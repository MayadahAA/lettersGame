import { NextResponse } from 'next/server';
import { Server as ServerIO } from 'socket.io';

// تخزين مثيل Socket.io عالمياً
let io: ServerIO | undefined;

export async function GET() {
  // يجب استدعاء هذه الطريقة لتهيئة Socket.io
  if (typeof io === 'undefined') {
    console.log('تهيئة خادم Socket.io');
    
    // @ts-ignore - Ignoring the global property issue temporarily
    if (typeof global.io === 'undefined') {
      // @ts-ignore
      global.io = new ServerIO({
        path: '/api/socket/io',
        addTrailingSlash: false,
      });
    }
    
    // @ts-ignore
    io = global.io;
    
    io.on('connection', (socket) => {
      console.log(`مستخدم متصل: ${socket.id}`);
      
      socket.on('disconnect', () => {
        console.log(`انقطع اتصال المستخدم: ${socket.id}`);
      });
      
      // يمكنك إضافة معالجات الأحداث الأخرى هنا
      socket.on('message', (data) => {
        console.log(`رسالة مستلمة: ${data}`);
        io?.emit('message', data); // إرسال إلى جميع العملاء
      });
    });
  }
  
  return new NextResponse('Socket.io server is running');
} 