import "server-only";

import { revalidatePath } from "next/cache";

import { requireSuperAdmin } from "@/lib/auth/require-super-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type MutationResult = { success: true } | { error: string };

function revalidateRegistrationPaths(id: string): void {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/organizations");
  revalidatePath(`/dashboard/organizations/${id}`);
}

export async function approveRegistration(id: string): Promise<MutationResult> {
  await requireSuperAdmin();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("registrations")
    .update({ status: "Approved" })
    .eq("id", id)
    .eq("status", "Pending");

  if (error) {
    return { error: error.message };
  }

  revalidateRegistrationPaths(id);
  return { success: true };
}

export async function rejectRegistration(
  id: string,
  reason: string,
): Promise<MutationResult> {
  await requireSuperAdmin();

  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    return { error: "A rejection reason is required." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("registrations")
    .update({ status: "Rejected", rejection_reason: trimmedReason })
    .eq("id", id)
    .eq("status", "Pending");

  if (error) {
    return { error: error.message };
  }

  revalidateRegistrationPaths(id);
  return { success: true };
}
