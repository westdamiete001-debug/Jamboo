/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Question, UserStats } from '../types';
import { STATIC_QUESTIONS, generateQuestionsForSubject } from '../data/questions';
import { playFeedbackSound, toggleBookmark, loadUserStats } from '../utils/localStorage';
import { 
  Bookmark, 
  Trash2, 
  Search, 
  BookOpen, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  FolderOpen
} from 'lucide-react';

interface BookmarksViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onBack: () => void;
}

export default function BookmarksView({ stats, onUpdateStats, onBack }: BookmarksViewProps) {
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // Load actual bookmarked question definitions
  useEffect(() => {
    const ids = stats.bookmarks;
    const items: Question[] = [];
    
    // Attempt to resolve questions from static list
    ids.forEach(id => {
      let found = STATIC_QUESTIONS.find(q => q.id === id);
      if (!found) {
        // Fallback: If generated question was bookmarked, recreate it based on subject prefix in ID
        const parts = id.split('-');
        if (parts[0] && id.includes('proc')) {
          const generatedPool = generateQuestionsForSubject(parts[0], 20);
          found = generatedPool.find(q => q.id === id);
        }
      }
      if (found) items.push(found);
    });

    setBookmarkedQuestions(items);
  }, [stats.bookmarks]);

  const handleToggleBookmark = (id: string) => {
    toggleBookmark(id);
    const updated = loadUserStats();
    onUpdateStats(updated);
    playFeedbackSound('click');
  };

  const filteredBookmarks = bookmarkedQuestions.filter(q => {
    const qText = q.text.toLowerCase();
    const qSub = q.subject.toLowerCase();
    const qTopic = q.topic.toLowerCase();
    const query = searchQuery.toLowerCase();
    return qText.includes(query) || qSub.includes(query) || qTopic.includes(query);
  });

  const startPractice = () => {
    if (filteredBookmarks.length === 0) return;
    setIsPracticeMode(true);
    setPracticeIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    playFeedbackSound('click');
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    setIsAnswered(true);
    
    const correct = selectedOption === filteredBookmarks[practiceIndex].correctAnswer;
    if (correct) {
      setScore(score + 1);
      playFeedbackSound('success');
    } else {
      playFeedbackSound('alert');
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    
    if (practiceIndex < filteredBookmarks.length - 1) {
      setPracticeIndex(practiceIndex + 1);
      playFeedbackSound('click');
    } else {
      // Finished practice
      setIsPracticeMode(false);
      playFeedbackSound('submit');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 text-slate-800 dark:text-slate-100">
      {/* Header */}
      {!isPracticeMode ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Saved Bookmarks</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">Practice or manage your saved exam items</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors font-bold"
            >
              Back
            </button>
          </div>

          {/* Search box and Practice trigger */}
          {bookmarkedQuestions.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search bookmarks by keyword or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
              <button
                disabled={filteredBookmarks.length === 0}
                onClick={startPractice}
                className="px-5 py-2 text-xs bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-teal-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                Practice Bookmarks ({filteredBookmarks.length})
              </button>
            </div>
          )}

          {/* List of bookmarks */}
          {filteredBookmarks.length > 0 ? (
            <div className="space-y-3.5">
              {filteredBookmarks.map((q, idx) => (
                <div 
                  key={q.id}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex gap-3.5 items-start hover:border-slate-200 dark:hover:border-slate-800 shadow-sm relative group"
                >
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 shrink-0">
                    <Bookmark className="w-4 h-4 fill-amber-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-black px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                        {q.subject}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {q.topic}
                      </span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed pt-1.5">
                      {q.text}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleBookmark(q.id)}
                    className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <div className="inline-flex p-4 rounded-3xl bg-slate-100 dark:bg-slate-950/40 text-slate-400 dark:text-slate-500 mb-3">
                <FolderOpen className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold">No bookmarks found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {searchQuery ? 'Try matching another keyword or subject' : 'Saved study items or formulas will appear here for practice drills.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Focused practice mode */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setIsPracticeMode(false);
                playFeedbackSound('click');
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Practice
            </button>
            <span className="text-xs font-mono font-bold text-slate-400">
              Card {practiceIndex + 1} of {filteredBookmarks.length} (Score: {score})
            </span>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
            {/* Top Info */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-full">
                {filteredBookmarks[practiceIndex].subject.toUpperCase()}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {filteredBookmarks[practiceIndex].topic}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-sm font-semibold leading-relaxed mb-4 whitespace-pre-wrap">
              {filteredBookmarks[practiceIndex].text}
            </h3>

            {/* Options list */}
            <div className="space-y-2.5">
              {filteredBookmarks[practiceIndex].options.map((option, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx];
                let btnStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50';
                
                if (selectedOption === idx) {
                  btnStyle = 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400';
                }

                if (isAnswered) {
                  if (idx === filteredBookmarks[practiceIndex].correctAnswer) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-semibold';
                  } else if (selectedOption === idx) {
                    btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400';
                  } else {
                    btnStyle = 'border-slate-100 dark:border-slate-900 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full p-3.5 text-left text-xs rounded-xl border transition-all flex items-center gap-3 ${btnStyle}`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      selectedOption === idx 
                        ? 'bg-teal-500 text-white' 
                        : isAnswered && idx === filteredBookmarks[practiceIndex].correctAnswer 
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {label}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isAnswered && idx === filteredBookmarks[practiceIndex].correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {isAnswered && selectedOption === idx && idx !== filteredBookmarks[practiceIndex].correctAnswer && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Answer explanation panel */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl"
            >
              <div className="flex items-center gap-1.5 mb-2 text-teal-600 dark:text-teal-400 font-semibold">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span className="text-[10px] tracking-wider uppercase font-extrabold">Explanation</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                {filteredBookmarks[practiceIndex].explanation}
              </p>
            </motion.div>
          )}

          {/* Action button */}
          <div className="flex justify-end pt-2">
            {!isAnswered ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-teal-500/10 transition-all flex items-center gap-2 cursor-pointer text-xs"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer text-xs"
              >
                {practiceIndex < filteredBookmarks.length - 1 ? 'Next Bookmark' : 'Finish Session'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
