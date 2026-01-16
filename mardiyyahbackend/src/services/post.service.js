import db from "../config/db.js";

export const createPost = async (userId, data) => {
  try {
    const { content, visibility = "public" } = data;

    const { rows } = await db.query(
      `
      INSERT INTO posts (user_id, content, visibility, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id, user_id, content, visibility, created_at, updated_at
      `,
      [userId, content, visibility]
    );

    return rows[0];
  } catch (err) {
    console.error("createPost error:", err);
    throw err;
  }
};

export const getFeed = async (userId, query) => {
  const limit = Number(query.limit) || 20;
  const offset = Number(query.offset) || 0;

  const { rows } = await db.query(
    `
    SELECT
      p.id,
      p.user_id,
      u.username           AS user_name,
      up.photo_url         AS avatar_url,
      p.content,
      p.visibility,
      p.created_at,
      p.updated_at,
      pm.media_url         AS image_url,
      pm.media_type        AS media_type
    FROM posts p
    JOIN users u
      ON u.id = p.user_id
    LEFT JOIN user_profiles up
      ON up.user_id = u.id
    LEFT JOIN LATERAL (
      SELECT media_url, media_type
      FROM post_media
      WHERE post_id = p.id
      ORDER BY created_at ASC
      LIMIT 1
    ) pm ON TRUE
    WHERE p.visibility = 'public'
       OR p.user_id = $1
    ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [userId, limit, offset]
  );

  return rows;
};

export const getPostById = async (postId) => {
  const { rows } = await db.query(
    `
    SELECT id, user_id, content, visibility, created_at, updated_at
    FROM posts
    WHERE id = $1
    `,
    [postId]
  );

  return rows[0] || null;
};

export const updatePost = async (userId, postId, data) => {
  const { content, visibility } = data;

  const { rows } = await db.query(
    `
    UPDATE posts
    SET
      content   = COALESCE($1, content),
      visibility= COALESCE($2, visibility),
      updated_at = NOW()
    WHERE id = $3 AND user_id = $4
    RETURNING id, user_id, content, visibility, created_at, updated_at
    `,
    [content ?? null, visibility ?? null, postId, userId]
  );

  return rows[0] || null;
};

export const deletePost = async (userId, postId) => {
  await db.query(
    `
    DELETE FROM posts
    WHERE id = $1 AND user_id = $2
    `,
    [postId, userId]
  );
  return true;
};

export const react = async (userId, postId, reaction) => {
  await db.query(
    `
    INSERT INTO reactions (user_id, post_id, reaction_type, created_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (user_id, post_id, reaction_type)
    DO UPDATE SET reaction_type = EXCLUDED.reaction_type
    `,
    [userId, postId, reaction]
  );

  return true;
};
