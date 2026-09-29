"use server";

import { updateOwnFullName, type MutationResult } from "@/lib/profile/mutations";

export async function updateProfileAction(formData: FormData): Promise<MutationResult> {
  const fullName = formData.get("fullName");
  return updateOwnFullName(typeof fullName === "string" ? fullName : "");
}
