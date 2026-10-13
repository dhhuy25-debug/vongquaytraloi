import React, { useEffect, useState } from 'react';
import { Student } from '../types';
import { soundEngine } from '../utils/audio';
import { fireClassroomCelebration } from '../utils/confetti';
import { Trophy, Medal, Award, Star, Zap, X, ScrollText, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onOpenCertificate: (student: Student, rank: number) => void;
  onResetScores?: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  students = [],
  onOpenCertificate,
  onResetScores,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Sound & Celebration hook must be called unconditionally before any early returns
  useEffect(() => {
    if (isOpen) {
      soundEngine.playFanfare();
      fireClassroomCelebration();
      setShowResetConfirm(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate class summary stats safely
  const totalStarsInClass = students.reduce((acc, s) => acc + (typeof s.stars === 'number' && !isNaN(s.stars) ? s.stars : 0), 0);
  const totalCorrectAnswers = students.reduce((acc, s) => acc + (typeof s.correctAnswers === 'number' && !isNaN(s.correctAnswers) ? s.correctAnswers : 0), 0);
  const isAllZero = totalStarsInClass === 0 && totalCorrectAnswers === 0;

  // Sort students: stars desc -> correctAnswers desc -> totalAnswerTimeSec asc
  const sortedStudents = [...students].sort((a, b) => {
    const starsA = typeof a.stars === 'number' && !isNaN(a.stars) ? a.stars : 0;
    const starsB = typeof b.stars === 'number' && !isNaN(b.stars) ? b.stars : 0;
    if (starsB !== starsA) return starsB - starsA;

    const correctA = typeof a.correctAnswers === 'number' && !isNaN(a.correctAnswers) ? a.correctAnswers : 0;
    const correctB = typeof b.correctAnswers === 'number' && !isNaN(b.correctAnswers) ? b.correctAnswers : 0;
    if (correctB !== correctA) return correctB - correctA;

    const timeA = typeof a.totalAnswerTimeSec === 'number' && !isNaN(a.totalAnswerTimeSec) ? a.totalAnswerTimeSec : 0;
    const timeB = typeof b.totalAnswerTimeSec === 'number' && !isNaN(b.totalAnswerTimeSec) ? b.totalAnswerTimeSec : 0;
    return timeA - timeB;
  });

  const top1 = sortedStudents[0];
  const top2 = sortedStudents[1];
  const top3 = sortedStudents[2];

  const handleConfirmReset = () => {
    if (onResetScores) {
      onResetScores();
      soundEngine.playPop();
    }
    setShowResetConfirm(false);
    setResetSuccessMessage('Đã đặt lại toàn bộ điểm và bảng xếp hạng về con số 0 thành công! 🎉');
    setTimeout(() => {
      setResetSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[95vh] flex flex-col bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-200 animate-bounce" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-['Baloo_2'] tracking-wide drop-shadow-xs">
                BẢNG VINH DANH TOP 3 HỌC SINH XUẤT SẮC
              </h2>
              <p className="text-amber-100 text-xs sm:text-sm font-semibold">
                Xếp hạng dựa trên số Sao đạt được và tốc độ trả lời chính xác nhất
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats & Action Subheader */}
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-extrabold text-amber-900 flex items-center gap-1.5 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              Tổng sao lớp: <strong className="text-amber-800">{totalStarsInClass}</strong>
            </span>
            <span className="font-extrabold text-slate-700 flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              🎯 Câu trả lời đúng: <strong className="text-slate-900">{totalCorrectAnswers}</strong>
            </span>
            {isAllZero && (
              <span className="text-2xs sm:text-xs text-amber-700 font-bold bg-amber-100/60 px-2 py-0.5 rounded-md">
                🌱 Tất cả đang ở vạch xuất phát 0 sao
              </span>
            )}
          </div>

          {onResetScores && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
              title="Đặt lại tất cả điểm và bắt đầu thi đua mới"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Đặt lại điểm về 0</span>
            </button>
          )}
        </div>

        {/* Success Toast Banner */}
        {resetSuccessMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-800 text-sm font-extrabold shadow-sm animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{resetSuccessMessage}</span>
            </div>
            <button
              onClick={() => setResetSuccessMessage(null)}
              className="p-1 hover:bg-emerald-100 rounded-md text-emerald-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Top 3 PODIUM (Bục vinh quang) */}
          {sortedStudents.length === 0 ? (
            <div className="bg-amber-50/70 rounded-3xl p-8 border-2 border-amber-200 text-center">
              <span className="text-4xl block mb-2">🎒</span>
              <p className="font-extrabold text-slate-700 text-base">Hiện chưa có học sinh nào trong danh sách lớp</p>
              <p className="text-slate-500 text-xs mt-1">Thầy/cô hãy nhấn nút "Học sinh" trên thanh công cụ để thêm danh sách lớp nhé!</p>
            </div>
          ) : (
            <div className="bg-gradient-to-b from-amber-50/70 to-orange-50/70 rounded-3xl p-4 sm:p-6 border-2 border-amber-200 shadow-inner">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-2xl mx-auto pt-6 pb-2">
                {/* RANK 2: Silver Podium (Bên trái) */}
                {top2 ? (
                  <div className="col-start-1 flex flex-col items-center text-center">
                    <div className="relative mb-2">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-slate-300 shadow-md overflow-hidden bg-white">
                        <img src={top2.avatar} alt={top2.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -top-2 -right-1 text-2xl select-none">🥈</span>
                    </div>
                    <h4 className="font-['Baloo_2'] font-black text-slate-800 text-sm sm:text-lg truncate max-w-full">
                      {top2.name}
                    </h4>
                    <div className="flex items-center gap-1 text-amber-700 font-extrabold text-xs sm:text-sm mb-2">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{top2.stars} Sao</span>
                    </div>

                    {/* Podium Stand */}
                    <div className="w-full bg-gradient-to-t from-slate-300 via-slate-200 to-slate-100 rounded-t-2xl py-4 sm:py-6 border-2 border-slate-300 shadow-md flex flex-col items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-black font-['Baloo_2'] text-slate-600">2</span>
                      <span className="text-2xs sm:text-xs font-black uppercase text-slate-500">Á QUÂN</span>
                      <button
                        onClick={() => onOpenCertificate(top2, 2)}
                        className="mt-2 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 font-extrabold rounded-lg text-2xs sm:text-xs shadow-xs border border-slate-300 flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                      >
                        <ScrollText className="w-3 h-3 text-slate-600" />
                        <span>Thư Khen</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="col-start-1"></div>
                )}

                {/* RANK 1: Gold Podium (Ở giữa, cao nhất) */}
                {top1 ? (
                  <div className="col-start-2 flex flex-col items-center text-center relative -top-4 sm:-top-6">
                    {/* Crown */}
                    <span className="text-3xl sm:text-4xl animate-bounce mb-0.5 select-none">👑</span>
                    <div className="relative mb-2">
                      <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-full border-4 border-amber-400 shadow-xl overflow-hidden bg-white ring-4 ring-amber-300/60">
                        <img src={top1.avatar} alt={top1.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -top-2 -right-1 text-3xl select-none">🥇</span>
                    </div>
                    <h4 className="font-['Baloo_2'] font-black text-amber-950 text-base sm:text-xl truncate max-w-full">
                      {top1.name}
                    </h4>
                    <div className="flex items-center gap-1 text-amber-800 font-black text-sm sm:text-base mb-2">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>{top1.stars} Sao Vàng</span>
                    </div>

                    {/* Podium Stand */}
                    <div className="w-full bg-gradient-to-t from-amber-400 via-amber-300 to-yellow-200 rounded-t-2xl py-7 sm:py-10 border-2 border-amber-400 shadow-xl flex flex-col items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-black font-['Baloo_2'] text-amber-900">1</span>
                      <span className="text-xs sm:text-sm font-black uppercase text-amber-800 tracking-wider">QUÁN QUÂN</span>
                      <button
                        onClick={() => onOpenCertificate(top1, 1)}
                        className="mt-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-1 cursor-pointer active:scale-95 transition-all animate-pulse"
                      >
                        <ScrollText className="w-4 h-4" />
                        <span>TẶNG THƯ KHEN</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="col-start-2"></div>
                )}

                {/* RANK 3: Bronze Podium (Bên phải) */}
                {top3 ? (
                  <div className="col-start-3 flex flex-col items-center text-center">
                    <div className="relative mb-2">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-600 shadow-md overflow-hidden bg-white">
                        <img src={top3.avatar} alt={top3.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -top-2 -right-1 text-2xl select-none">🥉</span>
                    </div>
                    <h4 className="font-['Baloo_2'] font-black text-slate-800 text-sm sm:text-lg truncate max-w-full">
                      {top3.name}
                    </h4>
                    <div className="flex items-center gap-1 text-amber-700 font-extrabold text-xs sm:text-sm mb-2">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{top3.stars} Sao</span>
                    </div>

                    {/* Podium Stand */}
                    <div className="w-full bg-gradient-to-t from-amber-700 via-amber-600 to-amber-500 rounded-t-2xl py-3 sm:py-5 border-2 border-amber-600 shadow-md flex flex-col items-center justify-center text-white">
                      <span className="text-2xl sm:text-3xl font-black font-['Baloo_2'] text-amber-100">3</span>
                      <span className="text-2xs sm:text-xs font-black uppercase text-amber-200">QUÝ QUÂN</span>
                      <button
                        onClick={() => onOpenCertificate(top3, 3)}
                        className="mt-2 px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-900 font-extrabold rounded-lg text-2xs sm:text-xs shadow-xs border border-amber-300 flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                      >
                        <ScrollText className="w-3 h-3 text-amber-700" />
                        <span>Thư Khen</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="col-start-3"></div>
                )}
              </div>
            </div>
          )}

          {/* Full Class Ranking Table */}
          <div>
            <h3 className="font-['Baloo_2'] font-black text-lg text-slate-800 mb-2 flex items-center gap-2">
              <span>Bảng điểm chi tiết cả lớp ({sortedStudents.length} học sinh)</span>
            </h3>

            <div className="space-y-2">
              {sortedStudents.length === 0 ? (
                <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-500 font-bold text-sm">
                  Danh sách học sinh đang trống.
                </div>
              ) : (
                sortedStudents.map((st, idx) => (
                <div
                  key={st.id || `st_${idx}`}
                  className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                    idx === 0
                      ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                      : idx === 1
                      ? 'bg-slate-50 border-slate-300'
                      : idx === 2
                      ? 'bg-orange-50/50 border-amber-300'
                      : 'bg-white border-slate-200 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950 font-black'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-600 font-bold'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-10 h-10 rounded-full border border-amber-300 bg-white object-cover"
                    />

                    <div>
                      <p className="font-extrabold text-slate-800 text-sm leading-tight">
                        {st.name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Đúng {st.correctAnswers || 0} câu · {st.stars || 0} sao
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {st.stars || 0} sao
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenCertificate(st, idx + 1)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      title="Mở Thư Khen cho em này"
                    >
                      <ScrollText className="w-3.5 h-3.5 text-amber-600" />
                      <span>Thư Khen</span>
                    </button>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 font-semibold">
          <div className="flex items-center gap-3">
            <span>* Thầy/cô có thể in hoặc tải ảnh Thư Khen cho bất kỳ học sinh nào trong bảng danh sách!</span>
            {onResetScores && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Đặt lại toàn bộ điểm và bắt đầu thi đua lại từ đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại điểm về 0</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow cursor-pointer transition-all"
          >
            Đóng
          </button>
        </div>

        {/* INTERACTIVE CONFIRMATION MODAL OVERLAY */}
        {showResetConfirm && (
          <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border-4 border-rose-300 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 border-2 border-rose-300">
                <AlertTriangle className="w-9 h-9" />
              </div>
              <h3 className="font-['Baloo_2'] font-black text-2xl text-slate-800 mb-2">
                Xác nhận đặt lại điểm về 0?
              </h3>
              <p className="text-slate-600 text-sm font-semibold mb-4 leading-relaxed">
                Thầy/cô có muốn đặt lại toàn bộ <strong className="text-amber-600">Sao Vàng ⭐</strong>, số câu đúng và thời gian kỷ lục của <strong className="text-slate-800">{students.length} học sinh</strong> về con số 0 không?
              </p>
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-800 font-bold mb-5 text-left space-y-1">
                <div>✓ Tất cả học sinh sẽ quay lại mốc 0 sao.</div>
                <div>✓ Danh sách họ tên và ảnh chân dung vẫn được giữ nguyên.</div>
                <div>✓ Bảng vinh danh và lượt thi đua sẽ bắt đầu lại từ đầu.</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2.5 rounded-xl border-2 border-slate-300 font-extrabold text-slate-700 hover:bg-slate-100 cursor-pointer transition-all text-sm"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5 text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Đồng ý đặt lại</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
