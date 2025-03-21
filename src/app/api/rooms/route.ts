import { realtimeDb } from '@/src/lib/firebase';
import { ref, set, get, push } from 'firebase/database';
import  { NextResponse } from 'next/server';

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
export async function POST() {
  try {
    // يمكنك هنا قراءة البيانات المرسلة من العميل إذا لزم الأمر
    // const body = await request.json();

    const roomsRef = ref(realtimeDb, 'rooms');
    const newRoomRef = push(roomsRef);
    
    // كتابة بيانات الغرفة الجديدة
    await set(newRoomRef, {
      metadata: {
      hostId: crypto.randomUUID(),
      roomId: newRoomRef.key,
      createdAt: new Date().toString() ,
      status: 'waiting',
      settings: {minPlayers:4, rounds:3, teams:2},
      },
      gameState: {
        currentLetter: '',
        currentQuestion: '',
        currentAnswer: '',
        currentTeam: '',
        currentPlayer: '',
        questionState: 'normal',
        selectedCells: { red: [], green: [] },
        // scores: { red: 0, green: 0 },
        rounds: { red: 0, green: 0 }
      },
players: { red: [], green: [] },
spectators: 0,
buzzerState: { active: false, resetTimestamp: null, buzzerPresses: {} }


    });
    
    return NextResponse.json({ roomId: newRoomRef.key });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}


