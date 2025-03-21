import { realtimeDb } from '@/src/lib/firebase';
import { ref, set, push, serverTimestamp } from 'firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest,
    {params}: {params: {roomId: string}}
){
    try{
        const body = await request.json()
        const { playerId} = body

            // مرجع لضغطات زر البازر داخل غرفة معينة
 const buzzerRef = ref(realtimeDb, `rooms/${params.roomId}/buzzerState/buzzerPresses`)
 const newPressRef = push(buzzerRef);

 await set(newPressRef, {
    playerId,
    timestamp: serverTimestamp(),
    order: 0
 })

 return NextResponse.json({ pressId: newPressRef.key });
}catch(error){
    console.error('Error in buzzerPresses POST:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}