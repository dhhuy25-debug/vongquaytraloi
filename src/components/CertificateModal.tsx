import React, { useState, useEffect, useRef } from 'react';
import { Student } from '../types';
import { soundEngine } from '../utils/audio';
import { fireClassroomCelebration } from '../utils/confetti';
import {
  Printer,
  Download,
  X,
  Sparkles,
  Award,
  Star,
  Heart,
  School,
  UserCheck,
  Check,
  Building,
} from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  rank?: number; // 1: Quán quân, 2: Á quân, 3: Quý quân
  schoolName?: string;
  className?: string;
  teacherName?: string;
  onUpdateSchoolInfo?: (school: string, cls: string, teacher: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  student,
  rank = 1,
  schoolName: propSchoolName,
  className: propClassName,
  teacherName: propTeacherName,
  onUpdateSchoolInfo,
}) => {
  // Load saved school and teacher info from props or localStorage
  const [schoolName, setSchoolName] = useState<string>(() => {
    if (propSchoolName) return propSchoolName;
    try {
      return localStorage.getItem('classroom_cert_school') || 'Trường Tiểu học Kim Đồng';
    } catch {
      return 'Trường Tiểu học Kim Đồng';
    }
  });

  const [className, setClassName] = useState<string>(() => {
    if (propClassName) return propClassName;
    try {
      return localStorage.getItem('classroom_cert_class') || 'Lớp 3A';
    } catch {
      return 'Lớp 3A';
    }
  });

  const [teacherName, setTeacherName] = useState<string>(() => {
    if (propTeacherName) return propTeacherName;
    try {
      return localStorage.getItem('classroom_cert_teacher') || 'Cô Nguyễn Thu Trang';
    } catch {
      return 'Cô Nguyễn Thu Trang';
    }
  });

  useEffect(() => {
    if (propSchoolName) setSchoolName(propSchoolName);
    if (propClassName) setClassName(propClassName);
    if (propTeacherName) setTeacherName(propTeacherName);
  }, [propSchoolName, propClassName, propTeacherName]);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const certRef = useRef<HTMLDivElement | null>(null);

  // Sync to localStorage
  const saveCustomInfo = () => {
    try {
      localStorage.setItem('classroom_cert_school', schoolName);
      localStorage.setItem('classroom_cert_class', className);
      localStorage.setItem('classroom_cert_teacher', teacherName);
    } catch {}
    if (onUpdateSchoolInfo) {
      onUpdateSchoolInfo(schoolName, className, teacherName);
    }
    setIsEditing(false);
    soundEngine.playPop();
  };

  if (!isOpen) return null;

  // Print certificate with clean print styles
  const handlePrint = () => {
    soundEngine.playPop();
    window.print();
  };

  // Export high-res PNG image of the certificate via Canvas
  const handleDownloadImage = () => {
    soundEngine.playPop();
    fireClassroomCelebration();

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 860;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient: Creamy warm yellow with gold borders
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 860);
    bgGrad.addColorStop(0, '#FFFDF0');
    bgGrad.addColorStop(0.5, '#FFF9E6');
    bgGrad.addColorStop(1, '#FEF3C7');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 860);

    // Outer double golden border
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 14;
    ctx.strokeRect(24, 24, 1152, 812);

    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1120, 780);

    // Corner decorative rosettes
    const drawCornerDeco = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    drawCornerDeco(40, 40);
    drawCornerDeco(1160, 40);
    drawCornerDeco(40, 820);
    drawCornerDeco(1160, 820);

    // Header: SCHOOL NAME (Tên Trường)
    ctx.font = 'bold 24px "Nunito", sans-serif';
    ctx.fillStyle = '#92400E';
    ctx.textAlign = 'center';
    ctx.fillText(schoolName.toUpperCase(), 600, 85);

    // Title: THƯ KHEN THƯỞNG
    ctx.font = 'bold 50px "Baloo 2", sans-serif';
    ctx.fillStyle = '#B45309';
    ctx.fillText('🌟 THƯ KHEN THƯỞNG 🌟', 600, 145);

    ctx.font = 'bold 22px "Nunito", sans-serif';
    ctx.fillStyle = '#D97706';
    ctx.fillText('HOA ĐIỂM 10 - BÉ CHĂM NGOAN HỌC GIỎI', 600, 185);

    // Draw student avatar in circular frame
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(600, 305, 80, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#F59E0B';
      ctx.stroke();
      ctx.clip();
      ctx.drawImage(img, 520, 225, 160, 160);
      ctx.restore();

      drawCertificateText();
    };
    img.onerror = () => {
      drawCertificateText();
    };
    img.src = student.avatar;

    function drawCertificateText() {
      if (!ctx) return;

      // Student Name
      ctx.font = 'bold 44px "Baloo 2", sans-serif';
      ctx.fillStyle = '#1E293B';
      ctx.textAlign = 'center';
      ctx.fillText(`Khen tặng em: ${student.name}`, 600, 445);

      // Class
      ctx.font = 'bold 24px "Nunito", sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(`Học sinh: ${className} · Năm học 2026`, 600, 488);

      // Merit Reason
      ctx.font = 'bold 26px "Baloo 2", sans-serif';
      ctx.fillStyle = '#B45309';
      const rankTitle =
        rank === 1
          ? '🥇 QUÁN QUÂN VÀNG: TRẢ LỜI XUẤT SẮC & NHANH NHẤT LỚP'
          : rank === 2
          ? '🥈 Á QUÂN BẠC: THÀNH TÍCH ÔN TẬP XUẤT SẮC'
          : '🥉 QUÝ QUÂN ĐỒNG: TÍCH CỰC & CHĂM CHỈ HỌC TẬP';
      ctx.fillText(rankTitle, 600, 545);

      ctx.font = '600 22px "Nunito", sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(
        `Đã xuất sắc đạt ${student.stars} Ngôi Sao Chăm Ngoan với phong độ tuyệt vời!`,
        600,
        585
      );

      // Left sign
      ctx.textAlign = 'left';
      ctx.font = 'bold 22px "Nunito", sans-serif';
      ctx.fillStyle = '#1E293B';
      ctx.fillText('Ban Giám Khảo & Lớp Học', 180, 695);
      ctx.font = 'italic 20px "Nunito", sans-serif';
      ctx.fillText('Đồng lòng tuyên dương', 180, 730);

      // Right sign: TEACHER NAME (Tên Giáo Viên)
      ctx.textAlign = 'right';
      ctx.font = 'bold 22px "Nunito", sans-serif';
      ctx.fillText('Giáo viên chủ nhiệm', 1020, 695);
      ctx.font = 'italic 24px "Baloo 2", sans-serif';
      ctx.fillStyle = '#B45309';
      ctx.fillText(teacherName, 1020, 742);

      // Red Seal Stamp
      ctx.save();
      ctx.translate(600, 705);
      ctx.rotate(-0.08);
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = 'bold 15px "Nunito", sans-serif';
      ctx.fillStyle = '#DC2626';
      ctx.textAlign = 'center';
      ctx.fillText('★ BÉ CHĂM NGOAN ★', 0, -10);
      ctx.fillText('XUẤT SẮC', 0, 16);
      ctx.restore();

      // Download triggered
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Thu-Khen-${student.name.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const rankBadge =
    rank === 1
      ? { text: '🥇 QUÁN QUÂN VÀNG', color: 'from-amber-400 to-yellow-500 text-amber-950 border-amber-300' }
      : rank === 2
      ? { text: '🥈 Á QUÂN BẠC', color: 'from-slate-200 to-slate-400 text-slate-800 border-slate-300' }
      : { text: '🥉 QUÝ QUÂN ĐỒNG', color: 'from-amber-600 to-orange-700 text-amber-100 border-amber-400' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[96vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-300">
        {/* Top Control Bar */}
        <div className="px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white flex items-center justify-between flex-wrap gap-2 no-print shadow-md">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-200 animate-bounce" />
            <span className="font-['Baloo_2'] font-black text-xl tracking-wide">
              THƯ KHEN THƯỞNG HỌC SINH
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* BUTTON TO EDIT SCHOOL & TEACHER NAME */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm ${
                isEditing
                  ? 'bg-amber-300 text-amber-950 font-black'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title="Thêm và chỉnh sửa tên Trường, Lớp và Giáo viên"
            >
              <School className="w-4 h-4 text-amber-200" />
              <span>{isEditing ? 'Đang chỉnh sửa...' : 'Thêm tên Trường & Giáo viên'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white text-amber-900 hover:bg-amber-100 font-extrabold text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
              title="In Thư Khen ra giấy A4/A5"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span>In Thư Khen</span>
            </button>

            <button
              onClick={handleDownloadImage}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
              title="Tải về file ảnh PNG chất lượng cao gửi phụ huynh"
            >
              <Download className="w-4 h-4" />
              <span>Tải ảnh PNG</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Edit Panel for School and Teacher Name */}
        {isEditing && (
          <div className="p-4 bg-amber-100/90 border-b-2 border-amber-300 flex flex-col sm:flex-row items-center gap-3 no-print animate-in slide-in-from-top-2">
            <div className="flex-1 w-full flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label className="text-2xs font-extrabold text-amber-900 uppercase block mb-0.5">
                  Tên Trường:
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Nhập tên trường (VD: Trường Tiểu học Kim Đồng)..."
                  className="w-full px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-amber-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="w-full sm:w-32">
                <label className="text-2xs font-extrabold text-amber-900 uppercase block mb-0.5">
                  Lớp học:
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Lớp (VD: Lớp 3A)..."
                  className="w-full px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-amber-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex-1">
                <label className="text-2xs font-extrabold text-amber-900 uppercase block mb-0.5">
                  Tên Giáo Viên:
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Nhập tên giáo viên (VD: Cô Nguyễn Thu Trang)..."
                  className="w-full px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-amber-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <button
              onClick={saveCustomInfo}
              className="w-full sm:w-auto px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Lưu & Cập nhật</span>
            </button>
          </div>
        )}

        {/* Printable & Interactive Certificate Area */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 flex justify-center bg-amber-50/50">
          <div
            ref={certRef}
            className="w-full max-w-3xl bg-gradient-to-b from-[#FFFDF0] via-[#FFFBEA] to-[#FEF3C7] rounded-3xl p-6 sm:p-10 border-8 border-amber-400 shadow-2xl relative text-center flex flex-col justify-between"
            style={{
              backgroundImage: `radial-gradient(#F59E0B 0.75px, transparent 0.75px)`,
              backgroundSize: '24px 24px',
            }}
          >
            {/* Inner Decorative Golden Border */}
            <div className="absolute inset-2.5 sm:inset-4 border-2 border-dashed border-amber-400/80 rounded-2xl pointer-events-none" />

            {/* Corner Decorative Elements */}
            <div className="absolute top-2 left-2 text-2xl select-none">🌸</div>
            <div className="absolute top-2 right-2 text-2xl select-none">🌸</div>
            <div className="absolute bottom-2 left-2 text-2xl select-none">🌺</div>
            <div className="absolute bottom-2 right-2 text-2xl select-none">🌺</div>

            {/* Top School Header (TÊN TRƯỜNG) */}
            <div className="relative mb-2">
              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs sm:text-sm font-black uppercase tracking-wider shadow-2xs">
                <Building className="w-3.5 h-3.5 text-amber-700" />
                <span>{schoolName}</span>
              </div>
            </div>

            {/* Certificate Title */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-0.5">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 animate-spin" />
                <h1 className="text-3xl sm:text-5xl font-black font-['Baloo_2'] tracking-wide text-amber-900 drop-shadow-xs">
                  THƯ KHEN THƯỞNG
                </h1>
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 animate-spin" />
              </div>
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-700">
                CHỨNG NHẬN HOA ĐIỂM 10 · BÉ CHĂM NGOAN HỌC GIỎI
              </p>
            </div>

            {/* Main Honor Content */}
            <div className="my-4 sm:my-6 flex flex-col items-center">
              {/* Framed Portrait of the student */}
              <div className="relative group mb-3">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-amber-400 shadow-xl overflow-hidden bg-white p-1">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {/* Ribbon badge on portrait */}
                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-black bg-gradient-to-r shadow-md border whitespace-nowrap ${rankBadge.color}`}
                >
                  {rankBadge.text}
                </div>
              </div>

              {/* Student Name & Class */}
              <div className="mt-2">
                <p className="text-xs sm:text-sm font-bold text-slate-500">
                  Thầy/Cô và tập thể lớp trân trọng biểu dương và khen tặng:
                </p>
                <h2 className="text-3xl sm:text-4xl font-black font-['Baloo_2'] text-slate-900 tracking-tight mt-0.5">
                  Em: {student.name}
                </h2>
                <p className="text-sm sm:text-base font-extrabold text-amber-800 mt-0.5">
                  Học sinh {className} · {schoolName}
                </p>
              </div>

              {/* Praise Paragraph */}
              <div className="mt-4 max-w-xl bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                <p className="text-base sm:text-lg font-bold text-amber-950 font-['Baloo_2'] leading-relaxed">
                  "Đã có thành tích xuất sắc, phản xạ nhanh nhạy và trả lời chính xác nhất trong giờ học ôn tập hôm nay!"
                </p>
                <div className="mt-2 flex items-center justify-center gap-1.5 text-amber-600 font-extrabold text-sm sm:text-base">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                  <span>Tổng kết: Đạt {student.stars} Ngôi Sao Chiến Thắng</span>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                </div>
              </div>
            </div>

            {/* Footer Signatures & Red Seal */}
            <div className="mt-4 pt-4 border-t-2 border-amber-300/60 flex items-center justify-between text-left text-xs sm:text-sm">
              {/* Left Sign */}
              <div>
                <p className="font-extrabold text-slate-700">Tập thể lớp biểu dương</p>
                <p className="text-xs text-slate-400 italic mt-0.5">Cả lớp cùng vỗ tay khen ngợi!</p>
                <div className="mt-3 text-xl">👏 🎈 💐</div>
              </div>

              {/* Center Official Red Seal Stamp */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-red-600/80 flex flex-col items-center justify-center text-red-600 font-extrabold text-center rotate-[-8deg] shadow-xs select-none">
                  <span className="text-2xs sm:text-xs tracking-wider">★ BÉ CHĂM NGOAN ★</span>
                  <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500 my-0.5" />
                  <span className="text-xs sm:text-sm font-black">XUẤT SẮC</span>
                </div>
              </div>

              {/* Right Teacher Signature (TÊN GIÁO VIÊN) */}
              <div className="text-right">
                <p className="font-extrabold text-slate-700">Giáo viên chủ nhiệm</p>
                <p className="font-['Baloo_2'] text-base sm:text-lg font-black text-amber-900 mt-2">
                  {teacherName}
                </p>
                <p className="text-2xs text-slate-400 italic">Ký và trao thưởng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
