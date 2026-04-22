import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, User, Mail, School, Home, MessageSquare, Trash2, Clock, Monitor, X, Activity } from 'lucide-react';
import { GAMES } from '../constants';

interface Response {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  age: string;
  homeroom: string;
  message: string;
  timestamp: string;
}

interface ActivePlayer {
  name: string;
  game: string;
  status: string;
  favs: number;
  gameId: string;
}

export default function Dashboard() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<ActivePlayer | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('contact_responses') || '[]');
    setResponses(data);
  }, []);

  const handleDelete = (id: number) => {
    const updated = responses.filter(r => r.id !== id);
    setResponses(updated);
    localStorage.setItem('contact_responses', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm('WIPE ALL DATA FROM THE GRID?')) {
      setResponses([]);
      localStorage.removeItem('contact_responses');
    }
  };

  const activePlayers: ActivePlayer[] = [
    { name: 'AXEL_V', game: 'SLOPE', gameId: 'slope', status: 'In Mission', favs: 12 },
    { name: 'KAI_ZERO', game: '2048', gameId: '2048', status: 'Level 14', favs: 5 },
    { name: 'NYX_GRID', game: 'HEXTRIS', gameId: 'hextris', status: 'Paused', favs: 8 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto py-12 px-6"
    >
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-5xl aspect-video bg-[#0c0c0e] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.3)] relative flex flex-col"
            >
              {/* Monitor Header */}
              <div className="p-4 bg-[#16161a] border-b border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-500/20 rounded-lg animate-pulse">
                    <Activity className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest leading-none">Interception Feed // Active</div>
                    <div className="text-sm font-bold text-white uppercase tracking-tight">Monitoring: {selectedPlayer.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <div className="text-[9px] font-mono text-white/30 uppercase">Target App</div>
                    <div className="text-[11px] font-bold text-white uppercase">{selectedPlayer.game}</div>
                  </div>
                  <button 
                    onClick={() => setSelectedPlayer(null)}
                    className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Monitor Content (The Screen) */}
              <div className="flex-1 relative bg-black group">
                <iframe 
                  src={GAMES.find(g => g.id === selectedPlayer.gameId)?.url}
                  className="w-full h-full border-none pointer-events-none opacity-80"
                  title="Player Monitor"
                />
                
                {/* Overlay Effects */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-40" />
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
                
                <div className="absolute top-8 left-8 flex flex-col gap-2">
                  <div className="px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded">LIVE</div>
                  <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white/60 text-[9px] font-mono uppercase tracking-widest rounded">
                    REC [00:42:15]
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 text-right font-mono">
                  <div className="text-[10px] text-cyan-500/50 uppercase tracking-widest mb-1">Signal Strength</div>
                  <div className="flex gap-1 justify-end">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-cyan-500 rounded-full" />)}
                  </div>
                </div>
              </div>

              {/* Monitor Footer */}
              <div className="p-4 bg-[#0c0c0e] border-t border-cyan-500/10 flex justify-between items-center text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">
                <span>Neural Intercept Protocol v4.2.0</span>
                <span className="text-cyan-500/30 font-bold">Encrypted Feed</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white flex items-center gap-3">
            OWNER <span className="text-cyan-500 text-glow">DASHBOARD</span>
            <ShieldCheck className="w-8 h-8 text-cyan-500" />
          </h2>
          <p className="text-white/40 font-mono text-xs mt-4 tracking-widest uppercase">
            REVIEWS // REQUESTS // SYSTEM ARCHIVE
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-green-500 font-bold uppercase tracking-widest">3 Systems Online</span>
          </div>
          {responses.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="px-6 py-2 border border-red-500/30 text-red-500 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-500/10 transition-all"
            >
              Clear Archive
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Active Players Section */}
          <section>
            <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Active Players // Live Monitoring
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePlayers.map((player, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedPlayer(player)}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest group-hover:text-cyan-400 transition-colors">{player.name}</div>
                      <div className="text-xs font-bold text-white uppercase group-hover:text-white transition-colors">Playing {player.game}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-mono text-green-500 uppercase">{player.status}</div>
                    <div className="text-[9px] font-mono text-white/20 uppercase">{player.favs} favs</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Messages Section */}
          <section>
            <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Transmissions // Incoming Data
            </h3>
            {responses.length === 0 ? (
              <div className="text-center py-20 bg-[#0c0c0e] border border-white/5 rounded-3xl">
                <p className="text-white/20 font-mono text-sm tracking-[0.3em] uppercase">No transmissions found in the grid</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {responses.map((res) => (
                  <motion.div 
                    key={res.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#121216] border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-colors group"
                  >
                    <div className="p-6 border-b border-white/5 bg-white/5 flex flex-wrap justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-tight">
                          <User className="w-4 h-4" />
                          {res.firstName} {res.lastName}
                        </div>
                        <div className="text-white/30 text-[10px] uppercase font-mono flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(res.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(res.id)}
                        className="p-2 text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4 col-span-1">
                        <div className="flex items-center gap-3 text-xs text-white/60 font-mono">
                          <Mail className="w-4 h-4 text-cyan-500/50" />
                          {res.email}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/60 font-mono">
                          <School className="w-4 h-4 text-cyan-500/50" />
                          Grade: {res.grade}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/60 font-mono">
                          <Home className="w-4 h-4 text-cyan-500/50" />
                          Room: {res.homeroom}
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 bg-black/30 rounded-xl p-5 border border-white/5">
                        <div className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <MessageSquare className="w-3 h-3" />
                          Log Entry
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{res.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-6">
          <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
            <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-4">Grid Statistics</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40 font-mono">Total Transmissions</span>
                <span className="text-sm font-bold text-white">{responses.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40 font-mono">Sector Status</span>
                <span className="text-xs font-bold text-green-500 uppercase">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
