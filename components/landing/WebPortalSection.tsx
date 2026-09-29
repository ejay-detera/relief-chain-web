"use client";

import Link from "next/link";
import { ShieldCheck, FileCheck2, Activity, Lock, ArrowRight } from "lucide-react";

import FadeInSection from "@/components/landing/FadeInSection";

export default function WebPortalSection() {
  return (
    <FadeInSection
      id="web-app"
      className="min-h-[100dvh] flex flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:py-16"
    >
      <div className="mx-auto max-w-7xl w-full">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-0.5 text-[11px] font-bold text-secondary uppercase tracking-wider">
              <ShieldCheck className="h-3 w-3 text-secondary" />
              The Web Control Plane
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-secondary">
              Super Admin Oversight & Accreditation Review
            </h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-dark/70">
              While the mobile app drives relief distribution on the ground, this web application
              gives Super Admins centralized governance. Review incoming organization registrations,
              verify legal accreditation documents, and audit real-time disaster metrics.
            </p>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-start gap-2.5 rounded-xl border border-dark/10 bg-muted/30 p-3">
                <FileCheck2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-secondary">
                    Organization Verification & Accreditation
                  </h4>
                  <p className="mt-0.5 text-[11px] text-dark/70">
                    Inspect SEC/DTI documentation and official government authorizations to approve
                    or reject relief operators before they distribute vouchers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-dark/10 bg-muted/30 p-3">
                <Activity className="h-4 w-4 shrink-0 text-secondary mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-secondary">
                    Real-Time Distribution Metrics
                  </h4>
                  <p className="mt-0.5 text-[11px] text-dark/70">
                    Live tracking across municipalities, voucher issuance volume, merchant
                    redemptions, and remaining emergency relief allocations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-dark/10 bg-muted/30 p-3">
                <Lock className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-secondary">
                    Zero Private Key Custody
                  </h4>
                  <p className="mt-0.5 text-[11px] text-dark/70">
                    The web server never holds beneficiary or merchant private keys. Transactions
                    are prepared securely and signed directly on client devices.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-secondary/90 shadow-sm"
              >
                <span>Go to Super Admin dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Portal Review Mockup */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-dark/10 bg-secondary p-5 sm:p-6 text-white shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="text-xs font-semibold text-white/80">
                    Super Admin Review Queue
                  </span>
                </div>
                <span className="rounded bg-primary/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  Live Portal
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-white/10 p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white">City Disaster Office - Naga</p>
                      <p className="text-[11px] text-white/60">DTI / LGU Registration Document</p>
                    </div>
                    <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                      Pending
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-white/10 p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white">
                        Philippine Red Cross - Albay
                      </p>
                      <p className="text-[11px] text-white/60">Accredited NGO • 5,000 Beneficiaries</p>
                    </div>
                    <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                      Approved
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/5 p-3 text-center">
                  <p className="text-[11px] text-white/70">
                    Control plane backed by 54 tables, 77 RLS policies, and immutable Stellar
                    records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
