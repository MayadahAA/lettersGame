import { realtimeDb } from '@/src/lib/firebase';
import { ref, get, set, remove } from 'firebase/database';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// تعريف نوع اللاعب
const playerSchema = z.object({
  id: z.string(),
  name: z.string(),
  team: z.enum(['red', 'green']),
  // ... خصائص اللاعب
});

// دالة لجلب قائمة اللاعبين من Realtime Database
async function getPlayersFromDatabase(roomId: string) {
  const playersRef = ref(realtimeDb, `rooms/${roomId}/players`);
  const snapshot = await get(playersRef);
  return snapshot.val();
}

// دالة لإضافة لاعب جديد إلى Realtime Database
async function addPlayerToDatabase(roomId: string, player: z.infer<typeof playerSchema>) {
  // استخدم معرف اللاعب المقدم بدلاً من توليد معرف جديد
  const playerRef = ref(realtimeDb, `rooms/${roomId}/players/${player.team}/${player.id}`);
  await set(playerRef, player);
  return player.id;
}

// دالة لإزالة لاعب من Realtime Database
async function removePlayerFromDatabase(roomId: string, playerId: string, team: 'red' | 'green') {
  const playerRef = ref(realtimeDb, `rooms/${roomId}/players/${team}/${playerId}`);
  await remove(playerRef);
}

// API Route لجلب قائمة اللاعبين
export async function GET(
  request: Request, 
  { params }: { params: Promise<{ roomId: string }> }
) {
  const resolvedParams = await params;
  try {
    const players = await getPlayersFromDatabase(resolvedParams.roomId);
    return NextResponse.json({ players });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// API Route لإضافة لاعب جديد
export async function POST(
  request: Request, 
  { params }: { params: Promise<{ roomId: string }> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    const parsedPlayer = playerSchema.parse(body);

    const playerId = await addPlayerToDatabase(resolvedParams.roomId, parsedPlayer);
    return NextResponse.json({ 
      message: 'Player added successfully', 
      playerId, 
      roomId: resolvedParams.roomId 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// API Route لإزالة لاعب
export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ roomId: string }> }
) {
  const resolvedParams = await params;
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const team = searchParams.get('team') as 'red' | 'green';

    if (!playerId || !team) {
      return NextResponse.json({ error: 'playerId and team are required' }, { status: 400 });
    }

    await removePlayerFromDatabase(resolvedParams.roomId, playerId, team);
    return NextResponse.json({ message: 'Player removed successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}