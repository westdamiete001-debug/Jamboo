/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800); // Progress to home screen after 2.8s

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center text-white select-none z-50">
      <div className="flex flex-col items-center max-w-xs text-center px-4">
        {/* Animated Icon Ring */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 15,
            delay: 0.2,
          }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-teal-500/20 mb-6 relative overflow-hidden"
        >
          {/* Subtle glowing pulse inside */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-white/20 rounded-full filter blur-xl"
          />
          <GraduationCap className="w-12 h-12 text-white drop-shadow-md z-10" />
        </motion.div>

        {/* Brand Name Text Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent font-sans"
        >
          Jamboo
        </motion.h1>

        {/* Tagline Animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="text-sm tracking-widest uppercase text-teal-100 font-medium mt-2"
        >
          Practice. Prepare. Pass.
        </motion.p>

        {/* Clean Loading bar */}
        <div className="w-40 h-1 bg-slate-800 rounded-full mt-10 overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2.2,
              ease: 'easeInOut',
              delay: 0.5,
              repeat: 0,
            }}
            className="w-full h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
