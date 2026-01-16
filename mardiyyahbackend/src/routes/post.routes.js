// src/routes/post.routes.js
import express from "express";
import {
  createPost,
  getFeed,
  getSinglePost,
  updatePost,
  deletePost,
  reactToPost,
  uploadPostMedia,
} from "../controllers/post.controller.js";
import { addComment, getComments } from "../controllers/comment.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

// all post routes require auth
router.use(authRequired);

router.post("/", createPost);
router.get("/feed", getFeed);
router.get("/:id", getSinglePost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.post("/:id/react", reactToPost);

router.post("/:id/media", upload.single("file"), uploadPostMedia);

router.get("/:postId/comments", getComments);
router.post("/:postId/comments", addComment);

export default router;
