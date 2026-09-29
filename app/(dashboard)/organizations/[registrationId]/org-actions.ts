"use server";

import {
  suspendOrganization,
  reactivateOrganization,
  deactivateOrganization,
} from "@/lib/registrations/organization-actions";

export type MutationResult = { success: true } | { error: string };

export async function suspendOrganizationAction(
  registrationId: string,
  reason: string,
): Promise<MutationResult> {
  return suspendOrganization(registrationId, reason);
}

export async function reactivateOrganizationAction(
  registrationId: string,
): Promise<MutationResult> {
  return reactivateOrganization(registrationId);
}

export async function deactivateOrganizationAction(
  registrationId: string,
  reason: string,
): Promise<MutationResult> {
  return deactivateOrganization(registrationId, reason);
}
