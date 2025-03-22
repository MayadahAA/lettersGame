import { realtimeDb } from '@/src/lib/firebase';
import { ref, set, get } from 'firebase/database';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// تعريف نوع بيانات اللاعب
const playerSchema = z.object({
  id: z.string(),
  name: z.string(),
  team: z.enum(['red', 'green']),
});

// دالة للتحقق من عدد اللاعبين في فريق معين
async function getTeamPlayerCount(roomId: string, team: 'red' | 'green') {
  const teamRef = ref(realtimeDb, `rooms/${roomId}/players/${team}`);
  const snapshot = await get(teamRef);
  
  if (!snapshot.exists()) {
    return 0;
  }
  
  return Object.keys(snapshot.val()).length;
}

// دالة لإضافة لاعب جديد
export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const resolvedParams = await params;
  try {
    const { roomId } = resolvedParams;
    
    // قراءة بيانات اللاعب من الطلب
    const body = await request.json();
    const parsedPlayer = playerSchema.parse(body);
    
    // التحقق من عدد اللاعبين في الفريق المختار
    const teamCount = await getTeamPlayerCount(roomId, parsedPlayer.team);
    
    // التحقق من الحد الأقصى (2 لاعبين لكل فريق)
    if (teamCount >= 2) {
      return NextResponse.json({
        error: `الفريق ${parsedPlayer.team === 'red' ? 'الأحمر' : 'الأخضر'} مكتمل، يرجى اختيار الفريق الآخر`
      }, { status: 400 });
    }
    
    // إضافة اللاعب إلى قاعدة البيانات
    const playerRef = ref(realtimeDb, `rooms/${roomId}/players/${parsedPlayer.team}/${parsedPlayer.id}`);
    await set(playerRef, parsedPlayer);
    
    return NextResponse.json({ 
      message: 'تمت إضافة اللاعب بنجاح', 
      playerId: parsedPlayer.id, 
      roomId 
    });
  } catch (error) {
    console.error('Error adding player:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'بيانات اللاعب غير صالحة' }, { status: 400 });
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}