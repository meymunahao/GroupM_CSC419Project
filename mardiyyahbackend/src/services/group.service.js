import db from "../config/db.js";

/* CREATE GROUP */
export const createGroup = async (userId, data) => {
  const { name, description, is_private } = data;

  const group = await db.query(
    `
    INSERT INTO groups (name, description, creator_id, is_private)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [name, description, userId, is_private]
  );

  await db.query(
    `
    INSERT INTO group_members (group_id, user_id, role, status)
    VALUES ($1, $2, 'admin', 'approved')
    `,
    [group.rows[0].id, userId]
  );

  return group.rows[0];
};

/* NEW: GET ALL GROUPS */
export const getAllGroups = async () => {
  const result = await db.query(
    `
    SELECT *
    FROM groups
    ORDER BY created_at DESC
    `
  );
  return result.rows;
};

/* JOIN GROUP */
export const joinGroup = async (userId, groupId) => {
  const group = await db.query(
    `SELECT is_private FROM groups WHERE id = $1`,
    [groupId]
  );

  const status = group.rows[0].is_private ? "pending" : "approved";

  await db.query(
    `
    INSERT INTO group_members (group_id, user_id, role, status)
    VALUES ($1, $2, 'member', $3)
    ON CONFLICT DO NOTHING
    `,
    [groupId, userId, status]
  );
};

/* APPROVE MEMBER */
export const approveMember = async (adminId, groupId, userId) => {
  const admin = await db.query(
    `
    SELECT role FROM group_members
    WHERE group_id = $1 AND user_id = $2
    `,
    [groupId, adminId]
  );

  if (!["admin", "moderator"].includes(admin.rows[0]?.role)) {
    throw new Error("Unauthorized");
  }

  await db.query(
    `
    UPDATE group_members
    SET status = 'approved'
    WHERE group_id = $1 AND user_id = $2
    `,
    [groupId, userId]
  );
};

/* LEAVE GROUP */
export const leaveGroup = async (userId, groupId) => {
  await db.query(
    `
    DELETE FROM group_members
    WHERE group_id = $1 AND user_id = $2
    `,
    [groupId, userId]
  );
};

/* GET GROUP */
export const getGroup = async (groupId) => {
  const group = await db.query(
    `SELECT * FROM groups WHERE id = $1`,
    [groupId]
  );

  return group.rows[0];
};

/* GROUP POSTS */
/* GROUP POSTS (service) */
export const getGroupPosts = async (groupId) => {
  const result = await db.query(
    `
    SELECT 
      gp.id,
      gp.content,
      gp.created_at,
      u.username AS author_handle,
      u.full_name AS author_name,         -- or whatever field you have
      u.avatar_url,
      gp.media_url
    FROM group_posts gp
    JOIN users u ON u.id = gp.user_id
    WHERE gp.group_id = $1
    ORDER BY gp.created_at DESC
    `,
    [groupId]
  );
  return result.rows;
};

export const createGroupPost = async (userId, groupId, data) => {
  const member = await db.query(
    `
    SELECT status FROM group_members
    WHERE group_id = $1 AND user_id = $2
    `,
    [groupId, userId]
  );

  if (member.rows[0]?.status !== "approved") {
    throw new Error("Not a group member");
  }

  const post = await db.query(
    `
    INSERT INTO group_posts (group_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [groupId, userId, data.content]
  );

  return post.rows[0];
};

/* SEARCH & DISCOVERY */
export const searchGroups = async (query) => {
  const result = await db.query(
    `
    SELECT * FROM groups
    WHERE name ILIKE $1
    ORDER BY created_at DESC
    `,
    [`%${query}%`]
  );

  return result.rows;
};
