import { ref, get } from 'firebase/database';
import { NextResponse } from 'next/server';
import { realtimeDb } from '@/src/lib/firebase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string; team: string }> }
) {
  const resolvedParams = await params;
  try {
    const { roomId, team } = resolvedParams;

    // التحقق من وجود المعلمات المطلوبة
    if (!roomId || !team) {
      return NextResponse.json({ error: 'roomId و team مطلوبة' }, { status: 400 });
    }

    // التحقق من أن الفريق صالح
    if (team !== 'red' && team !== 'green') {
      return NextResponse.json({ error: 'الفريق يجب أن يكون red أو green' }, { status: 400 });
    }

    // الوصول إلى جميع اللاعبين في الفريق المحدد
    const playersRef = ref(realtimeDb, `rooms/${roomId}/players/${team}`);
    const snapshot = await get(playersRef);

    if (!snapshot.exists()) {
      // إرجاع مصفوفة فارغة بدلاً من خطأ عندما لا يوجد لاعبين
      return NextResponse.json({ players: {}, count: 0 });
    }

    const players = snapshot.val();
    const count = Object.keys(players).length;
    
    return NextResponse.json({ 
      players, 
      count,
      team 
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
