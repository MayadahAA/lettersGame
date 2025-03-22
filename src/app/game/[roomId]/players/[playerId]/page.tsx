'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface PlayerData {
  id: string;
  name: string;
  team: 'red' | 'green';
  roomId?: string;
}

interface PageProps {
  params: Promise<{
    roomId: string;
    playerId: string;
  }>;
}

export default function PlayerPage({ params }: PageProps) {
  const { roomId, playerId } = React.use(params);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}/players/${playerId}`);
        
        if (!response.ok) {
          throw new Error('لا يمكن العثور على بيانات اللاعب');
        }
        
        const data = await response.json();
        setPlayerData(data.player);
      } catch (error) {
        console.error('Error fetching player data:', error);
        toast.error('حدث خطأ أثناء تحميل بيانات اللاعب');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayerData();
  }, [playerId, roomId]);

  const PlayerInfo = useMemo(() => {
    if (loading) {
      return <div className="text-xl">جاري تحميل بيانات اللاعب...</div>;
    }

    if (error) {
      return (
        <div className="text-xl text-red-600">{error}</div>
      );
    }

    if (!playerData) {
      return <div className="text-xl">لا يمكن العثور على بيانات اللاعب</div>;
    }

    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">صفحة اللاعب</h1>
        
        <div className="mb-4">
          <div className="font-bold">اسم اللاعب:</div>
          <div>{playerData.name}</div>
        </div>
        
        <div className="mb-4">
          <div className="font-bold">الفريق:</div>
          <div className={playerData.team === 'red' ? 'text-red-600' : 'text-green-600'}>
            {playerData.team === 'red' ? 'الفريق الأحمر' : 'الفريق الأخضر'}
          </div>
        </div>
        
        {playerData.roomId && (
          <div className="mb-4">
            <div className="font-bold">رمز الغرفة:</div>
            <div>{playerData.roomId}</div>
          </div>
        )}
      </div>
    );
  }, [playerData, loading, error]);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      {PlayerInfo}
      <button 
        onClick={() => router.push('/')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        العودة للصفحة الرئيسية
      </button>
    </div>
  );
}