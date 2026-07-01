/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserStats, ExamHistory, UserSettings } from '../types';

const STORAGE_KEY = 'jamboo_user_stats';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  fontFamily: 'Inter',
  fontSize: 'base',
  soundEnabled: true,
  timerDuration: 120, // 2 hours for full 4-subject mock exam
  highContrast: false,
};

const DEFAULT_STATS: UserStats = {
  streak: 0,
  lastActiveDate: '',
  totalQuestionsAnswered: 0,
  totalTimeSpent: 0,
  completedTopics: [],
  bookmarks: [],
  history: [],
  settings: DEFAULT_SETTINGS,
};

// Load stats from localStorage
export function loadUserStats(): UserStats {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return initializeStats();
    }
    const parsed = JSON.parse(data) as UserStats;
    // Backwards-compatibility checks
    if (!parsed.settings) parsed.settings = DEFAULT_SETTINGS;
    if (!parsed.bookmarks) parsed.bookmarks = [];
    if (!parsed.history) parsed.history = [];
    if (!parsed.completedTopics) parsed.completedTopics = [];
    return parsed;
  } catch (error) {
    console.error('Error loading stats', error);
    return DEFAULT_STATS;
  }
}

// Initialize / reset stats
export function initializeStats(): UserStats {
  const stats = { ...DEFAULT_STATS };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  return stats;
}

// Save complete stats
export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats', error);
  }
}

// Update study streak
export function updateStudyStreak(): UserStats {
  const stats = loadUserStats();
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-CA');

  if (stats.lastActiveDate === today) {
    // Already active today
    return stats;
  } else if (stats.lastActiveDate === yesterdayStr) {
    // Incremented streak
    stats.streak += 1;
  } else {
    // Streak broken or brand new
    stats.streak = 1;
  }
  stats.lastActiveDate = today;
  saveUserStats(stats);
  return stats;
}

// Add exam or practice test to history
export function saveExamResult(historyItem: ExamHistory): UserStats {
  const stats = loadUserStats();
  stats.history.unshift(historyItem); // Add to beginning
  
  // Update totals
  let totalAnswered = 0;
  Object.values(historyItem.subjectScores).forEach(sub => {
    totalAnswered += sub.correct + sub.wrong;
  });
  stats.totalQuestionsAnswered += totalAnswered;
  stats.totalTimeSpent += historyItem.timeTaken;
  
  saveUserStats(stats);
  updateStudyStreak();
  return stats;
}

// Toggle a bookmarked question
export function toggleBookmark(questionId: string): boolean {
  const stats = loadUserStats();
  const index = stats.bookmarks.indexOf(questionId);
  let bookmarked = false;
  if (index !== -1) {
    stats.bookmarks.splice(index, 1);
  } else {
    stats.bookmarks.push(questionId);
    bookmarked = true;
  }
  saveUserStats(stats);
  return bookmarked;
}

// Toggle a completed syllabus topic
export function toggleTopicCompleted(subjectName: string, topicName: string): boolean {
  const stats = loadUserStats();
  const key = `${subjectName}:${topicName}`;
  const index = stats.completedTopics.indexOf(key);
  let completed = false;
  if (index !== -1) {
    stats.completedTopics.splice(index, 1);
  } else {
    stats.completedTopics.push(key);
    completed = true;
  }
  saveUserStats(stats);
  return completed;
}

// Play feedback sound
export function playFeedbackSound(type: 'success' | 'click' | 'alert' | 'submit') {
  const stats = loadUserStats();
  if (!stats.settings.soundEnabled) return;

  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'click') {
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'alert') {
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'submit') {
      osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1); // A4
      osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.2); // C#5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    // Audio Context might be blocked before user interaction, which is fine
  }
}
