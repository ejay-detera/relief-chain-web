"use client";

import { useActionState, useState } from "react";

import { updateProfileAction } from "@/app/dashboard/profile/actions";

type MutationResult = { success: true } | { error: string };

type ProfileFormProps = {
  initialFullName: string;
};

async function submitProfile(
  _previousState: MutationResult | null,
  formData: FormData,
): Promise<MutationResult> {
  return updateProfileAction(formData);
}

export default function ProfileForm({ initialFullName }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [actionState, formAction, pending] = useActionState<MutationResult | null, FormData>(
    submitProfile,
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      {actionState && "error" in actionState ? (
        <p
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {actionState.error}
        </p>
      ) : null}
      {actionState && "success" in actionState ? (
        <p
          aria-live="polite"
          className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-secondary"
          role="status"
        >
          Profile updated.
        </p>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-secondary" htmlFor="fullName">
          Full name
        </label>
        <input
          className="w-full rounded-lg border border-secondary/20 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          id="fullName"
          name="fullName"
          onChange={(event) => setFullName(event.target.value)}
          type="text"
          value={fullName}
        />
      </div>

      <button
        className="rounded-lg bg-primary px-5 py-3 font-semibold text-secondary transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
