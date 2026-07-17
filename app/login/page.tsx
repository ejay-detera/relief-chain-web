import Link from "next/link";
import { redirect } from "next/navigation";

import LoginForm from "@/app/login/LoginForm";
import Grainient from "@/components/Grainient";
import { requireSuperAdmin } from "@/lib/auth/require-super-admin";
import { getSessionUser } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

function getAccessError(error: string | string[] | undefined): string | undefined {
  if (error === "access-denied" || (Array.isArray(error) && error.includes("access-denied"))) {
    return "This account is not authorized to access the Super Admin dashboard.";
  }

  return undefined;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getSessionUser();

  if (user) {
    await requireSuperAdmin();
    redirect("/dashboard");
  }

  const { error } = await searchParams;

  return (
    <main className="relative isolate flex min-h-full flex-1 items-center justify-center overflow-hidden px-6 py-12 font-sans">
      <div className="absolute inset-0 -z-10">
        <Grainient
          color1="#6FCA4B"
          color2="#112E58"
          color3="#E4CF10"
          timeSpeed={0.2}
          colorBalance={0.1}
          warpStrength={1.1}
          warpFrequency={4.0}
          warpSpeed={1.4}
          warpAmplitude={45.0}
          blendSoftness={0.12}
          rotationAmount={360.0}
          noiseScale={1.6}
          grainAmount={0.08}
          grainScale={2.5}
          grainAnimated
          contrast={1.25}
          saturation={1.05}
          zoom={1.1}
        />
        <div className="absolute inset-0 bg-secondary/35" />
      </div>

      <Link
        className="absolute left-6 top-6 flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-secondary shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 sm:left-12 sm:top-8"
        href="/"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </Link>

      <section className="animate-fade-in-up w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-secondary/10 sm:p-10">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Relief Chain
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-secondary">
            Super Admin login
          </h1>
          <p className="text-sm leading-6 text-dark/70">
            Sign in to review and manage organization registrations.
          </p>
        </div>
        <LoginForm initialAuthError={getAccessError(error)} />
      </section>
    </main>
  );
}
