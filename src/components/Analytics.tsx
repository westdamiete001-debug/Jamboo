/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { UserStats } from '../types';
import { SUBJECTS } from '../data/subjects';
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  Clock, 
  CheckCircle, 
  Target, 
  Award, 
  Compass, 
  Activity 
} from 'lucide-react';

interface AnalyticsProps {
  stats: UserStats;
  onBack: () => void;
}

export default function Analytics({ stats, onBack }: AnalyticsProps) {
  const history = stats.history || [];
  const totalCompleted = history.length;
  const mockCompleted = history.filter(h => h.type === 'Mock').length;
  const practiceCompleted = history.filter(h => h.type === 'Practice').length;

  // Calculate high/low/average scores
  let highestScore = 0;
  let lowestScore = 0;
  let averageScore = 0;
  
  if (totalCompleted > 0) {
    const scores = history.map(h => h.score);
    highestScore = Math.max(...scores);
    lowestScore = Math.min(...scores);
    averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalCompleted);
  }

  // Format study hours
  const hoursSpent = (stats.totalTimeSpent / 3600).toFixed(1);

  // Subject scores tracking
  const subjectAverages: { [key: string]: { sum: number; count: number } } = {};
  history.forEach(h => {
    Object.entries(h.subjectScores).forEach(([subId, detail]) => {
      if (!subjectAverages[subId]) {
        subjectAverages[subId] = { sum: 0, count: 0 };
      }
      subjectAverages[subId].sum += (detail.score / (detail.total || 1)) * 100;
      subjectAverages[subId].count += 1;
    });
  });

  const subjectRows = SUBJECTS.map(s => {
    const data = subjectAverages[s.id];
    const avg = data ? Math.round(data.sum / data.count) : 0;
    const isMastered = avg >= 70 ? 'Expert' : avg >= 50 ? 'Intermediate' : 'Beginner';
    return { name: s.name, avg, status: isMastered, count: data?.count || 0 };
  }).filter(r => r.count > 0);

  // Draw customized SVG line chart for performance trend
  const renderTrendChart = () => {
    if (history.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-400 border border-slate-100 dark:border-slate-850 h-48">
          <TrendingUp className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-xs">No exam scores available to draw visual improvement graphs yet.</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Your scores will map here chronologically.</p>
        </div>
      );
    }

    // Chart dimensions
    const width = 500;
    const height = 180;
    const padding = 30;

    const chartPoints = [...history].reverse(); // Oldest to newest
    const maxIndex = chartPoints.length - 1 || 1;

    // Calculate (x, y) coordinates for dots
    const points = chartPoints.map((h, idx) => {
      const x = padding + (idx / maxIndex) * (width - padding * 2);
      const y = height - padding - (h.score / 100) * (height - padding * 2);
      return { x, y, score: h.score, date: h.date };
    });

    // Create polyline string
    const polylinePath = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
      <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-teal-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Score Improvement Trend</h4>
          </div>
          <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">
            Latest: {history[0].score}%
          </span>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[320px] overflow-visible">
            {/* Horizontal Grid lines */}
            {[0, 25, 50, 75, 100].map((val, idx) => {
              const y = height - padding - (val / 100) * (height - padding * 2);
              return (
                <g key={idx}>
                  <line 
                    x1={padding} 
                    y1={y} 
                    x2={width - padding} 
                    y2={y} 
                    className="stroke-slate-100 dark:stroke-slate-800" 
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  <text 
                    x={padding - 10} 
                    y={y + 3} 
                    className="fill-slate-400 font-mono text-[9px] text-right"
                    textAnchor="end"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Line connecting points */}
            {points.length > 1 && (
              <polyline
                fill="none"
                stroke="url(#chart-grad)"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylinePath}
              />
            )}

            {/* SVG Gradient definition */}
            <defs>
              <linearGradient id="chart-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Render Circular points */}
            {points.map((p, idx) => (
              <g key={idx} className="group cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  className="fill-teal-500 dark:fill-teal-400 stroke-white dark:stroke-slate-900"
                  strokeWidth={2}
                />
                {/* Tooltip on top */}
                <text
                  x={p.x}
                  y={p.y - 10}
                  className="fill-slate-700 dark:fill-slate-300 font-mono text-[9px] font-bold"
                  textAnchor="middle"
                >
                  {p.score}%
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-6 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Performance Analytics</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Track and review study consistency and topic mastery</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors font-bold"
        >
          Back
        </button>
      </div>

      {/* Main stats card grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 shrink-0">
            <Flame className="w-5 h-5 fill-teal-500 text-teal-500" />
          </div>
          <div>
            <span className="block text-xl font-black">{stats.streak} days</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Study Streak</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 shrink-0">
            <Clock className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <span className="block text-xl font-black">{hoursSpent} hrs</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Time Studied</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 shrink-0">
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <span className="block text-xl font-black">{stats.totalQuestionsAnswered}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Questions Solved</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 shrink-0">
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <span className="block text-xl font-black">{averageScore}%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Average Score</span>
          </div>
        </div>
      </div>

      {/* SVG Trend Chart */}
      {renderTrendChart()}

      {/* Grid of details: History & Course Mastery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Subject performance lists */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-teal-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject Mastery Index</h4>
          </div>

          {subjectRows.length > 0 ? (
            <div className="space-y-3">
              {subjectRows.map((r, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>{r.name}</span>
                    <span className="text-teal-600 dark:text-teal-400 font-mono">{r.avg}% Avg</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        r.avg >= 70 ? 'bg-emerald-500' : r.avg >= 50 ? 'bg-teal-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${r.avg}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No historical scores found. Start Subject Practice or full Mocks to view stats.
            </div>
          )}
        </div>

        {/* History Score Logs */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-teal-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Examinations</h4>
          </div>

          {history.length > 0 ? (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {history.map((h) => (
                <div 
                  key={h.id}
                  className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-slate-200 dark:bg-slate-850 text-slate-500 rounded-md">
                      {h.type}
                    </span>
                    <p className="text-xs font-semibold mt-1">
                      {h.subjects.map(s => s.toUpperCase()).join(' • ')}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {h.date} • {Math.round(h.timeTaken / 60)} mins
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`text-base font-black ${h.score >= 70 ? 'text-emerald-500' : h.score >= 50 ? 'text-teal-500' : 'text-rose-500'}`}>
                      {h.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              Your completed tests and mock certificates will log here.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
