import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authController from "./../faruqbackend/src/controllers/auth.controller"; // Adjust path
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mailer";

// Mock all external modules
vi.mock("../prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    oTP: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(() => "hashed_password"),
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));

vi.mock("../utils/mailer", () => ({
  sendMail: vi.fn(),
}));

vi.mock("../utils/jwt", () => ({
  signAccessToken: vi.fn(() => "mock_access_token"),
  signRefreshToken: vi.fn(() => "mock_refresh_token"),
}));

describe("Auth Controller", () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Express Request and Response objects
    req = { body: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  /* ===== REGISTER TESTS ===== */
  describe("register", () => {
    it("should return 400 if email or password is missing", async () => {
      req.body = { email: "test@example.com" }; // Missing password
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: expect.stringContaining("required") });
    });

    it("should successfully register a new user and send OTP", async () => {
      req.body = { email: "new@example.com", password: "password123" };
      prisma.user.findUnique.mockResolvedValue(null); // User doesn't exist
      prisma.user.create.mockResolvedValue({ id: 1, email: req.body.email });

      await authController.register(req, res);

      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.oTP.create).toHaveBeenCalled();
      expect(sendMail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "Registered. OTP sent to email." });
    });

    it("should return 400 if user already exists", async () => {
      req.body = { email: "existing@example.com", password: "password123" };
      prisma.user.findUnique.mockResolvedValue({ id: 1 });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });
  });

  /* ===== LOGIN TESTS ===== */
  describe("login", () => {
    it("should successfully login verified user and return tokens", async () => {
      req.body = { email: "verified@example.com", password: "password123" };
      const mockUser = { id: 1, email: "verified@example.com", passwordHash: "hashed", isEmailVerified: true };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await authController.login(req, res);

      expect(prisma.refreshToken.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        accessToken: "mock_access_token",
        refreshToken: "mock_refresh_token",
      });
    });

    it("should return 401 if user is not verified", async () => {
      req.body = { email: "unverified@example.com", password: "password123" };
      prisma.user.findUnique.mockResolvedValue({ isEmailVerified: false });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });
  });

  /* ===== REFRESH TOKEN TESTS ===== */
  describe("refresh", () => {
    it("should return a new access token if refresh token is valid", async () => {
      req.body = { refreshToken: "valid_refresh_token" };
      jwt.verify.mockReturnValue({ id: 1 });
      prisma.refreshToken.findMany.mockResolvedValue([
        { tokenHash: "hashed_refresh_token", revoked: false }
      ]);
      bcrypt.compare.mockResolvedValue(true);
      prisma.user.findUnique.mockResolvedValue({ id: 1 });

      await authController.refresh(req, res);

      expect(res.json).toHaveBeenCalledWith({ accessToken: "mock_access_token" });
    });
  });

  /* ===== RESET PASSWORD TESTS ===== */
  describe("resetPassword", () => {
    it("should reset password and revoke all refresh tokens", async () => {
      req.body = { email: "test@example.com", newPassword: "newpassword123" };
      prisma.user.findUnique.mockResolvedValue({ id: 1 });

      await authController.resetPassword(req, res);

      expect(prisma.user.update).toHaveBeenCalled();
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        data: { revoked: true }
      });
      expect(res.json).toHaveBeenCalledWith({ message: "Password reset successful" });
    });
  });
});