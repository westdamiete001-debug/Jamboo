/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import Home from './components/Home';
import CbtEngine from './components/CbtEngine';
import PastQuestionsView from './components/PastQuestionsView';
import NotesView from './components/NotesView';
import DailyQuizView from './components/DailyQuizView';
import BookmarksView from './components/BookmarksView';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import About from './components/About';
import ResultScreen from './components/ResultScreen';
import { UserStats, ExamHistory } from './types';
import { loadUserStats, saveUserStats, updateStudyStreak } from './utils/localStorage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeView, setActiveView] = useState<
    'home' | 'cbt' | 'past_questions' | 'notes' | 'daily_quiz' | 'bookmarks' | 'analytics' | 'settings' | 'about' | 'result'
  >('home');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activeResult, setActiveResult] = useState<ExamHistory | null>(null);

  // Load state and update streak
  useEffect(() => {
    const loaded = updateStudyStreak();
    setStats(loaded);
  }, []);

  // Set typography preference on the root document element
  useEffect(() => {
    if (!stats?.settings) return;
    
    const root = document.documentElement;
    // Remove past classes
    root.classList.remove('font-inter', 'font-grotesk', 'font-mono', 'font-outfit');
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');

    // Add font family
    const font = stats.settings.fontFamily;
    if (font === 'Space Grotesk') {
      root.style.fontFamily = '"Space Grotesk", sans-serif';
    } else if (font === 'JetBrains Mono') {
      root.style.fontFamily = '"JetBrains Mono", monospace';
    } else if (font === 'Outfit') {
      root.style.fontFamily = '"Outfit", sans-serif';
    } else {
      root.style.fontFamily = '"Inter", sans-serif';
    }

    // Add scale class or style
    const size = stats.settings.fontSize;
    if (size === 'sm') {
      root.style.fontSize = '14px';
    } else if (size === 'lg') {
      root.style.fontSize = '18px';
    } else if (size === 'xl') {
      root.style.fontSize = '20px';
    } else {
      root.style.fontSize = '16px'; // standard
    }
    
    // Add theme class
    const theme = stats.settings.theme;
    root.classList.remove('dark');
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    }
  }, [stats?.settings]);

  if (!stats) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center text-teal-400 font-mono text-xs">
        Loading local storage databases...
      </div>
    );
  }

  // Handle splash completion
  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  const handleFinishExam = (result: ExamHistory) => {
    // Add to stats history
    const updatedStats = { ...stats };
    updatedStats.history.unshift(result);
    
    // Calculate total questions solved
    let answeredCount = 0;
    Object.values(result.subjectScores).forEach(s => {
      answeredCount += s.correct + s.wrong;
    });
    updatedStats.totalQuestionsAnswered += answeredCount;
    updatedStats.totalTimeSpent += result.timeTaken;

    setStats(updatedStats);
    saveUserStats(updatedStats);
    
    setActiveResult(result);
    setActiveView('result');
  };

  const handleRestartPractice = () => {
    setActiveView('cbt');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Dynamic render block */}
      {activeView === 'home' && (
        <Home stats={stats} onNavigate={setActiveView} />
      )}

      {activeView === 'cbt' && (
        <CbtEngine 
          stats={stats} 
          onFinishExam={handleFinishExam} 
          onBack={() => setActiveView('home')} 
        />
      )}

      {activeView === 'past_questions' && (
        <PastQuestionsView 
          stats={stats} 
          onUpdateStats={setStats} 
          onBack={() => setActiveView('home')} 
        />
      )}

      {activeView === 'notes' && (
        <NotesView 
          stats={stats} 
          onUpdateStats={setStats} 
          onBack={() => setActiveView('home')} 
        />
      )}

      {activeView === 'daily_quiz' && (
        <DailyQuizView 
          stats={stats} 
          onUpdateStats={setStats} 
          onBack={() => setActiveView('home')} 
        />
      )}

      {activeView === 'bookmarks' && (
        <BookmarksView 
          stats={stats} 
          onUpdateStats={setStats} 
          onBack={() => setActiveView('home')} 
        />
      )}

      {activeView === 'analytics' && (
        <Analytics stats={stats} onBack={() => setActiveView('home')} />
      )}

      {activeView === 'settings' && (
        <Settings 
          stats={stats} 
          onUpdateStats={setStats} 
          onBack={() => setActiveView('home')} 
        />
      )}

      {activeView === 'about' && (
        <About onBack={() => setActiveView('home')} />
      )}

      {activeView === 'result' && activeResult && (
        <ResultScreen 
          result={activeResult} 
          onReturnHome={() => setActiveView('home')} 
          onPracticeAgain={handleRestartPractice} 
        />
      )}
    </div>
  );
}
