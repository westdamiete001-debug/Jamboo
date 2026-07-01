/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Question, ExamHistory, UserStats, SubjectInfo } from '../types';
import { SUBJECTS } from '../data/subjects';
import { generateQuestionsForSubject } from '../data/questions';
import { playFeedbackSound } from '../utils/localStorage';
import Calculator from './Calculator';
import { 
  Clock, 
  HelpCircle, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  Calculator as CalcIcon, 
  AlertTriangle, 
  CheckSquare 
} from 'lucide-react';

interface CbtEngineProps {
  stats: UserStats;
  onFinishExam: (result: ExamHistory) => void;
  onBack: () => void;
}

export default function CbtEngine({ stats, onFinishExam, onBack }: CbtEngineProps) {
  // Setup state: Select Subjects or Exam Active
  const [examStarted, setExamStarted] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['english']); // English always compulsory
  const [examDuration, setExamDuration] = useState<number>(stats.settings.timerDuration); // in minutes
  
  // Active Exam state
  const [questionsMap, setQuestionsMap] = useState<{ [subjectId: string]: Question[] }>({});
  const [activeSubject, setActiveSubject] = useState<string>('english');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  
  // Answers mapping: { questionId: selectedOptionIndex }
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-compulsory English check
  const toggleSubjectSelect = (subId: string) => {
    if (subId === 'english') return; // Cannot deselect English
    
    setSelectedSubjects(prev => {
      if (prev.includes(subId)) {
        playFeedbackSound('click');
        return prev.filter(id => id !== subId);
      } else {
        if (prev.length >= 4) {
          playFeedbackSound('alert');
          return prev; // Maximum 4 subjects
        }
        playFeedbackSound('click');
        return [...prev, subId];
      }
    });
  };

  // Start CBT Exam
  const handleStartExam = () => {
    if (selectedSubjects.length < 4) {
      playFeedbackSound('alert');
      alert('You must select exactly 4 subjects for a realistic JAMB CBT Mock exam (English is compulsory).');
      return;
    }

    // Populate question database
    const newQuestionsMap: { [subjectId: string]: Question[] } = {};
    selectedSubjects.forEach(subId => {
      // JAMB mock has 40 questions per subject (English may have 60, we standardize to 40 for speed & completeness)
      const count = subId === 'english' ? 40 : 40;
      newQuestionsMap[subId] = generateQuestionsForSubject(subId, count);
    });

    setQuestionsMap(newQuestionsMap);
    setActiveSubject('english');
    setActiveIndex(0);
    setAnswers({});
    setFlaggedQuestions([]);
    setTimeLeft(examDuration * 60);
    setExamStarted(true);
    playFeedbackSound('submit');
  };

  // Timer loop
  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (examStarted && timeLeft === 0) {
      // Auto-submit when timer expires
      triggerSubmission(true);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [examStarted, timeLeft]);

  // Format time (HH:MM:SS)
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Answer choosing
  const handleChooseAnswer = (optionIdx: number) => {
    const activeQuestions = questionsMap[activeSubject] || [];
    const currentQ = activeQuestions[activeIndex];
    if (!currentQ) return;

    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIdx
    }));
    playFeedbackSound('click');
  };

  // Toggle flag
  const toggleFlagActiveQuestion = () => {
    const activeQuestions = questionsMap[activeSubject] || [];
    const currentQ = activeQuestions[activeIndex];
    if (!currentQ) return;

    setFlaggedQuestions(prev => {
      if (prev.includes(currentQ.id)) {
        return prev.filter(id => id !== currentQ.id);
      } else {
        return [...prev, currentQ.id];
      }
    });
    playFeedbackSound('click');
  };

  // Next/Prev Navigation
  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      playFeedbackSound('click');
    }
  };

  const handleNext = () => {
    const activeQuestions = questionsMap[activeSubject] || [];
    if (activeIndex < activeQuestions.length - 1) {
      setActiveIndex(activeIndex + 1);
      playFeedbackSound('click');
    }
  };

  // Core Evaluation and submission
  const triggerSubmission = (isAuto = false) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    playFeedbackSound('submit');

    // Build statistics
    let totalCorrect = 0;
    let totalQuestions = 0;
    const subjectScores: ExamHistory['subjectScores'] = {};
    const topicBreakdown: ExamHistory['topicBreakdown'] = {};

    selectedSubjects.forEach(subId => {
      const qList = questionsMap[subId] || [];
      let subCorrect = 0;
      let subWrong = 0;
      let subUnanswered = 0;

      qList.forEach(q => {
        totalQuestions += 1;
        const chosen = answers[q.id];
        
        if (!topicBreakdown[q.topic]) {
          topicBreakdown[q.topic] = { correct: 0, total: 0 };
        }
        topicBreakdown[q.topic].total += 1;

        if (chosen === undefined) {
          subUnanswered += 1;
        } else if (chosen === q.correctAnswer) {
          subCorrect += 1;
          totalCorrect += 1;
          topicBreakdown[q.topic].correct += 1;
        } else {
          subWrong += 1;
        }
      });

      subjectScores[subId] = {
        score: Math.round((subCorrect / qList.length) * 100),
        total: qList.length,
        correct: subCorrect,
        wrong: subWrong,
        unanswered: subUnanswered
      };
    });

    const finalPercent = Math.round((totalCorrect / totalQuestions) * 100);
    const timeUsed = (examDuration * 60) - timeLeft;

    const historyItem: ExamHistory = {
      id: `exam-${Date.now()}`,
      type: 'Mock',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      subjects: [...selectedSubjects],
      duration: examDuration * 60,
      timeTaken: timeUsed,
      score: finalPercent,
      subjectScores,
      topicBreakdown
    };

    onFinishExam(historyItem);
  };

  // --- RENDERING CONFIGURATION STAGE ---
  if (!examStarted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 text-slate-800 dark:text-slate-100 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">CBT Mock Examination Setup</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Replicate the official Joint Admissions and Matriculation Board (JAMB) computer-based experience.
          </p>
        </div>

        {/* COMPULSORY & SELECTED METRIC PANEL */}
        <div className="p-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 rounded-2xl">
          <h3 className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">Selected Subjects ({selectedSubjects.length} / 4)</h3>
          <p className="text-xs text-slate-500 dark:text-teal-300 leading-relaxed mb-4">
            Under official JAMB criteria, <strong className="text-teal-600 dark:text-teal-400">Use of English</strong> is compulsory. You must pick exactly <strong className="text-teal-600 dark:text-teal-400">three other subjects</strong> to begin the mock.
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSubjects.map(subId => (
              <span 
                key={subId} 
                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 rounded-xl text-xs font-bold text-teal-600 dark:text-teal-400 shadow-sm capitalize"
              >
                {SUBJECTS.find(s => s.id === subId)?.name}
              </span>
            ))}
          </div>
        </div>

        {/* TIMER CONFIG */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Exam duration</h3>
          <div className="flex gap-2">
            {[60, 90, 120, 180].map(mins => (
              <button
                key={mins}
                onClick={() => {
                  setExamDuration(mins);
                  playFeedbackSound('click');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                  examDuration === mins
                    ? 'bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-500/10'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850 text-slate-500 hover:text-slate-800'
                }`}
              >
                {mins} Mins
              </button>
            ))}
          </div>
        </div>

        {/* 25 SUBJECTS SELECTOR LIST */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Available Subjects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {SUBJECTS.map(sub => {
              const isSelected = selectedSubjects.includes(sub.id);
              const isDisabled = sub.id === 'english';
              
              return (
                <button
                  key={sub.id}
                  disabled={isDisabled}
                  onClick={() => toggleSubjectSelect(sub.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all text-xs flex justify-between items-center ${
                    isSelected
                      ? 'bg-teal-50 border-teal-400 text-teal-700 dark:bg-teal-950/20 dark:border-teal-900 dark:text-teal-400 font-bold shadow-sm'
                      : 'bg-white border-slate-100 hover:border-slate-200 dark:bg-slate-900 dark:border-slate-800/80 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate pr-1">{sub.name}</span>
                  {isSelected && (
                    <span className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 bg-teal-500 text-white rounded">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex justify-between items-center pt-4">
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all font-bold text-xs"
          >
            Back
          </button>
          <button
            onClick={handleStartExam}
            disabled={selectedSubjects.length < 4}
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-500/10 text-xs flex items-center gap-2 cursor-pointer"
          >
            Launch CBT Mock Exam
          </button>
        </div>
      </div>
    );
  }

  // --- ACTIVE EXAM STAGE ---
  const activeQuestions = questionsMap[activeSubject] || [];
  const currentQ = activeQuestions[activeIndex];
  const isQuestionAnswered = currentQ && answers[currentQ.id] !== undefined;
  const isQuestionFlagged = currentQ && flaggedQuestions.includes(currentQ.id);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 select-none">
      {/* 1. Header with details and Timer */}
      <header className="bg-slate-900 text-white px-4 py-3.5 flex justify-between items-center border-b border-slate-800 shrink-0 shadow-md">
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-teal-400">Jamboo CBT</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Unified Tertiary Matriculation Mock</p>
        </div>

        {/* Countdown clock */}
        <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl">
          <Clock className="w-4 h-4 text-pink-500 animate-pulse shrink-0" />
          <span className="font-mono text-sm font-bold tracking-widest text-emerald-400">
            {formatTime(timeLeft)}
          </span>
        </div>
      </header>

      {/* 2. TAB CONTROLLER FOR THE 4 SUBJECTS */}
      <nav className="bg-slate-800 px-2.5 py-2 flex gap-1.5 overflow-x-auto border-b border-slate-700 shrink-0 scrollbar-none">
        {selectedSubjects.map(subId => {
          const isActive = activeSubject === subId;
          const label = SUBJECTS.find(s => s.id === subId)?.name || subId;
          
          return (
            <button
              key={subId}
              onClick={() => {
                setActiveSubject(subId);
                setActiveIndex(0);
                playFeedbackSound('click');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-teal-500 text-white shadow' 
                  : 'bg-slate-900/60 text-slate-300 hover:text-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* 3. MAIN WORKSPACE GRID */}
      <main className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Left side: Question Body */}
        <section className="lg:col-span-3 space-y-4">
          {currentQ ? (
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm space-y-4 relative">
              
              {/* Question Header */}
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400">
                    {activeSubject.toUpperCase()} • QUESTION {activeIndex + 1}
                  </span>
                  <span className="block text-[9px] text-slate-400">
                    Topic: {currentQ.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Flag button */}
                  <button
                    onClick={toggleFlagActiveQuestion}
                    className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-[10px] font-bold cursor-pointer ${
                      isQuestionFlagged
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/20 text-amber-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${isQuestionFlagged ? 'fill-amber-500' : ''}`} />
                    Flag Question
                  </button>
                </div>
              </div>

              {/* Question body */}
              <p className="text-sm font-semibold leading-relaxed whitespace-pre-wrap">
                {currentQ.text}
              </p>

              {/* Mathematics/Physics parameters */}
              {currentQ.formula && (
                <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl text-center font-mono text-xs text-teal-500 border border-slate-100 dark:border-slate-850">
                  {currentQ.formula}
                </div>
              )}

              {currentQ.diagram && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-[10px] text-slate-500 border border-slate-100 dark:border-slate-850 overflow-x-auto whitespace-pre">
                  {currentQ.diagram}
                </div>
              )}

              {/* Options mapping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentQ.options.map((option, idx) => {
                  const label = ['A', 'B', 'C', 'D'][idx];
                  const isSelected = answers[currentQ.id] === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleChooseAnswer(idx)}
                      className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/30 text-teal-600 dark:text-teal-400 font-bold'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        isSelected 
                          ? 'bg-teal-500 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {label}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No questions found for this subject.
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center">
            <button
              disabled={activeIndex === 0}
              onClick={handlePrev}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:bg-slate-800 disabled:opacity-40 rounded-xl transition-all font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Quick access scientific calculator toggle */}
            <button
              onClick={() => {
                setShowCalc(!showCalc);
                playFeedbackSound('click');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                showCalc
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow'
                  : 'bg-white hover:bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-850'
              }`}
            >
              <CalcIcon className="w-4 h-4 shrink-0" />
              Calculator
            </button>

            <button
              disabled={activeIndex === activeQuestions.length - 1}
              onClick={handleNext}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:bg-slate-800 disabled:opacity-40 rounded-xl transition-all font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Right side: Interactive Palette Grid & Submit details */}
        <section className="space-y-4">
          
          {/* Palette info */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Questions Palette</h4>
            
            <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-5 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {activeQuestions.map((q, idx) => {
                const isAns = answers[q.id] !== undefined;
                const isFlg = flaggedQuestions.includes(q.id);
                const isAct = idx === activeIndex;

                let btnClass = 'bg-slate-100 text-slate-500 dark:bg-slate-950 dark:text-slate-400';
                if (isAns) btnClass = 'bg-teal-500 text-white';
                if (isFlg) btnClass = 'bg-amber-500 text-white';
                if (isAct) btnClass = 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 font-black';

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveIndex(idx);
                      playFeedbackSound('click');
                    }}
                    className={`aspect-square rounded-lg text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Colors description legend */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50 grid grid-cols-3 gap-1 text-[9px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-teal-500 shrink-0" /> Answered</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500 shrink-0" /> Flagged</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0" /> Open</span>
            </div>
          </div>

          {/* Core manual submit block */}
          <button
            onClick={() => {
              setShowSubmitModal(true);
              playFeedbackSound('click');
            }}
            className="w-full p-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold rounded-2xl shadow-lg shadow-teal-500/10 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckSquare className="w-4 h-4 shrink-0" />
            Finish & Submit Exam
          </button>
        </section>

      </main>

      {/* FLOATING CALCULATOR MODAL OVERLAY */}
      {showCalc && (
        <div className="fixed bottom-16 right-4 z-50">
          <Calculator onClose={() => setShowCalc(false)} isFloating />
        </div>
      )}

      {/* CONFIRM SUBMISSION POPUP */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl text-slate-800 dark:text-slate-100"
          >
            <div className="inline-flex p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-extrabold tracking-tight">Confirm Submission</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Are you sure you want to end this UTME session? Your final scoring matrix and correct options breakdown will render on the results board.
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  playFeedbackSound('click');
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => triggerSubmission(false)}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
              >
                Submit Mock
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
