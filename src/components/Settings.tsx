/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { UserStats, UserSettings } from '../types';
import { 
  loadUserStats, 
  saveUserStats, 
  initializeStats, 
  playFeedbackSound 
} from '../utils/localStorage';
import { 
  Volume2, 
  VolumeX, 
  Type, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Moon, 
  Sun, 
  Clock 
} from 'lucide-react';

interface SettingsProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onBack: () => void;
}

export default function Settings({ stats, onUpdateStats, onBack }: SettingsProps) {
  const [settings, setSettings] = useState<UserSettings>(stats.settings);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    const updatedStats = { ...stats, settings: updated };
    onUpdateStats(updatedStats);
    saveUserStats(updatedStats);
    playFeedbackSound('click');

    // Trigger theme classes on body
    if (key === 'theme' || key === 'highContrast') {
      applyThemeSettings(updated);
    }
  };

  // Utility to apply global CSS theme settings
  const applyThemeSettings = (s: UserSettings) => {
    const root = document.documentElement;
    root.classList.remove('dark', 'high-contrast');
    
    if (s.theme === 'dark' || (s.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    }
    if (s.highContrast) {
      root.classList.add('high-contrast');
    }
  };

  // Backup & Export Progress
  const handleExportBackup = () => {
    try {
      const currentStats = loadUserStats();
      const blob = new Blob([JSON.stringify(currentStats, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `jamboo_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      playFeedbackSound('success');
      showTemporaryMsg('Backup exported successfully!');
    } catch (e) {
      showTemporaryMsg('Error exporting backup.');
    }
  };

  // Import Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as UserStats;
        
        if (parsed && typeof parsed.streak === 'number' && Array.isArray(parsed.history)) {
          saveUserStats(parsed);
          onUpdateStats(parsed);
          playFeedbackSound('success');
          showTemporaryMsg('Backup imported and applied successfully!');
          applyThemeSettings(parsed.settings);
        } else {
          showTemporaryMsg('Invalid backup file format.');
        }
      } catch (err) {
        showTemporaryMsg('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  const showTemporaryMsg = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Hard Reset
  const handleResetAll = () => {
    const cleanStats = initializeStats();
    onUpdateStats(cleanStats);
    setSettings(cleanStats.settings);
    applyThemeSettings(cleanStats.settings);
    setResetConfirm(false);
    playFeedbackSound('alert');
    showTemporaryMsg('All progress reset successfully.');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 py-6 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configure your JAMB prep interface preferences</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
        >
          Back
        </button>
      </div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-2 border border-emerald-200/50"
        >
          <Check className="w-4 h-4" />
          {successMsg}
        </motion.div>
      )}

      {/* Theme and High Contrast */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Appearance</h3>
        
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <Sun className="w-5 h-5 text-teal-500" />
            <div>
              <p className="text-sm font-medium">Visual Theme</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Light, dark, or system matches</p>
            </div>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => updateSetting('theme', t)}
                className={`px-3 py-1 text-xs capitalize font-medium rounded-md transition-all ${
                  settings.theme === t
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-sm font-medium">High Contrast Mode</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Optimizes text outline and margins</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('highContrast', !settings.highContrast)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
              settings.highContrast ? 'bg-teal-500 justify-end' : 'bg-slate-300 dark:bg-slate-800 justify-start'
            }`}
          >
            <motion.div layout className="w-4 h-4 bg-white rounded-full shadow" />
          </button>
        </div>
      </div>

      {/* Typography preferences */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Typography & Layout</h3>

        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-sm font-medium">Font Family</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Select standard reading typeface</p>
            </div>
          </div>
          <select
            value={settings.fontFamily}
            onChange={(e) => updateSetting('fontFamily', e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <option value="Inter">Inter (Sans-Serif)</option>
            <option value="Space Grotesk">Space Grotesk (Tech)</option>
            <option value="JetBrains Mono">JetBrains Mono (Technical)</option>
            <option value="Outfit">Outfit (Rounded)</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-teal-500" />
            <div>
              <p className="text-sm font-medium">Text Scale Size</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Enlarge text for easy reading</p>
            </div>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
            {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => updateSetting('fontSize', sz)}
                className={`px-3 py-1 text-xs uppercase font-bold rounded-md transition-all ${
                  settings.fontSize === sz
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sound and CBT Timer */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Sounds & Timer</h3>

        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-500" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            <div>
              <p className="text-sm font-medium">Action Sound Effects</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Play micro-tones on click, submit, or success</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
              settings.soundEnabled ? 'bg-teal-500 justify-end' : 'bg-slate-300 dark:bg-slate-800 justify-start'
            }`}
          >
            <motion.div layout className="w-4 h-4 bg-white rounded-full shadow" />
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-pink-500" />
            <div>
              <p className="text-sm font-medium">Default CBT Exam Timer</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Duration in minutes for mock trials</p>
            </div>
          </div>
          <select
            value={settings.timerDuration}
            onChange={(e) => updateSetting('timerDuration', Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <option value={60}>60 minutes (1 hour)</option>
            <option value={90}>90 minutes (1.5 hours)</option>
            <option value={120}>120 minutes (2 hours)</option>
            <option value={180}>180 minutes (3 hours)</option>
          </select>
        </div>
      </div>

      {/* Backup and Import/Export */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Device Synchronization</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
          Because Jamboo operates offline-first without requiring remote servers, your mock progress, completed scores, and streaks reside only on your current device. Export your data to transfer to another phone or keep as a safe backup.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all font-semibold text-xs border border-slate-200/50 dark:border-slate-700/50"
          >
            <Download className="w-4 h-4" />
            Export Backup
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 rounded-xl transition-all font-semibold text-xs text-teal-600 dark:text-teal-400 border border-teal-200/30"
          >
            <Upload className="w-4 h-4" />
            Import Backup
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportBackup}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* Reset & Wipe Area */}
      <div className="p-4 bg-rose-50/50 dark:bg-rose-950/25 rounded-2xl border border-rose-100 dark:border-rose-950/50 space-y-3">
        <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-400">Danger Zone</h3>
        <p className="text-xs text-slate-400 dark:text-rose-200/60 leading-relaxed">
          Wiping your progress deletes every record of your past examinations, weekly mock analytics, daily study streaks, bookmarks, and completions. This is permanent.
        </p>

        {!resetConfirm ? (
          <button
            onClick={() => {
              setResetConfirm(true);
              playFeedbackSound('click');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-semibold text-xs"
          >
            <Trash2 className="w-4 h-4" />
            Reset All Application Data
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 w-full mb-1">Are you absolutely sure you want to delete everything?</p>
            <button
              onClick={handleResetAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg transition-colors font-bold text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Yes, Reset Everything
            </button>
            <button
              onClick={() => {
                setResetConfirm(false);
                playFeedbackSound('click');
              }}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
