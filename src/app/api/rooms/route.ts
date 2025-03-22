import { realtimeDb } from '@/src/lib/firebase';
import { ref, set, get, push } from 'firebase/database';
import { NextResponse } from 'next/server';

// قراءة قائمة الغرف دون إنشاء غرفة جديدة
export async function GET() {
  try {
    const roomsRef = ref(realtimeDb, 'rooms');
    const snapshot = await get(roomsRef);
    const data = snapshot.val();

    console.log('Data from rooms node:', data);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// إنشاء غرفة جديدة باستخدام POST
export async function POST(request: Request) {
  try {

    const body = await request.json();
    const { userId } = body; // استخراج هوية المستخدم من الطلب

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const roomsRef = ref(realtimeDb, 'rooms');
    const newRoomRef = push(roomsRef);

    // كتابة بيانات الغرفة الجديدة
    await set(newRoomRef, {
      metadata: {
        hostId: userId,
        roomId: newRoomRef.key,
        createdAt: new Date().toString(),
        status: 'waiting',
        settings: { minPlayers: 4, rounds: 3, teams: 2 },
      },
      gameState: {
        currentLetter: '',
        currentQuestion: '',
        currentAnswer: '',
        currentTeam: '',
        currentPlayer: '',
        questionState: 'normal',
        selectedCells: { red: [], green: [] },
        rounds: { red: 0, green: 0 },
      },
      players: { red: [], green: [] },
      host: {
        id: userId, // استخدام hostId الذي تم إنشاؤه
        name: '', // يمكن تعديل اسم الهوست لاحقًا
        role: 'host',
      },
      spectators: 0,
      buzzerState: { active: false, resetTimestamp: null, buzzerPresses: {} },
    });

    return NextResponse.json({ roomId: newRoomRef.key });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}