import db from "../config/db.js";

const onlineUsers = new Map();

export const initChatSocket = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) return;

    // Track online user
    onlineUsers.set(userId, socket.id);

    // Notify others user is online
    socket.broadcast.emit("user:online", userId);

    /* ---------------- TYPING ---------------- */
    socket.on("typing", ({ conversationId }) => {
      socket.broadcast.emit("typing", {
        userId,
        conversationId
      });
    });

    /* ---------------- SEND MESSAGE ---------------- */
    socket.on("message:send", async ({ conversationId, content, type }) => {
      try {
        const result = await db.query(
          `INSERT INTO messages 
           (conversation_id, sender_id, content, message_type)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [conversationId, userId, content, type]
        );

        io.emit("message:new", result.rows[0]);
      } catch (err) {
        console.error("Message send error:", err);
      }
    });

    /* ---------------- MESSAGE SEEN ---------------- */
    socket.on("message:seen", async ({ messageId }) => {
      try {
        await db.query(
          `UPDATE message_status
           SET status = 'seen'
           WHERE message_id = $1 AND user_id = $2`,
          [messageId, userId]
        );

        socket.broadcast.emit("message:seen", {
          messageId,
          userId
        });
      } catch (err) {
        console.error("Seen update error:", err);
      }
    });

    /* ---------------- DISCONNECT ---------------- */
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit("user:offline", userId);
    });
  });
};
