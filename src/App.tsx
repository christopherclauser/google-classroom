import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import GameCard from './components/GameCard';
import Calculator from './components/Calculator';
import ContactForm from './components/ContactForm';
import Dashboard from './components/Dashboard';
import FavoritesView from './components/FavoritesView';
import ChatView from './components/ChatView';
import UserSetup from './components/UserSetup';
import Footer from './components/Footer';
import { GAMES } from './constants';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from './lib/utils';

type ViewType = 'home' | 'calc' | 'contact' | 'dashboard' | 'favorites' | 'chat';

interface UserProfile {
  name: string;
  background: string;
  customBg?: string;
}

export default function App() {
  const [view, setView] = useState<ViewType>('home');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'calc', 'contact', 'dashboard', 'favorites', 'chat'].includes(hash)) {
        setView(hash as ViewType);
      } else if (hash === '') {
        setView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 

    // Initial profile load
    const profile = localStorage.getItem('user_profile');
    if (profile) setUserProfile(JSON.parse(profile));
    setIsLoaded(true);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleUpdateView = (newView: ViewType) => {
    window.location.hash = newView === 'home' ? '' : newView;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSetupComplete = (profile: UserProfile) => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
    setUserProfile(profile);
  };

  if (!isLoaded) return null;

  return (
    <div className={cn(
      "min-h-screen font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden relative transition-all duration-700",
      userProfile?.background || "bg-[#0c0c0e] bg-[linear-gradient(to_right,#16161a_1px,transparent_1px),linear-gradient(to_bottom,#16161a_1px,transparent_1px)] bg-[size:4rem_4rem]"
    )}>
      {/* Custom Background Image Overlay */}
      {userProfile?.customBg && (
        <div 
          className="fixed inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url(${userProfile.customBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      )}

      {/* Onboarding Overlay */}
      {!userProfile && <UserSetup onComplete={handleSetupComplete} />}

      <Header currentView={view} onViewChange={handleUpdateView} />
      
      <main className="container mx-auto px-4 relative z-10">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero />
              
              <div className="max-w-6xl mx-auto px-6 md:px-12 mb-8">
                <div className="flex items-center gap-4 py-4 px-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.2em]">
                    Welcome back, <span className="text-cyan-400 font-bold">{userProfile?.name || 'CITIZEN'}</span> // Sector 4 Active
                  </span>
                </div>
              </div>

              <section className="pb-24 px-6 md:px-12" id="games-grid">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {GAMES.map(game => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </section>
            </motion.div>
          )}
          
          {view === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-32 min-h-[80vh]"
            >
              <FavoritesView onPlayGame={(url) => window.open(url, '_blank')} />
            </motion.div>
          )}

          {view === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-32 min-h-[80vh]"
            >
              <ChatView />
            </motion.div>
          )}

          {view === 'calc' && (
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
                  STANDARD <span className="text-cyan-500 text-glow">CALCULATOR</span>
                </h2>
                <p className="text-white/40 font-mono text-xs mt-4 tracking-widest uppercase">
                  UNBLOCKED MATH UTILITIES // SYSTEM READY
                </p>
              </div>
              <Calculator />
            </motion.div>
          )}

          {view === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-32 min-h-[80vh]"
            >
              <ContactForm />
            </motion.div>
          )}
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-32 min-h-[80vh]"
            >
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer onViewChange={handleUpdateView} />
    </div>
  );
}
