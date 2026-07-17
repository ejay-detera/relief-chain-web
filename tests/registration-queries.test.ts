import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createServerSupabaseClient: vi.fn(),
  requireSuperAdmin: vi.fn(),
}));

vi.mock("server-only", () => ({}), { virtual: true });
vi.mock("@/lib/auth/require-super-admin", () => ({
  requireSuperAdmin: mocks.requireSuperAdmin,
}));
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: mocks.createServerSupabaseClient,
}));

import { getRegistration, listRegistrations } from "@/lib/registrations/queries";

const row = {
  id: "registration-1",
  organization_name: "San Isidro LGU",
  organization_type: "Local Government Unit",
  contact_info: "San Isidro, Laguna",
  representative_first_name: "Ana",
  representative_last_name: "Santos",
  representative_middle_initial: "M",
  representative_position: "Mayor",
  document_reference: "documents/registration-1.pdf",
  status: "Pending" as const,
  rejection_reason: null,
  created_at: "2026-07-16T10:00:00.000Z",
};

function createQuery(result: { data: unknown; error: Error | null }) {
  const query = {
    select: vi.fn(),
    order: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn(),
  };
  query.select.mockReturnValue(query);
  query.order.mockResolvedValue(result);
  query.eq.mockReturnValue(query);
  query.maybeSingle.mockResolvedValue(result);
  return query;
}

describe("registration queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireSuperAdmin.mockResolvedValue({ userId: "admin-1", email: "admin@example.com" });
  });

  it("authorizes before listing and maps every registration row", async () => {
    const query = createQuery({ data: [row], error: null });
    const callOrder: string[] = [];
    mocks.requireSuperAdmin.mockImplementation(async () => {
      callOrder.push("authorize");
    });
    mocks.createServerSupabaseClient.mockImplementation(async () => {
      callOrder.push("client");
      return { from: vi.fn().mockReturnValue(query) };
    });

    await expect(listRegistrations()).resolves.toEqual([
      {
        id: "registration-1",
        organizationName: "San Isidro LGU",
        organizationType: "Local Government Unit",
        contactInfo: "San Isidro, Laguna",
        representative: {
          firstName: "Ana",
          lastName: "Santos",
          middleInitial: "M",
          position: "Mayor",
        },
        documentReference: "documents/registration-1.pdf",
        status: "Pending",
        rejectionReason: null,
        createdAt: "2026-07-16T10:00:00.000Z",
      },
    ]);
    expect(callOrder).toEqual(["authorize", "client"]);
    expect(query.order).toHaveBeenCalledWith("created_at", { ascending: false });
  });

  it("returns an empty list when no registrations exist", async () => {
    const query = createQuery({ data: null, error: null });
    mocks.createServerSupabaseClient.mockResolvedValue({ from: vi.fn().mockReturnValue(query) });

    await expect(listRegistrations()).resolves.toEqual([]);
  });

  it("authorizes before loading and maps one registration detail", async () => {
    const query = createQuery({ data: row, error: null });
    const from = vi.fn().mockReturnValue(query);
    mocks.createServerSupabaseClient.mockResolvedValue({ from });

    await expect(getRegistration("registration-1")).resolves.toMatchObject({
      id: "registration-1",
      organizationName: "San Isidro LGU",
      status: "Pending",
    });
    expect(mocks.requireSuperAdmin).toHaveBeenCalledOnce();
    expect(from).toHaveBeenCalledWith("registrations");
    expect(query.eq).toHaveBeenCalledWith("id", "registration-1");
  });

  it("returns null when the requested registration does not exist", async () => {
    const query = createQuery({ data: null, error: null });
    mocks.createServerSupabaseClient.mockResolvedValue({ from: vi.fn().mockReturnValue(query) });

    await expect(getRegistration("missing-registration")).resolves.toBeNull();
  });

  it("propagates Supabase errors after authorization", async () => {
    const error = new Error("database unavailable");
    const query = createQuery({ data: null, error });
    mocks.createServerSupabaseClient.mockResolvedValue({ from: vi.fn().mockReturnValue(query) });

    await expect(listRegistrations()).rejects.toBe(error);
    expect(mocks.requireSuperAdmin).toHaveBeenCalledOnce();
  });
});
