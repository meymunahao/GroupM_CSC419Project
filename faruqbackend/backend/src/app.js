const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);
const profileRoutes = require("./routes/profile.routes");
app.use("/api/profile", profileRoutes);

// app.js
app.use("/api/friends", require("./routes/friend.routes"));
app.use("/api/follow", require("./routes/follow.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
const socialRoutes = require("./routes/social.routes");
app.use("/api/social", require("./routes/social.routes"));

app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    return res.status(400).json({
      error: err.message
    });
  }

  res.status(500).json({
    error: err.message || "Internal Server Error"
  });
});

module.exports = app;
