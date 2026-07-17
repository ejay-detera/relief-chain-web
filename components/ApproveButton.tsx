'use client';

import { useActionState } from "react";

import type { RegistrationStatus } from "@/lib/registrations/types";

type MutationResult = { success: true } | { error: string };
type ApproveAction = (registrationId: string) => Promise<MutationResult>;

type ApproveButtonProps = {
  registrationId: string;
  status: RegistrationStatus;
  approveAction?: ApproveAction;
};

const unavailableAction: ApproveAction = async () => ({
  error: "The approve action is unavailable.",
});

type ActionState = MutationResult | null;

export default function ApproveButton({
  registrationId,
  status,
  approveAction = unavailableAction,
}: ApproveButtonProps) {
  const [actionState, formAction, pending] = useActionState<ActionState, FormData>(
    async () => approveAction(registrationId),
    null,
  );

  if (status !== "Pending") {
    return null;
  }

  return (
    <div className="space-y-3">
      {actionState && "error" in actionState ? (
        <p aria-live="polite" className="text-sm text-red-700" role="alert">
          {actionState.error}
        </p>
      ) : null}
      <form action={formAction}>
        <button
          className="rounded-lg bg-primary px-5 py-3 font-semibold text-secondary transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? "Approving..." : "Approve registration"}
        </button>
      </form>
    </div>
  );
}
