/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Question, UserStats } from '../types';
import { generateQuestionsForSubject } from '../data/questions';
import { playFeedbackSound, saveUserStats, updateStudyStreak } from '../utils/localStorage';
import { 
  Trophy, 
  ArrowRight, 
  Award, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Lightbulb 
} from 'lucide-react';

interface DailyQuizProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onBack: () => void;
}

export default function DailyQuizView({ stats, onUpdateStats, onBack }: DailyQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [dateStr] = useState(() => new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

  useEffect(() => {
    // Generate 5 questions for today's quiz
    // We pick subjects like English, Mathematics, Biology, Chemistry, Physics randomly for the daily mix
    const quizSubjects = ['english', 'mathematics', 'physics', 'chemistry', 'biology'];
    const selectedSubject = quizSubjects[new Date().getDay() % quizSubjects.length];
    const generated = generateQuestionsForSubject(selectedSubject, 5);
    setQuestions(generated);
  }, []);

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    
    setIsAnswered(true);
    const correct = selectedOption === questions[currentIndex].correctAnswer;
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
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      playFeedbackSound('click');
    } else {
      // Quiz completed! Save history and update streak
      setQuizCompleted(true);
      playFeedbackSound('submit');
      
      const todayDate = new Date().toLocaleDateString('en-CA');
      const updatedStats = { ...stats };
      updatedStats.totalQuestionsAnswered += questions.length;
      
      onUpdateStats(updatedStats);
      saveUserStats(updatedStats);
      updateStudyStreak();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    playFeedbackSound('click');
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-slate-400">
        <p className="text-sm">Preparing today's daily challenge...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto px-4 py-6 text-slate-800 dark:text-slate-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-500" />
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Daily Quiz</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">{dateStr}</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors font-bold"
        >
          Back
        </button>
      </div>

      {!quizCompleted ? (
        <div className="space-y-6">
          {/* Question card */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
            {/* Top Info */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-full">
                {currentQuestion.subject.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-base font-medium leading-relaxed mb-4 whitespace-pre-wrap">
              {currentQuestion.text}
            </h3>

            {/* Scientific details if present */}
            {currentQuestion.formula && (
              <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-center font-mono text-xs text-teal-600 dark:text-teal-400 border border-slate-100 dark:border-slate-800 mb-4">
                {currentQuestion.formula}
              </div>
            )}

            {/* Options list */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx];
                let btnStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50';
                
                if (selectedOption === idx) {
                  btnStyle = 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400';
                }

                if (isAnswered) {
                  if (idx === currentQuestion.correctAnswer) {
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
                    className={`w-full p-3.5 text-left text-sm rounded-xl border transition-all flex items-center gap-3 ${btnStyle}`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                      selectedOption === idx 
                        ? 'bg-teal-500 text-white' 
                        : isAnswered && idx === currentQuestion.correctAnswer 
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {label}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isAnswered && idx === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {isAnswered && selectedOption === idx && idx !== currentQuestion.correctAnswer && (
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
              className="p-4 bg-teal-50/40 dark:bg-teal-950/10 border border-teal-100/50 dark:border-teal-900/30 rounded-2xl"
            >
              <div className="flex items-center gap-2 mb-2 text-teal-600 dark:text-teal-400">
                <Lightbulb className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold tracking-wider uppercase">Detailed Explanation</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}

          {/* Action button */}
          <div className="flex justify-end pt-2">
            {!isAnswered ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-teal-500/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl text-center space-y-6"
        >
          <div className="inline-flex p-4 rounded-3xl bg-teal-50 dark:bg-teal-950/30 text-teal-500 mb-2">
            <Trophy className="w-12 h-12" />
          </div>
          
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight">Challenge Completed!</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Excellent practice. Your scores are saved locally.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="block text-2xl font-black text-teal-500">{score} / 5</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5 block">Score</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="block text-2xl font-black text-amber-500">+{score * 20}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5 block">XP Gained</span>
            </div>
          </div>

          {score >= 4 ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 border border-emerald-100/50">
              <Award className="w-4 h-4" />
              UTME Mastery Level: Highly Competent!
            </div>
          ) : (
            <div className="p-3 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-lg">
              Practice makes perfect. Revise your notes or retry.
            </div>
          )}

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors font-bold text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              Practice Again
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-all font-bold text-xs shadow-lg shadow-teal-500/10"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
