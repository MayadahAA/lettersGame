const ARABIC_LETTERS = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];

export function getRandomLetter(): string {
  const randomIndex = Math.floor(Math.random() * ARABIC_LETTERS.length);
  return ARABIC_LETTERS[randomIndex];
}

export function getRandomLetters(count: number): string[] {
  const letters: string[] = [];
  const availableLetters = [...ARABIC_LETTERS];
  
  for (let i = 0; i < count; i++) {
    if (availableLetters.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    letters.push(availableLetters[randomIndex]);
    availableLetters.splice(randomIndex, 1);
  }
  
  return letters;
}
