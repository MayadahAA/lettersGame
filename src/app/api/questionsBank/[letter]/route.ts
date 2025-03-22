import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { NextRequest, NextResponse } from 'next/server';

// استرجاع جميع الأسئلة لحرف معيّن
export async function GET(
  request: NextRequest,
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const letter = searchParams.get('letter');
    if (!letter) {
      return NextResponse.json({ error: 'Letter is required' }, { status: 400 });
    }

    const questionsColRef = collection(db, 'questionsBank', letter, 'questions');
    const querySnapshot = await getDocs(questionsColRef);
    
    if (!querySnapshot.docs.length) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const questions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ data: questions }, { status: 200 });
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

// إضافة عدة أسئلة لحرف معيّن
export async function POST(
  request: NextRequest
) {
  const { searchParams } = new URL(request.url);
  const letter = searchParams.get('letter');

  if (!letter) {
    return NextResponse.json({ error: 'Letter is required' }, { status: 400 });
  }

  try {
    const questionsArray = await request.json();
    
    if (!Array.isArray(questionsArray)) {
      return NextResponse.json({ error: 'Expected an array of questions' }, { status: 400 });
    }
    
    // المرجع لمجموعة الأسئلة داخل وثيقة الحرف
    const questionsRef = collection(db, 'questionsBank', letter, 'questions');
    const results: { questionId: string; question: string }[] = [];
    
    // إضافة كل سؤال في المصفوفة
    for (const questionItem of questionsArray) {
      const { question, answer, isActive } = questionItem;
      const docRef = await addDoc(questionsRef, {
        letter,
        question,
        answer,
        isActive,
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString()
      });
      results.push({ questionId: docRef.id, question });
    }
    
    return NextResponse.json(
      { message: 'Questions added successfully', results },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}