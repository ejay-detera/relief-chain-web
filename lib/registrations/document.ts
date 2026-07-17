import "server-only";

import { requireSuperAdmin } from "@/lib/auth/require-super-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const DOCUMENT_BUCKET = "organization_documents";
const SIGNED_URL_TTL_SECONDS = 300;

/**
 * Returns a short-lived signed URL for a registration's uploaded document.
 *
 * requireSuperAdmin() is the authorization boundary here; the storage RLS
 * policy on `organization_documents` is a second, database-level check that
 * also allows the owning lgu to read their own document.
 */
export async function getRegistrationDocumentUrl(
  documentReference: string,
): Promise<string | null> {
  await requireSuperAdmin();

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .createSignedUrl(documentReference, SIGNED_URL_TTL_SECONDS);

  if (error || !data) {
    return null;
  }

  return data.signedUrl;
}
