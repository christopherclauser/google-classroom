import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface FooterProps {
  onViewChange: (view: 'home' | 'calc' | 'contact' | 'dashboard') => void;
}

export default function Footer({ onViewChange }: FooterProps) {
  return (
    <footer className="py-12 px-6 md:px-12 border-t border-white/5 bg-[#08080c]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-white/20 text-[10px] font-mono tracking-widest uppercase">
          <Gamepad2 className="w-4 h-4" />
          <span>TOPHERSGAMES // SYSTEM ACTIVE</span>
        </div>
        
        <div className="flex gap-8 text-[10px] font-mono text-white/20 uppercase tracking-widest">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-500 transition-colors cursor-default">Privacy Policy</button>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-500 transition-colors cursor-default">Terms of Service</button>
          <button 
            onClick={() => onViewChange('contact')}
            className={cn(
              "hover:text-cyan-500 transition-colors",
              "cursor-pointer"
            )}
          >
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
}
