import React from 'react';
import { SpinResult } from '../types';
import { RotateCcw, X, Clock, Award } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SpinResult[];
  onClearHistory: () => void;
  onRestoreStudent: (studentId: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRestoreStudent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l-4 border-amber-300">
        {/* Header */}
        <div className="p-4 bg-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-200" />
            <h3 className="font-extrabold text-lg">NHẬT KÝ LƯỢT GỌI ({history.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.map((record, index) => {
            const timeStr = new Date(record.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={index}
                className="p-3 rounded-2xl border border-slate-200 bg-amber-50/40 hover:bg-amber-50/80 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={record.student.avatar}
                      alt={record.student.name}
                      className="w-8 h-8 rounded-full border border-amber-300 object-cover"
                    />
                    <span className="font-extrabold text-slate-800 text-sm">
                      {record.student.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">{timeStr}</span>
                </div>

                <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-amber-200/60 font-medium">
                  <span className="font-bold text-amber-700 mr-1">
                    [{record.question.category}]
                  </span>
                  {record.question.text}
                </div>

                <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-xs text-amber-700 font-black inline-flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    {typeof record.starsAwarded === 'number'
                      ? `+${record.starsAwarded} sao (trong ${record.timeTakenSec || 0}s)`
                      : 'Đã hoàn thành lượt gọi'}
                  </span>
                  <button
                    onClick={() => onRestoreStudent(record.student.id)}
                    className="text-xs font-bold text-slate-500 hover:text-amber-600 inline-flex items-center gap-1 cursor-pointer"
                    title="Đưa em này trở lại vòng xoay"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Đưa lại vào vòng
                  </button>
                </div>
              </div>
            );
          })}

          {history.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="font-bold text-base">Chưa có lượt quay nào</p>
              <p className="text-xs mt-1">Lịch sử các bạn trúng thưởng sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClearHistory}
              className="text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
            >
              Xóa lịch sử buổi học
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
