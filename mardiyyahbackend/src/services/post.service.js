// post.service.js
import db from "../config/db.js";
import { createNotification } from "./notification.service.js";

export const react = async (userId, postId, reaction, io) => {
  // Save / update reaction
  await db.query(
    `
    INSERT INTO reactions (user_id, post_id, reaction_type)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, post_id)
    DO UPDATE SET reaction_type = $3
    `,
    [userId, postId, reaction]
  );

  // Get post owner
  const postResult = await db.query(
    `SELECT user_id FROM posts WHERE id = $1`,
    [postId]
  );
  const postOwnerId = postResult.rows[0]?.user_id;

  if (!postOwnerId) return;

  // Create notification in DB
  await createNotification(postOwnerId, "POST_LIKED", postId);

  // Emit real-time notification via Socket.IO
  io.to(`user_${postOwnerId}`).emit("notification", {
    type: "POST_LIKED",
    referenceId: postId
  });
};
