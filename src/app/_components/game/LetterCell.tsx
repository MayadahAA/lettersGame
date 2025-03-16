import React from 'react';

// واجهة لتحديد خصائص خلية الحرف
interface LetterCellProps {
  letter: string;      // الحرف المعروض في الخلية
  isRedOwned: boolean;    // هل الخلية محددة باللون الأحمر
  isGreenOwned: boolean;  // هل الخلية محددة باللون الأخضر 
  isCurrent: boolean;  // هل هذا هو الحرف الحالي المطلوب
  selectable: boolean;  // هل يمكن تحديد الخلية
  onClick: () => void;      // دالة تنفذ عند النقر على الخلية
}

// مكون خلية الحرف
export default function LetterCell({
  letter,
  isRedOwned,
  isGreenOwned,
  isCurrent,
  selectable,
  onClick
}: LetterCellProps) {
  // تحديد الصفوف CSS للخلية بناءً على حالتها
  let cellClass = 'letter-cell';
  
  if (isRedOwned) {
    cellClass += ' red-owned';
  } else if (isGreenOwned) {
    cellClass += ' green-owned';
  } else {
    cellClass += ' empty';
  }
  
  if (isCurrent) {
    cellClass += ' current';
  }
  
  if (selectable) {
    cellClass += ' selectable';
  }
  // عرض الخلية مع الحرف بداخلها
  return (
    <div 
    className={cellClass}
    onClick={selectable || onClick() ? onClick : undefined}
  >
    <div className="letter-cell-content">
      <span className="letter">{letter}</span>
    </div>
    {isCurrent && <div className="pulse-border"></div>}
  </div>
  );
} 