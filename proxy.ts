import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_AUTH_COOKIE_NAME = "supabase.auth.token";
const CHUNK_SUFFIX = /\.\d+$/;

function isSupabaseAuthCookie(name: string): boolean {
  if (name === DEFAULT_AUTH_COOKIE_NAME || name.startsWith(`${DEFAULT_AUTH_COOKIE_NAME}.`)) {
    return name.replace(CHUNK_SUFFIX, "") === DEFAULT_AUTH_COOKIE_NAME;
  }

  // Support the project-scoped cookie name used by Supabase SSR integrations.
  // The current server client uses Supabase Auth's default storage key above.
  return /^sb-.+-auth-token(?:\.\d+)?$/.test(name);
}

/**
 * Optimistic session-cookie check for dashboard navigation.
 *
 * This intentionally does not validate or decode the cookie. The server DAL
 * and Supabase RLS remain the authoritative authentication and authorization
 * boundaries for rendered data and Server Actions.
 */
export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies
    .getAll()
    .some(({ name, value }) => isSupabaseAuthCookie(name) && value.length > 0);

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
