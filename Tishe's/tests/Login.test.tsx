import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// MOCK FIRST
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// IMPORT COMPONENT SECOND
import Login from "./../frontend/csc419project/src/pages/auth/Login";

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.fetch = vi.fn();
    localStorage.clear();
  });

  it("navigates to /home if login and profile fetch are successful", async () => {
    const user = userEvent.setup();

    (window.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: "valid-token" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 1 }),
      });

    render(<MemoryRouter><Login /></MemoryRouter>);

    await user.type(screen.getByPlaceholderText(/Email Address/i), "user@test.com");
    await user.type(screen.getByPlaceholderText(/Password/i), "pass123");
    await user.click(screen.getByRole("button", { name: /Log In/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Login /></MemoryRouter>);

    const passwordInput = screen.getByPlaceholderText(/Password/i) as HTMLInputElement;
    const toggleBtn = screen.getByRole("button", { name: "" }); // Lucide icon button

    expect(passwordInput.type).toBe("password");
    await user.click(toggleBtn);
    expect(passwordInput.type).toBe("text");
  });
});