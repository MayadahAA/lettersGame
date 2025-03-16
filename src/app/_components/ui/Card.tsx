import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  active?: boolean;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({ children, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-lg shadow transition-all ${
        active 
          ? 'bg-blue-500 text-white scale-105' 
          : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="text-3xl font-bold">{children}</div>
    </button>
  );
};
