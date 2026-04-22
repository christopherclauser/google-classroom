import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    grade: '',
    age: '',
    homeroom: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Persist response to localStorage for the owner dashboard
    const newResponse = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem('contact_responses') || '[]');
    localStorage.setItem('contact_responses', JSON.stringify([newResponse, ...existing]));
    
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-20 text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/20 text-cyan-500 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-4">
          TRANSMISSION <span className="text-cyan-500 text-glow">RECEIVED</span>
        </h2>
        <p className="text-white/40 font-mono text-sm tracking-widest uppercase max-w-md mx-auto">
          YOUR DATA HAS BEEN UPLOADED TO THE GRID. TOPHER WILL REVIEW YOUR REQUEST SHORTLY.
        </p>
        <button 
          onClick={() => window.location.hash = ''}
          className="mt-10 px-8 py-3 bg-cyan-500 text-black font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        >
          RETURN TO HOME
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white">
          CONTACT <span className="text-cyan-500 text-glow">CENTRAL</span>
        </h2>
        <p className="text-white/40 font-mono text-xs mt-4 tracking-widest uppercase">
          REPORT BUGS // REQUEST GAMES // SECURE LINE
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0c0c0e] border border-cyan-500/30 rounded-3xl p-8 md:p-12 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* First Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest ml-1">First Name</label>
            <input 
              required
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="ENTER FIRST NAME..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest ml-1">Last Name</label>
            <input 
              required
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="ENTER LAST NAME..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="USER@SYSTEM.COM..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest ml-1">Grade</label>
            <select 
              required
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            >
              <option value="" disabled className="bg-[#0c0c0e]">SELECT GRADE...</option>
              {['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(g => (
                <option key={g} value={g} className="bg-[#0c0c0e]">{g} Grade</option>
              ))}
            </select>
          </div>

          {/* Age */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest ml-1">Age</label>
            <input 
              required
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="ENTER AGE..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* Homeroom */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest ml-1">Homeroom Classroom</label>
            <input 
              required
              type="text"
              name="homeroom"
              value={formData.homeroom}
              onChange={handleChange}
              placeholder="ROOM NUMBER / NAME..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2 mb-10">
          <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest ml-1">Problem / Game Request</label>
          <textarea 
            required
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="DESCRIBE THE ISSUE OR REQUEST A NEW GAME..."
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
          />
        </div>

        <button 
          type="submit"
          className="w-full h-16 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-[0.98]"
        >
          <Send className="w-5 h-5" />
          TRANSMIT REQUEST
        </button>
      </form>
      
      <div className="mt-8 text-center text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
        ENCRYPTED SESSION // END-TO-END VERIFIED
      </div>
    </motion.div>
  );
}
