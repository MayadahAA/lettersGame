// CanvasHexagonBoard.tsx
import React, { useState, useEffect } from 'react';
import HexagonCanvas from './GameBoard';

// تعريف الواجهة للخصائص المطلوبة
interface HexagonBoardProps {
  roomCode: string; // رمز الغرفة
  questions: { [key: string]: { question: string; answer: string }[] }; // قائمة الأسئلة مصنفة حسب الحرف
  timeLimit: number; 
  players: { id: number; name: string; active: boolean; team: 'red' | 'green' }[]; // معلومات اللاعبين
  teamName: string; // اسم الفريق
  onSelectNewLetter?: (letter: string) => void; // دالة لاختيار حرف جديد
}

// المكون الرئيسي للوحة السداسية
const CanvasHexagonBoard: React.FC<HexagonBoardProps> = ({
  roomCode,
  questions,
  timeLimit = 10, 
  players,
  // teamName,
  // onSelectNewLetter
}) => {
  // تعريف حالات المكون
  const [timeLeft, setTimeLeft] = useState(timeLimit); // الوقت المتبقي
  const [selectedHexagon, setSelectedHexagon] = useState<number | null>(null);
  const [currentLetter, setCurrentLetter] = useState<string>(''); // الحرف الحالي
  const [currentQuestion, setCurrentQuestion] = useState<string>(''); // السؤال الحالي
  const [currentAnswer, setCurrentAnswer] = useState<string>(''); // الإجابة الحالية
  
  // إضافة حالات لتتبع السداسيات المملوكة لكل فريق
  const [redTeamHexagons, setRedTeamHexagons] = useState<number[]>([]);
  const [greenTeamHexagons, setGreenTeamHexagons] = useState<number[]>([]);
  
  // إضافة حالات لتتبع دور اللعب والضغط
  const [currentTeam, setCurrentTeam] = useState<'open_question' | 'red' | 'green'>('open_question'); // نبدأ بالفريق الأخضر
  const [gamePhase, setGamePhase] = useState<'waiting' | 'team_turn' | 'open_question' | 'select_hexagon'>('waiting');
  const [buzzedPlayers, setBuzzedPlayers] = useState<number[]>([]); // قائمة اللاعبين الذين ضغطوا بالترتيب
  const [currentBuzzedPlayer, setCurrentBuzzedPlayer] = useState<number | null>(null); // اللاعب الحالي الذي ضغط
  const [timerActive, setTimerActive] = useState(false); // هل المؤقت نشط
  const [winner, setWinner] = useState<'red' | 'green' | null>(null); // الفريق الفائز
  
  // إضافة حالة لتتبع ما إذا كانت اللعبة قد بدأت
  const [gameStarted, setGameStarted] = useState(false);
  
  // إضافة حالة لتخزين الحروف المرتبطة بكل سداسية
  const [hexagonLetters, setHexagonLetters] = useState<{[key: number]: string}>({});
  
  // إضافة حالة لعرض رسائل الخطأ
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // تأثير لبدء المؤقت عند ضغط أول لاعب
  useEffect(() => {
    if (buzzedPlayers.length > 0 && !timerActive) {
      setTimerActive(true);
      setTimeLeft(timeLimit);
    }
  }, [buzzedPlayers.length, timeLimit, timerActive]);
  
  // تأثير المؤقت
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    console.log('timeLeft', timeLeft);
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive]);
  
  // تأثير لمعالجة انتهاء الوقت
  useEffect(() => {
    if (timerActive && timeLeft <= 0) {
      handleTimeOut();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, timerActive]);
  
  // تأثير لمعالجة اللاعب الذي ضغط
  useEffect(() => {
    if (buzzedPlayers.length > 0 && currentBuzzedPlayer === null) {
      // اختيار أول لاعب ضغط
      setCurrentBuzzedPlayer(buzzedPlayers[0]);
    }
  }, [buzzedPlayers, currentBuzzedPlayer]);
  
  // تأثير للتحقق من الفوز
  useEffect(() => {
    // التحقق من فوز الفريق الأحمر (خط أفقي من اليمين إلى اليسار)
    if (checkRedTeamWin()) {
      setWinner('red');
    }
    
    // التحقق من فوز الفريق الأخضر (خط عمودي من الأعلى إلى الأسفل)
    if (checkGreenTeamWin()) {
      setWinner('green');
    }
  }, [redTeamHexagons, greenTeamHexagons]);
  
  // دالة للتحقق من فوز الفريق الأحمر (خط أفقي)
  const checkRedTeamWin = () => {
    // هذه دالة مبسطة للتوضيح - يجب تنفيذ منطق التحقق الفعلي بناءً على هيكل اللوحة
    // التحقق من وجود خط أفقي متصل من اليمين إلى اليسار
    return false; // تعديل هذا المنطق حسب هيكل اللوحة الفعلي
  };
  
  // دالة للتحقق من فوز الفريق الأخضر (خط عمودي)
  const checkGreenTeamWin = () => {
    // هذه دالة مبسطة للتوضيح - يجب تنفيذ منطق التحقق الفعلي بناءً على هيكل اللوحة
    // التحقق من وجود خط عمودي متصل من الأعلى إلى الأسفل
    return false; // تعديل هذا المنطق حسب هيكل اللوحة الفعلي
  };
  
  // دالة لمعالجة انتهاء الوقت
  const handleTimeOut = () => {
    // إذا كان هناك لاعب ضغط ولم يجب، نعتبرها إجابة خاطئة
    if (currentBuzzedPlayer !== null) {
      handleWrongAnswer();
    } else {
      // إذا لم يضغط أحد، ننتقل للمرحلة التالية
      advanceGamePhase();
    }
  };
  
  // دالة للانتقال إلى المرحلة التالية من اللعبة
  const advanceGamePhase = () => {
    if (gamePhase === 'team_turn') {
      // إذا كان دور فريق، ننتقل إلى السؤال المفتوح
      setGamePhase('open_question');
      resetBuzzers();
      setTimerActive(true);
      setTimeLeft(timeLimit);
    } else {
      // إذا كان السؤال مفتوحًا، ننتقل إلى دور الفريق الآخر
      switchTeam();
    }
  };
  
  // دالة لتبديل الفريق الحالي
  const switchTeam = () => {
    setCurrentTeam(currentTeam === 'red' ? 'green' : 'red');
    setGamePhase('team_turn');
    resetBuzzers();
    setTimerActive(false);
    console.log(currentTeam);
  };
  
  // دالة لإعادة ضبط أزرار الضغط
  const resetBuzzers = () => {
    setBuzzedPlayers([]);
    setCurrentBuzzedPlayer(null);
    console.log(buzzedPlayers);
  };
  
  // دالة لمعالجة ضغط اللاعب على زر الإجابة
  const handlePlayerBuzz = (playerId: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player || !player.active || !gameStarted) return;
    
    // في بداية اللعبة أو عندما يكون السؤال مفتوحًا، أي لاعب يمكنه الضغط
    if (gamePhase !== 'team_turn' || player.team === currentTeam) {
      // التحقق من أن اللاعب لم يضغط بالفعل
      if (buzzedPlayers.includes(playerId)) {
        return;
      }
      
      // إضافة اللاعب إلى قائمة الضغط
      setBuzzedPlayers(prev => [...prev, playerId]);
      
      // إذا كان هذا أول لاعب يضغط
      if (buzzedPlayers.length === 0) {
        // تعيين اللاعب الحالي وبدء المؤقت
        setCurrentBuzzedPlayer(playerId);
        setTimerActive(true);
        setTimeLeft(timeLimit);
        
        console.log(`اللاعب ${playerId} ضغط أولاً وله حق الإجابة`);
      }
    }
  };
  
  // دالة لمعالجة اختيار سداسية (حرف)
  const handleHexagonSelect = (index: number | null) => {
    // إذا كنا في مرحلة اختيار الخلية (بعد إجابة صحيحة)
    if (gamePhase === 'select_hexagon') {
      if (index !== null) {
        handlePlayerSelectHexagon(index);
      }
      return;
    }
    
    // في الحالات الأخرى، نستخدم السلوك الحالي
    if (currentBuzzedPlayer === null) return;
    
    setSelectedHexagon(index);
    
    // إذا تم اختيار سداسية، نحصل على الحرف المرتبط بها
    if (index !== null && hexagonLetters[index]) {
      const letter = hexagonLetters[index];
      console.log(`تم اختيار الحرف ${letter} من السداسية ${index}`);
    }
  };
  
  // دالة لتعيين السداسية للفريق
  const assignHexagonToTeam = (team: 'red' | 'green') => {
    if (selectedHexagon !== null) {
      if (team === 'red') {
        // تعيين للفريق الأحمر
        setGreenTeamHexagons(prev => prev.filter(hex => hex !== selectedHexagon));
        setRedTeamHexagons(prev => [...prev, selectedHexagon]);
      } else {
        // تعيين للفريق الأخضر
        setRedTeamHexagons(prev => prev.filter(hex => hex !== selectedHexagon));
        setGreenTeamHexagons(prev => [...prev, selectedHexagon]);
      }
    }
  };
  
  // دالة لاختيار سؤال عشوائي بناءً على الحرف
  const selectRandomQuestion = (letter: string) => {
    if (!questions[letter] || questions[letter].length === 0) {
      console.warn(`لا توجد أسئلة للحرف ${letter}`);
      return false;
    }
    
    const randomIndex = Math.floor(Math.random() * questions[letter].length);
    const questionObj = questions[letter][randomIndex];
    
    // تأكد من أن السؤال يبدأ بالحرف المحدد
    if (!questionObj.question.startsWith(letter) && !questionObj.answer.startsWith(letter)) {
      console.warn(`تحذير: السؤال أو الإجابة لا تبدأ بالحرف ${letter}`);
    }
    
    setCurrentQuestion(questionObj.question);
    setCurrentAnswer(questionObj.answer);
    setCurrentLetter(letter);
    
    console.log(`تم اختيار سؤال للحرف ${letter}: ${questionObj.question}`);
    return true;
  };
  
  // دالة لبدء اللعبة
  const startGame = () => {
    // إعادة ضبط حالة اللعبة
    setRedTeamHexagons([]);
    setGreenTeamHexagons([]);
    resetBuzzers();
    setWinner(null);
    setErrorMessage(null);
    
    // التحقق من وجود أسئلة في الكائن questions
    const hasQuestions = Object.values(questions).some(letterQuestions => 
      letterQuestions && letterQuestions.length > 0
    );
    
    if (!hasQuestions) {
      console.error("لا توجد أسئلة متاحة لأي حرف!");
      setErrorMessage("لا توجد أسئلة متاحة لأي حرف! يرجى إضافة أسئلة أولاً.");
      return;
    }
    
    // البحث عن خلية لها حرف وأسئلة متاحة
    let foundValidHexagon = false;
    let validHexagonIndex = -1;
    let validLetter = '';
    
    // نحاول العثور على خلية لها حرف وأسئلة متاحة
    for (const [hexIndex, letter] of Object.entries(hexagonLetters)) {
      if (questions[letter] && questions[letter].length > 0) {
        validHexagonIndex = parseInt(hexIndex);
        validLetter = letter;
        foundValidHexagon = true;
        break;
      }
    }
    
    if (foundValidHexagon) {
      // إذا وجدنا خلية صالحة، نستخدمها
      setSelectedHexagon(validHexagonIndex);
      const success = selectRandomQuestion(validLetter);
      
      if (!success) {
        console.error(`خطأ غير متوقع: لا يمكن اختيار سؤال للحرف ${validLetter} رغم التحقق المسبق`);
        setErrorMessage(`خطأ غير متوقع: لا يمكن اختيار سؤال للحرف ${validLetter}`);
        return;
      }
      
      console.log(`بدء اللعبة بالخلية ${validHexagonIndex} والحرف ${validLetter}`);
    } else {
      // إذا لم نجد خلية صالحة، نبحث عن حرف له أسئلة ثم نبحث عن خلية تحتوي على هذا الحرف
      let validLetterWithQuestions = '';
      
      // البحث عن حرف له أسئلة
      for (const letter of getArabicLetters()) {
        if (questions[letter] && questions[letter].length > 0) {
          validLetterWithQuestions = letter;
          break;
        }
      }
      
      if (!validLetterWithQuestions) {
        console.error("لا توجد أسئلة متاحة لأي حرف!");
        setErrorMessage("لا توجد أسئلة متاحة لأي حرف! يرجى إضافة أسئلة أولاً.");
        return;
      }
      
      // البحث عن خلية تحتوي على الحرف الذي له أسئلة
      let hexagonWithValidLetter = -1;
      for (const [hexIndex, letter] of Object.entries(hexagonLetters)) {
        if (letter === validLetterWithQuestions) {
          hexagonWithValidLetter = parseInt(hexIndex);
          break;
        }
      }
      
      if (hexagonWithValidLetter !== -1) {
        // إذا وجدنا خلية تحتوي على الحرف المطلوب، نستخدمها
        setSelectedHexagon(hexagonWithValidLetter);
        selectRandomQuestion(validLetterWithQuestions);
        console.log(`بدء اللعبة بالخلية ${hexagonWithValidLetter} والحرف ${validLetterWithQuestions}`);
      } else {
        // إذا لم نجد خلية تحتوي على الحرف المطلوب، نختار خلية عشوائية ونستخدم الحرف الذي له أسئلة
        const randomHexagonIndex = Math.floor(Math.random() * 25);
        setSelectedHexagon(randomHexagonIndex);
        selectRandomQuestion(validLetterWithQuestions);
        console.log(`بدء اللعبة بالخلية ${randomHexagonIndex} والحرف ${validLetterWithQuestions} (غير متطابقين)`);
        
        // إضافة رسالة تنبيه للمستخدم
        setErrorMessage(`تنبيه: الحرف المحدد لا يتطابق مع السؤال. يرجى اختيار خلية أخرى بعد الإجابة.`);
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
    
    // عند بدء اللعبة، نجعل السؤال مفتوحًا للجميع (من يضغط أولاً)
    setGamePhase('open_question');
    setTimeLeft(timeLimit);
    setTimerActive(true);
    
    // تعيين حالة بدء اللعبة
    setGameStarted(true);
  };
  
  // دالة لاختيار حرف جديد (يستدعى عندما يجيب لاعب بشكل صحيح)
  // const handleSelectNewLetter = (letter: string) => {
  //   // اختيار سؤال عشوائي للحرف المختار
  //   selectRandomQuestion(letter);
    
  //   // إذا كان هناك دالة خارجية لاختيار حرف جديد، نستدعيها
  //   if (onSelectNewLetter) {
  //     onSelectNewLetter(letter);
  //   }
  // };
  
  // دالة لاختيار حرف عربي عشوائي
  // const getRandomArabicLetter = () => {
  //   const arabicLetters = getArabicLetters();
  //   const randomIndex = Math.floor(Math.random() * arabicLetters.length);
  //   return arabicLetters[randomIndex];
  // };
  
  // دالة للحصول على قائمة الحروف العربية
  const getArabicLetters = () => {
    return ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
  };
  
  // // تأثير لاستلام الحروف من مكون HexagonCanvas عند تهيئته
  // useEffect(() => {
  //   // تعريف دالة معالجة استلام الحروف
  //   // const handleReceiveLetters = (letters: {[key: number]: string}) => {
  //     // تحديث حالة الحروف فقط إذا كانت مختلفة عن الحالة الحالية
  //     setHexagonLetters(prevLetters => {
  //       // التحقق من أن الحروف الجديدة مختلفة عن الحروف الحالية
  //       if (JSON.stringify(prevLetters) === JSON.stringify(letters)) {
  //         return prevLetters; // إرجاع نفس الحالة إذا كانت الحروف متطابقة
  //       }
  //       return letters; // تحديث الحالة إذا كانت الحروف مختلفة
  //     });
  //   };
    
    // تخزين الدالة في متغير للاستخدام لاحقًا
  // يمكن استخدام هذا المتغير لتمرير الدالة إلى مكون HexagonCanvas
  // }, [])
  
  // تنسيق الوقت بصيغة MM:SS
  const formatTime = (seconds: number) => {
    const remainingSeconds = Math.floor(seconds);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    return `${String(remainingSeconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
  };
  
  // الحصول على اسم الفريق الحالي بالعربية
  const getCurrentTeamName = () => {
    return currentTeam === 'red' ? 'الأحمر' : 'الأخضر';
  };
  
  // الحصول على حالة اللعبة الحالية بالعربية
  const getGamePhaseText = () => {
    if (winner) {
      return `فاز الفريق ${winner === 'red' ? 'الأحمر' : 'الأخضر'}!`;
    }
    
    if (currentBuzzedPlayer) {
      return `دور اللاعب ${currentBuzzedPlayer} للإجابة`;
    }
    
    if (gamePhase === 'team_turn') {
      return `دور الفريق ${getCurrentTeamName()}`;
    }
    
    if (gamePhase === 'open_question') {
      return `سؤال مفتوح - من يضغط أولاً ${currentLetter}`;
    }
    
    if (gamePhase === 'select_hexagon') {
      return `الفريق ${getCurrentTeamName()} يختار خلية جديدة`;
    }
    
    return 'انتظار بدء اللعبة';
  };
  
  // دالة لمعالجة الإجابة الخاطئة
  const handleWrongAnswer = () => {
    if (currentBuzzedPlayer === null) return;
    
    // الحصول على فريق اللاعب الحالي
    // const playerTeam = players.find(p => p.id === currentBuzzedPlayer)?.team;
    
    // إزالة اللاعب الحالي من قائمة الضغط
    setBuzzedPlayers(prev => prev.filter(id => id !== currentBuzzedPlayer));
    setCurrentBuzzedPlayer(null);
    
    // التحقق مما إذا كان هناك لاعبون آخرون ضغطوا
    if (buzzedPlayers.length > 1) {
      // هناك لاعبون آخرون، سننتقل إلى اللاعب التالي
      // سيتم التعامل معه في تأثير buzzedPlayers
    } else {
      // لا يوجد لاعبون آخرون ضغطوا
      
      if (gamePhase === 'team_turn') {
        // إذا كان دور فريق، ننتقل إلى دور الفريق الآخر
        switchTeam();
      } else if (gamePhase === 'open_question') {
        // إذا كان السؤال مفتوحًا، ننتقل إلى دور الفريق الآخر
        switchTeam();
      }
    }
  };

  // تعديل دالة معالجة الإجابة الصحيحة
  const handleCorrectAnswer = () => {
    if (!currentBuzzedPlayer || selectedHexagon === null) return;
    
    // الحصول على فريق اللاعب الحالي
    const playerTeam = players.find(p => p.id === currentBuzzedPlayer)?.team || currentTeam;
    
    // تعيين السداسية لفريق اللاعب
    assignHexagonToTeam(playerTeam as "red" | "green");
    
    // تعيين الفريق الحالي لفريق اللاعب الذي أجاب بشكل صحيح
    setCurrentTeam(playerTeam);
    // بعد الإجابة الصحيحة، يصبح الدور لفريق اللاعب لاختيار خلية جديدة
    setGamePhase('select_hexagon');
    
    // إعادة ضبط حالة اللعبة
    resetBuzzers();
    setSelectedHexagon(null); // إلغاء تحديد الخلية الحالية ليتمكن اللاعب من اختيار خلية جديدة
    setTimerActive(false);
    
    console.log(`إجابة صحيحة من اللاعب ${currentBuzzedPlayer}، يمكنه الآن اختيار خلية جديدة`);
  };

  // تعديل دالة معالجة اختيار خلية من قبل اللاعب الفائز
  const handlePlayerSelectHexagon = (index: number) => {
    // يمكن اختيار خلية فقط في مرحلة اختيار الخلية
    if (gamePhase !== 'select_hexagon') return;
    
    // مسح أي رسائل خطأ سابقة
    setErrorMessage(null);
    
    // تحديد الخلية المختارة
    setSelectedHexagon(index);
    
    // إذا تم اختيار خلية، نحصل على الحرف المرتبط بها
    if (hexagonLetters[index]) {
      const letter = hexagonLetters[index];
      // console.log(`تم اختيار الحرف ${letter} من الخلية ${index}`);
      
      // اختيار سؤال عشوائي للحرف المختار
      const success = selectRandomQuestion(letter);
      
      if (!success) {
        // إذا لم يكن هناك أسئلة للحرف المختار، نعرض رسالة ونطلب اختيار خلية أخرى
        console.warn(`لا توجد أسئلة للحرف ${letter}، يرجى اختيار خلية أخرى`);
        setErrorMessage(`لا توجد أسئلة للحرف ${letter}، يرجى اختيار خلية أخرى`);
        
        // إلغاء تحديد الخلية ليتمكن اللاعب من اختيار خلية أخرى
        setTimeout(() => {
          setSelectedHexagon(null);
        }, 500);
        
        return;
      }
      
      // التحقق من تطابق الحرف المحدد مع الحرف المستخدم في السؤال
      if (currentLetter !== letter) {
        console.error(`خطأ: الحرف المحدد (${letter}) لا يتطابق مع الحرف المستخدم في السؤال (${currentLetter})`);
        // هذا لن يحدث عادة لأن selectRandomQuestion يعين currentLetter، ولكن نضيف هذا التحقق للتأكد
      }
      
      // بعد اختيار الخلية، ننتقل إلى مرحلة السؤال المفتوح
      setGamePhase('open_question');
      setTimeLeft(timeLimit);
      setTimerActive(true);
    }
  };

  // واجهة المستخدم
  return (
    <div className="w-full">
      {/* رأس الصفحة مع رمز الغرفة */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2 items-center">
          <div className="bg-blue-100 px-3 py-1 rounded-lg">
            <span className="font-bold text-blue-800">{roomCode}</span>
          </div>
          <div className="bg-blue-100 px-3 py-1 rounded-lg">
            <span className="font-bold text-blue-800">4/4</span>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg font-bold ${
          winner ? 'bg-purple-500 text-white' :
          !gameStarted ? 'bg-gray-500 text-white' :
          gamePhase === 'open_question' ? 'bg-yellow-500 text-white' : 
          currentTeam === 'red' ? 'bg-red-500 text-white' : 
          'bg-green-500 text-white'
        }`}>
          {!gameStarted ? 'اللعبة لم تبدأ بعد' : getGamePhaseText()}
        </div>
        <button 
          className={`font-bold py-1 px-4 rounded-lg ${
            gameStarted ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
          onClick={gameStarted ? () => setGameStarted(false) : startGame}
        >
          {gameStarted ? 'إنهاء اللعبة' : 'بدء اللعبة'}
        </button>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-row-reverse gap-4">
        {/* لوحة اللعبة - تحديث لاستخدام خصائص الفرق */}
        <div className="w-1/2 flex-1 bg-white rounded-lg shadow-md overflow-hidden relative h-[600px]">
          {/* عرض الحرف المختار بشكل بارز فوق اللوحة */}
          <HexagonCanvas 
            selectedHexagon={selectedHexagon}
            onHexagonSelect={gameStarted ? handleHexagonSelect : () => {}}
            redTeamHexagons={redTeamHexagons}
            greenTeamHexagons={greenTeamHexagons}
            onLettersInitialized={(letters) => {
              // تحديث الحروف فقط مرة واحدة عند التهيئة
              if (Object.keys(hexagonLetters).length === 0) {
                setHexagonLetters(letters);
              }
            }}
          />
          
          {/* عرض رسائل الخطأ */}
          {errorMessage && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
              {errorMessage}
            </div>
          )}
          
          {/* عرض الفائز إذا كان هناك فائز */}
          {winner && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg text-center">
                <h2 className="text-3xl font-bold mb-4">
                  {winner === 'red' ? 'فاز الفريق الأحمر!' : 'فاز الفريق الأخضر!'}
                </h2>
                <button 
                  className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg"
                  onClick={startGame}
                >
                  جولة جديدة
                </button>
              </div>
            </div>
          )}
          
          {/* عرض شاشة البداية إذا لم تبدأ اللعبة بعد */}
          {!gameStarted && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg text-center">
                <h2 className="text-3xl font-bold mb-4">لعبة حروف</h2>
                <p className="mb-6 text-lg">اضغط على زر &quot;بدء اللعبة&quot; للبدء</p>
                <button 
                  className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg"
                  onClick={startGame}
                >
                  بدء اللعبة
                </button>
              </div>
            </div>
          )}
        </div>

        {/* لوحة معلومات اللعبة */}
        <div className="w-96 space-y-4">
          {/* السؤال والحرف الحالي */}
          <div className="bg-white p-4 rounded-lg shadow-md text-right">
            {currentLetter && gameStarted && (
              <div className="mb-2 text-center">
                <span className="inline-block bg-blue-500 text-white text-2xl font-bold w-12 h-12 rounded-full  items-center justify-center">
                  {currentLetter}
                </span>
                <div className="mt-1 text-sm text-gray-500">
                  سؤال يبدأ بحرف {currentLetter}
                  {selectedHexagon !== null && hexagonLetters[selectedHexagon] && (
                    <span className={`font-bold ${hexagonLetters[selectedHexagon] === currentLetter ? 'text-green-600' : 'text-red-600'}`}>
                      {hexagonLetters[selectedHexagon] === currentLetter 
                        ? " (مطابق للخلية المحددة)" 
                        : ` (الخلية المحددة: ${hexagonLetters[selectedHexagon]})`}
                    </span>
                  )}
                </div>
              </div>
            )}
            <h2 className="text-xl font-bold mb-4">{gameStarted ? currentQuestion : 'سيتم عرض السؤال هنا'}</h2>
            <div className="bg-blue-100 p-3 rounded-lg text-center">
              <span className="text-xl font-bold text-blue-800">{gameStarted ? currentAnswer : '...'}</span>
            </div>
          </div>

          {/* حالة اللعبة الحالية - تحديث لإظهار "من يضغط أولاً" عند بدء اللعبة */}
          <div className={`p-4 rounded-lg shadow-md text-center ${
            !gameStarted ? 'bg-gray-100' :
            currentBuzzedPlayer ? 'bg-yellow-100' : 
            gamePhase === 'open_question' ? 'bg-yellow-100' : 
            currentTeam === 'red' ? 'bg-red-100' : 
            'bg-green-100'
          }`}>
            <span className={`text-xl font-bold ${
              !gameStarted ? 'text-gray-800' :
              currentBuzzedPlayer ? 'text-blue-800' : 
              gamePhase === 'open_question' ? 'text-yellow-800' : 
              currentTeam === 'red' ? 'text-red-800' : 
              'text-green-800'
            }`}>
              {!gameStarted ? 'انتظار بدء اللعبة' : 
               currentBuzzedPlayer ? `دور اللاعب ${currentBuzzedPlayer} للإجابة` :
               gamePhase === 'open_question' ? 'من يضغط أولاً يحق له الإجابة' :
               `دور الفريق ${currentTeam === 'red' ? 'الأحمر' : 'الأخضر'}`}
            </span>
          </div>

          {/* المؤقت */}
          <div className="text-center">
            <time className={`text-3xl font-bold font-mono ${!gameStarted ? 'text-gray-400' : timeLeft <= 10 ? 'text-red-500' : ''}`} dateTime={formatTime(timeLeft)}>
              {formatTime(timeLeft)}
            </time>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-4">
            <button 
              className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg flex-1"
              onClick={handleWrongAnswer}
              disabled={!gameStarted || currentBuzzedPlayer === null}
            >
              خطأ
            </button>
            <button 
              className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg flex-1"
              onClick={handleCorrectAnswer}
              disabled={!gameStarted || currentBuzzedPlayer === null || selectedHexagon === null}
            >
              صحيحة
            </button>
          </div>

          {/* الوقت المحدد */}
          <div className="mt-1 text-sm text-gray-500">
            الوقت المحدد: {timeLimit} ثوانٍ
          </div>
        </div>
      </div>

      {/* اللاعبون - تحديث لإبراز إمكانية الضغط عند بدء اللعبة */}
      <div className="mt-4 flex justify-between">
        {players.map((player) => (
          <div 
            key={player.id} 
            className={`p-4 rounded-lg cursor-pointer
              ${player.team === 'red' ? 'bg-red-100' : 'bg-green-100'} 
              ${currentBuzzedPlayer === player.id ? 'ring-4 ring-yellow-500' : ''}
              ${buzzedPlayers.includes(player.id) && currentBuzzedPlayer !== player.id ? 'ring-2 ring-blue-500' : ''}
              ${!player.active || !gameStarted ? 'opacity-50' : ''}
              ${gameStarted && gamePhase === 'open_question' && player.active && !buzzedPlayers.includes(player.id) ? 'animate-pulse' : ''}
            `}
            onClick={() => gameStarted && player.active && handlePlayerBuzz(player.id)}
          >
            <div className={`h-3 w-3 rounded-full inline-block mr-2 ${
              player.active && gameStarted ? (player.team === 'red' ? 'bg-red-500' : 'bg-green-500') : 'bg-gray-400'
            }`}></div>
            <span className="font-bold">اللاعب {player.id}</span>
            {gameStarted && buzzedPlayers.includes(player.id) && (
              <span className="mr-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {buzzedPlayers.indexOf(player.id) + 1}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* زر إعادة ضبط */}
      <div className="mt-4">
        <button 
          className="w-full bg-gray-400 text-white py-3 rounded-lg"
          onClick={() => {
            resetBuzzers();
            setSelectedHexagon(null);
            setTimerActive(false);
          }}
          disabled={!gameStarted}
        >
          إعادة ضبط الأزرار
        </button>
      </div>
    </div>
  );
};

export default CanvasHexagonBoard;