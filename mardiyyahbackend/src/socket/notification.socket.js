export const initNotificationSocket = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`🔔 User ${userId} connected to notifications`);
    }

    socket.on("disconnect", () => {
      console.log(`🔕 User ${userId} disconnected from notifications`);
    });
  });
};

/* Emit helper */
export const emitNotification = (io, userId, notification) => {
  io.to(`user_${userId}`).emit("notification", notification);
};
