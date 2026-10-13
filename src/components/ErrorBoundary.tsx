import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message || 'Lỗi không xác định' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Lỗi ứng dụng:', error, errorInfo);
  }

  private handleResetAndReload = () => {
    try {
      localStorage.removeItem('classroom_wheel_students');
      localStorage.removeItem('classroom_wheel_questions');
      localStorage.removeItem('classroom_wheel_history');
    } catch {
      // Ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6 text-slate-800">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border-4 border-amber-300 shadow-2xl text-center">
            <div className="text-5xl mb-4">🎡</div>
            <h2 className="text-2xl font-black text-amber-950 font-['Baloo_2'] mb-2">
              ĐÃ XẢY RA LỖI TẠM THỜI
            </h2>
            <p className="text-sm text-slate-600 font-medium mb-6">
              Đừng lo lắng! Thầy/cô chỉ cần nhấn nút bên dưới để khôi phục lại dữ liệu mẫu ban đầu và tiếp tục giờ học.
            </p>
            <button
              onClick={this.handleResetAndReload}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-extrabold rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-base active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              Khôi phục dữ liệu gốc & Tải lại
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
