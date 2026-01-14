import * as chatService from "../services/chat.service.js";

export const createConversation = async (req, res) => {
  const { userId, otherUserId } = req.body;

  if (!userId || !otherUserId) {
    return res.status(400).json({ error: "userId and otherUserId required" });
  }

  try {
    const conversation = await chatService.createConversation(userId, otherUserId);
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
