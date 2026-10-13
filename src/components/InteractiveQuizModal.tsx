import React, { useState, useEffect, useRef } from 'react';
import { Student, Question } from '../types';
import { soundEngine } from '../utils/audio';
import { fireClassroomCelebration, fireMiniBurst } from '../utils/confetti';
import {
  Sparkles,
  Star,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  UserMinus,
  Play,
  RotateCcw,
  X,
  Award,
  Flame,
  HelpCircle,
  Rocket,
} from 'lucide-react';

interface InteractiveQuizModalProps {
  student: Student;
  question: Question | null;
  onAnswerComplete: (studentId: string, starsEarned: number, timeTakenSec: number) => void;
  onRemoveStudent: (studentId: string) => void;
  onKeepStudent: () => void;
  onChangeQuestion: () => void;
  totalStudentsLeft: number;
  autoSkipEnabled?: boolean;
  unusedQuestionsCount?: number;
  totalQuestionsCount?: number;
  noRepeatQuestionsEnabled?: boolean;
}

export const InteractiveQuizModal: React.FC<InteractiveQuizModalProps> = ({
  student,
  question,
  onAnswerComplete,
  onRemoveStudent,
  onKeepStudent,
  onChangeQuestion,
  totalStudentsLeft,
  autoSkipEnabled = true,
  unusedQuestionsCount,
  totalQuestionsCount,
  noRepeatQuestionsEnabled = true,
}) => {
  const totalLimit = question?.timeLimitSec || 20;

  // Question reveal state: wait until student clicks "Hiển thị câu hỏi"
  const [isQuestionRevealed, setIsQuestionRevealed] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<number>(totalLimit);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [wrongOptionIndices, setWrongOptionIndices] = useState<number[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const prevStarRewardRef = useRef<number>(10);

  // Guarantee 4 options for every question
  const displayOptions =
    question?.options && question.options.length >= 2
      ? question.options
      : ['Đáp án A: Đúng', 'Đáp án B: Chưa đúng', 'Đáp án C: Chính xác', 'Đáp án D: Cần ôn tập'];

  const correctIndex = question?.correctIndex !== undefined ? question.correctIndex : 0;

  // Calculate stars remaining (10 down to 1) based on time left
  const fraction = Math.max(0, timeLeft / totalLimit);
  const calculatedCurrentStars = Math.max(1, Math.ceil(fraction * 10));
  const currentStarReward = isAnswered ? earnedStars : calculatedCurrentStars;

  // Reset modal state on mount or when question changes
  useEffect(() => {
    setIsQuestionRevealed(false);
    setTimeLeft(totalLimit);
    setIsTimerRunning(false);
    setSelectedOptionIndex(null);
    setWrongOptionIndices([]);
    setIsAnswered(false);
    setEarnedStars(0);
    setShowHint(false);
    setFeedbackMessage('');
    prevStarRewardRef.current = 10;
  }, [question, totalLimit]);

  // Start question and timer when student clicks the Reveal button
  const handleRevealQuestion = () => {
    soundEngine.playPop();
    fireMiniBurst();
    setIsQuestionRevealed(true);
    setIsTimerRunning(true);
    startTimeRef.current = Date.now();
  };

  // Countdown timer effect (only runs when question is revealed)
  useEffect(() => {
    if (!isQuestionRevealed || !isTimerRunning || isAnswered) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.2) {
          clearInterval(timerRef.current!);
          setIsTimerRunning(false);
          soundEngine.playPop();
          return 0;
        }
        return prev - 0.2;
      });
    }, 200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isQuestionRevealed, isTimerRunning, isAnswered]);

  // Play tick sound when a star drops
  useEffect(() => {
    if (isQuestionRevealed && !isAnswered && calculatedCurrentStars < prevStarRewardRef.current) {
      prevStarRewardRef.current = calculatedCurrentStars;
      soundEngine.playTick(0.2);
    }
  }, [calculatedCurrentStars, isQuestionRevealed, isAnswered]);

  // Title description based on current stars
  const getStarStatusInfo = (stars: number) => {
    if (stars >= 9) {
      return {
        label: '⚡ THẦN TỐC - ĐỈNH CAO!',
        color: 'text-amber-600 bg-amber-100 border-amber-300',
        barColor: 'from-amber-400 via-yellow-400 to-amber-500',
      };
    } else if (stars >= 7) {
      return {
        label: '🌟 RẤT NHANH NHẸN!',
        color: 'text-emerald-700 bg-emerald-100 border-emerald-300',
        barColor: 'from-emerald-400 via-teal-400 to-emerald-500',
      };
    } else if (stars >= 4) {
      return {
        label: '👍 TẬP TRUNG TỐT!',
        color: 'text-sky-700 bg-sky-100 border-sky-300',
        barColor: 'from-sky-400 via-blue-400 to-indigo-500',
      };
    } else {
      return {
        label: '🔥 NHANH LÊN NÀO!',
        color: 'text-rose-700 bg-rose-100 border-rose-300 animate-pulse',
        barColor: 'from-rose-500 via-orange-500 to-red-500',
      };
    }
  };

  const statusInfo = getStarStatusInfo(currentStarReward);

  // Handle correct response
  const handleCorrect = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setIsTimerRunning(false);

    const taken = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const finalStars = calculatedCurrentStars;

    setEarnedStars(finalStars);
    setFeedbackMessage(`XUẤT SẮC! BẠN ĐÃ GIÀNH ĐƯỢC +${finalStars} SAO VÀNG!`);

    soundEngine.playFanfare();
    fireClassroomCelebration();
    onAnswerComplete(student.id, finalStars, taken);
  };

  // Handle incorrect response
  const handleIncorrect = (idx: number) => {
    if (isAnswered) return;
    soundEngine.playPop();
    setWrongOptionIndices((prev) => [...prev, idx]);
    setFeedbackMessage('Chưa chính xác rồi! Em hãy chọn đáp án khác nhanh nhé!');
  };

  // Handle option click for multiple choice
  const handleOptionClick = (idx: number) => {
    if (!isQuestionRevealed || isAnswered || wrongOptionIndices.includes(idx)) return;
    setSelectedOptionIndex(idx);

    if (idx === correctIndex) {
      handleCorrect();
    } else {
      handleIncorrect(idx);
    }
  };

  const progressPercent = Math.max(0, Math.min(100, fraction * 100));

  // Option Letter badge styling
  const letterStyles = [
    { badge: 'bg-rose-500 text-white', border: 'border-rose-300', hover: 'hover:border-rose-400 hover:bg-rose-50/50' },
    { badge: 'bg-sky-500 text-white', border: 'border-sky-300', hover: 'hover:border-sky-400 hover:bg-sky-50/50' },
    { badge: 'bg-amber-500 text-white', border: 'border-amber-300', hover: 'hover:border-amber-400 hover:bg-amber-50/50' },
    { badge: 'bg-emerald-500 text-white', border: 'border-emerald-300', hover: 'hover:border-emerald-400 hover:bg-emerald-50/50' },
  ];

  const handleClose = () => {
    soundEngine.playPop();
    if (autoSkipEnabled) {
      onRemoveStudent(student.id);
    } else {
      onKeepStudent();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[96vh] flex flex-col bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden transform scale-100">
        {/* Festive Header Banner */}
        <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 px-6 py-3 text-white flex items-center justify-between relative shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-200 animate-spin" />
            <h2 className="text-xl sm:text-2xl font-black font-['Baloo_2'] tracking-wide drop-shadow-xs">
              LƯỢT THI CỦA BẠN: {student.name}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
            title="Đóng hộp thoại và chuyển sang lượt tiếp theo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Student Profile Card */}
          <div className="flex items-center justify-between bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-amber-400 bg-white shadow-md object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs font-black px-1.5 py-0.2 rounded-full border border-white flex items-center gap-0.5 shadow-xs">
                  <Star className="w-3 h-3 fill-white" />
                  <span>{student.stars + earnedStars}</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 font-['Baloo_2'] leading-tight">
                  {student.name}
                </h3>
                <p className="text-xs text-amber-700 font-extrabold flex items-center gap-1 mt-0.5">
                  <Award className="w-3.5 h-3.5" />
                  Đã đúng {student.correctAnswers + (isAnswered && earnedStars > 0 ? 1 : 0)} câu
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs sm:text-sm font-black border ${statusInfo.color}`}>
                <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
                <span>{statusInfo.label}</span>
              </span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* PHASE 1: READY SCREEN (CHƯA BẤM NÚT HIỂN THỊ CÂU HỎI) */}
          {/* ============================================================== */}
          {!isQuestionRevealed ? (
            <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 rounded-3xl p-6 sm:p-8 border-4 border-dashed border-amber-400 text-center flex flex-col items-center justify-center space-y-5 animate-in zoom-in-95 duration-200 shadow-md">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-amber-400 bg-white shadow-xl overflow-hidden p-1">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-2 rounded-full shadow-md text-xl animate-bounce">
                  ⭐
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-['Baloo_2'] text-slate-900 tracking-tight">
                  CHÚC MỪNG BẠN {student.name.toUpperCase()}!
                </h3>
                <p className="text-sm sm:text-base font-bold text-amber-900 mt-1 max-w-md mx-auto">
                  Mời em tự tin đứng dậy, chuẩn bị tinh thần và bấm nút bên dưới để mở câu hỏi trắc nghiệm và bắt đầu tính sao nhé!
                </p>
              </div>

              {/* 10 Stars Reward Preview */}
              <div className="bg-white/80 backdrop-blur-xs px-4 py-2 rounded-2xl border border-amber-300 shadow-xs flex items-center gap-2">
                <span className="text-xs font-black text-amber-800 uppercase tracking-wide">
                  Phần thưởng tối đa:
                </span>
                <span className="text-sm font-black text-amber-600 flex items-center gap-1">
                  ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (10 Sao Vàng)
                </span>
              </div>

              {/* GIANT BUTTON TO REVEAL QUESTION & START STAR COUNTDOWN */}
              <button
                type="button"
                onClick={handleRevealQuestion}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 active:scale-95 text-amber-950 font-black text-xl sm:text-2xl shadow-xl shadow-amber-500/35 border-4 border-white cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 animate-pulse"
              >
                <Rocket className="w-7 h-7 text-amber-950 animate-bounce" />
                <span>BẤM VÀO ĐÂY ĐỂ HIỂN THỊ CÂU HỎI!</span>
                <Sparkles className="w-7 h-7 text-yellow-100 animate-spin" />
              </button>

              <div className="flex items-center gap-4 flex-wrap justify-center pt-1">
                <p className="text-2xs text-slate-500 font-semibold">
                  * Sau khi bấm nút, câu hỏi sẽ xuất hiện và thanh 10 sao sẽ bắt đầu giảm dần theo thời gian.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playPop();
                    onRemoveStudent(student.id);
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                  title="Bỏ qua bạn này và quay bạn khác"
                >
                  Bỏ qua bạn này và quay bạn khác
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* PHASE 2: QUESTION REVEALED & 10-STAR COUNTDOWN ACTIVE */
            /* ============================================================== */
            <>
              {/* THE 10-STAR DECREASING GAUGE (THANH SỐ SAO GIẢM DẦN THEO THỜI GIAN) */}
              <div className="bg-gradient-to-b from-[#FFFDF5] to-[#FEF3C7] rounded-3xl p-4 sm:p-5 border-3 border-amber-300 shadow-md animate-in fade-in duration-200">
                {/* Header of Star Gauge */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500 animate-spin" />
                    <span>Thanh Số Sao Thưởng (Tối Đa 10 Sao):</span>
                  </span>
                  <div className="flex items-center gap-1.5 bg-amber-500 text-white font-['Baloo_2'] font-black px-3.5 py-0.5 rounded-full text-base sm:text-lg shadow-sm border border-amber-300">
                    <Star className="w-4 h-4 fill-white" />
                    <span>{currentStarReward} / 10 SAO VÀNG</span>
                  </div>
                </div>

                {/* 10 Glowing Interactive Star Slots in a Row */}
                <div className="grid grid-cols-10 gap-1 sm:gap-2 py-1.5">
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const starNum = idx + 1;
                    const isActive = starNum <= currentStarReward;

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-xl border-2 transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-b from-amber-200 to-amber-400 border-amber-400 shadow-sm scale-100 sm:scale-105 ring-1 ring-amber-300'
                            : 'bg-slate-100 border-slate-200 opacity-30 scale-95'
                        }`}
                      >
                        <Star
                          className={`w-5 h-5 sm:w-7 sm:h-7 transition-all ${
                            isActive
                              ? 'fill-amber-500 text-amber-600 drop-shadow-xs animate-pulse'
                              : 'fill-slate-200 text-slate-300'
                          }`}
                        />
                        <span
                          className={`text-2xs sm:text-xs font-black mt-0.5 ${
                            isActive ? 'text-amber-950' : 'text-slate-400'
                          }`}
                        >
                          {starNum}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Continuous Smooth Progress Track beneath the 10 stars */}
                <div className="mt-3 w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-amber-200">
                  <div
                    className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r ${statusInfo.barColor}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <p className="text-2xs text-center text-amber-800 font-bold mt-2">
                  * Chạm trực tiếp vào đáp án A, B, C, D bên dưới để trả lời và giành trọn số Sao Vàng!
                </p>
              </div>

              {/* Question Card & 4 INTERACTIVE OPTIONS */}
              <div className="bg-white rounded-2xl border-3 border-amber-300 p-5 shadow-sm text-left animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
                      {question ? question.category : 'Trắc nghiệm'}
                    </span>
                    {noRepeatQuestionsEnabled && (
                      <span className="text-2xs font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                        <span>🎯 Không lặp lại</span>
                        {typeof unusedQuestionsCount === 'number' && typeof totalQuestionsCount === 'number' && (
                          <span className="font-extrabold text-teal-900">
                            (Còn {unusedQuestionsCount}/{totalQuestionsCount} câu)
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  {question && !isAnswered && (
                    <button
                      onClick={onChangeQuestion}
                      className="text-xs font-bold text-slate-600 hover:text-amber-700 inline-flex items-center gap-1 bg-slate-50 hover:bg-amber-50 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer"
                      title="Đổi sang câu hỏi khác chưa xuất hiện"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                      Đổi câu khác
                    </button>
                  )}
                </div>

                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug font-['Baloo_2'] mt-1">
                  {question ? question.text : 'Chưa có câu hỏi trong ngân hàng!'}
                </p>

                {/* 4 INTERACTIVE MULTIPLE CHOICE BUTTONS (A, B, C, D) */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {displayOptions.map((opt, idx) => {
                    const label = String.fromCharCode(65 + idx); // A, B, C, D
                    const isCorrect = idx === correctIndex;
                    const isSelected = selectedOptionIndex === idx;
                    const isWrong = wrongOptionIndices.includes(idx);
                    const showResult = isAnswered;

                    const lStyle = letterStyles[idx % letterStyles.length];

                    let cardStyle = `bg-white ${lStyle.border} ${lStyle.hover} text-slate-800`;
                    let badgeStyle = lStyle.badge;

                    if (showResult && isCorrect) {
                      cardStyle =
                        'bg-emerald-500 border-emerald-600 text-white font-black shadow-lg scale-[1.02] ring-4 ring-emerald-300';
                      badgeStyle = 'bg-white text-emerald-700';
                    } else if (isWrong) {
                      cardStyle = 'bg-rose-50 border-rose-300 text-rose-800 opacity-60 line-through';
                      badgeStyle = 'bg-rose-500 text-white';
                    } else if (showResult && isSelected && !isCorrect) {
                      cardStyle = 'bg-rose-500 border-rose-600 text-white font-bold opacity-80';
                      badgeStyle = 'bg-white text-rose-700';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isAnswered || isWrong}
                        onClick={() => handleOptionClick(idx)}
                        className={`p-4 rounded-2xl border-3 text-left font-bold text-base sm:text-lg transition-all duration-150 flex items-center gap-3.5 cursor-pointer disabled:cursor-not-allowed shadow-xs active:scale-97 ${cardStyle}`}
                      >
                        <span
                          className={`w-10 h-10 rounded-xl font-black flex items-center justify-center shrink-0 text-base shadow-sm ${badgeStyle}`}
                        >
                          {label}
                        </span>
                        <span className="flex-1 leading-snug font-['Baloo_2'] text-lg sm:text-xl">
                          {opt}
                        </span>

                        {showResult && isCorrect && (
                          <CheckCircle className="w-6 h-6 text-white shrink-0 animate-bounce" />
                        )}
                        {isWrong && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Hint toggle */}
                {question?.hint && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {showHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showHint ? 'Ẩn gợi ý đáp án' : 'Xem gợi ý đáp án'}
                    </button>
                    {showHint && (
                      <span className="text-xs text-amber-900 font-semibold bg-amber-100 px-3 py-1 rounded-lg animate-in fade-in">
                        {question.hint}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Feedback & Result Message */}
              {feedbackMessage && (
                <div
                  className={`p-3.5 rounded-2xl text-center font-extrabold text-base animate-in zoom-in-95 duration-200 border-2 ${
                    earnedStars > 0
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {earnedStars > 0 ? (
                      <>
                        <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                        <span>{feedbackMessage}</span>
                        <span className="text-amber-500 font-black flex items-center gap-0.5">
                          ★ +{earnedStars}
                        </span>
                      </>
                    ) : (
                      <span>{feedbackMessage}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Decision Buttons after answering */}
              {isAnswered && (
                <div className="pt-3 border-t border-slate-200 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      onRemoveStudent(student.id);
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 active:scale-98 text-white font-black text-lg sm:text-xl flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-emerald-500/25 border-3 border-emerald-300 transition-all"
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-100" />
                    <span>TIẾP TỤC LƯỢT TIẾP THEO</span>
                    <span className="text-xs bg-emerald-800/60 text-emerald-100 px-3 py-1 rounded-full font-bold">
                      Đã bỏ qua em này (Còn {Math.max(0, totalStudentsLeft - 1)} bạn)
                    </span>
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1 flex-wrap gap-2">
                    <span className="font-bold text-emerald-700 flex items-center gap-1.5 flex-wrap">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                      <span>✓ Đã ghi nhận: Bỏ qua bạn {student.name}</span>
                      {noRepeatQuestionsEnabled && (
                        <span className="text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-md font-extrabold border border-teal-300">
                          🎯 Câu hỏi này sẽ không lặp lại
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playPop();
                        onKeepStudent();
                      }}
                      className="text-slate-500 hover:text-amber-700 underline font-bold cursor-pointer transition-colors"
                      title="Nếu muốn giữ lại học sinh này trong vòng quay"
                    >
                      Giữ lại em này trong vòng quay
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
