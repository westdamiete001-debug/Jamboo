/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserStats } from '../types';
import { SUBJECTS } from '../data/subjects';
import { playFeedbackSound } from '../utils/localStorage';
import { 
  Flame, 
  Target, 
  BookOpen, 
  Clock, 
  Settings as SettingsIcon, 
  Trophy, 
  Award, 
  Bookmark, 
  Calculator as CalcIcon, 
  Info, 
  Sparkles as DailyIcon, 
  Search,
  BookMarked,
  ChevronRight,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

interface HomeProps {
  stats: UserStats;
  onNavigate: (view: 'cbt' | 'past_questions' | 'notes' | 'daily_quiz' | 'bookmarks' | 'analytics' | 'settings' | 'about') => void;
}

const MOTIVATIONAL_QUOTES = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "Success isn't accidental. It's hard work, perseverance, studying, and sacrifice.",
  "You don't have to be great to start, but you have to start to be great. — Zig Ziglar",
  "The beautiful thing about learning is that no one can take it away from you. — B.B. King",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "Your future is created by what you do today, not tomorrow. — Robert Kiyosaki",
  "Ninety percent of success is showing up. — Woody Allen"
];

const STUDY_RECOMMENDATIONS = [
  { subject: 'Use of English', topic: 'The Lekki Headmaster novel characters', task: 'Read Chapter 3 Study Summary' },
  { subject: 'Mathematics', topic: 'Indices & Logarithms transformations', task: 'Try 5 Practice Questions' },
  { subject: 'Physics', topic: 'Wave equations and frequency calculations', task: 'Practice 2022 Past Questions' },
  { subject: 'Chemistry', topic: 'Acids, bases and pH values', task: 'Review the Chemical Formulas' },
  { subject: 'Biology', topic: 'Genetics, Rr cross-overs and Punnett squares', task: 'Tick completion tracker on Syllabus' }
];

export default function Home({ stats, onNavigate }: HomeProps) {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [recommendation] = useState(() => STUDY_RECOMMENDATIONS[new Date().getDay() % STUDY_RECOMMENDATIONS.length]);

  // Periodic motivational quotes rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Calculate syllabus progress percentage
  const totalTopics = SUBJECTS.reduce((sum, s) => sum + s.topics.length, 0);
  const completedCount = stats.completedTopics.length;
  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const handleMenuClick = (view: any) => {
    onNavigate(view);
    playFeedbackSound('click');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 text-slate-800 dark:text-slate-100">
      
      {/* 1. Welcoming header & Study Streaks */}
      <header className="flex justify-between items-center bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-850">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-5 h-5 text-teal-400" />
            <h1 className="text-xl font-extrabold tracking-tight">Jamboo</h1>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Practice. Prepare. Pass.</p>
        </div>

        {/* Study Streak */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
          <div>
            <span className="block text-sm font-black text-white">{stats.streak} Days</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Study Streak</span>
          </div>
        </div>
      </header>

      {/* 2. Motivational Quotes Rotator */}
      <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-cyan-500/10 border border-teal-150/40 dark:border-teal-900/20 p-4 rounded-2xl text-center">
        <motion.p 
          key={quoteIdx}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 0.9, y: 0 }}
          className="text-xs font-semibold tracking-wide italic text-slate-600 dark:text-teal-300"
        >
          "{MOTIVATIONAL_QUOTES[quoteIdx]}"
        </motion.p>
      </div>

      {/* 3. Progress Overview Card */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Core Percentage Tracker */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm space-y-3.5 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Syllabus Completion</h3>
            <span className="text-xs font-bold text-teal-500">{progressPercent}%</span>
          </div>
          
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>{completedCount} topics complete</span>
            <span>{totalTopics - completedCount} remaining</span>
          </div>
        </div>

        {/* Daily Recommendations */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm space-y-2 col-span-2">
          <div className="flex items-center gap-1 text-teal-500 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4.5 h-4.5" />
            Today's Practice Recommendation
          </div>
          <div className="space-y-1 pt-1.5">
            <p className="text-xs font-bold">{recommendation.subject} • {recommendation.topic}</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">{recommendation.task}. Complete offline questions to cement topic retention.</p>
          </div>
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleMenuClick('notes')}
              className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/20 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400 font-bold rounded-lg transition-all text-[10px] flex items-center gap-1 cursor-pointer"
            >
              Start Revision
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </section>

      {/* 4. MAIN NAVIGATION GRID CONTROLLER */}
      <section className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Mock & Practice Hub</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Mock CBT */}
          <button
            onClick={() => handleMenuClick('cbt')}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:border-teal-500 dark:hover:border-teal-500 rounded-2xl text-left transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between h-36"
          >
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 w-10">
              <Trophy className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-500 transition-colors">Start Mock CBT</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Realistic 4-subject trial</p>
            </div>
          </button>

          {/* Past Questions */}
          <button
            onClick={() => handleMenuClick('past_questions')}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:border-teal-500 dark:hover:border-teal-500 rounded-2xl text-left transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between h-36"
          >
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 w-10">
              <BookOpen className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-500 transition-colors">Past Questions</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Practice and filters</p>
            </div>
          </button>

          {/* Study Notes */}
          <button
            onClick={() => handleMenuClick('notes')}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:border-teal-500 dark:hover:border-teal-500 rounded-2xl text-left transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between h-36"
          >
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 w-10">
              <BookMarked className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-500 transition-colors">Study Notes</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Official syllabus topics</p>
            </div>
          </button>

          {/* Daily Quiz */}
          <button
            onClick={() => handleMenuClick('daily_quiz')}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:border-teal-500 dark:hover:border-teal-500 rounded-2xl text-left transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between h-36"
          >
            <div className="p-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/20 text-pink-500 w-10">
              <DailyIcon className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-pink-500 transition-colors">Daily Quiz</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Quick daily mini challenges</p>
            </div>
          </button>
        </div>
      </section>

      {/* 5. AUXILIARY SERVICES GRID */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
        
        {/* Bookmarked Questions */}
        <button
          onClick={() => handleMenuClick('bookmarks')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl text-left transition-all hover:shadow-sm cursor-pointer flex items-center gap-3.5"
        >
          <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl shrink-0">
            <Bookmark className="w-4 h-4 fill-amber-500" />
          </div>
          <div>
            <span className="block text-xs font-bold">Saved Items</span>
            <span className="text-[9px] text-slate-400">{stats.bookmarks.length} saved</span>
          </div>
        </button>

        {/* Analytics */}
        <button
          onClick={() => handleMenuClick('analytics')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl text-left transition-all hover:shadow-sm cursor-pointer flex items-center gap-3.5"
        >
          <div className="p-2 bg-teal-50 dark:bg-teal-950/20 text-teal-600 rounded-xl shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold">Analytics</span>
            <span className="text-[9px] text-slate-400">{stats.history.length} exams</span>
          </div>
        </button>

        {/* Settings */}
        <button
          onClick={() => handleMenuClick('settings')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl text-left transition-all hover:shadow-sm cursor-pointer flex items-center gap-3.5"
        >
          <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl shrink-0">
            <SettingsIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold">Settings</span>
            <span className="text-[9px] text-slate-400">Themes & Backups</span>
          </div>
        </button>

        {/* About */}
        <button
          onClick={() => handleMenuClick('about')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl text-left transition-all hover:shadow-sm cursor-pointer flex items-center gap-3.5"
        >
          <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold">About</span>
            <span className="text-[9px] text-slate-400">Terms & Privacy</span>
          </div>
        </button>

      </section>

      {/* 6. RECENT SCORES CAROUSEL */}
      {stats.history.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Recent Scores</h3>
          
          <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-none">
            {stats.history.slice(0, 3).map((h) => (
              <div 
                key={h.id}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl min-w-[200px] shrink-0 space-y-2 shadow-sm"
              >
                <div className="flex justify-between items-center text-[9px] uppercase font-bold text-slate-400">
                  <span>{h.date}</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">{h.type}</span>
                </div>
                <p className="text-xs font-bold truncate max-w-[150px]">{h.subjects.map(s => s.toUpperCase()).join(' • ')}</p>
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-100 dark:border-slate-850">
                  <span className="text-[10px] text-slate-400 font-semibold">{Math.round(h.timeTaken / 60)} mins</span>
                  <span className={`text-sm font-black ${h.score >= 70 ? 'text-emerald-500' : h.score >= 50 ? 'text-teal-500' : 'text-rose-500'}`}>{h.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
