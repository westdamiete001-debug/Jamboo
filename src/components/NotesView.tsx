/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserStats } from '../types';
import { SUBJECTS } from '../data/subjects';
import { getStudyNote, getSyllabusItem } from '../data/studyNotes';
import { 
  playFeedbackSound, 
  toggleTopicCompleted, 
  loadUserStats 
} from '../utils/localStorage';
import { 
  BookOpen, 
  Search, 
  CheckSquare, 
  Square, 
  ArrowLeft, 
  Bookmark, 
  Award, 
  ChevronRight, 
  FileText,
  HelpCircle,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface NotesViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onBack: () => void;
}

export default function NotesView({ stats, onUpdateStats, onBack }: NotesViewProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewSyllabusOnly, setViewSyllabusOnly] = useState(false);

  const handleToggleTopicCompleted = (subId: string, topicName: string) => {
    toggleTopicCompleted(subId, topicName);
    const updated = loadUserStats();
    onUpdateStats(updated);
    playFeedbackSound('success');
  };

  const getSubjectCompletions = (subId: string, topics: string[]) => {
    const completedCount = topics.filter(t => stats.completedTopics.includes(`${subId}:${t}`)).length;
    const percentage = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;
    return { count: completedCount, percentage };
  };

  const currentSubjectInfo = SUBJECTS.find(s => s.id === selectedSubject);

  // Search through subjects/topics
  const filteredSubjects = SUBJECTS.filter(s => {
    const nameMatch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const topicMatch = s.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return nameMatch || descMatch || topicMatch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-slate-800 dark:text-slate-100">
      {/* 1. Subjects Grid List */}
      {!selectedSubject && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Study Notes & Syllabus</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Read notes aligned with the official JAMB syllabus curriculum</p>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors font-bold"
            >
              Back
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects, topics, definitions, or syllabus targets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSubjects.map((sub) => {
              const { count, percentage } = getSubjectCompletions(sub.id, sub.topics);
              
              return (
                <div
                  key={sub.id}
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between hover:shadow-md hover:border-slate-200 dark:hover:border-slate-800 transition-all relative group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400">
                        {sub.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-500">
                        {percentage}% DONE
                      </span>
                    </div>

                    <h3 className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-2">
                      {sub.description}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-3 pt-4">
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {count} of {sub.topics.length} topics completed
                      </span>
                      <button
                        onClick={() => {
                          setSelectedSubject(sub.id);
                          setSelectedTopic('');
                          playFeedbackSound('click');
                        }}
                        className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/20 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400 font-bold rounded-lg transition-all text-xs flex items-center gap-1 cursor-pointer"
                      >
                        Read Notes
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Topics List Inside Selected Subject */}
      {selectedSubject && !selectedTopic && currentSubjectInfo && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedSubject('');
                playFeedbackSound('click');
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Subjects
            </button>
            <h2 className="text-lg font-extrabold text-teal-600 dark:text-teal-400">
              {currentSubjectInfo.name} Curriculum
            </h2>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500">Overall study completions for this course</p>
              <p className="text-lg font-extrabold text-emerald-500 mt-0.5">
                {getSubjectCompletions(currentSubjectInfo.id, currentSubjectInfo.topics).percentage}% Complete
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewSyllabusOnly(!viewSyllabusOnly)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  viewSyllabusOnly 
                    ? 'bg-teal-500 border-teal-500 text-white' 
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Syllabus Mode
              </button>
            </div>
          </div>

          {/* Topics List */}
          <div className="space-y-3">
            {currentSubjectInfo.topics.map((topic, index) => {
              const isCompleted = stats.completedTopics.includes(`${currentSubjectInfo.id}:${topic}`);
              const note = getStudyNote(currentSubjectInfo.id, topic);
              const syllabus = getSyllabusItem(currentSubjectInfo.id, topic);

              return (
                <div 
                  key={index}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl hover:border-slate-200 dark:hover:border-slate-800 transition-all flex items-start gap-4"
                >
                  <button
                    onClick={() => handleToggleTopicCompleted(currentSubjectInfo.id, topic)}
                    className="p-1.5 text-teal-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                  >
                    {isCompleted ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-300" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {topic}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-2">
                      {viewSyllabusOnly ? syllabus.objectives.join(' ') : note.definition}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTopic(topic);
                      playFeedbackSound('click');
                    }}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-all text-[11px] cursor-pointer"
                  >
                    View Detail
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Detailed Study Note View */}
      {selectedSubject && selectedTopic && currentSubjectInfo && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <button
              onClick={() => {
                setSelectedTopic('');
                playFeedbackSound('click');
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Syllabus List
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleTopicCompleted(currentSubjectInfo.id, selectedTopic)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors font-bold text-xs"
              >
                {stats.completedTopics.includes(`${currentSubjectInfo.id}:${selectedTopic}`) ? (
                  <>
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    Mark Uncompleted
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 text-slate-300" />
                    Mark as Completed
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Heading */}
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400">
              {currentSubjectInfo.name} • Topics Notes
            </span>
            <h1 className="text-xl font-extrabold tracking-tight mt-0.5">
              {selectedTopic}
            </h1>
          </div>

          {/* Render definitions */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-teal-500">
              <FileText className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Concept Definition</h3>
            </div>
            <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
              {getStudyNote(currentSubjectInfo.id, selectedTopic).definition}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
              {getStudyNote(currentSubjectInfo.id, selectedTopic).content}
            </p>
          </div>

          {/* Syllabus Objectives */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-teal-500">
              <Award className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Syllabus Objectives</h3>
            </div>
            <ul className="list-disc pl-5 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
              {getSyllabusItem(currentSubjectInfo.id, selectedTopic).objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          {/* Worked Examples */}
          {getStudyNote(currentSubjectInfo.id, selectedTopic).examples.length > 0 && (
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-500">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Worked Exam Examples</h3>
              </div>
              <div className="space-y-3">
                {getStudyNote(currentSubjectInfo.id, selectedTopic).examples.map((ex, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-2 border border-slate-100 dark:border-slate-850">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Problem {i + 1}: {ex.problem}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed font-semibold">
                      Solution: {ex.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam Tips and Common Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50/50 dark:bg-amber-950/15 border border-amber-100/50 dark:border-amber-950/40 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                Preparation Tips
              </div>
              <ul className="list-disc pl-5 text-xs text-slate-500 dark:text-slate-300 space-y-1">
                {getStudyNote(currentSubjectInfo.id, selectedTopic).tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-rose-50/50 dark:bg-rose-950/15 border border-rose-100/50 dark:border-rose-950/40 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                Common Mistakes
              </div>
              <ul className="list-disc pl-5 text-xs text-slate-500 dark:text-slate-300 space-y-1">
                {getStudyNote(currentSubjectInfo.id, selectedTopic).commonMistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key points & FAQ */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-teal-500">
              <HelpCircle className="w-5 h-5 text-teal-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Frequently Asked Questions</h3>
            </div>
            <div className="space-y-3.5">
              {getStudyNote(currentSubjectInfo.id, selectedTopic).faqs.map((faq, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Q: {faq.q}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    A: {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
