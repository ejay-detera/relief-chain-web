"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Terminates the server-managed Supabase session before returning to login.
 * Server Actions are public POST entry points, so this action intentionally
 * performs the mutation on the server rather than relying on client routing.
 */
export async function signOutAction(): Promise<never> {
  const supabase = await createServerSupabaseClient();

  try {
    await supabase.auth.signOut();
  } finally {
    redirect("/login");
  }
}
