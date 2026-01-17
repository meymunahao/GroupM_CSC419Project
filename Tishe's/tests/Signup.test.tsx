import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

import Signup from "./../frontend/csc419project/src/pages/auth/Signup";

describe("Signup Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.fetch = vi.fn();
    vi.useFakeTimers();
  });

  it("handles successful signup and navigation after 3s", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    
    (window.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Success" }),
    });

    render(<MemoryRouter><Signup /></MemoryRouter>);

    await user.type(screen.getByPlaceholderText(/Email Address/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/Password/i), "password123");
    await user.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Account created successfully/i)).toBeInTheDocument();
    });

    vi.advanceTimersByTime(3000);
    expect(mockNavigate).toHaveBeenCalledWith("/verify-new-user", {
      state: { email: "test@example.com" },
    });
  });
});