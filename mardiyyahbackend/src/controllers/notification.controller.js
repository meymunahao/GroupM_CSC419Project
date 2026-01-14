import * as notificationService from "../services/notification.service.js";

export const getUserNotifications = async (req, res) => {
  const data = await notificationService.getNotifications(req.user.id);
  res.json(data);
};

export const markNotificationRead = async (req, res) => {
  await notificationService.markAsRead(
    req.user.id,
    req.params.id
  );
  res.json({ success: true });
};

export const markAllRead = async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  res.json({ success: true });
};
