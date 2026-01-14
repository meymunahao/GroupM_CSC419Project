import express from "express";
import {
  getConversations,
  getMessages,
  searchChats,
  sendMessage,
  createConversation
} from "../controllers/chat.controller.js";





const router = express.Router();

router.get("/conversations",getConversations);
router.get("/messages/:conversationId",getMessages);
router.get("/search",searchChats);


router.post("/send", sendMessage);
router.post("/conversations", createConversation);
export default router;
