"use server";

import {
  approveRegistration,
  rejectRegistration,
  type MutationResult,
} from "@/lib/registrations/mutations";
import { getRegistrationDocumentUrl } from "@/lib/registrations/document";

export type DocumentUrlResult = { url: string } | { error: string };

export async function getRegistrationDocumentUrlAction(
  documentReference: string,
): Promise<DocumentUrlResult> {
  const url = await getRegistrationDocumentUrl(documentReference);

  if (!url) {
    return { error: "This document could not be opened. It may no longer be available." };
  }

  return { url };
}

export async function approveRegistrationAction(
  registrationId: string,
): Promise<MutationResult> {
  return approveRegistration(registrationId);
}

export async function rejectRegistrationAction(
  registrationId: string,
  formData: FormData,
): Promise<MutationResult> {
  const reason = formData.get("reason");
  return rejectRegistration(registrationId, typeof reason === "string" ? reason : "");
}
