'use client';

import React, { useState, useEffect } from 'react';
// import GameBoard from '../_components/game/GameBoard';
// import ScoreDisplay from '../_components/game/ScoreDisplay';
import { useGame } from '../../../hooks/useGame';
import EnhancedHexagonBoard from '../../_components/game/Board';

// قاعدة بيانات الأسئلة مصنفة حسب الحرف
// const questionsDatabase = {
//   'أ': [
//     { question: 'أين تقع مكة المكرمة؟', answer: 'السعودية' },
//     { question: 'أي دولة عربية تبدأ بحرف الألف؟', answer: 'الأردن' }
//   ],
//   'ب': [
//     { question: 'بلد عربي يبدأ بحرف الباء؟', answer: 'البحرين' },
//     { question: 'برج شهير في باريس؟', answer: 'برج إيفل' }
//   ],
//   'ت': [
//     { question: 'تقع جزيرة تاروت في أي دولة؟', answer: 'السعودية' },
//     { question: 'تمثال الحرية يوجد في أي مدينة؟', answer: 'نيويورك' }
//   ],
//   'ج': [
//     { question: 'جبل في المملكة العربية السعودية؟', answer: 'جبل طويق' },
//     { question: 'جزيرة عربية مشهورة؟', answer: 'جزيرة العرب' }
//   ],
//   'د': [
//     { question: 'دولة عربية تبدأ بحرف الدال؟', answer: 'دولة الإمارات' },
//     { question: 'دواء مشهور لعلاج الصداع؟', answer: 'دوافين' }
//   ],
//   'ر': [
//     { question: 'رياضة شعبية في الخليج؟', answer: 'رمي السهام' },
//     { question: 'رئيس عربي سابق؟', answer: 'رفيق الحريري' }
//   ],
//   'س': [
//     { question: 'سورة في القرآن الكريم تبدأ بحرف السين؟', answer: 'سورة الشمس' },
//     { question: 'سيارة يابانية مشهورة؟', answer: 'سوزوكي' }
//   ],
//   'ع': [
//     { question: 'عاصمة المملكة العربية السعودية؟', answer: 'الرياض' },
//     { question: 'عملة دولة الإمارات؟', answer: 'الدرهم' }
//   ],
//   'م': [
//     { question: 'مدينة سعودية مشهورة؟', answer: 'مكة' },
//     { question: 'ماركة سيارات ألمانية؟', answer: 'مرسيدس' }
//   ],
//   // يمكن إضافة المزيد من الأسئلة لباقي الحروف
// };


// استخدام الدالة داخل useEffect بدلاً من استدعائها مباشرة
export default function GamePage({ params }: { params: { hostId: string, roomId: string } }) {
  const { startGame } = useGame();
  const [questions, setQuestions] = useState<Question[]>([]);
  
  interface Question {
    question: string;
    answer: string;
  }
  
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(`/api/rooms/${params.roomId}/${params.hostId}`);
        const data = await response.json();
        setQuestions(data);
        console.log(data);
        return data.data || [];
      } catch (error) {
        console.error('خطأ في جلب الأسئلة:', error);
        return [];
      }
    }
    fetchQuestions();
  }, [params.hostId]);

  useEffect(() => {
    startGame();
    // مثال: جلب الأسئلة للحرف 'أ'
    const getQuestions = async () => {
      console.log(questions)
    };

    getQuestions();
  }, [startGame]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">لعبة الحروف</h1>
      
      <EnhancedHexagonBoard
        roomCode="ABC123"
        questions={{ 'أ': questions }}
        timeLimit={10}
        players={[
          { id: 1, name: "لاعب 1", active: true, team: 'red' },
          { id: 2, name: "لاعب 2", active: true, team: 'red' },
          { id: 3, name: "لاعب 3", active: true, team: 'green' },
          { id: 4, name: "لاعب 4", active: true, team: 'green' }
        ]}
        teamName="لعبة حروف"
        onSelectNewLetter={(letter) => console.log(`تم اختيار الحرف ${letter}`)} letter={''}      />
    </div>
  );
}