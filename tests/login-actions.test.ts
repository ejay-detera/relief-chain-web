import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createServerSupabaseClient: vi.fn(),
  requireSuperAdmin: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: mocks.createServerSupabaseClient,
}));
vi.mock("@/lib/auth/require-super-admin", () => ({
  requireSuperAdmin: mocks.requireSuperAdmin,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { loginAction } from "@/app/login/actions";

function loginForm(email = "admin@example.com", password = "correct-password") {
  const form = new FormData();
  form.set("email", email);
  form.set("password", password);
  return form;
}

describe("loginAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.redirect.mockImplementation((location: string) => {
      throw Object.assign(new Error(`REDIRECT:${location}`), { location });
    });
  });

  it("redirects valid credentials to the dashboard after Super Admin verification", async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({ data: { session: {} }, error: null });
    mocks.createServerSupabaseClient.mockResolvedValue({ auth: { signInWithPassword } });
    mocks.requireSuperAdmin.mockResolvedValue({ userId: "admin-id", email: "admin@example.com" });

    await expect(loginAction(loginForm())).rejects.toMatchObject({ location: "/dashboard" });

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "admin@example.com",
      password: "correct-password",
    });
    expect(mocks.requireSuperAdmin).toHaveBeenCalledOnce();
    expect(mocks.redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("returns an auth error for invalid credentials without establishing a session", async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({
      data: { session: null },
      error: { message: "Invalid login credentials" },
    });
    mocks.createServerSupabaseClient.mockResolvedValue({ auth: { signInWithPassword } });

    const result = await loginAction(loginForm("wrong@example.com", "wrong-password"));

    expect(result).toEqual({ authError: "Invalid email or password." });
    expect(mocks.requireSuperAdmin).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("returns field errors before contacting Supabase", async () => {
    const signInWithPassword = vi.fn();
    mocks.createServerSupabaseClient.mockResolvedValue({ auth: { signInWithPassword } });

    const result = await loginAction(loginForm("not-an-email", ""));

    expect(result).toEqual({
      fieldErrors: {
        email: "Enter a valid email address.",
        password: "Enter your password.",
      },
    });
    expect(signInWithPassword).not.toHaveBeenCalled();
  });
});
