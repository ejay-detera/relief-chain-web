"use client";

import { useActionState, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  RotateCcw,
  Save,
  Sparkles,
  User,
} from "lucide-react";

import { updateProfileAction } from "@/app/(dashboard)/profile/actions";

type MutationResult = { success: true } | { error: string };

type ProfileFormProps = {
  initialFullName: string;
  email: string;
};

async function submitProfile(
  _previousState: MutationResult | null,
  formData: FormData,
): Promise<MutationResult> {
  return updateProfileAction(formData);
}

export default function ProfileForm({ initialFullName, email }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [actionState, formAction, pending] = useActionState<MutationResult | null, FormData>(
    submitProfile,
    null,
  );

  // If server action succeeded, update initial baseline
  const [savedName, setSavedName] = useState(initialFullName);
  useEffect(() => {
    if (actionState && "success" in actionState) {
      setSavedName(fullName.trim());
    }
  }, [actionState, fullName]);

  const isDirty = fullName.trim() !== savedName.trim();

  function handleReset() {
    setFullName(savedName);
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Status Notifications */}
      {actionState && "error" in actionState ? (
        <div
          aria-live="polite"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-800 shadow-xs"
          role="alert"
        >
          <AlertCircle aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="font-semibold">Unable to save profile</p>
            <p className="mt-0.5 text-xs text-red-700">{actionState.error}</p>
          </div>
        </div>
      ) : null}

      {actionState && "success" in actionState ? (
        <div
          aria-live="polite"
          className="flex items-start gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm text-secondary shadow-xs"
          role="status"
        >
          <CheckCircle2
            aria-hidden="true"
            size={18}
            className="mt-0.5 shrink-0 text-secondary stroke-[2.5]"
          />
          <div className="flex-1">
            <p className="font-semibold">Profile updated successfully</p>
            <p className="mt-0.5 text-xs text-dark/70">
              Your administrative full name has been updated and reflected across the system.
            </p>
          </div>
        </div>
      ) : null}

      {/* Form Fields Grid */}
      <div className="space-y-5">
        {/* Full Name Field */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark/60"
              htmlFor="fullName"
            >
              <User aria-hidden="true" size={14} className="text-secondary" />
              Full Name
            </label>
            {isDirty && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[11px] font-bold text-dark/80">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Unsaved changes
              </span>
            )}
          </div>

          <div className="relative">
            <input
              autoComplete="name"
              className="w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-sm font-medium text-dark shadow-xs outline-none transition placeholder:text-dark/30 focus:border-secondary focus:ring-3 focus:ring-secondary/10"
              id="fullName"
              name="fullName"
              onChange={(event) => setFullName(event.target.value)}
              placeholder="e.g. Maria Santos"
              required
              type="text"
              value={fullName}
            />
          </div>
          <p className="mt-1.5 text-xs text-dark/50">
            This name appears on organization approval signatures and audit trail entries.
          </p>
        </div>

        {/* Email Address (Read-only System Field) */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark/60"
              htmlFor="email-display"
            >
              <Mail aria-hidden="true" size={14} className="text-secondary" />
              Email Address
            </label>
            <span className="inline-flex items-center gap-1 rounded-full border border-dark/10 bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-dark/60">
              <Lock aria-hidden="true" size={10} />
              Managed by Auth
            </span>
          </div>

          <div className="relative">
            <input
              className="w-full cursor-not-allowed rounded-xl border border-dark/10 bg-muted/60 px-4 py-3 text-sm font-medium text-dark/70 shadow-xs outline-none"
              disabled
              id="email-display"
              readOnly
              type="email"
              value={email}
            />
          </div>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-dark/50">
            <Sparkles aria-hidden="true" size={12} className="text-primary" />
            Super Admin email is authenticated via Supabase Auth credentials.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-dark/10 pt-5 sm:flex-row sm:items-center sm:justify-end">
        {isDirty ? (
          <button
            type="button"
            onClick={handleReset}
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark/15 bg-white px-4 py-2.5 text-xs font-semibold text-dark/70 shadow-xs transition hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw aria-hidden="true" size={14} />
            Discard changes
          </button>
        ) : null}

        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-secondary shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          disabled={pending || (!isDirty && actionState === null)}
          type="submit"
        >
          {pending ? (
            <>
              <svg
                className="h-4 w-4 animate-spin text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8v8H4z"
                  fill="currentColor"
                />
              </svg>
              <span>Saving changes...</span>
            </>
          ) : (
            <>
              <Save aria-hidden="true" size={14} />
              <span>Save changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
