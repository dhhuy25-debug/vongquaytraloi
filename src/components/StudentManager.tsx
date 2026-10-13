import React, { useState, useRef } from 'react';
import { Student } from '../types';
import { AVATAR_PALETTE, SLICE_COLORS, makeCuteAvatarSvg } from '../utils/defaultData';
import { soundEngine } from '../utils/audio';
import { UserPlus, Upload, Trash2, CheckCircle2, Circle, RotateCcw, X, Edit2, Check, AlertTriangle, CheckCircle } from 'lucide-react';

interface StudentManagerProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  onResetDefault: () => void;
  onResetScores?: () => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  isOpen,
  onClose,
  students,
  onUpdateStudents,
  onResetDefault,
  onResetScores,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_PALETTE[0]);
  const [bulkInput, setBulkInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [changingAvatarId, setChangingAvatarId] = useState<string | null>(null);
  const [showConfirmResetScores, setShowConfirmResetScores] = useState(false);
  const [showConfirmResetDefault, setShowConfirmResetDefault] = useState(false);
  const [managerSuccessMsg, setManagerSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const rowFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Compress any image file to 120x120 JPEG
  const compressImage = (file: File, callback: (compressedUrl: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 120;
          const canvas = document.createElement('canvas');
          canvas.width = maxDim;
          canvas.height = maxDim;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const minSide = Math.min(img.width, img.height);
            const sx = (img.width - minSide) / 2;
            const sy = (img.height - minSide) / 2;
            ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, maxDim, maxDim);
            callback(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            callback(dataUrl);
          }
        } catch {
          callback(dataUrl);
        }
      };
      img.onerror = () => callback(dataUrl);
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Handle main form image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh (PNG, JPG, JPEG, WebP)!');
      return;
    }
    compressImage(file, (url) => setSelectedAvatar(url));
  };

  // Handle row image change for existing student
  const handleRowFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !changingAvatarId) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh!');
      return;
    }
    compressImage(file, (url) => {
      onUpdateStudents(
        students.map((s) => (s.id === changingAvatarId ? { ...s, avatar: url } : s))
      );
      setChangingAvatarId(null);
      soundEngine.playPop();
    });
  };

  // Trigger file change for a specific student row
  const triggerRowPhotoChange = (id: string) => {
    setChangingAvatarId(id);
    rowFileInputRef.current?.click();
  };

  // Add single student
  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;

    const nextColor = SLICE_COLORS[students.length % SLICE_COLORS.length];
    const newStudent: Student = {
      id: 'student_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: trimmed,
      avatar: selectedAvatar,
      color: nextColor,
      active: true,
      stars: 0,
      correctAnswers: 0,
      totalAnswerTimeSec: 0,
    };

    onUpdateStudents([...students, newStudent]);
    setNewName('');
    // Advance selected avatar to next cute avatar
    const nextIdx = (AVATAR_PALETTE.indexOf(selectedAvatar) + 1) % AVATAR_PALETTE.length;
    setSelectedAvatar(AVATAR_PALETTE[nextIdx]);
    soundEngine.playPop();
  };

  // Bulk add students from multiline text
  const handleAddBulk = () => {
    const lines = bulkInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const newItems: Student[] = lines.map((name, idx) => {
      const globalIdx = students.length + idx;
      return {
        id: 'student_' + Date.now() + '_' + idx,
        name,
        avatar: makeCuteAvatarSvg(globalIdx),
        color: SLICE_COLORS[globalIdx % SLICE_COLORS.length],
        active: true,
        stars: 0,
        correctAnswers: 0,
        totalAnswerTimeSec: 0,
      };
    });

    onUpdateStudents([...students, ...newItems]);
    setBulkInput('');
    soundEngine.playPop();
  };

  // Toggle active/inactive
  const toggleStudentActive = (id: string) => {
    onUpdateStudents(
      students.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  // Delete student
  const deleteStudent = (id: string) => {
    onUpdateStudents(students.filter((s) => s.id !== id));
  };

  // Start inline rename
  const startEdit = (s: Student) => {
    setEditingId(s.id);
    setEditingName(s.name);
  };

  // Save inline rename
  const saveEdit = (id: string) => {
    if (!editingName.trim()) return;
    onUpdateStudents(
      students.map((s) => (s.id === id ? { ...s, name: editingName.trim() } : s))
    );
    setEditingId(null);
  };

  // Select all or deselect all
  const setAllActive = (active: boolean) => {
    onUpdateStudents(students.map((s) => ({ ...s, active })));
  };

  const activeCount = students.filter((s) => s.active).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎒</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide drop-shadow-xs">
                QUẢN LÝ DANH SÁCH HỌC SINH
              </h2>
              <p className="text-amber-100 text-xs sm:text-sm font-semibold">
                Đang có {activeCount}/{students.length} học sinh tham gia vòng xoay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content with 2-panel or tab layout */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Top Form to Add Students */}
          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200">
            {/* Tabs for Add Method */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setActiveTab('single')}
                className={`px-4 py-1.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === 'single'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-amber-100'
                }`}
              >
                + Thêm từng bạn
              </button>
              <button
                onClick={() => setActiveTab('bulk')}
                className={`px-4 py-1.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === 'bulk'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-amber-100'
                }`}
              >
                📋 Dán danh sách hàng loạt
              </button>
            </div>

            {activeTab === 'single' ? (
              <form onSubmit={handleAddSingle} className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Current Avatar preview & Upload trigger */}
                  <div className="relative group shrink-0">
                    <img
                      src={selectedAvatar}
                      alt="Avatar"
                      className="w-14 h-14 rounded-full border-2 border-amber-400 bg-white shadow-xs object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 p-1 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow cursor-pointer text-xs"
                      title="Tải ảnh học sinh lên từ máy tính"
                    >
                      <Upload className="w-3 h-3" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {/* Name Input */}
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nhập họ và tên học sinh (VD: Nguyễn Minh Khang)..."
                    className="flex-1 w-full px-4 py-2.5 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-hidden font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-400 text-base"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!newName.trim()}
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    Thêm em
                  </button>
                </div>

                {/* Choose from Cute Avatar bank */}
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  <span className="text-xs font-bold text-slate-500 shrink-0">Chọn hình đại diện:</span>
                  <div className="flex gap-2">
                    {AVATAR_PALETTE.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform cursor-pointer ${
                          selectedAvatar === av
                            ? 'border-amber-600 scale-110 shadow-md ring-2 ring-amber-300'
                            : 'border-white opacity-80 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <img src={av} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Dán hoặc nhập danh sách học sinh vào đây, mỗi dòng một tên:&#10;Trần Minh Anh&#10;Lê Hoàng Bảo&#10;Phạm Ngọc Mai..."
                  rows={4}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-hidden font-semibold text-slate-800 placeholder:font-normal placeholder:text-slate-400 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddBulk}
                  disabled={!bulkInput.trim()}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl shadow cursor-pointer text-sm"
                >
                  Thêm tất cả các em trên
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions & Filter */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700">Danh sách hiện tại ({students.length})</span>
              <button
                type="button"
                onClick={() => setAllActive(true)}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Chọn tất cả
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setAllActive(false)}
                className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
              >
                Bỏ chọn tất cả
              </button>
            </div>

            <div className="flex items-center gap-2">
              {onResetScores && (
                <button
                  type="button"
                  onClick={() => setShowConfirmResetScores(true)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-2 py-1 rounded-md border border-rose-200 inline-flex items-center gap-1 cursor-pointer"
                  title="Đặt lại tất cả điểm sao về 0"
                >
                  <RotateCcw className="w-3 h-3" />
                  Đặt lại sao về 0
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowConfirmResetDefault(true)}
                className="text-xs font-bold text-slate-500 hover:text-amber-600 inline-flex items-center gap-1 cursor-pointer"
                title="Khôi phục danh sách mẫu ban đầu và xóa sạch điểm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Khôi phục mẫu ban đầu (0 sao)
              </button>
            </div>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {students.map((student) => {
              const isEditing = editingId === student.id;

              return (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border-2 transition-all ${
                    student.active
                      ? 'bg-white border-amber-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Active toggle button */}
                    <button
                      type="button"
                      onClick={() => toggleStudentActive(student.id)}
                      className="cursor-pointer text-slate-400 hover:text-amber-500 shrink-0"
                      title={student.active ? 'Đang quay - bấm để tạm loại' : 'Đang tắt - bấm để thêm vào vòng xoay'}
                    >
                      {student.active ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {/* Avatar with click-to-change button */}
                    <div className="relative group shrink-0">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-11 h-11 rounded-full border border-amber-300 bg-amber-50 object-cover cursor-pointer hover:opacity-85 transition-opacity"
                        onClick={() => triggerRowPhotoChange(student.id)}
                        title="Bấm để đổi ảnh chân dung của em này"
                      />
                      <button
                        type="button"
                        onClick={() => triggerRowPhotoChange(student.id)}
                        className="absolute -bottom-1 -right-1 p-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow cursor-pointer text-xs"
                        title="Tải ảnh mới"
                      >
                        <Upload className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    {/* Name or inline edit */}
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full px-2 py-0.5 text-sm font-bold border border-amber-400 rounded-md focus:outline-hidden"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(student.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                          <button
                            onClick={() => saveEdit(student.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="font-extrabold text-slate-800 text-sm truncate">
                            {student.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                            <span>{student.stars > 0 ? `★ ${student.stars} sao` : '0 sao'}</span>
                            {student.correctAnswers > 0 && (
                              <span className="text-emerald-600">· {student.correctAnswers} câu đúng</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => startEdit(student)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                        title="Đổi tên"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteStudent(student.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Xóa học sinh này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {students.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p className="font-bold">Chưa có học sinh nào trong danh sách!</p>
              <button
                onClick={onResetDefault}
                className="mt-2 text-sm font-bold text-amber-600 hover:underline cursor-pointer"
              >
                Nhấn vào đây để tải danh sách 8 em mẫu
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <input
            type="file"
            ref={rowFileInputRef}
            onChange={handleRowFileChange}
            accept="image/*"
            className="hidden"
          />
          <span className="text-xs text-slate-500 font-medium">
            Mẹo: Bấm vào ảnh của bạn bất kỳ để tải ảnh thật từ máy tính lên!
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Hoàn tất & Quay lại
          </button>
        </div>
        {/* Confirmation Overlay for Reset Scores */}
        {showConfirmResetScores && (
          <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-rose-300 text-center animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 border-2 border-rose-300">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="font-['Baloo_2'] font-black text-xl text-slate-800 mb-2">
                Đặt lại tất cả điểm sao về 0?
              </h3>
              <p className="text-slate-600 text-xs font-semibold mb-4 leading-relaxed">
                Tất cả số sao ⭐ và số câu trả lời đúng của các em sẽ trở về 0 để bắt đầu thi đua lại từ đầu. Danh sách họ tên và ảnh học sinh vẫn giữ nguyên.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowConfirmResetScores(false)}
                  className="px-3 py-2 rounded-xl border border-slate-300 font-extrabold text-slate-600 hover:bg-slate-50 cursor-pointer text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetScores) {
                      onResetScores();
                      soundEngine.playPop();
                    }
                    setShowConfirmResetScores(false);
                    setManagerSuccessMsg('Đã đặt lại toàn bộ điểm sao về 0 thành công!');
                    setTimeout(() => setManagerSuccessMsg(null), 3500);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold cursor-pointer text-xs flex items-center justify-center gap-1 shadow"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Overlay for Reset Default */}
        {showConfirmResetDefault && (
          <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-amber-300 text-center animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 border-2 border-amber-300">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="font-['Baloo_2'] font-black text-xl text-slate-800 mb-2">
                Khôi phục danh sách mẫu?
              </h3>
              <p className="text-slate-600 text-xs font-semibold mb-4 leading-relaxed">
                Danh sách hiện tại sẽ được thay thế bằng 8 học sinh mẫu ban đầu và tất cả điểm sao sẽ trở về 0.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowConfirmResetDefault(false)}
                  className="px-3 py-2 rounded-xl border border-slate-300 font-extrabold text-slate-600 hover:bg-slate-50 cursor-pointer text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetDefault();
                    soundEngine.playPop();
                    setShowConfirmResetDefault(false);
                    setManagerSuccessMsg('Đã khôi phục danh sách 8 em mẫu ban đầu!');
                    setTimeout(() => setManagerSuccessMsg(null), 3500);
                  }}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold cursor-pointer text-xs flex items-center justify-center gap-1 shadow"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Khôi phục
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success toast notification */}
        {managerSuccessMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl font-extrabold text-xs shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <CheckCircle className="w-4 h-4" />
            <span>{managerSuccessMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
