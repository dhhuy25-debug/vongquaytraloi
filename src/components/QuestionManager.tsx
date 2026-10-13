import React, { useState } from 'react';
import { Question } from '../types';
import { soundEngine } from '../utils/audio';
import { PlusCircle, RotateCcw, Trash2, X, CheckCircle2, Check, AlertTriangle } from 'lucide-react';

interface QuestionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onUpdateQuestions: (questions: Question[]) => void;
  onResetDefault: () => void;
}

const CATEGORIES = ['Tất cả', 'Toán học', 'Tiếng Việt', 'Tự nhiên & Xã hội', 'Khoa học vui', 'Đố vui', 'Kỹ năng sống'];

export const QuestionManager: React.FC<QuestionManagerProps> = ({
  isOpen,
  onClose,
  questions,
  onUpdateQuestions,
  onResetDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  // Single 4-choice form
  const [newText, setNewText] = useState('');
  const [newCat, setNewCat] = useState('Toán học');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState<number>(0);
  const [newHint, setNewHint] = useState('');

  // Bulk form
  const [bulkInput, setBulkInput] = useState('');
  const [bulkCat, setBulkCat] = useState('Đố vui');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const options = [
      optA.trim() || 'Đáp án A',
      optB.trim() || 'Đáp án B',
      optC.trim() || 'Đáp án C',
      optD.trim() || 'Đáp án D',
    ];

    const newQ: Question = {
      id: 'q_' + Date.now(),
      text: newText.trim(),
      category: newCat,
      options,
      correctIndex: correctIdx,
      hint: newHint.trim() ? newHint.trim() : undefined,
      timeLimitSec: 20,
      used: false,
    };

    onUpdateQuestions([newQ, ...questions]);
    setNewText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectIdx(0);
    setNewHint('');
    soundEngine.playPop();
  };

  // Bulk import supporting format:
  // Câu hỏi | Đáp án A | Đáp án B | Đáp án C | Đáp án D | Đáp án đúng (A/B/C/D)
  const handleAddBulk = () => {
    const lines = bulkInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const newItems: Question[] = lines.map((line, idx) => {
      const parts = line.split('|').map((p) => p.trim());
      if (parts.length >= 5) {
        // Full format with 4 options
        const questionText = parts[0];
        const a = parts[1];
        const b = parts[2];
        const c = parts[3];
        const d = parts[4];
        let correct = 0;
        if (parts[5]) {
          const letter = parts[5].toUpperCase();
          if (letter === 'B' || letter === '1') correct = 1;
          else if (letter === 'C' || letter === '2') correct = 2;
          else if (letter === 'D' || letter === '3') correct = 3;
        }
        return {
          id: 'q_' + Date.now() + '_' + idx,
          text: questionText,
          category: bulkCat,
          options: [a, b, c, d],
          correctIndex: correct,
          timeLimitSec: 20,
          used: false,
        };
      } else {
        // Fallback for simple line
        return {
          id: 'q_' + Date.now() + '_' + idx,
          text: parts[0],
          category: bulkCat,
          options: ['Đúng', 'Sai', 'Chưa rõ', 'Khác'],
          correctIndex: 0,
          timeLimitSec: 20,
          used: false,
        };
      }
    });

    onUpdateQuestions([...newItems, ...questions]);
    setBulkInput('');
    soundEngine.playPop();
  };

  const handleDelete = (id: string) => {
    onUpdateQuestions(questions.filter((q) => q.id !== id));
  };

  const handleClearAll = () => {
    setShowClearConfirm(true);
  };

  const handleToggleUsed = (id: string) => {
    soundEngine.playPop();
    onUpdateQuestions(
      questions.map((q) => (q.id === id ? { ...q, used: !q.used } : q))
    );
  };

  const handleRestoreAllQuestions = () => {
    soundEngine.playPop();
    onUpdateQuestions(questions.map((q) => ({ ...q, used: false })));
  };

  const unusedCount = questions.filter((q) => !q.used).length;
  const usedCount = questions.filter((q) => q.used).length;

  const filteredQuestions =
    selectedCategory === 'Tất cả'
      ? questions
      : questions.filter((q) => q.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[94vh] flex flex-col bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">💡</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-['Baloo_2'] tracking-wide drop-shadow-xs">
                NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM 4 ĐÁP ÁN
              </h2>
              <p className="text-teal-100 text-xs sm:text-sm font-semibold">
                Đang có {questions.length} câu hỏi trắc nghiệm A, B, C, D sẵn sàng
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

        {/* Status sub-bar for used/unused questions */}
        <div className="px-6 py-2.5 bg-teal-50/90 border-b border-teal-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-teal-900 bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-300 flex items-center gap-1.5">
              <span>🎯 Chưa xuất hiện:</span>
              <strong className="text-emerald-700 font-black">{unusedCount}/{questions.length}</strong>
            </span>
            <span className="font-extrabold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
              <span>⏳ Đã xuất hiện:</span>
              <strong className="text-amber-700 font-black">{usedCount}</strong>
            </span>
            <span className="text-2xs text-teal-800 font-bold bg-teal-100/60 px-2 py-0.5 rounded-md hidden sm:inline-block">
              ✓ Câu hỏi đã xuất hiện sẽ không lặp lại cho lượt tiếp theo
            </span>
          </div>

          {usedCount > 0 && (
            <button
              onClick={handleRestoreAllQuestions}
              className="px-3 py-1 rounded-lg bg-white hover:bg-teal-50 text-teal-800 border border-teal-300 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
              title="Khôi phục trạng thái để tất cả câu hỏi có thể xuất hiện lại"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-600" />
              <span>Khôi phục các câu đã dùng</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Top Add Form */}
          <div className="bg-teal-50/70 rounded-2xl p-4 border border-teal-200">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setActiveTab('single')}
                className={`px-4 py-1.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === 'single'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-teal-100'
                }`}
              >
                + Thêm câu hỏi trắc nghiệm (A, B, C, D)
              </button>
              <button
                onClick={() => setActiveTab('bulk')}
                className={`px-4 py-1.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === 'bulk'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-teal-100'
                }`}
              >
                📋 Dán danh sách hàng loạt
              </button>
            </div>

            {activeTab === 'single' ? (
              <form onSubmit={handleAddSingle} className="space-y-3">
                {/* Category & Question text */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="px-3 py-2 bg-white rounded-xl border border-teal-200 font-bold text-slate-700 text-sm focus:outline-hidden shrink-0"
                  >
                    {CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Nhập nội dung câu hỏi trắc nghiệm..."
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:outline-hidden font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-400 text-sm"
                  />
                </div>

                {/* 4 Choices (A, B, C, D) with Correct Choice selection */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-teal-900">
                    <span>Nhập 4 đáp án (Tích chọn đáp án ĐÚNG):</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Option A */}
                    <div
                      className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                        correctIdx === 0
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setCorrectIdx(0)}
                        className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 cursor-pointer ${
                          correctIdx === 0
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Đánh dấu đáp án A là đáp án đúng"
                      >
                        A
                      </button>
                      <input
                        type="text"
                        value={optA}
                        onChange={(e) => setOptA(e.target.value)}
                        placeholder="Nội dung đáp án A..."
                        className="flex-1 text-xs font-semibold text-slate-800 focus:outline-hidden bg-transparent"
                      />
                      {correctIdx === 0 && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>

                    {/* Option B */}
                    <div
                      className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                        correctIdx === 1
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setCorrectIdx(1)}
                        className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 cursor-pointer ${
                          correctIdx === 1
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Đánh dấu đáp án B là đáp án đúng"
                      >
                        B
                      </button>
                      <input
                        type="text"
                        value={optB}
                        onChange={(e) => setOptB(e.target.value)}
                        placeholder="Nội dung đáp án B..."
                        className="flex-1 text-xs font-semibold text-slate-800 focus:outline-hidden bg-transparent"
                      />
                      {correctIdx === 1 && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>

                    {/* Option C */}
                    <div
                      className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                        correctIdx === 2
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setCorrectIdx(2)}
                        className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 cursor-pointer ${
                          correctIdx === 2
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Đánh dấu đáp án C là đáp án đúng"
                      >
                        C
                      </button>
                      <input
                        type="text"
                        value={optC}
                        onChange={(e) => setOptC(e.target.value)}
                        placeholder="Nội dung đáp án C..."
                        className="flex-1 text-xs font-semibold text-slate-800 focus:outline-hidden bg-transparent"
                      />
                      {correctIdx === 2 && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>

                    {/* Option D */}
                    <div
                      className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                        correctIdx === 3
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setCorrectIdx(3)}
                        className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 cursor-pointer ${
                          correctIdx === 3
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Đánh dấu đáp án D là đáp án đúng"
                      >
                        D
                      </button>
                      <input
                        type="text"
                        value={optD}
                        onChange={(e) => setOptD(e.target.value)}
                        placeholder="Nội dung đáp án D..."
                        className="flex-1 text-xs font-semibold text-slate-800 focus:outline-hidden bg-transparent"
                      />
                      {correctIdx === 3 && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                  </div>
                </div>

                {/* Hint & Submit Button */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                    placeholder="Gợi ý đáp án cho học sinh (tùy chọn)..."
                    className="flex-1 px-4 py-1.5 rounded-xl border border-teal-200 focus:border-teal-500 focus:outline-hidden font-medium text-slate-700 placeholder:text-slate-400 text-xs bg-white"
                  />
                  <button
                    type="submit"
                    disabled={!newText.trim()}
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-black rounded-xl shadow cursor-pointer text-sm shrink-0 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Thêm câu trắc nghiệm
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Phân loại chung:</span>
                  <select
                    value={bulkCat}
                    onChange={(e) => setBulkCat(e.target.value)}
                    className="px-3 py-1 bg-white rounded-lg border border-teal-300 font-bold text-slate-700 text-xs"
                  >
                    {CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-2xs text-teal-800 bg-teal-100/70 p-2 rounded-lg font-medium">
                  Định dạng: <code>Câu hỏi | Đáp án A | Đáp án B | Đáp án C | Đáp án D | Đáp án đúng (A/B/C/D)</code>
                </div>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Ví dụ:&#10;1 tuần có mấy ngày? | 5 ngày | 6 ngày | 7 ngày | 8 ngày | C&#10;Số lớn nhất có 2 chữ số? | 90 | 98 | 99 | 100 | C"
                  rows={4}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:outline-hidden font-semibold text-slate-800 placeholder:font-normal placeholder:text-slate-400 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddBulk}
                  disabled={!bulkInput.trim()}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl shadow cursor-pointer text-sm"
                >
                  Thêm tất cả các câu trên
                </button>
              </div>
            )}
          </div>

          {/* Filter Bar & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onResetDefault}
                className="text-xs font-bold text-slate-500 hover:text-teal-700 inline-flex items-center gap-1 cursor-pointer"
                title="Tải lại bộ 23 câu hỏi bài học mẫu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Nạp lại 23 câu mẫu
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
              >
                Xóa hết
              </button>
            </div>
          </div>

          {/* Questions list with 4 options preview */}
          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className={`p-3.5 rounded-2xl border transition-colors flex items-start justify-between gap-3 shadow-xs ${
                  q.used
                    ? 'border-slate-200 bg-slate-50/70 hover:border-amber-300'
                    : 'border-slate-200 bg-white hover:border-teal-300'
                }`}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className="font-extrabold text-teal-600 text-xs mt-0.5 w-6 shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                        {q.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleUsed(q.id)}
                        className={`text-2xs font-extrabold px-2 py-0.5 rounded-md border flex items-center gap-1 cursor-pointer transition-all ${
                          q.used
                            ? 'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                        }`}
                        title={q.used ? 'Bấm để đánh dấu câu này chưa xuất hiện' : 'Bấm để đánh dấu câu này đã xuất hiện'}
                      >
                        {q.used ? '⏳ Đã xuất hiện (Không lặp)' : '✓ Chưa xuất hiện'}
                      </button>
                    </div>
                    <p className="font-bold text-slate-800 text-sm leading-snug">
                      {q.text}
                    </p>

                    {/* 4 Options Preview */}
                    {q.options && q.options.length > 0 && (
                      <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const letter = String.fromCharCode(65 + oIdx);
                          const isCorrect = q.correctIndex === oIdx;

                          return (
                            <div
                              key={oIdx}
                              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold ${
                                isCorrect
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                                  : 'bg-slate-50 text-slate-600 border border-slate-200'
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-2xs font-black">
                                {letter}
                              </span>
                              <span className="truncate">{opt}</span>
                              {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.hint && (
                      <p className="text-xs text-amber-700 font-medium mt-2 bg-amber-50 px-2 py-0.5 rounded-md">
                        {q.hint}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Xóa câu hỏi này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p className="font-bold">Chưa có câu hỏi nào trong danh mục này!</p>
              <button
                onClick={onResetDefault}
                className="mt-2 text-sm font-bold text-teal-600 hover:underline cursor-pointer"
              >
                Nhấn vào đây để tải danh sách câu hỏi trắc nghiệm mẫu
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Tất cả câu hỏi hiển thị dạng 4 đáp án A, B, C, D để học sinh chạm trực tiếp trên màn hình!
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Hoàn tất
          </button>
        </div>
        {/* Confirmation Overlay for Clear All Questions */}
        {showClearConfirm && (
          <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-rose-300 text-center animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 border-2 border-rose-300">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="font-['Baloo_2'] font-black text-xl text-slate-800 mb-2">
                Xóa tất cả câu hỏi?
              </h3>
              <p className="text-slate-600 text-xs font-semibold mb-4 leading-relaxed">
                Thầy/cô có chắc chắn muốn xóa toàn bộ {questions.length} câu hỏi hiện tại khỏi ngân hàng câu hỏi không?
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-2 rounded-xl border border-slate-300 font-extrabold text-slate-600 hover:bg-slate-50 cursor-pointer text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateQuestions([]);
                    soundEngine.playPop();
                    setShowClearConfirm(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold cursor-pointer text-xs flex items-center justify-center gap-1 shadow"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa tất cả
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
