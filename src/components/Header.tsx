import React from 'react';
import { Gamepad2, Search, Volume2, Film, Shield, Github } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  currentView: 'home' | 'calc';
  onViewChange: (view: 'home' | 'calc') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c0c10]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onViewChange('home')}
        >
          <div className="p-1.5 bg-cyan-500 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-5 h-5 text-black" />
          </div>
          <span className="text-white font-black text-xl tracking-tighter uppercase italic">
            TOPHER'S<span className="text-cyan-500 ml-1">GAMES</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
          <button 
            onClick={() => onViewChange('home')}
            className={cn(
              "px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-all",
              currentView === 'home' ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "text-white/60 hover:text-white"
            )}
          >
            <Gamepad2 className="w-4 h-4" /> GAMES
          </button>
          <button className="px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-all">
            <Volume2 className="w-4 h-4" /> SOUNDS
          </button>
          <button className="px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-all">
            <Film className="w-4 h-4" /> MOVIES
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => onViewChange('calc')}
          className={cn(
            "px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-all",
            currentView === 'calc' ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "text-white/60 hover:text-white"
          )}
        >
          CALCULATOR
        </button>

        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="SEARCH THE GRID..."
            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 w-64 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-4 text-white/40">
          <Shield className="w-5 h-5 hover:text-cyan-400 cursor-pointer transition-colors" />
          <Github className="w-5 h-5 hover:text-cyan-400 cursor-pointer transition-colors" />
        </div>
      </div>
    </header>
  );
}
