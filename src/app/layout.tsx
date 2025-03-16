import React from 'react';
import './globals.css';

export const metadata = {
  title: 'لعبة الحروف',
  description: 'لعبة  للحروف',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}