import { realtimeDb } from '@/src/lib/firebase';
import { ref, set, push, get } from 'firebase/database';
import  { NextResponse, NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { roomId: string } }
  ) {
    try {
      const playersRef = ref(realtimeDb, `rooms/${params.roomId}/players`);
      const snapshot = await get(playersRef);
      const players = snapshot.val() || {};
      return NextResponse.json({ players });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }

export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
    try{

        const body = await request.json();
        const { team, name } = body;

            // مرجع للاعبين داخل الغرفة المحددة

            const playersRef = ref( realtimeDb, `rooms/${params.roomId}/players`)
            const newPlayerRef = push(playersRef);

            await set(newPlayerRef, {
                playerId: newPlayerRef.key,
                team,
                name,
                score: 0,
                isConnected: true,
                lastActive: new Date().toUTCString(),
                stats: { correctAnswers: 0 }
            })
return NextResponse.json({ message: 'Player added successfully', playerId: newPlayerRef.key }, { status: 200 });
    }catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
          }
          return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}



