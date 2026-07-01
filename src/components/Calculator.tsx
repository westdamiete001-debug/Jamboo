/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Delete, X } from 'lucide-react';

interface CalculatorProps {
  onClose?: () => void;
  isFloating?: boolean;
}

export default function Calculator({ onClose, isFloating = false }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNum = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleCalculate = () => {
    if (!equation) return;
    try {
      const fullEq = equation + display;
      // Sanitize input to only allow simple mathematical statements
      const sanitized = fullEq.replace(/[^-()\d/*+.]/g, '');
      // Evaluate expression
      const result = new Function(`return (${sanitized})`)();
      setDisplay(String(Number(result.toFixed(6))));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleSpecial = (type: 'sqrt' | 'sq' | 'sin' | 'cos' | 'tan') => {
    try {
      const val = parseFloat(display);
      if (isNaN(val)) return;

      let result = 0;
      switch (type) {
        case 'sqrt':
          result = Math.sqrt(val);
          break;
        case 'sq':
          result = val * val;
          break;
        case 'sin':
          result = Math.sin((val * Math.PI) / 180);
          break;
        case 'cos':
          result = Math.cos((val * Math.PI) / 180);
          break;
        case 'tan':
          result = Math.tan((val * Math.PI) / 180);
          break;
      }
      setDisplay(String(Number(result.toFixed(6))));
    } catch (e) {
      setDisplay('Error');
    }
  };

  return (
    <div
      className={`${
        isFloating
          ? 'fixed bottom-4 right-4 z-40 w-72 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden'
          : 'w-full max-w-sm bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700 overflow-hidden'
      } p-4 font-mono select-none`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-teal-400 tracking-wider">JAMB STANDARD CALC</span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Screen Display */}
      <div className="bg-slate-950 p-3 rounded-lg text-right mb-3 min-h-16 flex flex-col justify-end">
        <div className="text-xs text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap h-4">
          {equation}
        </div>
        <div className="text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap text-emerald-400">
          {display}
        </div>
      </div>

      {/* Calculator Pad */}
      <div className="grid grid-cols-4 gap-2">
        {/* Special buttons */}
        <button
          onClick={() => handleSpecial('sqrt')}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg font-bold text-teal-300 transition-colors"
        >
          √
        </button>
        <button
          onClick={() => handleSpecial('sq')}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg font-bold text-teal-300 transition-colors"
        >
          x²
        </button>
        <button
          onClick={handleClear}
          className="p-2.5 bg-rose-950 hover:bg-rose-900 text-xs rounded-lg font-bold text-rose-300 transition-colors"
        >
          C
        </button>
        <button
          onClick={handleBackspace}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 flex items-center justify-center rounded-lg text-slate-300 transition-colors"
        >
          <Delete className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleSpecial('sin')}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 transition-colors"
        >
          sin
        </button>
        <button
          onClick={() => handleSpecial('cos')}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 transition-colors"
        >
          cos
        </button>
        <button
          onClick={() => handleSpecial('tan')}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 transition-colors"
        >
          tan
        </button>
        <button
          onClick={() => handleOp('/')}
          className="p-2.5 bg-teal-950 hover:bg-teal-900 text-sm rounded-lg font-bold text-teal-300 transition-colors"
        >
          ÷
        </button>

        {/* Numbers & standard operations */}
        {['7', '8', '9'].map((num) => (
          <button
            key={num}
            onClick={() => handleNum(num)}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-sm rounded-lg font-semibold transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleOp('*')}
          className="p-2.5 bg-teal-950 hover:bg-teal-900 text-sm rounded-lg font-bold text-teal-300 transition-colors"
        >
          ×
        </button>

        {['4', '5', '6'].map((num) => (
          <button
            key={num}
            onClick={() => handleNum(num)}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-sm rounded-lg font-semibold transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleOp('-')}
          className="p-2.5 bg-teal-950 hover:bg-teal-900 text-sm rounded-lg font-bold text-teal-300 transition-colors"
        >
          -
        </button>

        {['1', '2', '3'].map((num) => (
          <button
            key={num}
            onClick={() => handleNum(num)}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-sm rounded-lg font-semibold transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleOp('+')}
          className="p-2.5 bg-teal-950 hover:bg-teal-900 text-sm rounded-lg font-bold text-teal-300 transition-colors"
        >
          +
        </button>

        <button
          onClick={() => handleNum('0')}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-sm rounded-lg font-semibold col-span-2 transition-colors"
        >
          0
        </button>
        <button
          onClick={() => handleNum('.')}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-sm rounded-lg font-semibold transition-colors"
        >
          .
        </button>
        <button
          onClick={handleCalculate}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-sm rounded-lg font-bold text-white transition-colors"
        >
          =
        </button>
      </div>
    </div>
  );
}
