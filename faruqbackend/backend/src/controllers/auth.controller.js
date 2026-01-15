const bcrypt = require("bcryptjs");
const prisma = require("../prisma");
const { generateOTP } = require("../utils/otp");
const { sendMail } = require("../utils/mailer");
const { signAccessToken, signRefreshToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");

/* ===== REGISTER ===== */
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // hash password
    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, passwordHash: hash, role: "USER" }
    });

    // generate OTP
    const otp = generateOTP();
    await prisma.oTP.create({
      data: {
        code: otp,
        purpose: "EMAIL_VERIFY",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        userId: user.id
      }
    });

    // send email
    await sendMail(email, "Verify Your Email", `<h2>OTP Verification</h2><h1>${otp}</h1>`);

    res.json({ message: "Registered. OTP sent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===== VERIFY EMAIL ===== */
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const record = await prisma.oTP.findFirst({
      where: { userId: user.id, code: otp, used: false, purpose: "EMAIL_VERIFY" }
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.oTP.update({ where: { id: record.id }, data: { used: true } });
    await prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true } });

    res.json({ message: "Email verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===== LOGIN ===== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isEmailVerified) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    await prisma.refreshToken.create({
      data: {
        tokenHash: await bcrypt.hash(refreshToken, 10),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: user.id
      }
    });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===== REFRESH TOKEN ===== */
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const tokens = await prisma.refreshToken.findMany({
      where: { userId: payload.id, revoked: false }
    });

    for (const t of tokens) {
      if (await bcrypt.compare(refreshToken, t.tokenHash)) {
        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        return res.json({ accessToken: signAccessToken(user) });
      }
    }

    res.status(401).json({ message: "Invalid refresh token" });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};

/* ===== FORGOT PASSWORD ===== */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ message: "If email exists, OTP sent" });

    const otp = generateOTP();
    await prisma.oTP.create({
      data: {
        code: otp,
        purpose: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        userId: user.id
      }
    });

    await sendMail(email, "Password Reset OTP", `<h2>OTP:</h2><h1>${otp}</h1>`);

    res.json({ message: "If email exists, OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===== VERIFY RESET OTP ===== */
exports.verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid OTP" });

    const record = await prisma.oTP.findFirst({
      where: { userId: user.id, code: otp, purpose: "PASSWORD_RESET", used: false }
    });

    if (!record || record.expiresAt < new Date()) return res.status(400).json({ message: "Invalid or expired OTP" });

    await prisma.oTP.update({ where: { id: record.id }, data: { used: true } });

    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===== RESET PASSWORD ===== */
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ message: "Email and new password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid request" });

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });

    // Revoke refresh tokens
    await prisma.refreshToken.updateMany({ where: { userId: user.id }, data: { revoked: true } });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
