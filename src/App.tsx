import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import GameCard from './components/GameCard';
import Calculator from './components/Calculator';
import Footer from './components/Footer';
import { GAMES } from './constants';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'home' | 'calc'>('home');

  return (
    <div className="min-h-screen bg-[#0c0c0e] font-sans selection:bg-cyan-500 selection:text-black">
      <Header currentView={view} onViewChange={setView} />
      
      <main className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero />
              
              <section className="pb-24 px-6 md:px-12" id="games-grid">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {GAMES.map(game => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="calc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-32 min-h-[80vh]"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white">
                  ADVANCED <span className="text-cyan-500 text-glow">CALCULATOR</span>
                </h2>
                <p className="text-white/40 font-mono text-xs mt-4 tracking-widest uppercase">
                  UNBLOCKED MATH UTILITIES // SYSTEM READY
                </p>
              </div>
              <Calculator />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
