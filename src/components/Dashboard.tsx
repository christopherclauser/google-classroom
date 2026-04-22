import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, User, Mail, School, Home, MessageSquare, Trash2, Clock } from 'lucide-react';

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

export default function Dashboard() {
  const [responses, setResponses] = useState<Response[]>([]);

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto py-12 px-6"
    >
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
        
        {responses.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="px-6 py-2 border border-red-500/30 text-red-500 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-500/10 transition-all"
          >
            Clear Archive
          </button>
        )}
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-32 bg-[#0c0c0e] border border-white/5 rounded-3xl">
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

              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
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

                <div className="col-span-1 md:col-span-3 bg-black/30 rounded-xl p-5 border border-white/5">
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
    </motion.div>
  );
}
