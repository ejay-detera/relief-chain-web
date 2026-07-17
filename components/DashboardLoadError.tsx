"use client";

import Link from "next/link";

import SignOutButton from "@/components/SignOutButton";

type DashboardLoadErrorProps = {
  onRetry?: () => void;
};

export default function DashboardLoadError({ onRetry }: DashboardLoadErrorProps) {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-muted px-6 py-12 font-sans">
      <section
        aria-labelledby="dashboard-load-error-title"
        className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl shadow-secondary/10"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Relief Chain
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-secondary" id="dashboard-load-error-title">
          Dashboard unavailable
        </h1>
        <p className="mt-3 text-sm leading-6 text-dark/70">
          We could not load the dashboard after establishing your session. Try again or sign out and return to login.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {onRetry ? (
            <button
              className="rounded-lg bg-primary px-4 py-3 font-semibold text-secondary transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={onRetry}
              type="button"
            >
              Try again
            </button>
          ) : (
            <Link
              className="rounded-lg bg-primary px-4 py-3 font-semibold text-secondary transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              href="/dashboard"
            >
              Try again
            </Link>
          )}
          <SignOutButton />
        </div>
      </section>
    </main>
  );
}
