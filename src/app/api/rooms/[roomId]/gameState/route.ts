import { realtimeDb } from '@/src/lib/firebase';
import { ref, get, update } from 'firebase/database';
import { db  } from '@/src/lib/firebase';
import {  doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// تعريف نوع gameState
const gameStateSchema = z.object({
  currentLetter: z.string(),
  currentQuestion: z.string(),
  currentAnswer: z.string(),
  // ... بقية خصائص gameState
});

// دالة لجلب حالة اللعبة من Realtime Database
async function getGameStateFromDatabase(roomId: string) {
  const gameStateRef = ref(realtimeDb, `rooms/${roomId}/gameState`);
  const snapshot = await get(gameStateRef);
  return snapshot.val();
}
// دالة لتحديث حالة اللعبة في Realtime Database
async function updateGameStateInDatabase(roomId: string, gameState: z.infer<typeof gameStateSchema>) {
  const gameStateRef = ref(realtimeDb, `rooms/${roomId}/gameState`);
  await update(gameStateRef, gameState);
}

// دالة لجلب سؤال من Firestore
async function getQuestionFromFirestore(questionId: string) {
  const questionRef = doc(db, 'questions', questionId);
  const questionSnap = await getDoc(questionRef);
  if (questionSnap.exists()) {
    return questionSnap.data();
  } else {
    return null;
  }
}

// API Route لجلب حالة اللعبة
export async function GET(request: Request, { params }: { params: { roomId: string } }) {
  try {
    const gameState = await getGameStateFromDatabase(params.roomId);
    if (!gameState) {
      return NextResponse.json({ error: 'Game state not found' }, { status: 404 });
    }
    return NextResponse.json({ gameState });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// API Route لتحديث حالة اللعبة
export async function PUT(request: Request, { params }: { params: { roomId: string } }) {
  try {
    const body = await request.json();
    const parsedGameState = gameStateSchema.parse(body); // التحقق من صحة البيانات

    // اذا تم طلب عرض سؤال جديد قم بجلبة من firestore
    if(parsedGameState.currentQuestion) {
        const questionData = await getQuestionFromFirestore(parsedGameState.currentQuestion)
        parsedGameState.currentAnswer = questionData?.answer
    }
    await updateGameStateInDatabase(params.roomId, parsedGameState);
    return NextResponse.json({ message: 'Game state updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 }); // إرجاع أخطاء التحقق من صحة البيانات
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}