import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock, ArrowLeft, ShieldCheck } from "lucide-react";

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
    <main className="relative isolate flex min-h-screen flex-1 items-center justify-center overflow-hidden px-6 py-12 font-sans">
      {/* Background with original Grainient and bg-secondary/35 overlay */}
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

      {/* Frosted Back Button */}
      <Link
        className="absolute left-6 top-6 flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2.5 text-xs sm:text-sm font-semibold text-secondary shadow-md backdrop-blur-md transition hover:bg-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 sm:left-12 sm:top-8 border border-white/40"
        href="/"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Welcome</span>
      </Link>

      {/* Revamped High-End Login Card */}
      <section className="animate-fade-in-up relative w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10 border border-white/50">
        {/* Top Header Badge Strip */}
        <div className="mb-6 flex items-center justify-between border-b border-secondary/10 pb-4">
          <Image
            src="/assets/Logo.svg"
            alt="Relief Chain"
            width={120}
            height={60}
            priority
            className="h-8 w-auto"
          />
          <div className="flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-bold text-secondary">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Institutional Access</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-6 space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Relief Chain
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-secondary">
            Super Admin login
          </h1>
          <p className="text-xs sm:text-sm leading-relaxed text-dark/70">
            Sign in to review and manage organization registrations.
          </p>
        </div>

        {/* Interactive Form Component */}
        <LoginForm initialAuthError={getAccessError(error)} />

        {/* Security Notice */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-muted/40 p-3 text-center border border-secondary/10">
          <Lock className="h-3.5 w-3.5 shrink-0 text-secondary" />
          <p className="text-[11px] leading-tight text-dark/70">
            Super Admin portal is strictly restricted to accredited disaster oversight officers.
          </p>
        </div>
      </section>
    </main>
  );
}
