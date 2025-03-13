'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function SocketClient() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // الاتصال بخادم Socket.io
    // يجب استدعاء GET أولاً لتهيئة الخادم
    fetch('/api/socket').then(() => {
      const socketInstance = io({
        path: '/api/socket/io',
        addTrailingSlash: false,
      });

      socketInstance.on('connect', () => {
        console.log('تم الاتصال بنجاح');
        setConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('تم قطع الاتصال');
        setConnected(false);
      });

      socketInstance.on('message', (data: string) => {
        setMessages((prev) => [...prev, data]);
      });

      socketInstance.on('connect_error', (err) => {
        console.error('خطأ في الاتصال:', err.message);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    });
  }, []);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">اختبار Socket.io</h2>
      <div className="mb-4">
        <span className={`inline-block px-2 py-1 rounded ${connected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {connected ? 'متصل' : 'غير متصل'}
        </span>
      </div>

      <div className="mb-4 p-2 border rounded-lg h-40 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-1">{msg}</div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-l"
          placeholder="اكتب رسالة..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
          disabled={!connected}
        >
          إرسال
        </button>
      </div>
    </div>
  );
} 