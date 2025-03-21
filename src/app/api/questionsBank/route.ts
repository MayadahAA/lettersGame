import { collection,setDoc, getDocs, doc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { NextResponse } from 'next/server';

export async function POST(){
    const letters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
    const results: { letter: string; questionId: string }[] = [];

    try{
        for(const letter of letters){
        const collectionRef = collection(db, 'questionsBank');
        const docRef = doc(collectionRef, letter);
        await setDoc(docRef, {
            letter: letter,
            question: 'جبل في المملكة العربية السعودية؟',
            answer: ' طويق',
            isActive: true,
            createdAt: new Date().toUTCString(),
            updatedAt: new Date().toUTCString(),
        })
        results.push({ letter, questionId: docRef.id });
    
    }    
    return NextResponse.json({ message: 'Questions added successfully', results }, { status: 201 });
    }catch(error){
        console.error('Error in questionsBank POST:', error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}


export async function GET(){
    try{
        const querySnapshot = await getDocs(collection(db, "questionsBank"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});
return NextResponse.json({questions: querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
}))}, {status: 200})
    }catch(error){
        console.error('Error in questionsBank GET:', error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}


