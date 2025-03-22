'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Board from '@/src/app/_components/game/Board';

interface PageProps {
  params: Promise<{
    roomId: string;
  }>;
}

interface RoomData {
  questions: { [key: string]: { question: string; answer: string }[] };
  timeLimit: number;
  players: { id: number; name: string; active: boolean; team: 'red' | 'green' }[];
  teamName: string;
  letter: string;
}

interface PlayerCount {
  total: number;
  red: number;
  green: number;
}

export default function HostPage({ params }: PageProps) {
  // فك الـ Promise باستخدام React.use()
  const { roomId } = React.use(params);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [playerCount, setPlayerCount] = useState<PlayerCount>({ total: 0, red: 0, green: 0 });

  // استدعاء useMemo بشكل غير مشروط
  const boardData = useMemo(() => ({
    questions: roomData?.questions || {},
    timeLimit: roomData?.timeLimit || 10,
    players: roomData?.players || [],
    teamName: roomData?.teamName || "لعبة حروف",
    letter: roomData?.letter || '',
  }), [roomData]);
  // دالة لحساب عدد اللاعبين - تعديلها لتتعامل مع الهيكل الصحيح للبيانات
  const countPlayers = (data: { roomInfo?: { players?: { red?: Record<string, unknown>; green?: Record<string, unknown> } } }) => {
    if (!data || !data.roomInfo || !data.roomInfo.players) {
      return { total: 0, red: 0, green: 0 };
    }
    // التعامل مع هيكل اللاعبين حسب تنسيق البيانات في قاعدة بيانات Firebase
    const players = data.roomInfo.players;
    
    // حساب عدد اللاعبين في كل فريق
    let redCount = 0;
    let greenCount = 0;
    
    // التحقق من وجود الفرق وحساب اللاعبين
    if (players.red && typeof players.red === 'object') {
      redCount = Object.keys(players.red).length;
    }
    
    if (players.green && typeof players.green === 'object') {
      greenCount = Object.keys(players.green).length;
    }
    
    return {
      red: redCount,
      green: greenCount,
      total: redCount + greenCount
    };
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch room data');
        }
        const data = await response.json();
        setRoomData(data); // يحتفظ بالهيكل الأصلي للبيانات في roomData
        
        // استخدام دالة العد المعدلة
        const counts = countPlayers(data);
        setPlayerCount(counts);
        
        console.log('Room data:', data);
        console.log('Player counts:', counts);
      } catch (err) {
        console.error('Error fetching room data:', err);
      } finally {
        console.log('Room data fetched successfully');
      }
    };

    fetchRoomData();
    
    // تحديث البيانات كل 10 ثوانٍ
    const interval = setInterval(fetchRoomData, 10000);
    return () => clearInterval(interval);
  }, [roomId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">لعبة الحروف</h1>
      
      {/* عرض عدد اللاعبين */}
      <div className="mb-6 text-center">
        <p className="text-lg">عدد اللاعبين: <span className="font-bold">{playerCount.total}</span></p>
        <div className="flex justify-center gap-4 mt-2">
          <p className="text-red-600">الفريق الأحمر: <span className="font-bold">{playerCount.red}</span></p>
          <p className="text-green-600">الفريق الأخضر: <span className="font-bold">{playerCount.green}</span></p>
        </div>
      </div>
      
      <Board
        roomCode={roomId}
        {...boardData}
        onSelectNewLetter={(letter: string) =>
          console.log(`تم اختيار الحرف ${letter}`)
        }
      />
    </div>
  );
}