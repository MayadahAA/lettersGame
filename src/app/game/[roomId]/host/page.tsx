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

export default function HostPage({ params }: PageProps) {
  // فك الـ Promise باستخدام React.use()
  const { roomId } = React.use(params);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isLoadingRoomData, setIsLoadingRoomData] = useState(true);

  // استدعاء useMemo بشكل غير مشروط
  const boardData = useMemo(() => ({
    questions: roomData?.questions || {},
    timeLimit: roomData?.timeLimit || 10,
    players: roomData?.players || [
      { id: 1, name: "لاعب 1", active: true, team: 'red' },
      { id: 2, name: "لاعب 2", active: true, team: 'red' },
      { id: 3, name: "لاعب 3", active: true, team: 'green' },
      { id: 4, name: "لاعب 4", active: true, team: 'green' },
    ],
    teamName: roomData?.teamName || "لعبة حروف",
    letter: roomData?.letter || '',
  }), [roomData]);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!isLoadingRoomData && roomId) {
        setIsLoadingRoomData(true);
        try {
          const response = await fetch(`/api/rooms/${roomId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch room data');
          }
          const data = await response.json();
          setRoomData(data);
          console.log('Room data:', data);
        } catch (err) {
          console.error('Error fetching room data:', err);
        } finally {
          setIsLoadingRoomData(false);
        }
      }
    };

    fetchRoomData();
  }, [isLoadingRoomData, roomId]);

  if (isLoadingRoomData) {
    return <div>جاري التحميل...</div>;
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">لعبة الحروف</h1>
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