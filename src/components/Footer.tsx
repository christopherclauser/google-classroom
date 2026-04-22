import React from 'react';
import { Gamepad2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-6 md:px-12 border-t border-white/5 bg-[#08080c]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-white/20 text-[10px] font-mono tracking-widest uppercase">
          <Gamepad2 className="w-4 h-4" />
          <span>TOPHERSGAMES // SYSTEM ACTIVE</span>
        </div>
        
        <div className="flex gap-8 text-[10px] font-mono text-white/20 uppercase tracking-widest">
          <a href="#" className="hover:text-cyan-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-cyan-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-cyan-500 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
