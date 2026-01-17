import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// 1. Mock navigate BEFORE importing the component
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// 2. Mock Auth Utilities
vi.mock("../src/utils/auth", () => ({
  getAuthHeader: vi.fn(() => ({ Authorization: "Bearer mock-token" })),
  getCurrentUser: vi.fn(() => ({ 
    username: "TestUser", 
    photoUrl: "/test-avatar.png" 
  })),
}));

import CreatePost from "./../frontend/csc419project/src/pages/CreatePost";

describe("CreatePost Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.URL.createObjectURL = vi.fn(() => "mock-url");
    window.URL.revokeObjectURL = vi.fn();
    window.fetch = vi.fn();
  });

  it("renders correctly with current user data", () => {
    render(<MemoryRouter><CreatePost /></MemoryRouter>);
    expect(screen.getByPlaceholderText(/What's on your mind, TestUser\?/i)).toBeInTheDocument();
  });

  it("submits a post successfully and navigates back", async () => {
    const user = userEvent.setup();
    (window.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "123" }),
    });

    render(<MemoryRouter><CreatePost /></MemoryRouter>);

    await user.type(screen.getByPlaceholderText(/What's on your mind/i), "Test content");
    await user.click(screen.getByRole("button", { name: /post/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(-1));
  });
});