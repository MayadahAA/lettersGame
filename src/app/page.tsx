// import Image from "next/image";
// import dynamic from 'next/dynamic';
'use client'
import React, { useState } from "react";
// import Link from 'next/link';
import Image from "next/image";
import { Button } from "./_components/ui/Button";

// const ClientComponent = dynamic(
//   () => import('./components/SocketClient'),
//   { ssr: false }
// );

export default function Home() {
  const [roomCode, setRoomCode] = useState('');

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // فقط الأحرف والأرقام، بحد أقصى 6 أحرف
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
    setRoomCode(value);
  };

  return (
    <main className="min-h-screen rtl-dir gradient-bg flex flex-col items-center justify-between py-8 px-4">
      {/* الشعار في الأعلى */}
      <div className="w-full text-center pt-4 pb-8">
        <div className="flex justify-center mb-4">
          <Image 
            src="/images/logo.svg" 
            alt="شعار حروف" 
            width={100} 
            height={100}
            className="mb-2 animate-pulse"
          />
        </div>
        <h1 className="text-5xl font-bold text-white mb-2">حروف</h1>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="bg-white rounded-container w-full p-8  md:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">اختر طريقة اللعب</h2>
        
        {/* أزرار الخيارات الرئيسية */}
        <div className=" mb-8 flex  gap-4">
       
          <Button variant="primary" >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            إنشاء غرفة
          </Button>
          <Button variant="primary" className="bg-yellow-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            الانضمام للعبة
          </Button>
          <Button variant="primary" className="bg-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            الجمهور
          </Button>

        </div>
        
        {/* حقل إدخال رمز الغرفة */}
        <div className=" p-4 rounded-lg mb-6">
          <h3 className="text-sm font-medium text-blue-800 mb-3">لديك رمز غرفة؟</h3>
          <div className="flex items-center">
            <input 
              type="text" 
              maxLength={6} 
              placeholder="أدخل الرمز هنا" 
              className="room-code-input flex-1 p-2 border border-blue-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={roomCode}
              onChange={handleRoomCodeChange}
            />
            <button 
              className={`btn btn-green rounded-l-lg rounded-r-none ${roomCode.length < 4 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
              disabled={roomCode.length < 4}
              onClick={() => console.log(`الانضمام إلى الغرفة: ${roomCode}`)}
            >
              انضمام
            </button>
          </div>
        </div>
      </div>

      {/* شرح قواعد اللعبة */}
      <div className="text-center max-w-md text-white mt-8">
        <h3 className="text-xl font-semibold mb-2">كيف تلعب؟</h3>
        <p className="text-blue-100">
          لعبة &quot;حروف&quot; هي لعبة تعليمية ممتعة حيث يقوم اللاعبون بتكوين كلمات من الحروف المتاحة. 
          مقدم اللعبة يختار الحروف والمواضيع، ويمكن للاعبين المشاركة أو للمتفرجين مشاهدة اللعبة. 
          اجمع أكبر عدد من النقاط بتكوين الكلمات الصحيحة!
        </p>
      </div>
    </main>
  );
}
