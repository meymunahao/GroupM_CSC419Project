import db from "../config/db.js";

export const addComment = async (req, res) => {
  const { content, parent_comment_id } = req.body;

  const result = await db.query(
    `
    INSERT INTO comments (post_id, user_id, content, parent_comment_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [req.params.postId, req.user.id, content, parent_comment_id || null]
  );

  res.status(201).json(result.rows[0]);
};

export const getComments = async (req, res) => {
  const result = await db.query(
    `
    SELECT *
    FROM comments
    WHERE post_id = $1
    ORDER BY created_at ASC
    `,
    [req.params.postId]
  );

  res.json(result.rows);
};
