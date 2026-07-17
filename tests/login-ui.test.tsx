import { existsSync } from "node:fs";
import { join } from "node:path";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSessionUser: vi.fn(),
  requireSuperAdmin: vi.fn(),
  loginAction: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({ getSessionUser: mocks.getSessionUser }));
vi.mock("@/lib/auth/require-super-admin", () => ({
  requireSuperAdmin: mocks.requireSuperAdmin,
}));
vi.mock("@/app/login/actions", () => ({ loginAction: mocks.loginAction }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import LoginForm from "@/app/login/LoginForm";
import LoginPage from "@/app/login/page";

describe("login page and form", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSessionUser.mockResolvedValue(null);
    mocks.loginAction.mockResolvedValue({ authError: "Invalid email or password." });
  });

  it("has no self-registration route or link", async () => {
    const page = await LoginPage({ searchParams: Promise.resolve({}) });
    render(page);

    const links = screen.queryAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));
    expect(hrefs).not.toContain("/register");
    expect(hrefs).not.toContain("/signup");
    expect(existsSync(join(process.cwd(), "app", "register"))).toBe(false);
    expect(existsSync(join(process.cwd(), "app", "signup"))).toBe(false);
  });

  it("shows the authentication error returned by the login action", async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrong-password" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Sign in" }).closest("form")!);

    await waitFor(() => {
      expect(mocks.loginAction).toHaveBeenCalledWith(expect.any(FormData));
      expect(screen.getByRole("alert").textContent).toContain("Invalid email or password.");
    });
  });

  it("keeps server errors dismissible when the user edits a field", async () => {
    render(<LoginForm initialAuthError="Invalid email or password." />);
    expect(screen.queryByRole("alert")).not.toBeNull();

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "admin@example.com" },
    });

    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });
});
