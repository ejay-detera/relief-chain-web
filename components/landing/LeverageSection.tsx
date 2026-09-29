"use client";

import { Activity, Check } from "lucide-react";

import FadeInSection from "@/components/landing/FadeInSection";

export default function LeverageSection() {
  return (
    <FadeInSection
      id="leverage"
      className="min-h-[100dvh] flex flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:py-16"
    >
      <div className="mx-auto max-w-7xl w-full">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-0.5 text-[11px] font-bold text-secondary uppercase tracking-wider">
            <Activity className="h-3 w-3 text-secondary" />
            Platform Leverage
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-secondary">
            Why Relief Chain Outperforms Traditional Relief
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-dark/70">
            Traditional disaster relief relies on manual paper ledgers, vulnerable cash envelopes,
            and slow logistics. Relief Chain creates an accountable, real-time aid pipeline.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-dark/10 shadow-sm">
          <div className="grid grid-cols-12 bg-secondary text-white font-bold text-xs sm:text-sm p-3 sm:p-3.5">
            <div className="col-span-4 sm:col-span-3">Relief Metric</div>
            <div className="col-span-4 sm:col-span-4 text-white/70">Traditional Method</div>
            <div className="col-span-4 sm:col-span-5 text-primary">Relief Chain Platform</div>
          </div>

          <div className="divide-y divide-dark/5 bg-white text-[11px] sm:text-xs">
            <div className="grid grid-cols-12 p-3 sm:p-3.5 items-center">
              <div className="col-span-4 sm:col-span-3 font-bold text-secondary">
                Fraud & Ghost Claims
              </div>
              <div className="col-span-4 sm:col-span-4 text-dark/70">
                High; ghost entries & fake lists
              </div>
              <div className="col-span-4 sm:col-span-5 font-semibold text-primary flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" /> Algorithmic duplicate blocking
              </div>
            </div>

            <div className="grid grid-cols-12 p-3 sm:p-3.5 items-center bg-muted/30">
              <div className="col-span-4 sm:col-span-3 font-bold text-secondary">
                Cash Handling Risk
              </div>
              <div className="col-span-4 sm:col-span-4 text-dark/70">
                Severe security & theft exposure
              </div>
              <div className="col-span-4 sm:col-span-5 font-semibold text-primary flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" /> 0% physical cash handling
              </div>
            </div>

            <div className="grid grid-cols-12 p-3 sm:p-3.5 items-center">
              <div className="col-span-4 sm:col-span-3 font-bold text-secondary">
                Disbursement Speed
              </div>
              <div className="col-span-4 sm:col-span-4 text-dark/70">
                Days to weeks of paperwork
              </div>
              <div className="col-span-4 sm:col-span-5 font-semibold text-primary flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" /> Instant mobile QR voucher release
              </div>
            </div>

            <div className="grid grid-cols-12 p-3 sm:p-3.5 items-center bg-muted/30">
              <div className="col-span-4 sm:col-span-3 font-bold text-secondary">
                Audit Transparency
              </div>
              <div className="col-span-4 sm:col-span-4 text-dark/70">
                Slow paper receipts & loss
              </div>
              <div className="col-span-4 sm:col-span-5 font-semibold text-primary flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" /> 100% immutable Stellar ledger
              </div>
            </div>

            <div className="grid grid-cols-12 p-3 sm:p-3.5 items-center">
              <div className="col-span-4 sm:col-span-3 font-bold text-secondary">
                Local Economy
              </div>
              <div className="col-span-4 sm:col-span-4 text-dark/70">
                External goods hurt local stores
              </div>
              <div className="col-span-4 sm:col-span-5 font-semibold text-primary flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" /> Direct stimulus for sari-sari stores
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
