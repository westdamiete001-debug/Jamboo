/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Question, UserStats } from '../types';
import { SUBJECTS } from '../data/subjects';
import { generateQuestionsForSubject, STATIC_QUESTIONS } from '../data/questions';
import { playFeedbackSound, toggleBookmark, loadUserStats } from '../utils/localStorage';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Bookmark, 
  ArrowLeft, 
  GraduationCap, 
  Check, 
  X,
  Play
} from 'lucide-react';

interface PastQuestionsViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onBack: () => void;
}

export default function PastQuestionsView({ stats, onUpdateStats, onBack }: PastQuestionsViewProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedDiff, setSelectedDiff] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate or load questions when subject changes
  useEffect(() => {
    if (selectedSubject) {
      // Fetch 40 questions for high-density practice
      const list = generateQuestionsForSubject(selectedSubject, 40);
      setQuestions(list);
      setActiveQuestion(null);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      setQuestions([]);
    }
  }, [selectedSubject]);

  const handleToggleBookmark = (id: string) => {
    toggleBookmark(id);
    const updated = loadUserStats();
    onUpdateStats(updated);
    playFeedbackSound('click');
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    playFeedbackSound('click');
  };

  const checkAnswer = () => {
    if (selectedOption === null || !activeQuestion) return;
    setIsAnswered(true);
    if (selectedOption === activeQuestion.correctAnswer) {
      playFeedbackSound('success');
    } else {
      playFeedbackSound('alert');
    }
  };

  // Filter conditions
  const filteredQuestions = questions.filter(q => {
    if (selectedYear !== 'All' && q.year !== Number(selectedYear)) return false;
    if (selectedDiff !== 'All' && q.difficulty !== selectedDiff) return false;
    
    if (searchQuery) {
      const qText = q.text.toLowerCase();
      const qTopic = q.topic.toLowerCase();
      const query = searchQuery.toLowerCase();
      return qText.includes(query) || qTopic.includes(query);
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-slate-800 dark:text-slate-100">
      {/* Subject select header */}
      {!selectedSubject ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Past Questions</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Practice real questions categorized by syllabus subjects</p>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors font-bold"
            >
              Back
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {SUBJECTS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubject(sub.id);
                  playFeedbackSound('click');
                }}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:border-teal-500 dark:hover:border-teal-500 rounded-2xl text-left transition-all hover:shadow-md cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                    {sub.category}
                  </span>
                  <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {sub.name}
                  </h3>
                </div>
                <BookOpen className="w-5 h-5 text-slate-300 group-hover:text-teal-500 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Detailed browse screen */
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={() => {
                setSelectedSubject('');
                playFeedbackSound('click');
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Subject
            </button>
            <h2 className="text-lg font-extrabold text-teal-600 dark:text-teal-400">
              {SUBJECTS.find(s => s.id === selectedSubject)?.name} Practice
            </h2>
          </div>

          {/* Filtering row */}
          {!activeQuestion && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-850 focus:outline-none"
                >
                  <option value="All">All Years</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedDiff}
                  onChange={(e) => setSelectedDiff(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-850 focus:outline-none"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="flex items-center justify-end text-xs font-mono text-slate-400">
                Matched: {filteredQuestions.length} items
              </div>
            </div>
          )}

          {/* Practice modal / Active question overlay */}
          {activeQuestion ? (
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-lg relative space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span className="text-[10px] font-black px-2.5 py-1 bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 rounded-md">
                  {activeQuestion.topic}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleBookmark(activeQuestion.id)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500 rounded-lg transition-colors cursor-pointer"
                  >
                    <Bookmark className={`w-4 h-4 ${stats.bookmarks.includes(activeQuestion.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      setActiveQuestion(null);
                      playFeedbackSound('click');
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold rounded-lg transition-colors"
                  >
                    Return
                  </button>
                </div>
              </div>

              <p className="text-sm font-semibold leading-relaxed whitespace-pre-wrap">
                {activeQuestion.text}
              </p>

              {/* Formula and Diagrams */}
              {activeQuestion.formula && (
                <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg text-center font-mono text-xs text-teal-500 border border-slate-100 dark:border-slate-850">
                  {activeQuestion.formula}
                </div>
              )}

              {activeQuestion.diagram && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-xs text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-850 overflow-x-auto whitespace-pre">
                  {activeQuestion.diagram}
                </div>
              )}

              {/* Options list */}
              <div className="space-y-2">
                {activeQuestion.options.map((option, idx) => {
                  const label = ['A', 'B', 'C', 'D'][idx];
                  let choiceStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50';
                  
                  if (selectedOption === idx) {
                    choiceStyle = 'border-teal-500 bg-teal-50/20 text-teal-600 dark:text-teal-400';
                  }

                  if (isAnswered) {
                    if (idx === activeQuestion.correctAnswer) {
                      choiceStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400';
                    } else if (selectedOption === idx) {
                      choiceStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/10 text-rose-600 dark:text-rose-400';
                    } else {
                      choiceStyle = 'opacity-55 border-slate-100 dark:border-slate-900';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full p-3 text-left text-xs rounded-xl border flex items-center gap-3 transition-all ${choiceStyle}`}
                    >
                      <span className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        selectedOption === idx 
                          ? 'bg-teal-500 text-white' 
                          : isAnswered && idx === activeQuestion.correctAnswer 
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {label}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action and feedback */}
              {isAnswered && (
                <div className="p-3 bg-teal-50/20 dark:bg-teal-950/10 rounded-xl border border-teal-100/30">
                  <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1">Explanation</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">{activeQuestion.explanation}</p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                {!isAnswered ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={checkAnswer}
                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 text-xs cursor-pointer"
                  >
                    Check Correct Answer
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveQuestion(null);
                      playFeedbackSound('click');
                    }}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 text-white font-semibold rounded-xl transition-all text-xs cursor-pointer"
                  >
                    Return to List
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results grid list */
            <div className="space-y-3">
              {filteredQuestions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase font-black px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                            Year {q.year} • {q.difficulty}
                          </span>
                          <button
                            onClick={() => handleToggleBookmark(q.id)}
                            className="text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                          >
                            <Bookmark className={`w-4 h-4 ${stats.bookmarks.includes(q.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>
                        </div>
                        <p className="text-xs font-semibold leading-relaxed line-clamp-3">
                          {q.text}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/50 mt-3 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 truncate max-w-[150px]">
                          {q.topic}
                        </span>
                        <button
                          onClick={() => {
                            setActiveQuestion(q);
                            setIsAnswered(false);
                            setSelectedOption(null);
                            playFeedbackSound('click');
                          }}
                          className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/30 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400 font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3" />
                          Practice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-xs font-bold">No past questions matched the current filter combo.</p>
                  <p className="text-[10px] text-slate-400/80 mt-1">Try changing the year or difficulty level selectors.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
