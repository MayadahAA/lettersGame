import { realtimeDb } from '@/src/lib/firebase';
import { ref, set, push, serverTimestamp } from 'firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest
) {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
        return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

    try {
        const body = await request.json();
        const { playerId } = body;

        // مرجع لضغطات زر البازر داخل غرفة معينة
        const buzzerRef = ref(realtimeDb, `rooms/${roomId}/buzzerState/buzzerPresses`);
        const newPressRef = push(buzzerRef);

        await set(newPressRef, {
            playerId,
            timestamp: serverTimestamp(),
            order: 0
        });

        return NextResponse.json({ pressId: newPressRef.key });
    } catch (error) {
        console.error('Error in buzzerPresses POST:', error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}