"use server";

import { redirect } from "next/navigation";

import { requireSuperAdmin } from "@/lib/auth/require-super-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export type LoginActionState = {
  fieldErrors?: LoginFieldErrors;
  authError?: string;
};

function getStringField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function validateLoginFields(email: string, password: string): LoginFieldErrors {
  const errors: LoginFieldErrors = {};

  if (!email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export async function loginAction(formData: FormData): Promise<LoginActionState> {
  const email = getStringField(formData, "email");
  const password = getStringField(formData, "password");
  const fieldErrors = validateLoginFields(email, password);

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { authError: "Invalid email or password." };
  }

  await requireSuperAdmin();
  redirect("/dashboard");
}
