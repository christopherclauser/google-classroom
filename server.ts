import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // In-memory Grid Store
  const users = new Map<string, { socketId: string, name: string }>();
  const friendRequests: { from: string, to: string, fromName: string }[] = [];
  const friendships: { u1: string, u2: string }[] = [];
  const groupChats: { id: string, name: string, members: string[], messages: any[] }[] = [];

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", ({ gridCode, name }) => {
      users.set(gridCode, { socketId: socket.id, name });
      socket.join(gridCode); // Each user has their own room for private signals
      console.log(`User registered: ${name} (${gridCode})`);
      
      // Send current state for this user
      const userRequests = friendRequests.filter(r => r.to === gridCode);
      const userFriends = friendships
        .filter(f => f.u1 === gridCode || f.u2 === gridCode)
        .map(f => f.u1 === gridCode ? f.u2 : f.u1);
      
      const userGroups = groupChats.filter(g => g.members.includes(gridCode));

      socket.emit("init_state", {
        requests: userRequests,
        friends: userFriends.map(fCode => ({ code: fCode, name: users.get(fCode)?.name || "Unknown" })),
        groups: userGroups
      });
    });

    socket.on("send_request", ({ fromCode, fromName, toCode }) => {
      if (!toCode || fromCode === toCode) return;
      
      // Check if already friends
      if (friendships.some(f => (f.u1 === fromCode && f.u2 === toCode) || (f.u1 === toCode && f.u2 === fromCode))) return;
      
      // Check if already requested
      if (friendRequests.some(r => r.from === fromCode && r.to === toCode)) return;

      const request = { from: fromCode, to: toCode, fromName };
      friendRequests.push(request);
      
      // Notify the target user if online
      io.to(toCode).emit("incoming_request", request);
    });

    socket.on("accept_request", ({ myCode, myName, fromCode }) => {
      const index = friendRequests.findIndex(r => r.from === fromCode && r.to === myCode);
      if (index !== -1) {
        friendRequests.splice(index, 1);
        friendships.push({ u1: myCode, u2: fromCode });
        
        const fromUser = users.get(fromCode);
        
        // Notify both parties
        io.to(myCode).emit("friend_added", { code: fromCode, name: fromUser?.name || "Guardian" });
        io.to(fromCode).emit("friend_added", { code: myCode, name: myName });
      }
    });

    socket.on("create_group", ({ creatorCode, name, members }) => {
      const groupId = Math.random().toString(36).substring(7);
      const newGroup = {
        id: groupId,
        name,
        members: [creatorCode, ...members],
        messages: []
      };
      groupChats.push(newGroup);
      
      newGroup.members.forEach(mCode => {
        io.to(mCode).emit("group_created", newGroup);
      });
    });

    socket.on("send_message", ({ groupId, fromCode, fromName, text }) => {
      const group = groupChats.find(g => g.id === groupId);
      if (group && group.members.includes(fromCode)) {
        const msg = { from: fromCode, name: fromName, text, timestamp: new Date().toISOString() };
        group.messages.push(msg);
        
        group.members.forEach(mCode => {
          io.to(mCode).emit("new_message", { groupId, message: msg });
        });
      }
    });

    socket.on("broadcast_message", ({ fromName, text }) => {
      io.emit("global_announcement", { fromName, text, timestamp: new Date().toISOString() });
    });

    socket.on("disconnect", () => {
      // Find and "log off" user if needed
      for (const [code, data] of users.entries()) {
        if (data.socketId === socket.id) {
          // users.delete(code); 
          break;
        }
      }
    });
  });

  // API Route for clearing (owner mode)
  app.get("/api/games", (req, res) => {
    // Import GAMES dynamically or just define it here to avoid complex imports in server.ts if needed
    // Actually, I'll just put the route above clear-chat
    res.json([
      { id: "2048", title: "2048", url: "https://play2048.co/" },
      { id: "hextris", title: "HEXTRIS", url: "https://hextris.io/" },
      { id: "slope", title: "SLOPE", url: "https://slope-game.github.io/" },
      { id: "tetris", title: "TETRIS", url: "https://tetris.com/play-tetris" },
      { id: "chrome-dino", title: "DINO RUN", url: "https://dino-run.com/" }
    ]);
  });

  app.get("/api/clear-chat", (req, res) => {
    friendRequests.length = 0;
    friendships.length = 0;
    groupChats.length = 0;
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
