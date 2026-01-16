import dotenv from "dotenv";
dotenv.config();



import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import db from "./config/db.js";

import { initChatSocket } from "./socket/chat.socket.js";
import { initNotificationSocket } from "./socket/notification.socket.js";

const PORT = process.env.PORT || 5001;

// Create HTTP server
const server = http.createServer(app);

// Create ONE Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Initialize sockets
initChatSocket(io);
initNotificationSocket(io);

// Make io available globally (for emitting inside services)
app.set("io", io);

// Test DB connection
db.query("SELECT 1")
  .then(() => console.log("✅ PostgreSQL connected"))
  .catch(err => console.error("❌ DB connection error", err));

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
