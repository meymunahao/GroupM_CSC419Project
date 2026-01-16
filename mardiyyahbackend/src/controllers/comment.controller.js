import db from "../config/db.js";

export const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;   // maps to posts.id
    const { content } = req.body;

    if (!postId) {
      return res.status(400).json({ error: "postId is required" });
    }

    // If posts.id is INTEGER:
    // const postIdValue = Number(postId);

    // If posts.id is UUID (string), use it directly:
    const postIdValue = postId;

    const { rows } = await db.query(
      `
      INSERT INTO comments (post_id, user_id, content, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, post_id, user_id, content, created_at
      `,
      [postIdValue, userId, content]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("addComment error:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ error: "postId is required" });
    }

    // Same rule: integer vs UUID
    const postIdValue = postId;

    const { rows } = await db.query(
      `
      SELECT
        c.id,
        c.post_id,
        c.user_id,
        u.username   AS user_name,
        up.photo_url AS avatar_url,
        c.content,
        c.created_at
      FROM comments c
      JOIN users u ON u.id = c.user_id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
      `,
      [postIdValue]
    );

    res.json(rows);
  } catch (err) {
    console.error("getComments error:", err);
    res.status(500).json({ error: "Failed to load comments" });
  }
};
