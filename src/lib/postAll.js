import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import serviceAccountJson from './letters-game-horof-firebase-adminsdk-fbsvc-ff6c22fd57.json' assert { type: 'json' };
const serviceAccount = serviceAccountJson ;

// تهيئة Firebase Admin باستخدام ملف مفتاح الخدمة
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// افترض أن بيانات الأسئلة محفوظة في ملف questionsData.json
const questionsData = JSON.parse(fs.readFileSync('q.json', 'utf8'));

async function addQuestionsBulk() {
  const batch = db.batch();

  // التكرار على كل حرف في بيانات الأسئلة
  for (const letter in questionsData) {
    // إنشاء أو تحديث وثيقة الحرف داخل مجموعة questionsBank
    const letterDocRef = db.collection('questionsBank').doc(letter);
    // يمكنك تحديث أو إنشاء الوثيقة الأساسية للحرف
    batch.set(letterDocRef, { letter }, { merge: true });

    const questions = questionsData[letter];
    for (const q of questions) {
      // إنشاء مرجع لمستند جديد داخل مجموعة فرعية "questions" للوثيقة الخاصة بالحرف
      const questionDocRef = letterDocRef.collection('questions').doc();
      batch.set(questionDocRef, {
        letter,
        question: q.question,
        answer: q.answer,
        isActive: q.isActive,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  await batch.commit();
  console.log("Bulk questions added successfully");
}

addQuestionsBulk().catch(console.error);