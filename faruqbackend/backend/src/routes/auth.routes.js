const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Auth routes
router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refresh);

// Password reset routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyResetOTP);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
