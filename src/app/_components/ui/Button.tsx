'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'correct' | 'wrong' | 'reset';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary',
  children,
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'btn flex w-full flex-col items-center justify-center transition-all duration-200 ease-in-out';
  
  const variantClasses = {
    primary: 'bg-blue-700 hover:bg-blue-800 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    correct: 'bg-green-600 hover:bg-green-700 text-white',
    wrong: 'bg-red-600 hover:bg-red-700 text-white',
    reset: 'bg-yellow-500 hover:bg-yellow-600 text-white'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}