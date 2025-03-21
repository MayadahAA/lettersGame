import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { NextRequest, NextResponse } from 'next/server';

// استرجاع سؤال محدد
export async function GET(
  request: NextRequest,
  { params }: { params: { letter: string; questionId: string } }
) {
  try {
    const docRef = doc(db, 'questionsBank', params.letter, 'questions', params.questionId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    return NextResponse.json({ data: docSnap.data() }, { status: 200 });
  } catch (error) {
    console.error('Error in GET:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// تحديث سؤال محدد
export async function PUT(
  request: NextRequest,
  { params }: { params: { letter: string; questionId: string } }
) {
  try {
    const body = await request.json();
    const docRef = doc(db, 'questionsBank', params.letter, 'questions', params.questionId);
    await updateDoc(docRef, {
      ...body,
      updatedAt: new Date().toUTCString()
    });
    return NextResponse.json({ message: 'Question updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in PUT:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// حذف سؤال محدد
export async function DELETE(
  request: NextRequest,
  { params }: { params: { letter: string; questionId: string } }
) {
  try {
    const docRef = doc(db, 'questionsBank', params.letter, 'questions', params.questionId);
    await deleteDoc(docRef);
    return NextResponse.json({ message: 'Question deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}