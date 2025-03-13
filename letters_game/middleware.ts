import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// التعامل مع اتصالات Socket.io واختراق طلبات WebSocket
// هذا middleware مسؤول عن اعتراض طلبات Socket.io والتعامل معها بشكل مناسب

export async function middleware(req: NextRequest) {
  // يجب تمرير طلبات Socket.io
  if (req.nextUrl.pathname.startsWith('/api/socket')) {
    // سمح للطلب بالمرور - سيتم التعامل معه من قبل API route
    return NextResponse.next();
  }
  
  return NextResponse.next();
} 