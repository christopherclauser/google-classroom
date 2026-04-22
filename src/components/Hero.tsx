import React from 'react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="pt-32 pb-16 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-1 bg-cyan-500 h-24 absolute -left-0 hidden md:block" />
        <h1 className="text-7xl md:text-8xl font-black text-white italic tracking-tighter leading-none uppercase">
          TOPHER'S <span className="text-cyan-500 text-glow">GAMES</span>
        </h1>
        <p className="mt-8 text-white/40 font-mono tracking-widest text-xs uppercase max-w-md leading-loose">
          TOPHER IS 11 5THGRADE AND MADE THIS WEBSITE WITH HIS CODE WITH A BIT OF 6-7 VERSIONS
        </p>
        
        <div className="flex gap-4 mt-8">
          <div className="h-1.5 w-16 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
          <div className="h-1.5 w-12 bg-magenta-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <img 
          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop" 
          alt="Cyberpunk City" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-6 right-6 px-3 py-1 bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 rounded text-[10px] font-mono text-cyan-400">
          SYSTEM_VISUAL_01
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      </motion.div>
    </section>
  );
}
