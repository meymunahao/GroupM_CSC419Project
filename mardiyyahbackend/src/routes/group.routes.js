import express from "express";

import {
  createGroup,
  joinGroup,
  leaveGroup,
  getGroup,
  getGroupPosts,
  createGroupPost,
  searchGroups,
  approveMember
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/",createGroup);
router.post("/:id/join",joinGroup);
router.post("/:id/leave",leaveGroup);
router.post("/:id/approve/:userId",approveMember);

router.get("/search",searchGroups);
router.get("/:id", getGroup);
router.get("/:id/posts",getGroupPosts);
router.post("/:id/posts",createGroupPost);

export default router;
