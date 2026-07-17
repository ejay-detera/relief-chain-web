import "server-only";

import { requireSuperAdmin } from "@/lib/auth/require-super-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SuperAdminProfile = {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string | null;
};

export async function getOwnProfile(): Promise<SuperAdminProfile> {
  const session = await requireSuperAdmin();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, created_at")
    .eq("id", session.userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return {
    id: session.userId,
    email: session.email,
    fullName: data?.full_name ?? null,
    createdAt: data?.created_at ?? null,
  };
}
