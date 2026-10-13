import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Student } from '../types';
import { soundEngine } from '../utils/audio';

interface ClassroomWheelProps {
  students: Student[];
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinEnd: (winner: Student) => void;
  spinDurationMs?: number;
  onRestoreAll?: () => void;
}

export const ClassroomWheel: React.FC<ClassroomWheelProps> = ({
  students,
  isSpinning,
  onSpinStart,
  onSpinEnd,
  spinDurationMs = 6000,
  onRestoreAll,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [wheelSize, setWheelSize] = useState<number>(540);

  // Current rotation angle in radians
  const currentAngleRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTickSliceIndexRef = useRef<number>(-1);
  const [needleKick, setNeedleKick] = useState<number>(0);
  const [ledFlash, setLedFlash] = useState<boolean>(false);

  // Cache loaded Image elements for fast canvas rendering
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Preload student avatars into Image elements
  useEffect(() => {
    students.forEach((s) => {
      if (s && s.avatar && !imageCacheRef.current.has(s.avatar)) {
        const img = new Image();
        img.onload = () => {
          imageCacheRef.current.set(s.avatar, img);
          drawWheel();
        };
        img.onerror = () => {
          // Fallback handled in canvas
        };
        img.src = s.avatar;
      }
    });
  }, [students]);

  // Handle responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        // Keep within 340px to 620px for ideal classroom visibility
        const size = Math.min(Math.max(width - 32, 340), 620);
        setWheelSize(size);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Main draw function
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = wheelSize;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 24; // padding for border & bulbs

    ctx.clearRect(0, 0, size, size);

    if (students.length === 0) {
      // Empty state - All students have had their turns
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#FEF3C7';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#F59E0B';
      ctx.stroke();

      ctx.font = 'bold 22px "Baloo 2", sans-serif';
      ctx.fillStyle = '#92400E';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎉 ĐÃ GỌI HẾT TẤT CẢ HỌC SINH!', centerX, centerY - 20);
      ctx.font = 'bold 15px "Nunito", sans-serif';
      ctx.fillStyle = '#B45309';
      ctx.fillText('Bấm nút bên dưới để khôi phục danh sách', centerX, centerY + 12);
      ctx.fillText('và bắt đầu vòng chơi mới nhé!', centerX, centerY + 34);
      ctx.restore();
      return;
    }

    const numSlices = students.length;
    const sliceAngle = (Math.PI * 2) / numSlices;
    const currentAngle = currentAngleRef.current;

    // 1. Draw outer decorative rim with flashing carnival bulbs
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 14, 0, Math.PI * 2);
    ctx.fillStyle = '#B45309'; // dark golden rim
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 11, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B'; // bright golden rim
    ctx.fill();

    // Carnival LED lights
    const totalBulbs = 24;
    for (let i = 0; i < totalBulbs; i++) {
      const bulbAngle = (i * Math.PI * 2) / totalBulbs;
      const bx = centerX + (radius + 6) * Math.cos(bulbAngle);
      const by = centerY + (radius + 6) * Math.sin(bulbAngle);

      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, Math.PI * 2);
      const isLit = (i % 2 === 0 && ledFlash) || (i % 2 !== 0 && !ledFlash);
      ctx.fillStyle = isLit ? '#FEF08A' : '#FCD34D';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#92400E';
      ctx.stroke();

      if (isLit) {
        ctx.shadowColor = '#FDE047';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    ctx.restore();

    // 2. Draw Wheel slices
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentAngle);

    for (let i = 0; i < numSlices; i++) {
      const student = students[i];
      if (!student) continue;

      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const midAngle = startAngle + sliceAngle / 2;

      // Slice background
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = student.color || '#F59E0B';
      ctx.fill();

      // Slice divider border
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Content inside slice (Text & Avatar)
      ctx.save();
      ctx.rotate(midAngle);

      // Student Avatar image
      const avatarDistance = radius * 0.72;
      const avatarSize = Math.min(radius * 0.28, 54);
      const cachedImg = student.avatar ? imageCacheRef.current.get(student.avatar) : null;

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarDistance, 0, avatarSize / 2 + 3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#FDE047';
      ctx.stroke();

      // Clip avatar in circle
      ctx.beginPath();
      ctx.arc(avatarDistance, 0, avatarSize / 2, 0, Math.PI * 2);
      ctx.clip();

      if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
        ctx.drawImage(
          cachedImg,
          avatarDistance - avatarSize / 2,
          -avatarSize / 2,
          avatarSize,
          avatarSize
        );
      } else {
        // Fallback letter if image is loading
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(
          avatarDistance - avatarSize / 2,
          -avatarSize / 2,
          avatarSize,
          avatarSize
        );
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px "Baloo 2", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((student.name || '?').charAt(0), avatarDistance, 0);
      }
      ctx.restore();

      // Student Name text
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Adapt font size according to student count
      let fontSize = 16;
      if (numSlices <= 6) fontSize = 20;
      else if (numSlices <= 10) fontSize = 17;
      else if (numSlices <= 16) fontSize = 14;
      else fontSize = 12;

      ctx.font = `bold ${fontSize}px "Baloo 2", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Truncate name if too long for small slices
      const rawName = student.name || 'Học sinh';
      const displayName = rawName.length > 12 ? rawName.slice(0, 11) + '…' : rawName;
      ctx.fillText(displayName, radius * 0.38, 0);

      // Star count badge if student has stars
      if (typeof student.stars === 'number' && student.stars > 0) {
        ctx.font = 'bold 11px "Nunito", sans-serif';
        ctx.fillStyle = '#FEF08A';
        ctx.fillText(`★ ${student.stars}`, radius * 0.2, 0);
      }

      ctx.restore();

      ctx.restore(); // restore slice rotation
    }

    ctx.restore(); // restore wheel transform

    // 3. Center Hub (Golden Button Cap)
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 42, 0, Math.PI * 2);
    ctx.fillStyle = '#78350F';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();

    // Subtle 3D gradient reflection
    const grad = ctx.createLinearGradient(centerX - 30, centerY - 30, centerX + 30, centerY + 30);
    grad.addColorStop(0, '#FEF08A');
    grad.addColorStop(0.5, '#F59E0B');
    grad.addColorStop(1, '#D97706');

    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Center icon/text
    ctx.font = 'bold 15px "Baloo 2", sans-serif';
    ctx.fillStyle = '#78350F';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isSpinning ? '...' : 'QUAY', centerX, centerY);
    ctx.restore();
  }, [wheelSize, students, ledFlash, isSpinning]);

  // Re-draw whenever angle, led, or size changes
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // Flash LED bulbs periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setLedFlash((prev) => !prev);
    }, isSpinning ? 120 : 600);
    return () => clearInterval(interval);
  }, [isSpinning]);

  // Calculate slice at top needle (Needle is fixed at Top Center: -PI/2)
  const getSliceAtPointer = (currentAngle: number, numSlices: number): number => {
    if (numSlices <= 0) return 0;
    // Pointer is at angle -PI/2 (top)
    // Relative angle on the wheel = (-PI/2 - currentAngle) mod 2PI
    let normalized = (-Math.PI / 2 - currentAngle) % (Math.PI * 2);
    if (normalized < 0) normalized += Math.PI * 2;
    const sliceAngle = (Math.PI * 2) / numSlices;
    return Math.floor(normalized / sliceAngle) % numSlices;
  };

  // Trigger spin animation
  const startSpin = () => {
    if (isSpinning || students.length === 0) return;

    soundEngine.playPop();
    onSpinStart();

    // Pick random target winner index
    const numSlices = students.length;
    const targetWinnerIndex = Math.floor(Math.random() * numSlices);
    const sliceAngle = (Math.PI * 2) / numSlices;

    // We want slice `targetWinnerIndex` center to align with top (-PI/2)
    // The center of slice targetWinnerIndex is: targetWinnerIndex * sliceAngle + sliceAngle / 2
    // We add a slight random offset within [-sliceAngle * 0.35, +sliceAngle * 0.35] so it doesn't land exactly on the line
    const jitter = (Math.random() - 0.5) * (sliceAngle * 0.65);
    const sliceCenter = targetWinnerIndex * sliceAngle + sliceAngle / 2 + jitter;

    // Desired final angle mod 2PI:
    // (-PI/2 - finalAngle) mod 2PI = sliceCenter => finalAngle = -PI/2 - sliceCenter
    const targetRemainder = (-Math.PI / 2 - sliceCenter) % (Math.PI * 2);
    let targetOffset = (targetRemainder - (currentAngleRef.current % (Math.PI * 2))) % (Math.PI * 2);
    if (targetOffset < 0) targetOffset += Math.PI * 2;

    // Full rotations for great suspense (between 6 and 9 full turns)
    const fullTurns = Math.floor(Math.random() * 3) + 7;
    const totalRotationToAdd = fullTurns * Math.PI * 2 + targetOffset;

    const startAngle = currentAngleRef.current;
    const startTime = performance.now();
    const duration = spinDurationMs;

    // Ease Out Quint: fast start, prolonged natural slow down
    const easeOutQuint = (x: number): number => {
      return 1 - Math.pow(1 - x, 5);
    };

    lastTickSliceIndexRef.current = getSliceAtPointer(startAngle, numSlices);

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeVal = easeOutQuint(progress);

      const currentAngle = startAngle + totalRotationToAdd * easeVal;
      currentAngleRef.current = currentAngle;

      // Needle tick detection
      const currentSliceIndex = getSliceAtPointer(currentAngle, numSlices);
      if (currentSliceIndex !== lastTickSliceIndexRef.current) {
        lastTickSliceIndexRef.current = currentSliceIndex;
        // Calculate current rotation speed to pitch tick sound
        const remainingProgress = 1 - progress;
        soundEngine.playTick(remainingProgress);

        // Needle physical kickback visual
        setNeedleKick(12);
        setTimeout(() => setNeedleKick(0), 40);
      }

      drawWheel();

      if (progress < 1) {
        animFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        const finalWinner = students[targetWinnerIndex] || students[0];
        if (finalWinner) {
          onSpinEnd(finalWinner);
        }
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center p-2">
        {/* Needle / Pointer at top */}
        <div
          className="absolute -top-3 z-20 pointer-events-none transition-transform duration-75 drop-shadow-lg"
          style={{
            transform: `translateX(-50%) rotate(${needleKick}deg)`,
            left: '50%',
            transformOrigin: '50% 15%',
          }}
        >
          <svg width="44" height="52" viewBox="0 0 44 52" fill="none">
            {/* Pointer shadow */}
            <path
              d="M22 50 L7 12 C5 7 9 2 15 2 L29 2 C35 2 39 7 37 12 Z"
              fill="#78350F"
              opacity="0.3"
              transform="translate(0, 2)"
            />
            {/* Main Golden/Ruby Arrow */}
            <path
              d="M22 48 L8 12 C6 7 10 3 16 3 L28 3 C34 3 38 7 36 12 Z"
              fill="url(#needleGrad)"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
            {/* Needle center crystal gem */}
            <circle cx="22" cy="14" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
            <defs>
              <linearGradient id="needleGrad" x1="8" y1="3" x2="36" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="0.5" stopColor="#E11D48" />
                <stop offset="1" stopColor="#9F1239" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{ width: wheelSize, height: wheelSize }}
          className="cursor-pointer transition-transform hover:scale-[1.008] active:scale-[0.99] rounded-full drop-shadow-2xl"
          onClick={startSpin}
          title={isSpinning ? 'Vòng xoay đang chạy...' : 'Bấm vào vòng xoay để quay!'}
        />
      </div>

      {/* Big Action Button below wheel */}
      <div className="mt-4 flex flex-col items-center gap-2">
        {students.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-3xl shadow-lg max-w-md text-center">
            <span className="text-3xl">🎉</span>
            <p className="font-extrabold text-amber-900 text-base">
              Tất cả học sinh trong lớp đã tham gia lượt quay!
            </p>
            {onRestoreAll && (
              <button
                type="button"
                onClick={onRestoreAll}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 active:scale-95 text-white font-black text-lg rounded-2xl shadow-lg shadow-amber-500/30 border-2 border-white cursor-pointer transition-all animate-bounce"
              >
                🔄 BẮT ĐẦU VÒNG CHƠI MỚI (Khôi phục danh sách)
              </button>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={startSpin}
              disabled={isSpinning || students.length === 0}
              className={`group relative px-10 py-3.5 text-2xl md:text-3xl font-extrabold rounded-2xl shadow-xl transition-all duration-200 transform ${
                isSpinning
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-80'
                  : 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-95 text-amber-950 border-4 border-white shadow-amber-500/40 hover:shadow-2xl hover:shadow-amber-400/50 cursor-pointer animate-pulse'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span>{isSpinning ? 'ĐANG QUAY HỒI HỘP...' : 'BẮT ĐẦU QUAY!'}</span>
                <span className="text-2xl">✨</span>
              </span>
            </button>
            <p className="text-sm text-slate-500 font-medium">
              Đang có <strong className="text-amber-800">{students.length}</strong> học sinh trong vòng xoay (Tự động bỏ qua sau khi được chọn)
            </p>
          </>
        )}
      </div>
    </div>
  );
};
