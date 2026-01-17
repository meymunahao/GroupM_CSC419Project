import { describe, it, expect, vi, beforeEach } from "vitest";
import * as chatController from "./../mardiyyahbackend/src/controllers/chat.controller.js"; // Adjust path
import * as chatService from "./../mardiyyahbackend/src/services/chat.service.js";

// 1. Mock the chat service
vi.mock("../services/chat.service.js", () => ({
  fetchConversations: vi.fn(),
  fetchMessages: vi.fn(),
  searchMessages: vi.fn(),
  createMessage: vi.fn(),
}));

describe("Chat Controller", () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mocking Express Response object with chained methods
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    // Mocking Express Request object with a default user (simulating auth middleware)
    req = {
      user: { id: "user-123" },
      params: {},
      query: {},
      body: {},
    };
  });

  describe("getConversations", () => {
    it("should fetch and return conversations for the logged-in user", async () => {
      const mockData = [{ id: "conv-1", name: "John Doe" }];
      chatService.fetchConversations.mockResolvedValue(mockData);

      await chatController.getConversations(req, res);

      expect(chatService.fetchConversations).toHaveBeenCalledWith("user-123");
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should return 500 if the service throws an error", async () => {
      chatService.fetchConversations.mockRejectedValue(new Error("Database error"));

      await chatController.getConversations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("getMessages", () => {
    it("should fetch messages for a specific conversationId", async () => {
      req.params.conversationId = "conv-1";
      const mockMessages = [{ id: "msg-1", content: "Hello" }];
      chatService.fetchMessages.mockResolvedValue(mockMessages);

      await chatController.getMessages(req, res);

      expect(chatService.fetchMessages).toHaveBeenCalledWith("conv-1");
      expect(res.json).toHaveBeenCalledWith(mockMessages);
    });
  });

  describe("searchChats", () => {
    it("should call search service with user ID and query string", async () => {
      req.query.q = "lunch";
      const mockResults = [{ id: "msg-99", content: "What's for lunch?" }];
      chatService.searchMessages.mockResolvedValue(mockResults);

      await chatController.searchChats(req, res);

      expect(chatService.searchMessages).toHaveBeenCalledWith("user-123", "lunch");
      expect(res.json).toHaveBeenCalledWith(mockResults);
    });
  });

  describe("sendMessage", () => {
    it("should create a message and return 201 status", async () => {
      req.body = { conversationId: "conv-1", content: "Hey there" };
      const mockSavedMessage = { id: "msg-100", content: "Hey there", senderId: "user-123" };
      chatService.createMessage.mockResolvedValue(mockSavedMessage);

      await chatController.sendMessage(req, res);

      expect(chatService.createMessage).toHaveBeenCalledWith("conv-1", "user-123", "Hey there");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSavedMessage);
    });

    it("should return 400 if conversationId or content is missing", async () => {
      req.body = { conversationId: "conv-1" }; // Missing content

      await chatController.sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing fields" });
      expect(chatService.createMessage).not.toHaveBeenCalled();
    });
  });
});