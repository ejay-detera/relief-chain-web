import "server-only";

import { revalidatePath } from "next/cache";

import { requireSuperAdmin } from "@/lib/auth/require-super-admin";
import { writeAuditLog } from "@/lib/platform/audit-log";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type MutationResult = { success: true } | { error: string };

/**
 * Suspend an approved organization (reversible).
 * Sets status = 'Suspended' on the registrations row.
 */
export async function suspendOrganization(
  registrationId: string,
  reason: string,
): Promise<MutationResult> {
  const session = await requireSuperAdmin();

  const trimmed = reason.trim();
  if (!trimmed) return { error: "A reason is required to suspend an organization." };

  const supabase = await createServerSupabaseClient();

  const { data: reg } = await supabase
    .from("registrations")
    .select("organization_name")
    .eq("id", registrationId)
    .maybeSingle();

  const { error } = await supabase
    .from("registrations")
    .update({ status: "Suspended", suspension_reason: trimmed })
    .eq("id", registrationId)
    .eq("status", "Approved");

  if (error) return { error: error.message };

  await writeAuditLog({
    actorEmail: session.email,
    action: "suspend",
    targetName: reg?.organization_name ?? "Organization",
    targetId: registrationId,
    reason: trimmed,
  });

  revalidatePath("/organizations");
  revalidatePath(`/organizations/${registrationId}`);
  revalidatePath("/audit-log");
  revalidatePath("/dashboard/organizations");
  revalidatePath(`/dashboard/organizations/${registrationId}`);
  revalidatePath("/dashboard/audit-log");
  return { success: true };
}

/**
 * Reactivate a suspended organization (sets status back to Approved).
 */
export async function reactivateOrganization(
  registrationId: string,
): Promise<MutationResult> {
  const session = await requireSuperAdmin();
  const supabase = await createServerSupabaseClient();

  const { data: reg } = await supabase
    .from("registrations")
    .select("organization_name")
    .eq("id", registrationId)
    .maybeSingle();

  const { error } = await supabase
    .from("registrations")
    .update({ status: "Approved", suspension_reason: null })
    .eq("id", registrationId)
    .eq("status", "Suspended");

  if (error) return { error: error.message };

  await writeAuditLog({
    actorEmail: session.email,
    action: "reactivate",
    targetName: reg?.organization_name ?? "Organization",
    targetId: registrationId,
    reason: null,
  });

  revalidatePath("/organizations");
  revalidatePath(`/organizations/${registrationId}`);
  revalidatePath("/audit-log");
  revalidatePath("/dashboard/organizations");
  revalidatePath(`/dashboard/organizations/${registrationId}`);
  revalidatePath("/dashboard/audit-log");
  return { success: true };
}

/**
 * Soft-delete (deactivate) an organization — not reversible via UI.
 */
export async function deactivateOrganization(
  registrationId: string,
  reason: string,
): Promise<MutationResult> {
  const session = await requireSuperAdmin();

  const trimmed = reason.trim();
  if (!trimmed) return { error: "A reason is required to deactivate an organization." };

  const supabase = await createServerSupabaseClient();

  const { data: reg } = await supabase
    .from("registrations")
    .select("organization_name")
    .eq("id", registrationId)
    .maybeSingle();

  const { error } = await supabase
    .from("registrations")
    .update({ status: "Deactivated", suspension_reason: trimmed })
    .eq("id", registrationId);

  if (error) return { error: error.message };

  await writeAuditLog({
    actorEmail: session.email,
    action: "deactivate",
    targetName: reg?.organization_name ?? "Organization",
    targetId: registrationId,
    reason: trimmed,
  });

  revalidatePath("/organizations");
  revalidatePath(`/organizations/${registrationId}`);
  revalidatePath("/audit-log");
  revalidatePath("/dashboard/organizations");
  revalidatePath(`/dashboard/organizations/${registrationId}`);
  revalidatePath("/dashboard/audit-log");
  return { success: true };
}
