import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Image as ImageIcon, Check, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';

export const BACKGROUND_PRESETS = [
  { id: 'grid-cyan', name: 'CYAN GRID', class: 'bg-[#0c0c0e] bg-[linear-gradient(to_right,#16161a_1px,transparent_1px),linear-gradient(to_bottom,#16161a_1px,transparent_1px)] bg-[size:4rem_4rem]' },
  { id: 'solid-dark', name: 'PURE VOID', class: 'bg-black' },
  { id: 'vaporwave', name: 'VAPORWAVE', class: 'bg-[#1a0b2e] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2d0a4e] via-[#1a0b2e] to-[#0c0c0e]' },
  { id: 'matrix', name: 'DEEP MATRIX', class: 'bg-[#020d04] bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem]' },
  { id: 'sunset', name: 'NEON SUNSET', class: 'bg-[#1a0c10] bg-[radial-gradient(circle_at_top,_#3a0c15_0%,_#0c0c0e_70%)]' }
];

interface UserSetupProps {
  onComplete: (profile: { name: string, background: string, customBg?: string }) => void;
}

export default function UserSetup({ onComplete }: UserSetupProps) {
  const [name, setName] = useState('');
  const [selectedBg, setSelectedBg] = useState(BACKGROUND_PRESETS[0].id);
  const [customBg, setCustomBg] = useState('');
  const [isCunstom, setIsCustom] = useState(false);

  const handleFinish = () => {
    if (!name.trim()) return;
    const bgClass = isCunstom ? '' : (BACKGROUND_PRESETS.find(b => b.id === selectedBg)?.class || '');
    onComplete({ name, background: bgClass, customBg: isCunstom ? customBg : undefined });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0c0c0e] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-[#121216] border border-cyan-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)]"
      >
        <div className="p-10 border-b border-white/5 flex items-center gap-4">
          <div className="p-3 bg-cyan-500 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Terminal className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">
              INITIALIZING <span className="text-cyan-500 text-glow">USER_SESSION</span>
            </h1>
            <p className="text-white/30 font-mono text-[10px] uppercase tracking-[0.3em] mt-1">Grid Portal // Access Level: Public</p>
          </div>
        </div>

        <div className="p-10 space-y-10">
          {/* Name Input */}
          <div className="space-y-4">
            <label className="text-xs font-mono text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
              <User className="w-4 h-4" /> IDENTIFY YOURSELF
            </label>
            <input 
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ENTER GRID ALIAS..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-xl font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
            />
          </div>

          {/* Background Selection */}
          <div className="space-y-4">
            <label className="text-xs font-mono text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
              <ImageIcon className="w-4 h-4" /> SELECT ENVIRONMENT
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {BACKGROUND_PRESETS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => { setSelectedBg(bg.id); setIsCustom(false); }}
                  className={cn(
                    "relative h-24 rounded-xl overflow-hidden border-2 transition-all p-3 flex items-end justify-start text-left",
                    selectedBg === bg.id && !isCunstom ? "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "border-white/10 hover:border-white/30",
                    bg.class
                  )}
                >
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                    {bg.name}
                  </span>
                  {selectedBg === bg.id && !isCunstom && (
                    <div className="absolute top-2 right-2 p-1 bg-cyan-500 rounded-full">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                </button>
              ))}
              
              {/* Custom Image Option */}
              <button
                onClick={() => setIsCustom(true)}
                className={cn(
                  "relative h-24 rounded-xl overflow-hidden border-2 transition-all p-3 flex flex-col items-center justify-center gap-1",
                    isCunstom ? "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-500/10" : "border-white/10 hover:border-white/30 bg-white/5"
                )}
              >
                <ImageIcon className="w-6 h-6 text-white/50" />
                <span className="text-[9px] font-bold text-white/50 uppercase">CUSTOM URL</span>
              </button>
            </div>

            {isCunstom && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <input 
                  value={customBg}
                  onChange={(e) => setCustomBg(e.target.value)}
                  placeholder="PASTE IMAGE URL HERE..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </motion.div>
            )}
          </div>

          <button
            disabled={!name.trim()}
            onClick={handleFinish}
            className="w-full h-16 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] active:scale-[0.98] mt-4"
          >
            ENTER THE GRID
          </button>
        </div>
      </motion.div>
    </div>
  );
}
