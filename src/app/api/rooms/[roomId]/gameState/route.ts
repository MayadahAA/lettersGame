import { realtimeDb } from '@/src/lib/firebase';
import { ref, update } from 'firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const body = await request.json();
    // نفترض أن body يحتوي على التحديثات المطلوبة لحالة اللعبة
    const gameStateRef = ref(realtimeDb, `rooms/${params.roomId}/gameState`);
    
    await update(gameStateRef, body);
    
    return NextResponse.json({ message: 'Game state updated' });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}