import "server-only";

import { revalidatePath } from "next/cache";

import { requireSuperAdmin } from "@/lib/auth/require-super-admin";
import { writeAuditLog } from "@/lib/platform/audit-log";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type MutationResult = { success: true } | { error: string };

function revalidateRegistrationPaths(id: string): void {
  revalidatePath("/dashboard");
  revalidatePath("/organizations");
  revalidatePath(`/organizations/${id}`);
  revalidatePath("/dashboard/organizations");
  revalidatePath(`/dashboard/organizations/${id}`);
  revalidatePath("/audit-log");
  revalidatePath("/dashboard/audit-log");
}

export async function approveRegistration(id: string): Promise<MutationResult> {
  const session = await requireSuperAdmin();

  const supabase = await createServerSupabaseClient();

  const { data: reg } = await supabase
    .from("registrations")
    .select("organization_name")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("registrations")
    .update({ status: "Approved" })
    .eq("id", id)
    .eq("status", "Pending");

  if (error) {
    return { error: error.message };
  }

  await writeAuditLog({
    actorEmail: session.email,
    action: "approve",
    targetName: reg?.organization_name ?? "Organization",
    targetId: id,
    reason: null,
  });

  revalidateRegistrationPaths(id);
  return { success: true };
}

export async function rejectRegistration(
  id: string,
  reason: string,
): Promise<MutationResult> {
  const session = await requireSuperAdmin();

  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    return { error: "A rejection reason is required." };
  }

  const supabase = await createServerSupabaseClient();

  const { data: reg } = await supabase
    .from("registrations")
    .select("organization_name")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("registrations")
    .update({ status: "Rejected", rejection_reason: trimmedReason })
    .eq("id", id)
    .eq("status", "Pending");

  if (error) {
    return { error: error.message };
  }

  await writeAuditLog({
    actorEmail: session.email,
    action: "reject",
    targetName: reg?.organization_name ?? "Organization",
    targetId: id,
    reason: trimmedReason,
  });

  revalidateRegistrationPaths(id);
  return { success: true };
}
