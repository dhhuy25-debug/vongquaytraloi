import React, { useState } from 'react';
import { Student, Question } from '../types';
import { soundEngine } from '../utils/audio';
import { fireMiniBurst } from '../utils/confetti';
import { Sparkles, Star, UserMinus, Play, RefreshCw, Eye, EyeOff, Award, X } from 'lucide-react';

interface WinnerModalProps {
  student: Student;
  question: Question | null;
  onRemoveStudent: (studentId: string) => void;
  onKeepStudent: () => void;
  onChangeQuestion: () => void;
  onAwardStar: (studentId: string) => void;
  totalStudentsLeft: number;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  student,
  question,
  onRemoveStudent,
  onKeepStudent,
  onChangeQuestion,
  onAwardStar,
  totalStudentsLeft,
}) => {
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hasAwardedStar, setHasAwardedStar] = useState<boolean>(false);

  const handleAwardStar = () => {
    if (hasAwardedStar) return;
    setHasAwardedStar(true);
    soundEngine.playStarSound();
    fireMiniBurst();
    onAwardStar(student.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden transform transition-all scale-100">
        {/* Festive top banner */}
        <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 p-4 text-center text-white relative">
          <button
            onClick={onKeepStudent}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white cursor-pointer transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-7 h-7 text-yellow-200 animate-spin" />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide drop-shadow-md">
              CHÚC MỪNG BẠN MAY MẮN!
            </h2>
            <Sparkles className="w-7 h-7 text-yellow-200 animate-spin" />
          </div>
          <p className="text-amber-100 text-sm font-semibold mt-0.5">
            Mời em tự tin đứng dậy trả lời câu hỏi của thầy/cô nhé!
          </p>
        </div>

        {/* Winner Showcase Card */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Avatar with shining glow */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-amber-400 rounded-full blur-md opacity-75 animate-pulse" />
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-amber-50 flex items-center justify-center">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Stars badge */}
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 font-extrabold px-3 py-1 rounded-full text-sm border-2 border-white shadow-md flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-900 text-amber-900" />
              <span>{(student.stars || 0) + (hasAwardedStar ? 1 : 0)} sao</span>
            </div>
          </div>

          {/* Student Name */}
          <h3 className="mt-4 text-3xl sm:text-4xl font-black text-slate-850 tracking-tight text-slate-900">
            {student.name}
          </h3>

          {/* Award Star Button */}
          <button
            onClick={handleAwardStar}
            disabled={hasAwardedStar}
            className={`mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              hasAwardedStar
                ? 'bg-amber-100 text-amber-800 cursor-default'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" />
            {hasAwardedStar ? 'Đã tặng 1 Sao Chăm Ngoan! ★' : '+ Tặng 1 Sao trả lời đúng'}
          </button>

          {/* Question Card Box */}
          <div className="mt-6 w-full bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-2xl p-5 text-left relative shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-200 text-amber-900">
                {question ? question.category : 'Câu hỏi thử thách'}
              </span>
              {question && (
                <button
                  onClick={onChangeQuestion}
                  className="text-xs font-semibold text-slate-600 hover:text-amber-700 inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs hover:border-amber-300 transition-colors cursor-pointer"
                  title="Bốc câu hỏi ngẫu nhiên khác"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Đổi câu khác
                </button>
              )}
            </div>

            {question ? (
              <>
                <p className="text-lg sm:text-xl font-bold text-slate-800 leading-snug mt-1">
                  "{question.text}"
                </p>

                {question.hint && (
                  <div className="mt-3 pt-3 border-t border-amber-200/60">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs font-bold text-amber-800 hover:text-amber-950 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {showHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showHint ? 'Ẩn đáp án gợi ý' : 'Xem đáp án / Gợi ý cho thầy cô'}
                    </button>
                    {showHint && (
                      <p className="mt-1.5 text-sm text-amber-900 font-medium bg-amber-100/80 p-2.5 rounded-lg animate-in fade-in">
                        {question.hint}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-base text-slate-600 italic py-2">
                Chưa có câu hỏi trong ngân hàng câu hỏi. Em hãy tự tin giới thiệu bản thân hoặc trả lời câu hỏi trực tiếp của thầy/cô nhé!
              </p>
            )}
          </div>

          {/* Action Decision Buttons */}
          <div className="mt-6 w-full space-y-2.5">
            <button
              onClick={() => {
                soundEngine.playPop();
                onRemoveStudent(student.id);
              }}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-black text-lg bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white shadow-lg shadow-emerald-500/25 transition-all cursor-pointer border-2 border-emerald-300"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>TIẾP TỤC LƯỢT TIẾP THEO</span>
              <span className="text-xs bg-emerald-800/60 text-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                (Đã bỏ qua em này · Còn {Math.max(0, totalStudentsLeft - 1)})
              </span>
            </button>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
              <span className="font-bold text-emerald-700">
                ✓ Vòng quay sẽ bỏ qua bạn {student.name} cho các lượt chơi tiếp theo
              </span>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onKeepStudent();
                }}
                className="text-slate-500 hover:text-amber-700 underline font-bold cursor-pointer"
              >
                Vẫn giữ lại em này
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3 font-medium">
            * "Loại học sinh" để tránh trùng lặp trong buổi học hôm nay. Thầy/cô có thể khôi phục lại bất kỳ lúc nào!
          </p>
        </div>
      </div>
    </div>
  );
};
