import express from "express";
import db from "../config/db.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET /api/users - list all users except current
router.get("/", authRequired, async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    const { rows } = await db.query(
      `SELECT id, username, email
       FROM users
       WHERE id <> $1
       ORDER BY username ASC`,
      [currentUserId]
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
