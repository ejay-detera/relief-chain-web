import "server-only";

import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SuperAdminSession = {
  userId: string;
  email: string;
};

/**
 * Enforces the server-side authorization boundary for the web dashboard.
 *
 * This function returns a minimal session DTO and never returns profile or
 * registration data to callers.
 */
export async function requireSuperAdmin(): Promise<SuperAdminSession> {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createServerSupabaseClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || profile?.role !== "super_admin") {
    try {
      await supabase.auth.signOut();
    } finally {
      redirect("/login?error=access-denied");
    }
  }

  return {
    userId: user.id,
    email: user.email ?? "",
  };
}
