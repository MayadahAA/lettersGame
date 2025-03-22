import { realtimeDb } from '@/src/lib/firebase';
import { ref, get } from 'firebase/database';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string; team: string; playerId: string }> }
) {
  const resolvedParams = await params;
  try {
    const { roomId, team, playerId } = resolvedParams;
    
    // التحقق من وجود المعلمات المطلوبة
    if (!roomId || !team || !playerId) {
      return NextResponse.json({ error: 'roomId, team, and playerId are required' }, { status: 400 });
    }
    
    // الوصول المباشر إلى اللاعب باستخدام الفريق ومعرف اللاعب
    const playerRef = ref(realtimeDb, `rooms/${roomId}/players/${team}/${playerId}`);
    const snapshot = await get(playerRef);
    
    if (!snapshot.exists()) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    
    const player = snapshot.val();
    // إضافة معرف الغرفة إلى بيانات اللاعب للعرض
    player.roomId = roomId;
    
    return NextResponse.json({ player });
  } catch (error) {
    console.error('Error fetching player:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}