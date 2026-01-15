const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Get notifications
 */
exports.getNotifications = async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" }
  });

  res.json(notifications);
};

/**
 * Mark notification as read
 */
exports.markAsRead = async (req, res) => {
  await prisma.notification.update({
    where: { id: req.params.id },
    data: { isRead: true }
  });

  res.json({ message: "Notification marked as read" });
};
