import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createServerSupabaseClient: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: mocks.createServerSupabaseClient,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { signOutAction } from "@/app/dashboard/actions";

describe("signOutAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.redirect.mockImplementation((location: string) => {
      throw Object.assign(new Error(`REDIRECT:${location}`), { location });
    });
  });

  it("terminates the Supabase session and redirects to login", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });
    mocks.createServerSupabaseClient.mockResolvedValue({ auth: { signOut } });

    await expect(signOutAction()).rejects.toMatchObject({ location: "/login" });

    expect(signOut).toHaveBeenCalledOnce();
    expect(mocks.redirect).toHaveBeenCalledWith("/login");
  });

  it("still returns to login when session termination reports an error", async () => {
    const signOut = vi.fn().mockRejectedValue(new Error("network failure"));
    mocks.createServerSupabaseClient.mockResolvedValue({ auth: { signOut } });

    await expect(signOutAction()).rejects.toMatchObject({ location: "/login" });
    expect(mocks.redirect).toHaveBeenCalledWith("/login");
  });
});
