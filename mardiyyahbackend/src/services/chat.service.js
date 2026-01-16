import db from "../config/db.js";

export const fetchConversations = async (userId) => {
  const { rows } = await db.query(
    `
    SELECT 
      c.id,
      u.email AS other_user_email,
      MAX(m.created_at) AS last_message_time
    FROM conversations c
    JOIN conversation_members cm_self
      ON cm_self.conversation_id = c.id
    JOIN conversation_members cm_other
      ON cm_other.conversation_id = c.id
     AND cm_other.user_id <> cm_self.user_id
    JOIN users u
      ON u.id = cm_other.user_id
    LEFT JOIN messages m
      ON m.conversation_id = c.id
    WHERE cm_self.user_id = $1
    GROUP BY c.id, u.email
    ORDER BY last_message_time DESC NULLS LAST
    `,
    [userId]
  );
  return rows;
};
export const fetchMessages = async (conversationId) => {
  const { rows } = await db.query(
    `SELECT * FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [conversationId]
  );
  return rows;
};

export const searchMessages = async (userId, query) => {
  const { rows } = await db.query(
    `SELECT m.*
     FROM messages m
     JOIN conversation_members cm
       ON cm.conversation_id = m.conversation_id
     WHERE cm.user_id=$1
       AND m.content ILIKE $2`,
    [userId, `%${query}%`]
  );
  return rows;
};

/** ✅ NEW: save a message to DB */
export const createMessage = async (conversationId, senderId, content) => {
  const { rows } = await db.query(
    `INSERT INTO messages (conversation_id, sender_id, content, message_type)
     VALUES ($1, $2, $3, 'text')
     RETURNING *`,
    [conversationId, senderId, content]
  );

  return rows[0];
};


export const createConversation = async (userId, otherUserId) => {
  // Check if conversation already exists
  const existing = await db.query(
    `SELECT c.id 
     FROM conversations c
     JOIN conversation_members cm1 ON cm1.conversation_id = c.id AND cm1.user_id = $1
     JOIN conversation_members cm2 ON cm2.conversation_id = c.id AND cm2.user_id = $2`,
    [userId, otherUserId]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  // Create new conversation
  const conv = await db.query(
    `INSERT INTO conversations DEFAULT VALUES RETURNING id`
  );

  const conversationId = conv.rows[0].id;

  // Add both members
  await db.query(
    `INSERT INTO conversation_members (conversation_id, user_id)
     VALUES ($1, $2), ($1, $3)`,
    [conversationId, userId, otherUserId]
  );

  return { id: conversationId };
};