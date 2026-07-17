import "server-only";

import { requireSuperAdmin } from "@/lib/auth/require-super-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Registration } from "@/lib/registrations/types";

type RegistrationRow = {
  id: string;
  organization_name: string;
  organization_type: string;
  contact_info: string;
  representative_first_name: string;
  representative_last_name: string;
  representative_middle_initial: string | null;
  representative_position: string;
  document_reference: string;
  status: Registration["status"];
  rejection_reason: string | null;
  created_at: string;
};

function toRegistration(row: RegistrationRow): Registration {
  return {
    id: row.id,
    organizationName: row.organization_name,
    organizationType: row.organization_type,
    contactInfo: row.contact_info,
    representative: {
      firstName: row.representative_first_name,
      lastName: row.representative_last_name,
      middleInitial: row.representative_middle_initial,
      position: row.representative_position,
    },
    documentReference: row.document_reference,
    status: row.status,
    rejectionReason: row.rejection_reason,
    createdAt: row.created_at,
  };
}

export async function listRegistrations(): Promise<Registration[]> {
  await requireSuperAdmin();

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("registrations")
    .select(
      "id, organization_name, organization_type, contact_info, representative_first_name, representative_last_name, representative_middle_initial, representative_position, document_reference, status, rejection_reason, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => toRegistration(row as RegistrationRow));
}

export async function getRegistration(id: string): Promise<Registration | null> {
  await requireSuperAdmin();

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("registrations")
    .select(
      "id, organization_name, organization_type, contact_info, representative_first_name, representative_last_name, representative_middle_initial, representative_position, document_reference, status, rejection_reason, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toRegistration(data as RegistrationRow) : null;
}
