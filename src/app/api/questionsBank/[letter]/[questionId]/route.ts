import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { NextRequest, NextResponse } from 'next/server';

// تعريف دالة GET بشكل صحيح
export async function GET(
  request: NextRequest
) {
  const { searchParams } = new URL(request.url);
  const letter = searchParams.get('letter');
  const questionId = searchParams.get('questionId');

  if (!letter || !questionId) {
    return NextResponse.json({ error: 'Letter and Question ID are required' }, { status: 400 });
  }

  try {
    const docRef = doc(db, 'questionsBank', letter, 'questions', questionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const data = docSnap.data() as DocumentData;
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error in GET:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { letter, questionId } = await request.json();

  if (!letter || !questionId) {
    return NextResponse.json({ error: 'Letter and Question ID are required' }, { status: 400 });
  }

  try {
    const docRef = doc(db, 'questionsBank', letter, 'questions', questionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const data = docSnap.data() as DocumentData;
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error in POST:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}