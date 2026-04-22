import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Gamepad2, Volume2, Film, Trash2, ArrowRight } from 'lucide-react';
import { GAMES } from '../constants';

interface FavoriteItem {
  id: string;
  type: 'game' | 'sound' | 'movie';
}

interface FavoritesViewProps {
  onPlayGame: (url: string) => void;
}

export default function FavoritesView({ onPlayGame }: FavoritesViewProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('user_favorites') || '[]');
    setFavorites(data);
  }, []);

  const handleRemove = (id: string) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('user_favorites', JSON.stringify(updated));
  };

  const getGame = (id: string) => GAMES.find(g => g.id === id);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto py-12 px-6"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white flex items-center justify-center gap-4">
          YOUR <span className="text-red-500 text-glow">FAVORITES</span>
          <Heart className="w-8 h-8 text-red-500 fill-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
        </h2>
        <p className="text-white/40 font-mono text-xs mt-4 tracking-widest uppercase">
          PRIORITY ACCESS // SAVED DATA // QUICK LAUNCH
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-32 bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] flex flex-col items-center gap-6">
          <Heart className="w-12 h-12 text-white/5" />
          <p className="text-white/20 font-mono text-sm tracking-[0.3em] uppercase">No favorites saved in your local sector</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const game = fav.type === 'game' ? getGame(fav.id) : null;
            if (!game) return null;

            return (
              <motion.div
                key={fav.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-[#121216] border border-white/5 rounded-3xl overflow-hidden hover:border-red-500/30 transition-all shadow-lg"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={game.thumbnail} 
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent" />
                  
                  <button 
                    onClick={() => handleRemove(fav.id)}
                    className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-red-500 border border-red-500/30 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute top-4 left-4 p-2 bg-red-500 text-white rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    <Heart className="w-3 h-3 fill-white" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black italic uppercase tracking-tight text-white group-hover:text-red-500 transition-colors">
                      {game.title}
                    </h3>
                    <div className="px-2 py-1 bg-white/5 rounded text-[8px] font-mono text-white/40 uppercase tracking-widest">
                      {fav.type}
                    </div>
                  </div>
                  <p className="text-white/40 text-xs line-clamp-2 mb-6 font-mono leading-relaxed">
                    {game.description}
                  </p>
                  
                  <button 
                    onClick={() => onPlayGame(game.url)}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-red-500 hover:text-black hover:border-transparent transition-all shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
                  >
                    DEPLOY NOW <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
