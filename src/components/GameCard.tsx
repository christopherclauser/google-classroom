import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Game } from '../constants';
import { cn } from '../lib/utils';

export default function GameCard({ game }: { game: Game }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('user_favorites') || '[]');
    setIsFavorite(favorites.some((f: any) => f.id === game.id));
  }, [game.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('user_favorites') || '[]');
    let updated;
    if (isFavorite) {
      updated = favorites.filter((f: any) => f.id !== game.id);
    } else {
      updated = [...favorites, { id: game.id, type: 'game' }];
    }
    localStorage.setItem('user_favorites', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-[#16161a] border border-white/5 rounded-2xl overflow-hidden group cursor-pointer shadow-xl relative"
      onClick={() => window.open(game.url, '_blank')}
      id={`game-card-${game.id}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16161a] to-transparent opacity-60" />
        
        <button 
          onClick={toggleFavorite}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10",
            isFavorite ? "bg-red-500 text-white" : "bg-black/50 text-white/50 hover:text-white"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-white")} />
        </button>
      </div>
      <div className="p-5 border-t border-white/5">
        <h3 className="text-cyan-400 font-bold italic tracking-wider text-lg uppercase">
          {game.title}
        </h3>
        <p className="text-white/40 text-[10px] mt-1 uppercase font-mono leading-relaxed line-clamp-2">
          {game.description}
        </p>
      </div>
    </motion.div>
  );
}
