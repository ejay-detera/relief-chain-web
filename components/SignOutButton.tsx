"use client";

import { useFormStatus } from "react-dom";

import { signOutAction } from "@/app/dashboard/actions";

function SignOutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <SignOutSubmitButton />
    </form>
  );
}
