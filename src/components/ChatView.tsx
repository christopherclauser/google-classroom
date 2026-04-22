import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { 
  MessageSquare, Users, UserPlus, Copy, Check, Send, 
  Hash, ChevronRight, Bell, Shield, Terminal, Settings
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  from: string;
  name: string;
  text: string;
  timestamp: string;
}

interface GroupChat {
  id: string;
  name: string;
  members: string[];
  messages: Message[];
}

interface Friend {
  code: string;
  name: string;
}

interface Request {
  from: string;
  fromName: string;
}

export default function ChatView() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [myCode, setMyCode] = useState('');
  const [myName, setMyName] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [activeGroup, setActiveGroup] = useState<GroupChat | null>(null);
  const [message, setMessage] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get or create Grid Code
    let code = localStorage.getItem('grid_code');
    if (!code) {
      code = uuidv4().substring(0, 8).toUpperCase();
      localStorage.setItem('grid_code', code);
    }
    setMyCode(code);

    const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    setMyName(profile.name || 'CITIZEN_' + code);

    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('register', { gridCode: code, name: profile.name || 'CITIZEN' });
    });

    newSocket.on('init_state', ({ requests, friends, groups }) => {
      setRequests(requests);
      setFriends(friends);
      setGroups(groups);
    });

    newSocket.on('incoming_request', (req) => {
      setRequests(prev => [...prev, req]);
    });

    newSocket.on('friend_added', (friend) => {
      setFriends(prev => [...prev, friend]);
    });

    newSocket.on('group_created', (group) => {
      setGroups(prev => [...prev, group]);
    });

    newSocket.on('new_message', ({ groupId, message }) => {
      setGroups(prev => prev.map(g => 
        g.id === groupId ? { ...g, messages: [...g.messages, message] } : g
      ));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeGroup?.messages]);

  const copyCode = () => {
    navigator.clipboard.writeText(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendInvite = () => {
    if (!inviteCode || !socket) return;
    socket.emit('send_request', { fromCode: myCode, fromName: myName, toCode: inviteCode.toUpperCase() });
    setInviteCode('');
  };

  const acceptRequest = (fromCode: string) => {
    if (!socket) return;
    socket.emit('accept_request', { myCode, myName, fromCode });
    setRequests(prev => prev.filter(r => r.from !== fromCode));
  };

  const createGroup = () => {
    if (!newGroupName || !socket) return;
    socket.emit('create_group', { creatorCode: myCode, name: newGroupName, members: selectedFriends });
    setNewGroupName('');
    setSelectedFriends([]);
    setIsCreatingGroup(false);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !activeGroup || !socket) return;
    socket.emit('send_message', { groupId: activeGroup.id, fromCode: myCode, fromName: myName, text: message });
    setMessage('');
  };

  // Sync active group data when groups update
  useEffect(() => {
    if (activeGroup) {
      const updated = groups.find(g => g.id === activeGroup.id);
      if (updated) setActiveGroup(updated);
    }
  }, [groups]);

  return (
    <div className="max-w-6xl mx-auto h-[70vh] bg-[#0c0c0e] border border-cyan-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)] flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <div className="w-full md:w-80 border-r border-white/5 flex flex-col bg-white/[0.02]">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-500 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Terminal className="w-4 h-4 text-black" />
            </div>
            <h2 className="text-xl font-black italic tracking-tighter uppercase text-white">
              CHAT <span className="text-cyan-500 text-glow">TERMINAL</span>
            </h2>
          </div>

          <div className="bg-black/40 rounded-xl p-4 border border-white/5 group">
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2 flex justify-between">
              <span>Your Grid Code</span>
              {copied && <span className="text-green-500 lowercase">copied!</span>}
            </div>
            <div 
              onClick={copyCode}
              className="flex items-center justify-between cursor-pointer group-hover:text-cyan-400 transition-colors"
            >
              <span className="text-xl font-black font-mono tracking-widest text-white/80">{myCode}</span>
              <Copy className="w-4 h-4 text-white/20 group-hover:text-cyan-500 transition-colors" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Requests */}
          {requests.length > 0 && (
            <div className="space-y-3">
              <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest flex items-center gap-2 px-2">
                <Bell className="w-3 h-3 animate-pulse" /> Pending Invites
              </div>
              {requests.map((r) => (
                <div key={r.from} className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white uppercase">{r.fromName}</div>
                    <div className="text-[9px] font-mono text-white/40">{r.from}</div>
                  </div>
                  <button 
                    onClick={() => acceptRequest(r.from)}
                    className="p-1.5 bg-cyan-500 rounded-lg text-black hover:bg-cyan-400 transition-colors"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Group Chats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-3 h-3" /> Sectors
              </div>
              <button 
                onClick={() => setIsCreatingGroup(true)}
                className="p-1 text-white/20 hover:text-cyan-500 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
            
            {groups.length === 0 ? (
              <div className="text-center py-8 text-[10px] font-mono text-white/10 uppercase tracking-widest border border-dashed border-white/5 rounded-xl">
                No active sectors
              </div>
            ) : (
              groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGroup(g)}
                  className={cn(
                    "w-full p-4 rounded-xl flex items-center gap-4 transition-all border text-left",
                    activeGroup?.id === g.id 
                      ? "bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]" 
                      : "bg-white/5 border-transparent hover:border-white/10"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center font-black italic",
                    activeGroup?.id === g.id ? "bg-cyan-500 text-black" : "bg-white/5 text-white/20"
                  )}>
                    {g.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white uppercase tracking-tight truncate">{g.name}</div>
                    <div className="text-[9px] font-mono text-white/40 truncate">
                      {g.messages.length > 0 ? g.messages[g.messages.length-1].text : 'Start transmission...'}
                    </div>
                  </div>
                  {activeGroup?.id === g.id && <ChevronRight className="w-4 h-4 text-cyan-500" />}
                </button>
              ))
            )}
          </div>

          {/* Friends List for Group Invite Reference */}
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest px-2">
              Sync Contacts
            </div>
            <div className="flex flex-wrap gap-2 px-2">
              {friends.map(f => (
                <div key={f.code} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-white/40">
                  {f.code}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="relative">
            <input 
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="INVITE CODE..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-[10px] font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/50 transition-colors uppercase"
            />
            <button 
              onClick={sendInvite}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-cyan-500 hover:scale-110 transition-transform"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-black/20">
        <AnimatePresence mode="wait">
          {!activeGroup ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white/10 mb-6 border border-white/5">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                STANDBY <span className="text-cyan-500">MODE</span>
              </h3>
              <p className="text-white/30 font-mono text-[10px] uppercase tracking-widest max-w-xs">
                SELECT A SECTOR OR INVITE A GUARDIAN TO BEGIN TRANSMISSION
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-[#16161a] border-b border-white/5 flex justify-between items-center h-20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-black font-black italic shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    {activeGroup.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-lg font-black uppercase italic text-white leading-none">{activeGroup.name}</div>
                    <div className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest mt-1">Sector Live // {activeGroup.members.length} Members</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-white/20" />
                  <Settings className="w-5 h-5 text-white/20" />
                </div>
              </div>

              {/* Messages */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide"
              >
                {activeGroup.messages.length === 0 && (
                  <div className="text-center py-20 text-[10px] font-mono text-white/10 uppercase tracking-[0.3em] font-bold">
                    [ END-TO-END ENCRYPTED GRID READY ]
                  </div>
                )}
                {activeGroup.messages.map((msg, i) => {
                  const isMe = msg.from === myCode;
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex flex-col max-w-[80%]",
                        isMe ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className={cn(
                          "text-[9px] font-mono uppercase font-bold",
                          isMe ? "text-cyan-500" : "text-white/40"
                        )}>
                          {msg.name}
                        </span>
                        <span className="text-[8px] font-mono text-white/10">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className={cn(
                        "p-4 rounded-2xl text-sm leading-relaxed",
                        isMe 
                          ? "bg-cyan-500 text-black font-medium rounded-tr-none shadow-[0_5px_15px_rgba(6,182,212,0.2)]" 
                          : "bg-white/5 text-white border border-white/10 rounded-tl-none font-mono"
                      )}>
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="p-6 bg-[#16161a] border-t border-white/5">
                <form onSubmit={sendMessage} className="relative">
                  <input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="TYPE TRANSMISSION..."
                    className="w-full bg-[#0c0c0e] border border-white/10 rounded-2xl py-4 pl-6 pr-20 text-sm font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal for Creating Group */}
      <AnimatePresence>
        {isCreatingGroup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full bg-[#121216] border border-cyan-500/30 rounded-3xl p-8 shadow-2xl">
              <h4 className="text-xl font-black italic uppercase text-white mb-6">Initialize <span className="text-cyan-500">Sector</span></h4>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest ml-1">Sector Name</label>
                  <input 
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="ENTER NAME..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest ml-1">Invite Guardians</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-hide">
                    {friends.map(f => (
                      <button
                        key={f.code}
                        onClick={() => setSelectedFriends(prev => 
                          prev.includes(f.code) ? prev.filter(c => c !== f.code) : [...prev, f.code]
                        )}
                        className={cn(
                          "p-3 rounded-xl border transition-all text-left",
                          selectedFriends.includes(f.code) 
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" 
                            : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
                        )}
                      >
                        <div className="text-[10px] font-bold uppercase truncate">{f.name}</div>
                        <div className="text-[9px] font-mono truncate">{f.code}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsCreatingGroup(false)}
                    className="flex-1 py-3 bg-white/5 text-white/40 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={createGroup}
                    className="flex-1 py-3 bg-cyan-500 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all"
                  >
                    Deploy
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
