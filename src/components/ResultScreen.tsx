/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ExamHistory } from '../types';
import { SUBJECTS } from '../data/subjects';
import { playFeedbackSound } from '../utils/localStorage';
import { 
  Trophy, 
  Clock, 
  HelpCircle, 
  Compass, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  ArrowRight, 
  ShieldAlert, 
  ThumbsUp,
  Activity
} from 'lucide-react';

interface ResultScreenProps {
  result: ExamHistory;
  onReturnHome: () => void;
  onPracticeAgain: () => void;
}

export default function ResultScreen({ result, onReturnHome, onPracticeAgain }: ResultScreenProps) {
  const percentage = result.score;
  
  // Grade definitions
  let grade = 'F';
  let feedTitle = 'Keep Practicing!';
  let feedDesc = 'Review your syllabus study notes and tackle more past questions to improve your score.';
  let feedbackStyle = 'bg-rose-50 border-rose-150 text-rose-700 dark:bg-rose-950/10 dark:border-rose-950 dark:text-rose-400';

  if (percentage >= 80) {
    grade = 'A';
    feedTitle = 'Exceptional Performance!';
    feedDesc = 'Outstanding mock simulation! You are fully equipped to achieve premium top-tier scaling on the official JAMB CBT.';
    feedbackStyle = 'bg-emerald-50 border-emerald-150 text-emerald-700 dark:bg-emerald-950/15 dark:border-emerald-950 dark:text-emerald-400';
  } else if (percentage >= 65) {
    grade = 'B';
    feedTitle = 'Great Score!';
    feedDesc = 'Very strong competence. Focus on isolating your minor weak sub-topics to secure a perfect result.';
    feedbackStyle = 'bg-teal-50 border-teal-150 text-teal-700 dark:bg-teal-950/10 dark:border-teal-950 dark:text-teal-400';
  } else if (percentage >= 50) {
    grade = 'C';
    feedTitle = 'Fair Progress!';
    feedDesc = 'Solid average footing. Regular reviews on worked examples and formulas will boost you past the 70% threshold.';
    feedbackStyle = 'bg-amber-50 border-amber-150 text-amber-700 dark:bg-amber-950/10 dark:border-amber-950 dark:text-amber-400';
  }

  // Calculate totals
  let totalCorrect = 0;
  let totalWrong = 0;
  let totalUnanswered = 0;

  Object.values(result.subjectScores).forEach(sub => {
    totalCorrect += sub.correct;
    totalWrong += sub.wrong;
    totalUnanswered += sub.unanswered;
  });

  const totalQuestions = totalCorrect + totalWrong + totalUnanswered;

  // Strength and Weakness separation
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  Object.entries(result.topicBreakdown).forEach(([topic, stats]) => {
    const topicPercent = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    if (topicPercent >= 70) {
      strengths.push(topic);
    } else if (topicPercent < 50) {
      weaknesses.push(topic);
    }
  });

  // Default recommendations based on performance
  const recommendations: string[] = [];
  if (weaknesses.length > 0) {
    recommendations.push(`Revise the fundamental definitions and parameters of "${weaknesses[0]}" inside the study notes.`);
    recommendations.push(`Take a focused 20-question practice test filtering specifically for ${weaknesses.length} weak areas.`);
  } else {
    recommendations.push('Maintain your revision schedule with daily mix quizzes to keep terms fresh.');
  }
  recommendations.push('Leverage the integrated calculator to double-check multi-step mathematical quotients.');

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 text-slate-800 dark:text-slate-100 space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Performance Summary</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Auto-saved result card for mock exam simulation</p>
        </div>
        <button
          onClick={() => {
            onReturnHome();
            playFeedbackSound('click');
          }}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-all"
        >
          Return Home
        </button>
      </div>

      {/* Hero grading banner */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row gap-5 items-center justify-between ${feedbackStyle}`}>
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-20 h-20 bg-white/20 dark:bg-slate-800/80 rounded-3xl flex items-center justify-center font-black text-4xl shadow-md border border-white/20">
            {grade}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold">{feedTitle}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed max-w-md">
              {feedDesc}
            </p>
          </div>
        </div>

        <div className="text-center md:text-right">
          <span className="block text-4xl font-black">{percentage}%</span>
          <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block mt-1">Average Score</span>
        </div>
      </div>

      {/* Metric details dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm">
          <span className="block text-xl font-black text-emerald-500">{totalCorrect}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5 block">Correct Answers</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm">
          <span className="block text-xl font-black text-rose-500">{totalWrong}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5 block">Wrong Answers</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm">
          <span className="block text-xl font-black text-slate-400">{totalUnanswered}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5 block">Unanswered</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm">
          <span className="block text-xl font-black">{Math.round(result.timeTaken / 60)} mins</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5 block">Time Spent</span>
        </div>
      </div>

      {/* Subject-by-Subject breakdowns */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
          <Compass className="w-4 h-4 text-teal-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject Breakdown</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(result.subjectScores).map(([subId, stats]) => {
            const sName = SUBJECTS.find(s => s.id === subId)?.name || subId;
            return (
              <div key={subId} className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="truncate pr-1">{sName}</span>
                  <span className={`${stats.score >= 70 ? 'text-emerald-500' : stats.score >= 50 ? 'text-teal-500' : 'text-rose-500'}`}>{stats.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      stats.score >= 70 ? 'bg-emerald-500' : stats.score >= 50 ? 'bg-teal-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${stats.score}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Correct: {stats.correct}</span>
                  <span>Wrong: {stats.wrong}</span>
                  <span>Left: {stats.unanswered}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs uppercase tracking-wider">
            <ThumbsUp className="w-4 h-4" />
            Core Strengths ({strengths.length})
          </div>
          {strengths.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-300">
              {strengths.slice(0, 3).map((s, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-black">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">Keep practicing to build your score benchmarks.</p>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center gap-1 text-rose-500 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            Attention Needed ({weaknesses.length})
          </div>
          {weaknesses.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-300">
              {weaknesses.slice(0, 3).map((w, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-black">!</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-500 font-medium">Excellent! No severe weak-topics noted.</p>
          )}
        </div>

      </div>

      {/* Custom actionable feedback recommendations */}
      <div className="p-4 bg-teal-50/40 dark:bg-teal-950/15 rounded-2xl border border-teal-150/40 dark:border-teal-900/30 space-y-3">
        <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1">
          <Activity className="w-4 h-4" />
          Improvement Suggestions
        </h4>
        <ul className="list-disc pl-5 text-xs text-slate-500 dark:text-slate-300 space-y-1.5 leading-relaxed">
          {recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* Footer trigger buttons */}
      <div className="flex gap-3 justify-center pt-2">
        <button
          onClick={() => {
            onPracticeAgain();
            playFeedbackSound('click');
          }}
          className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-bold text-xs"
        >
          Practice Again
        </button>
        <button
          onClick={() => {
            onReturnHome();
            playFeedbackSound('click');
          }}
          className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-500/10 text-xs"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
