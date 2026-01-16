// src/routes/chat.routes.js
import express from "express";
import {
  getConversations,
  getMessages,
  searchChats,
  sendMessage,
} from "../controllers/chat.controller.js";
import { createConversation } from "../controllers/conversation.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authRequired, getConversations);
router.get("/:conversationId/messages", authRequired, getMessages);
router.get("/search", authRequired, searchChats);
router.post("/:conversationId/messages", authRequired, sendMessage);
router.post("/", authRequired, createConversation);

export default router;
