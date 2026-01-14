import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  getUserNotifications,
  markNotificationRead,
  markAllRead
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", auth, getUserNotifications);
router.put("/:id/read", auth, markNotificationRead);
router.put("/read-all", auth, markAllRead);

export default router;
