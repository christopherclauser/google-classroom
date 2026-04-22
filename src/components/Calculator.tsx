import React, { useState } from 'react';
import { create, all } from 'mathjs';
import { cn } from '../lib/utils';
import { Delete, Eraser, Equal, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const math = create(all);

const BUTTONS = [
  ['AC', 'BS', '^', '/'],
  ['7', '8', '9', 'X'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', 'x', '=']
];

const SYMBOL_MAP: Record<string, string> = {
  'X': '*',
  'BS': 'BACKSPACE',
};

export default function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleAction = (val: string) => {
    setError(false);
    if (val === 'BS') {
      setInput(prev => prev.slice(0, -1));
    } else if (val === 'AC') {
      setInput('');
      setResult(null);
    } else if (val === '=') {
      try {
        // Handle variable 'x' by replacing it with a placeholder if needed, 
        // but mathjs might struggle without a scope. 
        // For a basic calculator, we'll keep it as a symbol for now or 
        // treat it as a constant for the sake of the 'unblocked site' aesthetic.
        const res = math.evaluate(input.replace(/X/g, '*'));
        setResult(String(res));
      } catch (err) {
        setError(true);
        setResult('Error');
      }
    } else {
      const addition = SYMBOL_MAP[val] === 'BACKSPACE' ? '' : (SYMBOL_MAP[val] || val);
      setInput(prev => prev + addition);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xs mx-auto bg-[#0c0c0e] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.15)] mt-12 mb-20"
      id="calculator-main"
    >
      <div className="p-6 bg-[#16161a] border-b border-cyan-500/20">
        <div className="text-right text-cyan-400 font-mono text-xs h-4 overflow-hidden truncate opacity-70">
          {input || '0'}
        </div>
        <div className={cn(
          "text-right text-4xl font-bold font-mono mt-2 min-h-[3rem] transition-colors overflow-x-auto whitespace-nowrap scrollbar-hide",
          error ? "text-red-500" : "text-white"
        )}>
          {result || input || '0'}
        </div>
      </div>

      <div className="p-4 grid grid-cols-4 gap-3 bg-[#0c0c0e]">
        {BUTTONS.flat().map((btn) => (
          <button
            key={btn}
            id={`calc-btn-${btn.toLowerCase()}`}
            onClick={() => handleAction(btn)}
            className={cn(
              "h-14 flex items-center justify-center rounded-xl transition-all active:scale-95",
              btn === '=' ? "bg-cyan-500 text-black font-black hover:bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" :
              btn === 'AC' ? "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 font-bold" :
              btn === 'BS' ? "bg-white/5 text-white hover:bg-white/10" :
              ['/', 'X', '-', '+', '^'].includes(btn) ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 font-bold text-xl" :
              "bg-white/5 text-white hover:bg-white/10 text-2xl font-semibold"
            )}
          >
            {btn === 'BS' ? <Delete className="w-6 h-6" /> : btn}
          </button>
        ))}
      </div>
      
      <div className="px-6 py-3 bg-[#111114] text-[9px] text-white/30 uppercase tracking-[0.2em] font-mono flex justify-between">
        <span>System: Standard Mode</span>
        <span className="text-cyan-500/50">TOPHER_OS</span>
      </div>
    </motion.div>
  );
}
