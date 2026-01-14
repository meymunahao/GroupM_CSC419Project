import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chat.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import groupRoutes from "./routes/group.routes.js";

// ✅ app MUST be created before use
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API running");
});

export default app;
