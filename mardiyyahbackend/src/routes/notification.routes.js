// routes/notification.routes.ts
import express from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import {
  getUserNotifications,
  markNotificationRead,
  markAllRead
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", authRequired, getUserNotifications);
router.put("/:id/read", authRequired, markNotificationRead);
router.put("/read-all", authRequired, markAllRead);

export default router;
