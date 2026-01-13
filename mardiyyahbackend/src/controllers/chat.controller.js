import * as chatService from "../services/chat.service.js";


export const getConversations = async (req, res) => {
  // TEMP mock user
  const userId = 1;

  const data = await chatService.fetchConversations(userId);
  res.json(data);
};

export const getMessages = async (req, res) => {
  const data = await chatService.fetchMessages(
    req.params.conversationId
  );
  res.json(data);
};

export const searchChats = async (req, res) => {
  // TEMP mock user
  const userId = 1;

  const data = await chatService.searchMessages(
    userId,
    req.query.q
  );
  res.json(data);
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // TEMP: hard-coded user until auth is wired
    const senderId = 1; // later: use req.user.id

    const saved = await chatService.createMessage(
      conversationId,
      senderId,
      content
    );

    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in sendMessage:", err);
    res.status(500).json({ error: err.message });
  }
};
