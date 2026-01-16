import * as chatService from "../services/chat.service.js";

// GET /api/chats
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id; // from authRequired

    const data = await chatService.fetchConversations(userId);
    res.json(data);
  } catch (err) {
    console.error("Error in getConversations:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/chats/:conversationId/messages
export const getMessages = async (req, res) => {
  try {
    const data = await chatService.fetchMessages(req.params.conversationId);
    res.json(data);
  } catch (err) {
    console.error("Error in getMessages:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/chats/search?q=...
export const searchChats = async (req, res) => {
  try {
    const userId = req.user.id; // from authRequired

    const data = await chatService.searchMessages(userId, req.query.q);
    res.json(data);
  } catch (err) {
    console.error("Error in searchChats:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/chats/:conversationId/messages
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const senderId = req.user.id; // comes from JWT via authRequired

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
