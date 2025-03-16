import React, { useRef, useEffect, useState, useCallback } from 'react';

interface HexagonCanvasProps {
  onHexagonSelect?: (index: number | null) => void;
  selectedHexagon: number | null;
  redTeamHexagons?: number[]; 
  greenTeamHexagons?: number[]; 
  onLettersInitialized?: (letters: {[key: number]: string}) => void;
}

const HexagonCanvas: React.FC<HexagonCanvasProps> = ({ 
  onHexagonSelect, 
  selectedHexagon,
  redTeamHexagons = [],
  greenTeamHexagons = [],
  onLettersInitialized
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hexagons, setHexagons] = useState<{x: number, y: number, size: number, row: number, col: number, letter: string}[]>([]);
  const initialized = useRef(false);
  
  // الحروف العربية
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const arabicLetters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
  
  const getRandomArabicLetter = useCallback(() => {
    return arabicLetters[Math.floor(Math.random() * arabicLetters.length)];
  }, [arabicLetters]);
  
  // رسم سداسي واحد - مدبب القمة (pointy-topped)
  const drawHexagon = useCallback((
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number, 
    fillColor: string,
    lineWidth: number
  ) => {
    ctx.beginPath();
    
    // رسم سداسي مدبب القمة (30 درجة إزاحة)
    const angleOffset = Math.PI / 6; // 30 درجة
    for (let i = 0; i < 6; i++) {
      const angle = angleOffset + (Math.PI / 3) * i;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(hx, hy);
      } else {
        ctx.lineTo(hx, hy);
      }
    }
    
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#3b82f6';
    ctx.stroke();
  }, []);
  
  // رسم جميع السداسيات
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || hexagons.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    hexagons.forEach((hexagon, index) => {
      const isSelected = index === selectedHexagon;
      const isRedTeam = redTeamHexagons.includes(index);
      const isGreenTeam = greenTeamHexagons.includes(index);
      
      let fillColor = 'white';
      if (isRedTeam) {
        fillColor = '#ef4444';
      } else if (isGreenTeam) {
        fillColor = '#22c55e';
      } else if (isSelected) {
        fillColor = '#f6c347';
      }
      
      drawHexagon(
        ctx, 
        hexagon.x, 
        hexagon.y, 
        hexagon.size, 
        fillColor,
        isSelected ? 4 : 1
      );
      
      ctx.fillStyle = isRedTeam || isGreenTeam ? 'white' : 'black';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(hexagon.letter, hexagon.x, hexagon.y);
    });
  }, [hexagons, selectedHexagon, redTeamHexagons, greenTeamHexagons, drawHexagon]);
  
  // تهيئة الكانفاس - مع تغيير الاتجاه للسداسيات
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || initialized.current) return;
    
    canvas.width = 900;
    canvas.height = 600;
    
    const rows = 5;
    const cols = 5;
    
    // تعديل حسابات الحجم للسداسيات المدببة القمة
    const hexSize = Math.min(canvas.width / (cols * 2.2), canvas.height / (rows * 2.2)) * 1.2;
    
    // حساب أبعاد السداسي بعد التدوير
    const hexHeight = hexSize * 2; 
    const hexWidth = hexSize * Math.sqrt(3);
    
    // حساب إجمالي أبعاد الشبكة
    const gridWidth = cols * hexWidth;
    const gridHeight = rows * hexHeight * 0.75 + hexHeight * 0.25;
    
    // نقطة البداية لتوسيط الشبكة
    const startX = (canvas.width - gridWidth) / 2 + hexWidth / 2;
    const startY = (canvas.height - gridHeight) / 2 + hexSize;
    
    const newHexagons: {x: number, y: number, size: number, row: number, col: number, letter: string}[] = [];
    const lettersMap: {[key: number]: string} = {};
    
    // إنشاء شبكة مع تبديل الإزاحة من الأعمدة إلى الصفوف
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // الإزاحة الأفقية للصفوف الفردية
        const x = startX + col * hexWidth + (row % 2 === 1 ? hexWidth * 0.5 : 0);
        const y = startY + row * hexHeight * 0.75;
        
        const letter = getRandomArabicLetter();
        const index = row * cols + col;
        
        lettersMap[index] = letter;
        newHexagons.push({
          x, y, size: hexSize, row, col, letter
        });
      }
    }
    
    setHexagons(newHexagons);
    initialized.current = true;
    
    if (onLettersInitialized) {
      onLettersInitialized(lettersMap);
    }
  }, [getRandomArabicLetter, onLettersInitialized]);
  
  // إعادة الرسم عند تغيير الحالة
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);
  
  // معالجة النقر
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    for (let i = 0; i < hexagons.length; i++) {
      const hexagon = hexagons[i];
      const dx = x - hexagon.x;
      const dy = y - hexagon.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= hexagon.size * 1.1) {
        if (onHexagonSelect) {
          onHexagonSelect(i);
        }
        return;
      }
    }
    
    if (onHexagonSelect) {
      onHexagonSelect(null);
    }
  }, [hexagons, onHexagonSelect]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full"
      onClick={handleCanvasClick}
      style={{ 
        backgroundColor: 'green',
        boxShadow: 'rgb(212 12 11) 110px 0px 0px inset, rgb(211 12 12) -110px 0px 0px 0px inset',
        touchAction: 'none', 
        display: 'block', 
        margin: '0 auto',
        maxWidth: '800px',
        maxHeight: '600px',
        width: '100%'
      }} 
    />
  );
};

export default HexagonCanvas;