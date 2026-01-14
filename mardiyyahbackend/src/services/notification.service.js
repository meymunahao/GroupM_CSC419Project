import db from "../config/db.js";

/* CREATE NOTIFICATION */
export const createNotification = async (
  userId,
  type,
  referenceId
) => {
  const result = await db.query(
    `
    INSERT INTO notifications (user_id, type, reference_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [userId, type, referenceId]
  );

  return result.rows[0];
};

/* GET USER NOTIFICATIONS */
export const getNotifications = async (userId) => {
  const result = await db.query(
    `
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

/* MARK AS READ */
export const markAsRead = async (userId, notificationId) => {
  await db.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE id = $1 AND user_id = $2
    `,
    [notificationId, userId]
  );
};

/* MARK ALL AS READ */
export const markAllAsRead = async (userId) => {
  await db.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE user_id = $1
    `,
    [userId]
  );
};
