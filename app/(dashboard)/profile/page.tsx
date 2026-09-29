import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck2,
  KeyRound,
  LayoutDashboard,
  Lock,
  Mail,
  ScrollText,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import CopyButton from "@/components/dashboard/CopyButton";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { getOwnProfile } from "@/lib/profile/queries";

export default async function ProfilePage() {
  const profile = await getOwnProfile();

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const memberSinceYear = profile.createdAt
    ? new Date(profile.createdAt).getFullYear()
    : "2026";

  // Derive initials from full name or email
  const displayName = profile.fullName?.trim() || "Relief Chain Super Admin";
  const initials = displayName
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "SA";

  return (
    <section aria-labelledby="profile-title" className="space-y-8">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-secondary px-7 py-8 text-white shadow-sm">
        {/* Decorative background glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-1/3 h-40 w-40 rounded-full bg-accent/10 blur-2xl"
        />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <ShieldCheck aria-hidden="true" size={14} className="stroke-[2.5]" />
                Super Admin Account
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Active Session
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl" id="profile-title">
              Administrator Profile
            </h1>
            <p className="max-w-xl text-sm text-white/70">
              Manage your administrator identity, view active system authorizations, and monitor platform credentials.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/audit-log"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white shadow-xs backdrop-blur-xs transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ScrollText aria-hidden="true" size={15} />
              View Audit Log
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Identity & Privileges Column, Right Details & Security Column */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column (Identity, Privileges, Quick Links) */}
        <div className="space-y-6 lg:col-span-5 xl:col-span-4">
          {/* Identity Card */}
          <div className="overflow-hidden rounded-2xl border border-dark/10 bg-white shadow-sm">
            {/* Card Cover Banner */}
            <div className="relative h-24 bg-gradient-to-r from-secondary via-secondary to-[#1b437e] px-6">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)/0.25,transparent_50%)]"
              />
              <div className="absolute right-4 top-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                  <Shield aria-hidden="true" size={12} className="text-primary" />
                  Level 1 Authority
                </span>
              </div>
            </div>

            {/* Avatar & Key Profile Info */}
            <div className="relative px-6 pb-6 pt-0">
              {/* Overlapping Avatar */}
              <div className="-mt-12 mb-4 flex items-end justify-between">
                <div className="relative">
                  <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary text-2xl font-black text-white shadow-md ring-4 ring-white">
                    {initials}
                  </span>
                  <span
                    title="Session is active and verified"
                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary ring-2 ring-white shadow-xs"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      size={14}
                      className="text-secondary stroke-[2.5]"
                    />
                  </span>
                </div>

                <span className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-secondary">
                  Super Admin
                </span>
              </div>

              {/* Name & Role */}
              <div>
                <h2 className="text-xl font-bold tracking-tight text-secondary">
                  {displayName}
                </h2>
                <p className="mt-0.5 text-xs text-dark/60">
                  Relief Chain Platform Administrator
                </p>
              </div>

              {/* Meta details list */}
              <div className="mt-6 space-y-3.5 border-t border-dark/10 pt-5">
                {/* Email address */}
                <div>
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-dark/50">
                    <Mail aria-hidden="true" size={13} className="text-secondary" />
                    Admin Email
                  </dt>
                  <dd className="mt-1 flex items-center justify-between text-xs font-semibold text-secondary">
                    <span className="truncate pr-2">{profile.email}</span>
                    <CopyButton text={profile.email} label="Copy" />
                  </dd>
                </div>

                {/* Account UUID */}
                <div>
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-dark/50">
                    <KeyRound aria-hidden="true" size={13} className="text-secondary" />
                    Account User ID
                  </dt>
                  <dd className="mt-1 flex items-center justify-between gap-2">
                    <span
                      title={profile.id}
                      className="truncate font-mono text-[11px] text-dark/70 bg-muted/60 px-2 py-0.5 rounded border border-dark/5"
                    >
                      {profile.id}
                    </span>
                    <CopyButton text={profile.id} label="Copy ID" />
                  </dd>
                </div>

                {/* Member Since */}
                <div>
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-dark/50">
                    <Calendar aria-hidden="true" size={13} className="text-secondary" />
                    Member Since
                  </dt>
                  <dd className="mt-1 text-xs font-semibold text-secondary">
                    {memberSince}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Administrative Privileges Card */}
          <div className="rounded-2xl border border-dark/10 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">
                Administrative Privileges
              </h3>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-secondary">
                Full Clearance
              </span>
            </div>

            <ul className="space-y-3 text-xs text-dark/80">
              <li className="flex items-start gap-2.5">
                <CheckCircle2
                  aria-hidden="true"
                  size={16}
                  className="mt-0.5 shrink-0 text-primary stroke-[2.5]"
                />
                <div>
                  <span className="font-bold text-secondary">Organization Verification</span>
                  <p className="text-dark/60 text-[11px]">
                    Review, approve, reject, and suspend relief organization applications.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2
                  aria-hidden="true"
                  size={16}
                  className="mt-0.5 shrink-0 text-primary stroke-[2.5]"
                />
                <div>
                  <span className="font-bold text-secondary">Audit Trail Inspection</span>
                  <p className="text-dark/60 text-[11px]">
                    Access full chronological logs of all platform actions and decisions.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2
                  aria-hidden="true"
                  size={16}
                  className="mt-0.5 shrink-0 text-primary stroke-[2.5]"
                />
                <div>
                  <span className="font-bold text-secondary">Fund & Distribution Oversight</span>
                  <p className="text-dark/60 text-[11px]">
                    Monitor aid disbursement volume and program-level allocations.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2
                  aria-hidden="true"
                  size={16}
                  className="mt-0.5 shrink-0 text-primary stroke-[2.5]"
                />
                <div>
                  <span className="font-bold text-secondary">RLS Policy Authorization</span>
                  <p className="text-dark/60 text-[11px]">
                    Root server-side privileges enforced by Supabase database policies.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Navigation Card */}
          <div className="rounded-2xl border border-dark/10 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-dark/50">
              Administrative Shortcuts
            </h3>
            <div className="space-y-1.5">
              <Link
                href="/organizations"
                className="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-secondary transition hover:bg-muted"
              >
                <span className="flex items-center gap-2.5">
                  <Building2 aria-hidden="true" size={15} className="text-dark/50 group-hover:text-secondary" />
                  Review Organizations Queue
                </span>
                <ArrowRight aria-hidden="true" size={13} className="text-dark/30 transition group-hover:translate-x-0.5 group-hover:text-secondary" />
              </Link>
              <Link
                href="/audit-log"
                className="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-secondary transition hover:bg-muted"
              >
                <span className="flex items-center gap-2.5">
                  <ScrollText aria-hidden="true" size={15} className="text-dark/50 group-hover:text-secondary" />
                  View Platform Audit Trail
                </span>
                <ArrowRight aria-hidden="true" size={13} className="text-dark/30 transition group-hover:translate-x-0.5 group-hover:text-secondary" />
              </Link>
              <Link
                href="/dashboard"
                className="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-secondary transition hover:bg-muted"
              >
                <span className="flex items-center gap-2.5">
                  <LayoutDashboard aria-hidden="true" size={15} className="text-dark/50 group-hover:text-secondary" />
                  Platform Overview & Metrics
                </span>
                <ArrowRight aria-hidden="true" size={13} className="text-dark/30 transition group-hover:translate-x-0.5 group-hover:text-secondary" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (Edit Form & Security Details) */}
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          {/* Personal Information & Profile Form Card */}
          <div className="rounded-2xl border border-dark/10 bg-white p-7 shadow-sm">
            <div className="mb-6 border-b border-dark/10 pb-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <UserCheck aria-hidden="true" size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-secondary">
                    Personal & Administrative Details
                  </h2>
                  <p className="text-xs text-dark/60">
                    Update your full name as recognized across administrative audit logs.
                  </p>
                </div>
              </div>
            </div>

            <ProfileForm
              email={profile.email}
              initialFullName={profile.fullName ?? ""}
            />
          </div>

          {/* Account Security & Authentication Specifications */}
          <div className="rounded-2xl border border-dark/10 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-secondary">
                <KeyRound aria-hidden="true" size={20} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-secondary">
                  Security & Access Governance
                </h2>
                <p className="text-xs text-dark/60">
                  Authentication parameters and data protection standards for this administrator account.
                </p>
              </div>
            </div>

            {/* Spec Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-dark/10 bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck aria-hidden="true" size={16} className="text-primary stroke-[2.5]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-dark/50">
                    Role Tier
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-secondary">
                  Super Administrator
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-dark/60">
                  Full clearance level across all Relief Chain services and database relations.
                </p>
              </div>

              <div className="rounded-xl border border-dark/10 bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <Lock aria-hidden="true" size={16} className="text-secondary" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-dark/50">
                    Auth Method
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-secondary">
                  Supabase Auth
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-dark/60">
                  Protected with encrypted JWT cookies, session validation, and PKCE flow.
                </p>
              </div>

              <div className="rounded-xl border border-dark/10 bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <FileCheck2 aria-hidden="true" size={16} className="text-accent stroke-[2.5]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-dark/50">
                    Audit Status
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-secondary">
                  Immutable Logs
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-dark/60">
                  Every status modification and application review is permanently recorded.
                </p>
              </div>
            </div>

            {/* Security Notice Callout */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-dark/10 bg-secondary/5 p-4 text-xs text-secondary">
              <ShieldAlert aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-secondary" />
              <div>
                <p className="font-bold text-secondary">Security Protocol</p>
                <p className="mt-0.5 leading-relaxed text-dark/70">
                  To safeguard the integrity of disaster relief fund allocations, Super Admin credentials require active session verification. If you require credentials rotation or role delegation, please submit a request to the platform security team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
