/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Student, Question, SpinResult } from './types';
import { INITIAL_STUDENTS, INITIAL_QUESTIONS } from './utils/defaultData';
import { soundEngine } from './utils/audio';
import { fireClassroomCelebration } from './utils/confetti';
import { generateStandaloneHtml } from './utils/exportHtml';

import { ClassroomWheel } from './components/ClassroomWheel';
import { ClassroomHorseRace } from './components/ClassroomHorseRace';
import { InteractiveQuizModal } from './components/InteractiveQuizModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { CertificateModal } from './components/CertificateModal';
import { StudentManager } from './components/StudentManager';
import { QuestionManager } from './components/QuestionManager';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';

import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Users,
  HelpCircle,
  History,
  Download,
  RotateCcw,
  Sparkles,
  Trophy,
  ScrollText,
  School,
} from 'lucide-react';

export default function App() {
  // Persistence state in localStorage with defaults
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('classroom_wheel_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const flat = parsed.flat(Infinity).filter(
            (s): s is Student => Boolean(s && typeof s === 'object' && typeof s.name === 'string' && s.name.trim().length > 0)
          );
          // If the cached students are the old 8 default students, upgrade to the 23 students list
          if (flat.length === 8 && flat[0]?.name === 'Minh Khang' && flat[7]?.name === 'Quỳnh Chi') {
            return INITIAL_STUDENTS;
          }
          if (flat.length > 0) {
            return flat.map((s, idx) => ({
              id: s.id || `s_${Date.now()}_${idx}`,
              name: String(s.name).trim(),
              avatar: s.avatar || INITIAL_STUDENTS[idx % INITIAL_STUDENTS.length].avatar,
              color: s.color || INITIAL_STUDENTS[idx % INITIAL_STUDENTS.length].color,
              active: typeof s.active === 'boolean' ? s.active : true,
              stars: typeof s.stars === 'number' && !isNaN(s.stars) ? s.stars : 0,
              correctAnswers: typeof s.correctAnswers === 'number' ? s.correctAnswers : 0,
              totalAnswerTimeSec: typeof s.totalAnswerTimeSec === 'number' ? s.totalAnswerTimeSec : 0,
            }));
          }
        }
      }
      return INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('classroom_wheel_questions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (q): q is Question => Boolean(q && typeof q === 'object' && typeof q.text === 'string' && q.text.trim().length > 0)
          );
          // If the cached questions are the old demo questions, upgrade to the new 23 curriculum questions
          const isOldDefault = valid.some((q) => q.text.includes('Một tuần lễ') || q.text.includes('Bác Ba'));
          if (valid.length > 0 && !isOldDefault) return valid;
        }
      }
      return INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  const [history, setHistory] = useState<SpinResult[]>(() => {
    try {
      const saved = localStorage.getItem('classroom_wheel_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (h): h is SpinResult => Boolean(h && h.student && h.student.name && h.question && h.question.text)
          );
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Active game mode tab ('wheel' or 'horserace')
  const [activeTab, setActiveTab] = useState<'wheel' | 'horserace'>(() => {
    try {
      return (localStorage.getItem('classroom_game_tab') as 'wheel' | 'horserace') || 'wheel';
    } catch {
      return 'wheel';
    }
  });

  // UI state
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [raceDuration, setRaceDuration] = useState<number>(6500);
  const [winner, setWinner] = useState<Student | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState<boolean>(false);

  // School and Teacher settings for Certificates
  const [schoolName, setSchoolName] = useState<string>(() => {
    try {
      return localStorage.getItem('classroom_cert_school') || 'Trường Tiểu học Kim Đồng';
    } catch {
      return 'Trường Tiểu học Kim Đồng';
    }
  });

  const [className, setClassName] = useState<string>(() => {
    try {
      return localStorage.getItem('classroom_cert_class') || 'Lớp 3A';
    } catch {
      return 'Lớp 3A';
    }
  });

  const [teacherName, setTeacherName] = useState<string>(() => {
    try {
      return localStorage.getItem('classroom_cert_teacher') || 'Cô Nguyễn Thu Trang';
    } catch {
      return 'Cô Nguyễn Thu Trang';
    }
  });

  const handleSaveSchoolInfo = (school: string, cls: string, teacher: string) => {
    setSchoolName(school);
    setClassName(cls);
    setTeacherName(teacher);
    try {
      localStorage.setItem('classroom_cert_school', school);
      localStorage.setItem('classroom_cert_class', cls);
      localStorage.setItem('classroom_cert_teacher', teacher);
    } catch {}
  };

  // Certificate Modal state
  const [certificateStudent, setCertificateStudent] = useState<Student | null>(null);
  const [certificateRank, setCertificateRank] = useState<number>(1);

  // Spin duration selector (Default 5500ms)
  const [spinSpeed, setSpinSpeed] = useState<number>(5500);

  // Auto-skip chosen students for next turns (Requested feature - enabled by default)
  const [autoSkipSelected, setAutoSkipSelected] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('classroom_wheel_auto_skip');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('classroom_wheel_auto_skip', JSON.stringify(autoSkipSelected));
    } catch {}
  }, [autoSkipSelected]);

  // Non-repeating questions mode: questions that have appeared will not repeat for subsequent turns
  const [noRepeatQuestions, setNoRepeatQuestions] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('classroom_wheel_no_repeat_questions');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('classroom_wheel_no_repeat_questions', JSON.stringify(noRepeatQuestions));
    } catch {}
  }, [noRepeatQuestions]);

  // Sync to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('classroom_wheel_students', JSON.stringify(students));
    } catch (e) {
      console.warn('Could not save students to localStorage', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('classroom_wheel_questions', JSON.stringify(questions));
    } catch (e) {
      console.warn('Could not save questions to localStorage', e);
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem('classroom_wheel_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  }, [history]);

  // Audio mute sync
  const toggleSound = () => {
    const nextMuted = !isSoundMuted;
    setIsSoundMuted(nextMuted);
    soundEngine.enabled = !nextMuted;
    if (!nextMuted) soundEngine.playPop();
  };

  // Fullscreen toggle for Classroom TV / Projector
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Listen to fullscreen exit
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Filter only active students for the wheel
  const activeStudents = students.filter((s) => s.active);

  // Question counts
  const unusedQuestionsCount = questions.filter((q) => !q.used).length;
  const usedQuestionsCount = questions.filter((q) => q.used).length;

  // Pick a question respecting non-repetition mode
  const pickNextQuestion = useCallback(
    (excludeId?: string): { question: Question | null; recycled: boolean } => {
      if (questions.length === 0) return { question: null, recycled: false };

      let pool: Question[];
      let recycled = false;

      if (noRepeatQuestions) {
        // Find unused questions, excluding the one currently shown if changing
        let unused = questions.filter((q) => !q.used && (!excludeId || q.id !== excludeId));
        if (unused.length === 0) {
          // All questions have already appeared! Recycle all for a fresh cycle
          recycled = true;
          unused = questions.filter((q) => !excludeId || q.id !== excludeId);
          if (unused.length === 0) unused = questions;
        }
        pool = unused;
      } else {
        pool = excludeId ? questions.filter((q) => q.id !== excludeId) : questions;
        if (pool.length === 0) pool = questions;
      }

      const randomIndex = Math.floor(Math.random() * pool.length);
      return { question: pool[randomIndex] || null, recycled };
    },
    [questions, noRepeatQuestions]
  );

  // Wheel spin callbacks
  const handleSpinStart = () => {
    setIsSpinning(true);
    setWinner(null);
  };

  const handleSpinEnd = (selectedWinner: Student) => {
    setIsSpinning(false);
    const { question: chosenQ, recycled } = pickNextQuestion();

    setWinner(selectedWinner);
    setCurrentQuestion(chosenQ);

    // Mark the chosen question as used so it will NOT repeat for subsequent turns
    if (chosenQ && noRepeatQuestions) {
      setQuestions((prev) =>
        prev.map((q) => {
          if (recycled) {
            return q.id === chosenQ.id ? { ...q, used: true } : { ...q, used: false };
          }
          return q.id === chosenQ.id ? { ...q, used: true } : q;
        })
      );
    }

    soundEngine.playFanfare();
    fireClassroomCelebration();
  };

  // Horse race callbacks
  const handleRaceStart = () => {
    setIsRacing(true);
    setWinner(null);
  };

  const handleRaceEnd = (selectedWinner: Student) => {
    setIsRacing(false);
    const { question: chosenQ, recycled } = pickNextQuestion();

    setWinner(selectedWinner);
    setCurrentQuestion(chosenQ);

    // Mark the chosen question as used so it will NOT repeat for subsequent turns
    if (chosenQ && noRepeatQuestions) {
      setQuestions((prev) =>
        prev.map((q) => {
          if (recycled) {
            return q.id === chosenQ.id ? { ...q, used: true } : { ...q, used: false };
          }
          return q.id === chosenQ.id ? { ...q, used: true } : q;
        })
      );
    }

    soundEngine.playFanfare();
    fireClassroomCelebration();
  };

  // Answer completed callback from InteractiveQuizModal
  const handleAnswerComplete = (studentId: string, starsEarned: number, timeTakenSec: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              stars: s.stars + starsEarned,
              correctAnswers: s.correctAnswers + (starsEarned > 0 ? 1 : 0),
              totalAnswerTimeSec: s.totalAnswerTimeSec + timeTakenSec,
            }
          : s
      )
    );

    if (currentQuestion && winner) {
      setHistory((prev) => [
        {
          student: winner,
          question: currentQuestion,
          starsAwarded: starsEarned,
          timeTakenSec,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    }
  };

  // Decision: Remove student from subsequent wheel spins
  const handleRemoveWinner = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, active: false } : s))
    );
    setWinner(null);
  };

  // Decision: Keep student in wheel
  const handleKeepWinner = () => {
    setWinner(null);
  };

  // Change current question to another random one that has not appeared yet
  const handleChangeQuestion = () => {
    const { question: nextQ, recycled } = pickNextQuestion(currentQuestion?.id);
    if (nextQ) {
      soundEngine.playPop();
      setCurrentQuestion(nextQ);
      if (noRepeatQuestions) {
        setQuestions((prev) =>
          prev.map((q) => {
            if (recycled) {
              return q.id === nextQ.id ? { ...q, used: true } : { ...q, used: false };
            }
            return q.id === nextQ.id ? { ...q, used: true } : q;
          })
        );
      }
    }
  };

  // Restore all questions back to unused (Allow all questions to appear again)
  const handleRestoreAllQuestions = () => {
    setQuestions((prev) => prev.map((q) => ({ ...q, used: false })));
    soundEngine.playPop();
  };

  // Restore all students back into wheel
  const handleRestoreAllStudents = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, active: true })));
    soundEngine.playPop();
  };

  // Reset all student stars & quiz records to 0 (Starting fresh from zero)
  const handleResetScores = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        stars: 0,
        correctAnswers: 0,
        totalAnswerTimeSec: 0,
      }))
    );
    setHistory([]);
    try {
      localStorage.removeItem('classroom_wheel_history');
    } catch {}
    soundEngine.playPop();
  };

  // Full reset to default 8 students with 0 stars and active status
  const handleFullResetToDefault = () => {
    const cleanDefault = INITIAL_STUDENTS.map((s) => ({
      ...s,
      active: true,
      stars: 0,
      correctAnswers: 0,
      totalAnswerTimeSec: 0,
    }));
    setStudents(cleanDefault);
    setHistory([]);
    try {
      localStorage.setItem('classroom_wheel_students', JSON.stringify(cleanDefault));
      localStorage.removeItem('classroom_wheel_history');
    } catch {}
    soundEngine.playPop();
  };

  // Restore single student
  const handleRestoreSingleStudent = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, active: true } : s))
    );
    soundEngine.playPop();
  };

  // Open certificate modal
  const handleOpenCertificate = (student: Student, rank: number) => {
    setCertificateStudent(student);
    setCertificateRank(rank);
  };

  // Download standalone single HTML file for offline usage
  const handleDownloadStandaloneHtml = () => {
    soundEngine.playPop();
    const htmlContent = generateStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vong-xoay-may-man-lop-hoc.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Spacebar to trigger spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        isStudentModalOpen ||
        isQuestionModalOpen ||
        isLeaderboardOpen ||
        certificateStudent !== null ||
        winner !== null
      ) {
        return;
      }

      if (e.code === 'Space' && !isSpinning && !isRacing && activeStudents.length > 0) {
        e.preventDefault();
        if (activeTab === 'wheel') {
          const spinBtn = document.querySelector('button[title*="quay"]') as HTMLButtonElement | null;
          if (spinBtn) spinBtn.click();
        } else {
          const raceBtn = document.querySelector('button[title*="Phím Cách"]') as HTMLButtonElement | null;
          if (raceBtn) raceBtn.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeTab,
    isSpinning,
    isRacing,
    activeStudents.length,
    isStudentModalOpen,
    isQuestionModalOpen,
    isLeaderboardOpen,
    certificateStudent,
    winner,
  ]);

  return (
    <div className="min-h-screen bg-radial from-[#FFFDF2] via-[#FEF9E7] to-[#FDE8B3] flex flex-col justify-between text-slate-800">
      {/* Top Classroom Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b-4 border-amber-300 shadow-sm px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-2 sticky top-0 z-30">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md text-2xl animate-bounce">
            🎡
          </div>
          <div>
            <h1 className="font-['Baloo_2'] text-xl sm:text-2xl font-black text-amber-950 tracking-tight leading-none flex items-center gap-2">
              VÒNG XOAY MAY MẮN LỚP HỌC
              <span className="hidden sm:inline-block text-xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Tiểu học
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-bold hidden sm:block mt-0.5">
              Gọi ngẫu nhiên · Thi đấu cộng sao tốc độ · Trao Thư Khen
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* TOP 3 & LEADERBOARD BUTTON */}
          <button
            onClick={() => {
              soundEngine.playPop();
              setIsLeaderboardOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-md transition-all cursor-pointer active:scale-95 animate-pulse"
            title="Xem bảng xếp hạng và trao Thư Khen Top 3"
          >
            <Trophy className="w-4 h-4 text-yellow-200" />
            <span>Xếp Hạng & Top 3</span>
            <span className="bg-white/30 text-white px-1.5 py-0.2 rounded-md text-xs font-black">
              🏆
            </span>
          </button>

          {/* Student Manager */}
          <button
            onClick={() => {
              soundEngine.playPop();
              setIsStudentModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all cursor-pointer active:scale-95"
            title="Quản lý danh sách & thêm ảnh học sinh"
          >
            <Users className="w-4 h-4" />
            <span>Học sinh</span>
            <span className="bg-amber-700/50 text-white px-1.5 py-0.2 rounded-md text-xs">
              {activeStudents.length}/{students.length}
            </span>
          </button>

          {/* Question Bank Manager */}
          <button
            onClick={() => {
              soundEngine.playPop();
              setIsQuestionModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all cursor-pointer active:scale-95"
            title={`Ngân hàng câu hỏi: Còn ${unusedQuestionsCount}/${questions.length} câu chưa xuất hiện`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Câu hỏi</span>
            <span className="bg-teal-800/60 text-white px-1.5 py-0.2 rounded-md text-xs font-black">
              {unusedQuestionsCount}/{questions.length}
            </span>
          </button>

          {/* School & Teacher Settings Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              setIsSchoolModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-2xs transition-all cursor-pointer active:scale-95"
            title="Thêm và chỉnh sửa tên Trường, Lớp, Giáo viên hiển thị trong Thư Khen"
          >
            <School className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Trường & GV</span>
            <span className="sm:hidden">Trường</span>
          </button>

          {/* History */}
          <button
            onClick={() => {
              soundEngine.playPop();
              setIsHistoryOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
            title="Xem danh sách các em đã được gọi"
          >
            <History className="w-4 h-4 text-slate-600" />
            <span className="hidden md:inline">Nhật ký</span>
            {history.length > 0 && (
              <span className="bg-amber-400 text-amber-950 px-1.5 rounded-full text-xs font-black">
                {history.length}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isSoundMuted
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            }`}
            title={isSoundMuted ? 'Bật âm thanh trò chơi' : 'Tắt âm thanh'}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Toàn màn hình chiếu / Tivi'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Download Standalone HTML Button */}
          <button
            onClick={handleDownloadStandaloneHtml}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 transition-all cursor-pointer"
            title="Tải về file HTML duy nhất để chạy Offline không cần mạng"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tải Offline</span>
          </button>
        </div>
      </header>

      {/* GAME MODE TAB SELECTOR BAR */}
      <div className="bg-white/80 backdrop-blur-xs border-b-2 border-amber-200/90 px-4 sm:px-6 py-2 flex items-center justify-between flex-wrap gap-2 sticky top-[61px] z-20 shadow-2xs">
        <div className="flex items-center gap-1.5 p-1 bg-amber-100/80 rounded-2xl border border-amber-200 shadow-inner">
          <button
            type="button"
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('wheel');
              try {
                localStorage.setItem('classroom_game_tab', 'wheel');
              } catch {}
            }}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'wheel'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-amber-900 hover:text-amber-950 hover:bg-amber-200/60'
            }`}
          >
            <span className="text-base sm:text-lg">🎡</span>
            <span>VÒNG XOAY MAY MẮN</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('horserace');
              try {
                localStorage.setItem('classroom_game_tab', 'horserace');
              } catch {}
            }}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'horserace'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-200/60'
            }`}
          >
            <span className="text-base sm:text-lg">🏇</span>
            <span>ĐUA NGỰA KỲ THÚ</span>
            <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 hidden sm:inline-block">
              Mới
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-bold hidden md:flex items-center gap-2">
          <span className="text-amber-600">✨ Đồng bộ điểm số:</span>
          <span>Sao và thành tích được tích lũy chung cho cả 2 trò chơi</span>
        </div>
      </div>

      {/* Main Arena (Wheel or Horse Race) */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 relative">
        {/* Floating Cartoon Background Accents */}
        <div className="absolute top-8 left-10 text-4xl opacity-30 pointer-events-none select-none hidden lg:block animate-pulse">
          ☁️
        </div>
        <div className="absolute top-16 right-16 text-4xl opacity-30 pointer-events-none select-none hidden lg:block animate-pulse">
          ⭐
        </div>
        <div className="absolute bottom-16 left-16 text-3xl opacity-25 pointer-events-none select-none hidden lg:block">
          🎈
        </div>
        <div className="absolute bottom-20 right-20 text-3xl opacity-25 pointer-events-none select-none hidden lg:block">
          🌟
        </div>

        {/* Active status indicator banner & auto-skip controls */}
        {/* Active status indicator banner & auto-skip controls */}
        <div className="mb-2 flex items-center gap-2 flex-wrap justify-center">
          {/* Student skip banner */}
          {activeStudents.length < students.length ? (
            <div className="bg-amber-100/90 border border-amber-300 px-4 py-1.5 rounded-full flex items-center gap-3 text-xs sm:text-sm font-bold text-amber-900 shadow-xs">
              <span>
                🎯 Đã gọi & bỏ qua {students.length - activeStudents.length} học sinh (Còn lại {activeStudents.length}/{students.length} em).
              </span>
              <button
                onClick={handleRestoreAllStudents}
                className="text-amber-800 underline hover:text-amber-950 font-black cursor-pointer flex items-center gap-1"
                title="Khôi phục toàn bộ danh sách vào vòng quay"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Khôi phục tất cả
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-300 px-3.5 py-1 rounded-full flex items-center gap-2 text-xs font-bold text-emerald-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Đang sẵn sàng {students.length} học sinh (Tự động bỏ qua sau khi được chọn)</span>
            </div>
          )}

          {/* Quick Toggle for Student Auto-Skip */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playPop();
              setAutoSkipSelected((prev) => !prev);
            }}
            className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 cursor-pointer transition-all ${
              autoSkipSelected
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
            }`}
            title="Bật/Tắt chế độ tự động bỏ qua học sinh đã được chọn ở lượt tiếp theo"
          >
            <span>{autoSkipSelected ? '✓' : '○'} Bỏ qua em đã chọn:</span>
            <span className={autoSkipSelected ? 'text-emerald-700 font-black' : 'text-slate-500 font-bold'}>
              {autoSkipSelected ? 'BẬT' : 'TẮT'}
            </span>
          </button>

          {/* Question non-repetition status indicator */}
          {usedQuestionsCount > 0 ? (
            <div className="bg-teal-100/90 border border-teal-300 px-3.5 py-1 rounded-full flex items-center gap-2.5 text-xs font-bold text-teal-900 shadow-2xs">
              <span>
                💡 Đã xuất hiện {usedQuestionsCount}/{questions.length} câu (Còn {unusedQuestionsCount} câu)
              </span>
              <button
                onClick={handleRestoreAllQuestions}
                className="text-teal-800 underline hover:text-teal-950 font-black cursor-pointer flex items-center gap-0.5 text-2xs"
                title="Khôi phục lại tất cả câu hỏi về chưa xuất hiện"
              >
                <RotateCcw className="w-3 h-3" />
                Khôi phục câu hỏi
              </button>
            </div>
          ) : (
            <div className="bg-teal-50 border border-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-teal-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>Sẵn sàng {questions.length} câu hỏi (Không lặp lại)</span>
            </div>
          )}

          {/* Quick Toggle for Question Non-Repetition */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playPop();
              setNoRepeatQuestions((prev) => !prev);
            }}
            className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 cursor-pointer transition-all ${
              noRepeatQuestions
                ? 'bg-teal-100 text-teal-900 border-teal-300 hover:bg-teal-200'
                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
            }`}
            title="Bật/Tắt chế độ câu hỏi đã xuất hiện rồi thì không lặp lại cho lượt tiếp theo"
          >
            <span>{noRepeatQuestions ? '✓' : '○'} Không lặp lại câu hỏi:</span>
            <span className={noRepeatQuestions ? 'text-teal-700 font-black' : 'text-slate-500 font-bold'}>
              {noRepeatQuestions ? 'BẬT' : 'TẮT'}
            </span>
          </button>
        </div>

        {/* TAB 1: THE WHEEL */}
        {activeTab === 'wheel' ? (
          <>
            <ClassroomWheel
              students={activeStudents}
              isSpinning={isSpinning}
              onSpinStart={handleSpinStart}
              onSpinEnd={handleSpinEnd}
              spinDurationMs={spinSpeed}
              onRestoreAll={handleRestoreAllStudents}
            />

            {/* Wheel Speed Selector */}
            <div className="mt-4 flex items-center gap-2 bg-white/70 backdrop-blur-xs px-3.5 py-1.5 rounded-2xl border border-amber-200 text-xs font-bold text-slate-600 shadow-2xs">
              <span className="text-slate-500">Thời gian quay:</span>
              <button
                onClick={() => setSpinSpeed(3500)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  spinSpeed === 3500
                    ? 'bg-amber-500 text-white font-extrabold'
                    : 'hover:bg-amber-100 text-slate-600'
                }`}
              >
                Nhanh (3.5s)
              </button>
              <button
                onClick={() => setSpinSpeed(5500)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  spinSpeed === 5500
                    ? 'bg-amber-500 text-white font-extrabold'
                    : 'hover:bg-amber-100 text-slate-600'
                }`}
              >
                Chuẩn (5.5s)
              </button>
              <button
                onClick={() => setSpinSpeed(8000)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  spinSpeed === 8000
                    ? 'bg-amber-500 text-white font-extrabold'
                    : 'hover:bg-amber-100 text-slate-600'
                }`}
              >
                Hồi hộp (8s)
              </button>
            </div>
          </>
        ) : (
          /* TAB 2: CLASSROOM HORSE RACE */
          <>
            <ClassroomHorseRace
              students={activeStudents}
              isRacing={isRacing}
              onRaceStart={handleRaceStart}
              onRaceEnd={handleRaceEnd}
              raceDurationMs={raceDuration}
              onRestoreAll={handleRestoreAllStudents}
            />

            {/* Horse Race Duration Selector */}
            <div className="mt-4 flex items-center gap-2 bg-white/70 backdrop-blur-xs px-3.5 py-1.5 rounded-2xl border border-emerald-200 text-xs font-bold text-slate-600 shadow-2xs">
              <span className="text-slate-500">Cự ly thi đấu:</span>
              <button
                onClick={() => setRaceDuration(4000)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  raceDuration === 4000
                    ? 'bg-emerald-600 text-white font-extrabold'
                    : 'hover:bg-emerald-100 text-slate-600'
                }`}
              >
                Nước rút (100m - 4s)
              </button>
              <button
                onClick={() => setRaceDuration(6500)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  raceDuration === 6500
                    ? 'bg-emerald-600 text-white font-extrabold'
                    : 'hover:bg-emerald-100 text-slate-600'
                }`}
              >
                Tiêu chuẩn (200m - 6.5s)
              </button>
              <button
                onClick={() => setRaceDuration(9000)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  raceDuration === 9000
                    ? 'bg-emerald-600 text-white font-extrabold'
                    : 'hover:bg-emerald-100 text-slate-600'
                }`}
              >
                Kịch tính (400m - 9s)
              </button>
            </div>
          </>
        )}
      </main>

      {/* Classroom Footer */}
      <footer className="bg-white/80 border-t border-amber-200/80 px-4 py-2 text-center text-xs font-bold text-slate-500 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-600">🌟 Lớp học sôi nổi</span>
          <span>·</span>
          <span>Trả lời càng nhanh, Sao càng nhiều</span>
          <span>·</span>
          <span>Trao Thư Khen vinh danh</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="text-amber-800 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Xem Bảng Vinh Danh Top 3</span>
          </button>
        </div>
      </footer>

      {/* INTERACTIVE QUESTION & SPEED QUIZ MODAL */}
      {winner && (
        <InteractiveQuizModal
          student={winner}
          question={currentQuestion}
          onAnswerComplete={handleAnswerComplete}
          onRemoveStudent={handleRemoveWinner}
          onKeepStudent={handleKeepWinner}
          onChangeQuestion={handleChangeQuestion}
          totalStudentsLeft={activeStudents.length}
          autoSkipEnabled={autoSkipSelected}
          unusedQuestionsCount={unusedQuestionsCount}
          totalQuestionsCount={questions.length}
          noRepeatQuestionsEnabled={noRepeatQuestions}
        />
      )}

      {/* LEADERBOARD & PODIUM MODAL */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        students={students}
        onOpenCertificate={handleOpenCertificate}
        onResetScores={handleResetScores}
      />

      {/* CERTIFICATE OF MERIT MODAL */}
      {certificateStudent && (
        <CertificateModal
          isOpen={true}
          onClose={() => setCertificateStudent(null)}
          student={certificateStudent}
          rank={certificateRank}
          schoolName={schoolName}
          className={className}
          teacherName={teacherName}
          onUpdateSchoolInfo={handleSaveSchoolInfo}
        />
      )}

      {/* SCHOOL & TEACHER SETTINGS MODAL */}
      <SchoolSettingsModal
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        schoolName={schoolName}
        className={className}
        teacherName={teacherName}
        onSave={handleSaveSchoolInfo}
      />

      {/* STUDENT MANAGER MODAL */}
      <StudentManager
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        students={students}
        onUpdateStudents={setStudents}
        onResetDefault={handleFullResetToDefault}
        onResetScores={handleResetScores}
      />

      {/* QUESTION MANAGER MODAL */}
      <QuestionManager
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        questions={questions}
        onUpdateQuestions={setQuestions}
        onResetDefault={() => {
          setQuestions(INITIAL_QUESTIONS);
          soundEngine.playPop();
        }}
      />

      {/* HISTORY DRAWER */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
        onRestoreStudent={handleRestoreSingleStudent}
      />
    </div>
  );
}
