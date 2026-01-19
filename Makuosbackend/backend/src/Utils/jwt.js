const jwt = require("jsonwebtoken");

exports.signAccessToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });

exports.signRefreshToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
  });

exports.signResetToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_RESET_SECRET, { expiresIn: "10m" });
