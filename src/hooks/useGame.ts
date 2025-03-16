import { useState, useCallback } from 'react';
import { getRandomLetter } from '../lib/game-logic';

export function useGame() {
  const [score, setScore] = useState(0);
  const [currentLetter, setCurrentLetter] = useState('');

  const startGame = useCallback(() => {
    setCurrentLetter(getRandomLetter());
    setScore(0);
  }, []);

  const checkAnswer = useCallback((selectedLetter: string) => {
    if (selectedLetter === currentLetter) {
      setScore((prev) => prev + 10);
    } else {
      setScore((prev) => Math.max(0, prev - 5));
    }
    
    setCurrentLetter(getRandomLetter());
  }, [currentLetter]);

  return {
    score,
    currentLetter,
    checkAnswer,
    startGame,
  };
}
