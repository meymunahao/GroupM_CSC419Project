import express from "express";
import { addComment, getComments } from "../controllers/comment.controller.js";

const router = express.Router();

// POST /api/posts/:postId/comments
router.post("/", addComment);

// GET /api/posts/:postId/comments
router.get("/", getComments);

export default router;
