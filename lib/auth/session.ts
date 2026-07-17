import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

/**
 * Reads the authenticated user from the server-managed Supabase session.
 *
 * The returned user is only available to server callers. Auth errors are
 * treated as an absent session so callers can apply their own redirect or
 * authorization policy without exposing provider details.
 */
export async function getSessionUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}
