import express from "express";
import {
  createPost,
  getFeed,
  getSinglePost,
  updatePost,
  deletePost,
  reactToPost
} from "../controllers/post.controller.js";


const router = express.Router();

router.post("/",createPost);
router.get("/feed",getFeed);
router.get("/:id",getSinglePost);
router.put("/:id",updatePost);
router.delete("/:id",deletePost);
router.post("/:id/react",reactToPost);

export default router;
