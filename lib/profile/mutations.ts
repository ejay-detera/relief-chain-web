import "server-only";

import { revalidatePath } from "next/cache";

import { requireSuperAdmin } from "@/lib/auth/require-super-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type MutationResult = { success: true } | { error: string };

export async function updateOwnFullName(fullName: string): Promise<MutationResult> {
  const session = await requireSuperAdmin();

  const trimmed = fullName.trim();
  if (!trimmed) {
    return { error: "Full name is required." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: trimmed })
    .eq("id", session.userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/profile");
  return { success: true };
}
