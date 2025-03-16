import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 text-center w-full max-w-md">
      <h3 className="text-lg font-medium mb-2">النقاط</h3>
      <div className="text-3xl font-bold">{score}</div>
    </div>
  );
}
