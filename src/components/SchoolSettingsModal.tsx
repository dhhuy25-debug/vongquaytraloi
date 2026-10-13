import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/audio';
import { School, User, GraduationCap, Check, X, Sparkles, Building2 } from 'lucide-react';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolName: string;
  className: string;
  teacherName: string;
  onSave: (school: string, cls: string, teacher: string) => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  schoolName: initialSchool,
  className: initialClass,
  teacherName: initialTeacher,
  onSave,
}) => {
  const [school, setSchool] = useState(initialSchool);
  const [cls, setCls] = useState(initialClass);
  const [teacher, setTeacher] = useState(initialTeacher);

  useEffect(() => {
    setSchool(initialSchool);
    setCls(initialClass);
    setTeacher(initialTeacher);
  }, [initialSchool, initialClass, initialTeacher, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      school.trim() || 'Trường Tiểu học Kim Đồng',
      cls.trim() || 'Lớp 3A',
      teacher.trim() || 'Cô Nguyễn Thu Trang'
    );
    soundEngine.playPop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <School className="w-7 h-7 text-yellow-200 animate-bounce" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-['Baloo_2'] tracking-wide">
                THÔNG TIN TRƯỜNG & GIÁO VIÊN
              </h2>
              <p className="text-2xs sm:text-xs text-amber-100 font-bold">
                Hiển thị trang trọng trên Thư Khen Thưởng của học sinh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase mb-1">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Tên Trường:</span>
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="VD: Trường Tiểu học Chu Văn An..."
              className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-300 focus:border-amber-500 focus:outline-hidden text-sm sm:text-base font-bold text-slate-800 bg-amber-50/40"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase mb-1">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>Lớp học:</span>
              </label>
              <input
                type="text"
                value={cls}
                onChange={(e) => setCls(e.target.value)}
                placeholder="VD: Lớp 3A"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-300 focus:border-amber-500 focus:outline-hidden text-sm sm:text-base font-bold text-slate-800 bg-amber-50/40"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase mb-1">
                <User className="w-4 h-4 text-amber-600" />
                <span>Tên Giáo Viên:</span>
              </label>
              <input
                type="text"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="VD: Cô Nguyễn Mai Anh"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-300 focus:border-amber-500 focus:outline-hidden text-sm sm:text-base font-bold text-slate-800 bg-amber-50/40"
                required
              />
            </div>
          </div>

          {/* Preview Box */}
          <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-bold space-y-1">
            <div className="flex items-center gap-1.5 text-amber-700 font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Xem trước dòng tiêu đề Thư Khen:</span>
            </div>
            <p className="font-['Baloo_2'] text-sm text-slate-800 font-black">
              "{school || 'Tên trường'} · {cls || 'Lớp'} · GV: {teacher || 'Tên giáo viên'}"
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Thông Tin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
