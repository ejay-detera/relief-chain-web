"use client";

import { type FormEvent, useActionState, useState } from "react";

import {
  loginAction,
  type LoginActionState,
  type LoginFieldErrors,
} from "@/app/login/actions";

type LoginFormProps = {
  initialAuthError?: string;
};

type DismissedFields = {
  email?: boolean;
  password?: boolean;
};

async function submitLogin(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  return loginAction(formData);
}

function validateFields(email: string, password: string): LoginFieldErrors {
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

export default function LoginForm({ initialAuthError }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [dismissedServerFields, setDismissedServerFields] = useState<DismissedFields>({});
  const [dismissedAuthError, setDismissedAuthError] = useState(false);
  const [actionState, formAction, pending] = useActionState<LoginActionState, FormData>(
    submitLogin,
    { authError: initialAuthError },
  );

  const emailError =
    fieldErrors.email ??
    (dismissedServerFields.email ? undefined : actionState.fieldErrors?.email);
  const passwordError =
    fieldErrors.password ??
    (dismissedServerFields.password ? undefined : actionState.fieldErrors?.password);
  const authError = dismissedAuthError ? undefined : actionState.authError;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const errors = validateFields(email, password);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      event.preventDefault();
      setDismissedAuthError(true);
      return;
    }

    setDismissedAuthError(false);
    setDismissedServerFields({});
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    setDismissedServerFields((current) => ({ ...current, email: true }));
    if (fieldErrors.email) {
      setFieldErrors((current) => ({ ...current, email: undefined }));
    }
    if (authError) {
      setDismissedAuthError(true);
    }
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setDismissedServerFields((current) => ({ ...current, password: true }));
    if (fieldErrors.password) {
      setFieldErrors((current) => ({ ...current, password: undefined }));
    }
    if (authError) {
      setDismissedAuthError(true);
    }
  }

  return (
    <form action={formAction} className="space-y-5" noValidate onSubmit={handleSubmit}>
      {authError ? (
        <p
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {authError}
        </p>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-secondary" htmlFor="email">
          Email address
        </label>
        <input
          aria-describedby={emailError ? "email-error" : undefined}
          aria-invalid={Boolean(emailError)}
          autoComplete="email"
          className="w-full rounded-lg border border-secondary/20 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-red-500"
          id="email"
          name="email"
          onChange={(event) => handleEmailChange(event.target.value)}
          type="email"
          value={email}
        />
        {emailError ? (
          <p className="text-sm text-red-600" id="email-error">
            {emailError}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-secondary" htmlFor="password">
          Password
        </label>
        <input
          aria-describedby={passwordError ? "password-error" : undefined}
          aria-invalid={Boolean(passwordError)}
          autoComplete="current-password"
          className="w-full rounded-lg border border-secondary/20 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-red-500"
          id="password"
          name="password"
          onChange={(event) => handlePasswordChange(event.target.value)}
          type="password"
          value={password}
        />
        {passwordError ? (
          <p className="text-sm text-red-600" id="password-error">
            {passwordError}
          </p>
        ) : null}
      </div>

      <button
        className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-secondary transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        disabled={pending}
        type="submit"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
