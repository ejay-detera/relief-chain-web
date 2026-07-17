import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createServerSupabaseClient: vi.fn(),
  requireSuperAdmin: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("server-only", () => ({}), { virtual: true });
vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));
vi.mock("@/lib/auth/require-super-admin", () => ({
  requireSuperAdmin: mocks.requireSuperAdmin,
}));
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: mocks.createServerSupabaseClient,
}));

import {
  approveRegistration,
  rejectRegistration,
} from "@/lib/registrations/mutations";
import { rejectRegistrationAction } from "@/app/dashboard/organizations/[registrationId]/actions";

function createMutationQuery(result: { error: Error | null }) {
  const query = {
    update: vi.fn(),
    eq: vi.fn(),
  };
  query.update.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.eq.mockReturnValueOnce(query).mockReturnValueOnce(Promise.resolve(result));
  return query;
}

describe("registration mutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireSuperAdmin.mockResolvedValue({
      userId: "admin-1",
      email: "admin@example.com",
    });
  });

  it("authorizes before approving and scopes the update to Pending", async () => {
    const query = createMutationQuery({ error: null });
    const callOrder: string[] = [];
    mocks.requireSuperAdmin.mockImplementation(async () => {
      callOrder.push("authorize");
    });
    mocks.createServerSupabaseClient.mockImplementation(async () => {
      callOrder.push("client");
      return { from: vi.fn().mockReturnValue(query) };
    });

    await expect(approveRegistration("registration-1")).resolves.toEqual({
      success: true,
    });

    expect(callOrder).toEqual(["authorize", "client"]);
    expect(query.update).toHaveBeenCalledWith({ status: "Approved" });
    expect(query.eq).toHaveBeenNthCalledWith(1, "id", "registration-1");
    expect(query.eq).toHaveBeenNthCalledWith(2, "status", "Pending");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard/organizations");
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      "/dashboard/organizations/registration-1",
    );
  });

  it("rejects whitespace-only reasons before creating a mutation client", async () => {
    await expect(rejectRegistration("registration-1", " \t\n ")).resolves.toEqual({
      error: "A rejection reason is required.",
    });

    expect(mocks.requireSuperAdmin).toHaveBeenCalledOnce();
    expect(mocks.createServerSupabaseClient).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("trims and stores a non-empty rejection reason while scoping to Pending", async () => {
    const query = createMutationQuery({ error: null });
    mocks.createServerSupabaseClient.mockResolvedValue({
      from: vi.fn().mockReturnValue(query),
    });

    await expect(
      rejectRegistration("registration-1", "  Missing accreditation document  "),
    ).resolves.toEqual({ success: true });

    expect(query.update).toHaveBeenCalledWith({
      status: "Rejected",
      rejection_reason: "Missing accreditation document",
    });
    expect(query.eq).toHaveBeenNthCalledWith(1, "id", "registration-1");
    expect(query.eq).toHaveBeenNthCalledWith(2, "status", "Pending");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard/organizations");
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      "/dashboard/organizations/registration-1",
    );
  });

  it("returns Supabase errors without revalidating", async () => {
    const error = new Error("database unavailable");
    const query = createMutationQuery({ error });
    mocks.createServerSupabaseClient.mockResolvedValue({
      from: vi.fn().mockReturnValue(query),
    });

    await expect(approveRegistration("registration-1")).resolves.toEqual({
      error: "database unavailable",
    });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  describe("rejection notification suppression (Requirement 13.5)", () => {
    let fetchSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      fetchSpy = vi.fn().mockRejectedValue(new Error("network calls are not expected in this test"));
      vi.stubGlobal("fetch", fetchSpy);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("does not send an email or SMS notification when a registration is rejected via the mutation", async () => {
      const query = createMutationQuery({ error: null });
      mocks.createServerSupabaseClient.mockResolvedValue({
        from: vi.fn().mockReturnValue(query),
      });

      await expect(
        rejectRegistration("registration-1", "Missing accreditation document"),
      ).resolves.toEqual({ success: true });

      // No outbound network call (email/SMS provider request) was made anywhere
      // in the rejection code path.
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("does not send an email or SMS notification through the full Server Action rejection path", async () => {
      const query = createMutationQuery({ error: null });
      mocks.createServerSupabaseClient.mockResolvedValue({
        from: vi.fn().mockReturnValue(query),
      });

      const formData = new FormData();
      formData.set("reason", "Missing accreditation document");

      await expect(
        rejectRegistrationAction("registration-1", formData),
      ).resolves.toEqual({ success: true });

      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });
});
