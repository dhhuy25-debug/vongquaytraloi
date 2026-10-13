import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Student } from '../types';
import { soundEngine } from '../utils/audio';
import { Play, RotateCcw, Flag, Trophy, Sparkles, Zap, Flame } from 'lucide-react';

interface ClassroomHorseRaceProps {
  students: Student[];
  isRacing: boolean;
  onRaceStart: () => void;
  onRaceEnd: (winner: Student) => void;
  raceDurationMs?: number;
  onRestoreAll?: () => void;
}

interface HorseProgress {
  studentId: string;
  progress: number; // 0 to 100
  speedMultiplier: number;
  burstRemaining: number;
}

// Colorful horse coat colors for variety
const HORSE_COATS = [
  { body: '#8B4513', mane: '#3E2723', legs: '#5D4037' }, // Chestnut
  { body: '#D2691E', mane: '#E65100', legs: '#8D4004' }, // Sorrel / Orange-brown
  { body: '#424242', mane: '#212121', legs: '#1A1A1A' }, // Black Stallion
  { body: '#F5F5DC', mane: '#E0E0E0', legs: '#D7CCC8' }, // Palomino / Cream
  { body: '#A0522D', mane: '#4A2511', legs: '#6B3A1E' }, // Bay
  { body: '#CD853F', mane: '#8B4513', legs: '#A5682A' }, // Golden Brown
  { body: '#78909C', mane: '#37474F', legs: '#546E7A' }, // Dappled Grey
  { body: '#BCAAA4', mane: '#6D4C41', legs: '#8D6E63' }, // Roan
];

export const ClassroomHorseRace: React.FC<ClassroomHorseRaceProps> = ({
  students,
  isRacing,
  onRaceStart,
  onRaceEnd,
  raceDurationMs = 6500,
  onRestoreAll,
}) => {
  // Live position of each horse: 0 to 100%
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [countdown, setCountdown] = useState<number | null>(null);
  const [raceWinner, setRaceWinner] = useState<Student | null>(null);
  const [leadStudent, setLeadStudent] = useState<Student | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const raceStartTimeRef = useRef<number>(0);
  const gallopIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chosenWinnerRef = useRef<Student | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize or reset positions to 0
  useEffect(() => {
    if (!isRacing) {
      const init: Record<string, number> = {};
      students.forEach((s) => {
        init[s.id] = 0;
      });
      setPositions(init);
      setRaceWinner(null);
      setLeadStudent(null);
    }
  }, [students, isRacing]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (gallopIntervalRef.current) clearInterval(gallopIntervalRef.current);
    };
  }, []);

  // Pre-race start with countdown and bugle call
  const handleStartRace = () => {
    if (isRacing || students.length === 0 || countdown !== null) return;

    // Pick winning student fairly at random among active students
    const winnerIdx = Math.floor(Math.random() * students.length);
    const predeterminedWinner = students[winnerIdx];
    chosenWinnerRef.current = predeterminedWinner;

    // Play race horn fanfare
    soundEngine.playRaceHorn();
    setCountdown(3);

    const countTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countTimer);
          setCountdown(null);
          // Actually trigger race
          startRaceAnimation(predeterminedWinner);
          return null;
        }
        soundEngine.playPop();
        return prev - 1;
      });
    }, 800);
  };

  const startRaceAnimation = (predeterminedWinner: Student) => {
    onRaceStart();
    raceStartTimeRef.current = performance.now();
    setRaceWinner(null);

    // Gallop sound loop (alternating clip-clop hoofbeats)
    gallopIntervalRef.current = setInterval(() => {
      soundEngine.playGallop();
    }, 280);

    // Generate individual horse trajectories and speed curves
    // Winner will pull ahead in final stretch and cross 100% first
    const horseCurves: Record<
      string,
      { surges: number[]; finalPush: number; currentJitter: number }
    > = {};

    students.forEach((s) => {
      const isWinner = s.id === predeterminedWinner.id;
      horseCurves[s.id] = {
        // Random speed bursts at 25%, 50%, 75% marks
        surges: [
          0.85 + Math.random() * 0.35,
          0.85 + Math.random() * 0.35,
          0.85 + Math.random() * 0.35,
        ],
        finalPush: isWinner ? 1.45 : 0.75 + Math.random() * 0.3,
        currentJitter: 0,
      };
    });

    const updatePhysics = (now: number) => {
      const elapsed = now - raceStartTimeRef.current;
      const progress = Math.min(1, elapsed / raceDurationMs);

      // Easing function for natural sprint progression
      const newPositions: Record<string, number> = {};
      let currentLeader: Student | null = null;
      let maxPos = -1;

      students.forEach((s) => {
        const isWinner = s.id === predeterminedWinner.id;
        const curves = horseCurves[s.id];

        // Periodic small surges & bobbing
        const segment = Math.min(2, Math.floor(progress * 3));
        const surgeFactor = curves.surges[segment];
        const wobble = Math.sin((elapsed / 300) + (parseInt(s.id.slice(-2), 16) || 1)) * 1.5;

        let horsePos = 0;
        if (progress < 0.75) {
          // Mid-race pack racing: everyone close together with realistic overtakes
          const baseProgress = progress * 70;
          const variance = (surgeFactor - 1) * 14;
          horsePos = Math.max(0, Math.min(78, baseProgress + variance + wobble));
        } else {
          // Final sprint: 75% to 100%
          const sprintProgress = (progress - 0.75) / 0.25; // 0 to 1
          const startSprintPos = 65 + (curves.surges[2] - 1) * 10;
          const targetFinish = isWinner ? 100 : 82 + Math.random() * 10;
          horsePos = startSprintPos + (targetFinish - startSprintPos) * sprintProgress;
          if (isWinner && progress >= 1) {
            horsePos = 100;
          }
        }

        // Clamp between 0 and 100
        const clamped = Math.max(0, Math.min(100, horsePos));
        newPositions[s.id] = clamped;

        if (clamped > maxPos) {
          maxPos = clamped;
          currentLeader = s;
        }
      });

      setPositions(newPositions);
      setLeadStudent(currentLeader);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(updatePhysics);
      } else {
        // Race complete!
        if (gallopIntervalRef.current) {
          clearInterval(gallopIntervalRef.current);
          gallopIntervalRef.current = null;
        }

        // Ensure winner reaches 100%
        newPositions[predeterminedWinner.id] = 100;
        setPositions({ ...newPositions });
        setRaceWinner(predeterminedWinner);
        setLeadStudent(predeterminedWinner);

        // Winner fanfare and delay to show triumph before question modal opens
        soundEngine.playFanfare();

        setTimeout(() => {
          onRaceEnd(predeterminedWinner);
        }, 1200);
      }
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none" ref={containerRef}>
      {/* Race Top Banner & Live Status */}
      <div className="w-full mb-3 flex items-center justify-between flex-wrap gap-2 px-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-sm text-lg">
            🏇
          </div>
          <div>
            <h2 className="font-['Baloo_2'] text-lg sm:text-xl font-black text-amber-950 leading-tight flex items-center gap-2">
              ĐƯỜNG ĐUA NGỰA LỚP HỌC
              <span className="text-xs font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                {students.length} Ngựa Chiến
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Bứt phá tốc độ · Cán đích đầu tiên · Giành quyền trả lời thử thách
            </p>
          </div>
        </div>

        {/* Live Leader / Race Status Alert */}
        <div className="flex items-center gap-2">
          {isRacing && leadStudent && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-xl text-xs font-black text-amber-900 animate-pulse shadow-xs">
              <Flame className="w-3.5 h-3.5 text-orange-600 animate-bounce" />
              <span>Dẫn đầu: {leadStudent.name}</span>
            </div>
          )}

          {raceWinner && (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-black text-emerald-900 shadow-xs">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Về nhất: {raceWinner.name}! 🏆</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Racetrack Arena */}
      <div className="w-full bg-gradient-to-b from-[#2E7D32] via-[#388E3C] to-[#1B5E20] rounded-3xl p-3 sm:p-4 shadow-xl border-4 border-[#1B5E20] relative overflow-hidden">
        {/* Track Grass Stripes Decoration */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #1B5E20 0px, #1B5E20 36px, #2E7D32 36px, #2E7D32 72px)',
          }}
        />

        {/* Distance Markers at Top of Track */}
        <div className="relative w-full h-6 mb-2 flex items-center justify-between px-14 sm:px-20 text-[11px] font-black text-emerald-100 border-b border-emerald-400/40 pb-1">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-300 inline-block"></span>
            0m (Xuất phát)
          </span>
          <span className="hidden sm:inline-block opacity-80">50m</span>
          <span className="opacity-80">100m</span>
          <span className="hidden sm:inline-block opacity-80">150m</span>
          <span className="text-yellow-300 flex items-center gap-1 font-black">
            <Flag className="w-3.5 h-3.5" />
            Vạch Đích 🏁
          </span>
        </div>

        {/* Racetrack Lanes Container */}
        <div className="relative flex flex-col gap-2.5 max-h-[58vh] overflow-y-auto pr-1 custom-scrollbar">
          {students.length === 0 ? (
            <div className="py-14 text-center text-white bg-black/20 rounded-2xl">
              <p className="text-lg font-bold">Chưa có học sinh nào trên đường đua!</p>
              <p className="text-xs text-emerald-200 mt-1">
                Vui lòng kích hoạt học sinh trong bảng &quot;Quản lý học sinh&quot; để bắt đầu cuộc đua.
              </p>
            </div>
          ) : (
            students.map((student, idx) => {
              const posPercent = positions[student.id] || 0;
              const coat = HORSE_COATS[idx % HORSE_COATS.length];
              const isWinner = raceWinner?.id === student.id;
              const isLead = isRacing && leadStudent?.id === student.id;

              return (
                <div
                  key={student.id}
                  className={`relative h-16 sm:h-20 rounded-2xl transition-all flex items-center px-2 sm:px-3 overflow-hidden border ${
                    isWinner
                      ? 'bg-amber-400/30 border-amber-300 ring-2 ring-yellow-400'
                      : isLead
                      ? 'bg-emerald-800/60 border-yellow-400/80'
                      : 'bg-[#5c3c1e]/40 border-emerald-700/60'
                  }`}
                  style={{
                    // Racetrack dirt texture effect
                    background:
                      'linear-gradient(90deg, rgba(160,82,45,0.7) 0%, rgba(139,69,19,0.75) 50%, rgba(160,82,45,0.7) 100%)',
                  }}
                >
                  {/* Lane Number & Student Name Pill on the Left Stall */}
                  <div className="absolute left-2 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs text-white px-2 py-1 rounded-xl border border-white/20 text-xs font-bold max-w-[120px] sm:max-w-[150px] truncate shadow-xs">
                    <span
                      className="w-5 h-5 rounded-md text-[11px] font-black flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: student.color, color: '#FFFFFF' }}
                    >
                      {idx + 1}
                    </span>
                    <span className="truncate text-[11px] sm:text-xs">{student.name}</span>
                  </div>

                  {/* Starting Gate Line */}
                  <div className="absolute left-28 sm:left-36 top-0 bottom-0 w-1 bg-yellow-400/60 border-r border-dashed border-white/40" />

                  {/* Finish Line Checkered Banner */}
                  <div
                    className="absolute right-6 sm:right-10 top-0 bottom-0 w-7 flex flex-col z-0 opacity-90 shadow-sm"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(45deg, #000 0, #000 8px, #FFF 8px, #FFF 16px)',
                    }}
                  >
                    <div className="w-full h-full border-x-2 border-yellow-400/80" />
                  </div>

                  {/* The Running Horse & Jockey Unit */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none transition-transform will-change-transform"
                    style={{
                      // Usable racing span between left start gate (110px) and finish line (right margin)
                      left: `calc(110px + (100% - 210px) * ${posPercent / 100})`,
                      transition: isRacing ? 'left 60ms linear' : 'left 0.4s ease-out',
                    }}
                  >
                    {/* Animated Horse SVG */}
                    <div
                      className={`relative flex items-center ${
                        isRacing ? 'animate-gallop' : ''
                      }`}
                    >
                      {/* Dust cloud puff behind horse when galloping */}
                      {isRacing && posPercent > 5 && posPercent < 98 && (
                        <span className="absolute -left-4 bottom-1 text-sm opacity-70 animate-ping select-none">
                          💨
                        </span>
                      )}

                      {/* Jockey & Horse Visual Container */}
                      <div className="relative flex items-center">
                        <AnimatedHorseSvg
                          coat={coat}
                          studentColor={student.color}
                          isGalloping={isRacing}
                          isWinner={isWinner}
                        />

                        {/* Student Avatar circular badge placed as the Jockey's helmet/emblem */}
                        <div
                          className="absolute -top-1 left-3 sm:left-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-md overflow-hidden bg-white z-30 transition-transform"
                          style={{
                            boxShadow: `0 0 8px ${student.color}`,
                          }}
                        >
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Winner Crown / Trophy icon */}
                        {isWinner && (
                          <div className="absolute -top-6 left-5 text-xl animate-bounce z-40 select-none">
                            👑
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 3... 2... 1... COUNTDOWN OVERLAY */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center z-50">
            <div className="font-['Baloo_2'] text-7xl sm:text-9xl font-black text-amber-400 animate-ping drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
              {countdown}
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-3 uppercase tracking-wider flex items-center gap-2">
              <span>🎺 Chuẩn bị xuất phát!</span>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons & Trigger */}
      <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
        {students.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-3xl shadow-lg max-w-md text-center">
            <span className="text-3xl">🎉</span>
            <p className="font-extrabold text-emerald-950 text-base">
              Tất cả các bạn ngựa chiến đã hoàn thành lượt thi đua!
            </p>
            {onRestoreAll && (
              <button
                type="button"
                onClick={onRestoreAll}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-95 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-600/30 border-2 border-white cursor-pointer transition-all animate-bounce"
              >
                🔄 BẮT ĐẦU VÒNG ĐUA MỚI (Khôi phục danh sách)
              </button>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={handleStartRace}
              disabled={isRacing || countdown !== null || students.length === 0}
              className={`flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-black text-base sm:text-lg text-white shadow-lg transition-all cursor-pointer ${
                isRacing || countdown !== null || students.length === 0
                  ? 'bg-slate-400 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-95 hover:shadow-xl ring-4 ring-emerald-300/40 animate-pulse'
              }`}
              title="Bấm hoặc nhấn Phím Cách (Space) để xuất phát cuộc đua"
            >
              <span className="text-2xl">🏇</span>
              <span>{isRacing ? 'ĐANG ĐUA GAY CẤN...' : 'XUẤT PHÁT ĐUA NGỰA'}</span>
              <span className="hidden sm:inline-block bg-white/20 text-white text-xs px-2 py-0.5 rounded-md font-bold">
                Phím Space
              </span>
            </button>

            {/* Reset / Reposition Horses Button */}
            {!isRacing && (
              <button
                onClick={() => {
                  const resetObj: Record<string, number> = {};
                  students.forEach((s) => {
                    resetObj[s.id] = 0;
                  });
                  setPositions(resetObj);
                  setRaceWinner(null);
                  setLeadStudent(null);
                  soundEngine.playPop();
                }}
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-white/80 hover:bg-white text-slate-700 border border-slate-300 shadow-sm transition-all cursor-pointer active:scale-95"
                title="Đưa tất cả ngựa về vạch xuất phát"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Về vạch xuất phát</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Custom SVG Horse Component with animated galloping limbs and jockey silks
interface AnimatedHorseSvgProps {
  coat: { body: string; mane: string; legs: string };
  studentColor: string;
  isGalloping: boolean;
  isWinner?: boolean;
}

const AnimatedHorseSvg: React.FC<AnimatedHorseSvgProps> = ({
  coat,
  studentColor,
  isGalloping,
  isWinner,
}) => {
  return (
    <svg
      width="68"
      height="48"
      viewBox="0 0 100 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-md overflow-visible transition-transform ${
        isGalloping ? 'scale-105' : ''
      }`}
    >
      <g>
        {/* Back Legs */}
        <g className={isGalloping ? 'origin-[35px_40px] animate-horse-back-leg' : ''}>
          <path
            d="M32 40 L22 56 L16 66 L22 67 L28 58 L38 43 Z"
            fill={coat.legs}
          />
          <path
            d="M38 42 L32 58 L28 66 L34 67 L40 57 L44 44 Z"
            fill={coat.legs}
            opacity="0.9"
          />
        </g>

        {/* Horse Tail */}
        <path
          d="M20 32 C12 36 6 48 8 56 C11 50 16 42 22 36 Z"
          fill={coat.mane}
          className={isGalloping ? 'origin-[20px_32px] animate-horse-tail' : ''}
        />

        {/* Horse Body */}
        <ellipse cx="48" cy="36" rx="26" ry="14" fill={coat.body} />

        {/* Saddle / Jockey Silks Cloth in Student's Unique Color */}
        <path
          d="M40 25 C44 23 54 23 58 25 L60 38 C55 41 43 41 38 38 Z"
          fill={studentColor}
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />

        {/* Stirrup and straps */}
        <path d="M49 26 L49 44" stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="2 1" />
        <ellipse cx="49" cy="45" rx="3" ry="1.5" fill="#E5E7EB" stroke="#6B7280" strokeWidth="1" />

        {/* Horse Neck and Head */}
        <path
          d="M62 38 L76 22 L86 24 C89 27 88 32 82 35 L68 45 Z"
          fill={coat.body}
        />
        {/* Horse Ears */}
        <path d="M75 22 L77 14 L80 20 Z" fill={coat.body} />
        <path d="M78 22 L81 15 L83 20 Z" fill={coat.legs} opacity="0.8" />

        {/* Horse Mane */}
        <path
          d="M64 32 C68 26 73 18 75 16 C73 22 70 28 66 36 Z"
          fill={coat.mane}
        />

        {/* Horse Muzzle & Eye */}
        <circle cx="82" cy="26" r="2" fill="#1F2937" />
        <ellipse cx="85" cy="28" rx="2" ry="1" fill="#4B5563" />

        {/* Reins held by jockey */}
        <path
          d="M52 26 C62 28 72 30 82 29"
          stroke="#F3F4F6"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Front Legs */}
        <g className={isGalloping ? 'origin-[65px_42px] animate-horse-front-leg' : ''}>
          <path
            d="M64 42 L72 56 L82 65 L76 66 L67 58 L58 45 Z"
            fill={coat.legs}
          />
          <path
            d="M68 43 L78 57 L88 64 L82 66 L73 59 L63 46 Z"
            fill={coat.legs}
            opacity="0.9"
          />
        </g>

        {/* Jockey Body crouched forward in racing stance */}
        <ellipse
          cx="46"
          cy="22"
          rx="8"
          ry="6"
          fill={studentColor}
          stroke="#FFFFFF"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};
