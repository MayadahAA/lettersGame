import { realtimeDb } from '@/src/lib/firebase';
import { ref, get } from 'firebase/database';
import { NextResponse } from 'next/server';

// دالة لجلب معلومات الغرفة باستخدام roomId
async function getRoomInfoFromDatabase(roomId: string) {
  const roomRef = ref(realtimeDb, `rooms/${roomId}`);
  const snapshot = await get(roomRef);
  return snapshot.val();
}

// API Route لجلب معلومات الغرفة
export async function GET(
    request: Request,
    { params }: { params: Promise<{ roomId: string }> }
  ) {
    // فك الـ Promise للحصول على قيم المعلمات
    const resolvedParams = await params;
    try {
      const roomInfo = await getRoomInfoFromDatabase(resolvedParams.roomId);
  
      if (!roomInfo) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }
  
      return NextResponse.json({ roomInfo });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }