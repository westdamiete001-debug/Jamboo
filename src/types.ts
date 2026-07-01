/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  subject: string;
  topic: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  year: number;
  image?: string; // Optional image URL or base64
  formula?: string; // Standard formula formatting or latex string
  diagram?: string; // Simple ASCII / SVG symbol descriptor
}

export interface SubjectInfo {
  id: string;
  name: string;
  topics: string[];
  category: 'Science' | 'Social Science' | 'Art' | 'Commercial' | 'General';
  description: string;
}

export interface ExamHistory {
  id: string;
  type: 'Mock' | 'Practice';
  date: string;
  subjects: string[];
  duration: number; // in seconds
  timeTaken: number; // in seconds
  score: number; // overall percentage or total points
  subjectScores: {
    [subjectId: string]: {
      score: number;
      total: number;
      correct: number;
      wrong: number;
      unanswered: number;
    };
  };
  topicBreakdown: {
    [topic: string]: {
      correct: number;
      total: number;
    };
  };
}

export interface UserStats {
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalQuestionsAnswered: number;
  totalTimeSpent: number; // in seconds
  completedTopics: string[]; // subjectName:topicName
  bookmarks: string[]; // Question IDs
  history: ExamHistory[];
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  fontFamily: 'Inter' | 'Space Grotesk' | 'JetBrains Mono' | 'Outfit';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  soundEnabled: boolean;
  timerDuration: number; // Mock exam time in minutes
  highContrast: boolean;
}

export interface StudyNote {
  id: string;
  subject: string;
  topic: string;
  definition: string;
  content: string; // Rich markdown or structured sectioning
  examples: { problem: string; solution: string }[];
  keyPoints: string[];
  summary: string;
  tips: string[];
  commonMistakes: string[];
  faqs: { q: string; a: string }[];
}

export interface SyllabusItem {
  id: string;
  subject: string;
  topic: string;
  subtopics: string[];
  objectives: string[];
}

export interface DailyChallenge {
  date: string; // YYYY-MM-DD
  subject: string;
  questions: Question[];
  completed: boolean;
  score?: number;
}
