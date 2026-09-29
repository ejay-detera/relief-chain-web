"use client";

import { Zap, Database, ShieldCheck, Radio, Users } from "lucide-react";

import FadeInSection from "@/components/landing/FadeInSection";

export default function TechnologySection() {
  return (
    <FadeInSection
      id="technology"
      className="min-h-[100dvh] flex flex-col justify-center bg-secondary text-white px-6 py-12 sm:px-12 lg:py-16"
    >
      <div className="mx-auto max-w-7xl w-full">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-0.5 text-[11px] font-bold text-primary uppercase tracking-wider">
            <Zap className="h-3 w-3" />
            Technology Architecture
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Engineered for High-Stakes Disaster Resilience
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-white/80">
            Relief Chain combines decentralized ledger technology, serverless edge infrastructure,
            and offline-first cryptographic validation.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md transition-all hover:-translate-y-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Database className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-sm sm:text-base font-bold text-white">Stellar & Soroban</h3>
            <p className="mt-1.5 text-[11px] sm:text-xs text-white/70 leading-relaxed">
              3 to 5 second settlement with near-zero transaction fees. Smart contracts enforce
              conservation invariants so vouchers cannot be counterfeited or double-redeemed.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md transition-all hover:-translate-y-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-sm sm:text-base font-bold text-white">Supabase Control Plane</h3>
            <p className="mt-1.5 text-[11px] sm:text-xs text-white/70 leading-relaxed">
              54 relational tables with 77 strict Row-Level Security (RLS) policies. Edge
              Functions manage two-phase prepare/submit envelopes without taking key custody.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md transition-all hover:-translate-y-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Radio className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-sm sm:text-base font-bold text-white">Offline Cryptography</h3>
            <p className="mt-1.5 text-[11px] sm:text-xs text-white/70 leading-relaxed">
              When cell towers fall, devices validate signed voucher payloads locally. Pending
              records sync seamlessly to the chain once connectivity is recovered.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md transition-all hover:-translate-y-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-sm sm:text-base font-bold text-white">Anti-Fraud Deduplication</h3>
            <p className="mt-1.5 text-[11px] sm:text-xs text-white/70 leading-relaxed">
              Automated intake matching cross-checks National ID, Barangay records, and family
              heads, preventing ghost beneficiaries across relief drives.
            </p>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
