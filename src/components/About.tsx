/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Info, Shield, Scale, Mail, GitBranch, ArrowLeft, GraduationCap } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export default function About({ onBack }: AboutProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 text-slate-800 dark:text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-teal-500" />
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">About Jamboo</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Version 1.0.0 (Offline Stable Edition)</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors font-bold"
        >
          Back
        </button>
      </div>

      {/* Brand card */}
      <div className="p-5 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shrink-0 shadow-lg shadow-teal-500/20">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-sm font-black">Jamboo CBT</h3>
          <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
            A premium, lightweight, offline-first Unified Tertiary Matriculation Examination (UTME) practice suite designed for Nigerian students.
          </p>
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-3">
        <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          Privacy Policy
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
          <p>
            <strong>Zero Registration:</strong> Jamboo does not require you to sign up, log in, or verify emails or phone numbers. You can start practicing instantly.
          </p>
          <p>
            <strong>100% Client-Side Storage:</strong> Every action including mock scores, study streaks, syllabus checkmarks, and bookmarks is saved strictly on your local physical device. We have no remote analytics tracking or cloud databases.
          </p>
          <p>
            <strong>Data Exportability:</strong> You can export a secure JSON backup of your historical results and streaks, or wipe your entire application cache instantly under the Settings menu.
          </p>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-3">
        <div className="flex items-center gap-1.5 text-indigo-500 font-bold text-xs uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          Terms & Conditions
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
          <p>
            <strong>Educational Purposes Only:</strong> Jamboo is designed strictly to facilitate student training, exam pacing, and concepts review.
          </p>
          <p>
            <strong>Official Endorsement Disclaimer:</strong> Jamboo is an independent private educational tool and is **NOT** affiliated with, sponsored by, or endorsed by the Joint Admissions and Matriculation Board (JAMB).
          </p>
          <p>
            <strong>No Guarantee of Scores:</strong> Scores achieved during simulated practice sessions do not offer legal or formal warranties of actual UTME or tertiary screening results.
          </p>
        </div>
      </div>

      {/* Future Roadmap */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-3">
        <div className="flex items-center gap-1.5 text-pink-500 font-bold text-xs uppercase tracking-wider">
          <GitBranch className="w-4 h-4" />
          Future Roadmap
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The Jamboo modular framework is designed to seamlessly integrate additional secondary school past questions and resources in future updates, including:
        </p>
        <ul className="list-disc pl-5 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <li>WAEC Senior Secondary Examination CBT modules</li>
          <li>NECO SSCE Mock exams</li>
          <li>Post-UTME University screening suites</li>
          <li>Nigerian Federal/State Scholarship past questions</li>
        </ul>
      </div>

      {/* Contact Placeholder */}
      <div className="p-4 bg-teal-50/40 dark:bg-teal-950/15 rounded-2xl border border-teal-150/40 dark:border-teal-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-teal-300">
          <Mail className="w-4 h-4" />
          <span>Need support or content clarification?</span>
        </div>
        <a 
          href="mailto:support@jambooapp.edu.ng"
          className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
        >
          support@jambooapp.edu.ng
        </a>
      </div>
    </div>
  );
}
