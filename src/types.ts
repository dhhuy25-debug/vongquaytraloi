export interface Student {
  id: string;
  name: string;
  avatar: string; // base64 or SVG data URL
  color: string;
  active: boolean; // true if included in wheel
  stars: number; // reward stars earned
  correctAnswers: number;
  totalAnswerTimeSec: number; // total answer time for tie-breaking speed
}

export interface Question {
  id: string;
  text: string;
  category: string;
  options?: string[]; // Optional multiple choice options
  correctIndex?: number; // 0, 1, 2, 3
  hint?: string;
  timeLimitSec?: number; // Default 20s
  used: boolean;
}

export interface SpinResult {
  student: Student;
  question: Question;
  starsAwarded: number;
  timeTakenSec: number;
  timestamp: number;
}
