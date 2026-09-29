"use server";

import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/platform/audit-log";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Terminates the server-managed Supabase session before returning to login.
 * Server Actions are public POST entry points, so this action intentionally
 * performs the mutation on the server rather than relying on client routing.
 */
export async function signOutAction(): Promise<never> {
  try {
    const user = await getSessionUser();
    if (user?.email) {
      await writeAuditLog({
        actorEmail: user.email,
        action: "logout",
        targetName: "Super Admin Portal",
        targetId: user.id,
        reason: "Administrator signed out of session",
      });
    }
  } catch (err) {
    console.warn("Failed to record sign out audit log", err);
  }

  const supabase = await createServerSupabaseClient();

  try {
    await supabase.auth.signOut();
  } finally {
    redirect("/login");
  }
}
