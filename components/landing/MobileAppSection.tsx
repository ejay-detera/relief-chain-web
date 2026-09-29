"use client";

import { useState } from "react";
import {
  Smartphone,
  CheckCircle2,
  Users,
  Store,
  Building2,
  Sparkles,
  QrCode,
} from "lucide-react";

import FadeInSection from "@/components/landing/FadeInSection";
import PhoneMockup from "@/components/PhoneMockup";

type MobileRole = "beneficiary" | "merchant" | "lgu";

interface RoleFeature {
  title: string;
  description: string;
}

const mobileRoleDetails: Record<
  MobileRole,
  {
    roleName: string;
    tagline: string;
    badge: string;
    description: string;
    features: RoleFeature[];
    quote: string;
  }
> = {
  beneficiary: {
    roleName: "Beneficiaries & Households",
    tagline: "Dignified, secure, and instant disaster assistance",
    badge: "Aid Recipient Surface",
    description:
      "Displaced families receive purpose-bound digital vouchers directly on their phone or via verified QR codes. No cash envelopes, zero risk of theft, and complete clarity on assistance.",
    features: [
      {
        title: "Purpose-Specific Vouchers",
        description: "Aid is programmatically tagged for essential needs like food and medicine.",
      },
      {
        title: "Offline QR Code Display",
        description: "Vouchers display and validate offline without active cellular data or Wi-Fi.",
      },
      {
        title: "SMS Notifications",
        description: "Real-time alerts notify families when assistance is approved or released.",
      },
      {
        title: "Biometric & ID Protection",
        description: "Secured by device biometrics and linked to National ID / Barangay records.",
      },
    ],
    quote: "Families purchase the exact supplies they need with a quick QR scan at local stores.",
  },
  merchant: {
    roleName: "Accredited Local Merchants",
    tagline: "Empowering sari-sari stores as relief partners",
    badge: "Redemption Network Surface",
    description:
      "Local neighborhood groceries and sari-sari stores become frontline relief centers. Merchants scan beneficiary QR codes and receive instant, verifiable blockchain settlement.",
    features: [
      {
        title: "Camera QR Scanner",
        description: "Scans vouchers in milliseconds to validate balance and eligible supplies.",
      },
      {
        title: "Offline Verification",
        description: "Authenticates vouchers during blackouts, syncing once network restores.",
      },
      {
        title: "Stellar Settlement",
        description: "Automated ledger settlement eliminates manual paper voucher cycles.",
      },
      {
        title: "Local Stimulus",
        description: "Disaster recovery capital circulates directly within the affected community.",
      },
    ],
    quote: "Sari-sari store owners scan the QR voucher and know settlement is secured on-chain.",
  },
  lgu: {
    roleName: "Organizers (LGUs & NGOs)",
    tagline: "Accelerated intake, zero paperwork, and zero ghost beneficiaries",
    badge: "Organization Field Surface",
    description:
      "Local government units and humanitarian NGOs rapidly onboard displaced residents at evacuation centers, verify credentials on-site, and disburse relief programs with automated fraud detection.",
    features: [
      {
        title: "Rapid Evacuation Intake",
        description: "Registers households in seconds using mobile camera document capture.",
      },
      {
        title: "Duplicate Detection",
        description: "Cross-references household data in real-time to block duplicate claims.",
      },
      {
        title: "Batch Disbursement",
        description: "Authorizes emergency vouchers to thousands of recipients in one click.",
      },
      {
        title: "Live Field Monitoring",
        description: "Tracks redemption progress and remaining supplies per evacuation zone.",
      },
    ],
    quote: "Field teams from LGUs and NGOs register entire shelters in hours, with duplicate checks blocking fraud.",
  },
};

export default function MobileAppSection() {
  const [activeRole, setActiveRole] = useState<MobileRole>("beneficiary");
  const role = mobileRoleDetails[activeRole];

  return (
    <FadeInSection
      id="mobile-app"
      className="relative isolate min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-secondary via-[#0E274A] to-secondary px-6 py-12 sm:px-12 lg:py-16 text-white"
    >
      {/* Ambient Glow Orbs for Flagship Mobile Section */}
      <div className="pointer-events-none absolute -top-24 right-1/4 -z-10 h-96 w-96 rounded-full bg-primary/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 left-10 -z-10 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />

      <div className="mx-auto max-w-7xl w-full">
        {/* Colorful Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/20 px-3.5 py-1 text-[11px] font-bold text-primary uppercase tracking-wider shadow-sm backdrop-blur-md">
            <Smartphone className="h-3.5 w-3.5 text-primary" />
            The Main Mobile Application
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            One Mobile Binary. Three Operational Field Surfaces.
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-white/85">
            Built with React Native and Expo, Relief Chain is the primary field engine that powers
            disaster aid even during complete telecommunications blackouts.
          </p>
        </div>

        {/* Role Switcher Tabs with Vibrant Active State */}
        <div className="mt-5 flex justify-center">
          <div className="inline-flex rounded-xl border border-white/20 bg-white/10 p-1 shadow-lg backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveRole("beneficiary")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeRole === "beneficiary"
                  ? "bg-primary text-secondary shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Beneficiaries</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole("merchant")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeRole === "merchant"
                  ? "bg-primary text-secondary shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              <span>Accredited Merchants</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole("lgu")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeRole === "lgu"
                  ? "bg-primary text-secondary shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Organizers (LGUs & NGOs)</span>
            </button>
          </div>
        </div>

        {/* Vibrant Glass Role Card with Generous Breathing Room */}
        <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <span className="inline-block rounded-md border border-primary/30 bg-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                {role.badge}
              </span>
              <h3 className="mt-1.5 text-xl sm:text-2xl font-bold text-white">
                {role.roleName}
              </h3>
              <p className="mt-0.5 text-xs font-semibold text-accent">{role.tagline}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/90">
                {role.description}
              </p>

              {/* 4 Features */}
              <div className="mt-3.5 grid gap-2 sm:grid-cols-2">
                {role.features.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-lg border border-white/15 bg-white/5 p-2.5 backdrop-blur-sm transition hover:border-primary/40 hover:bg-white/10"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{feature.title}</h4>
                        <p className="mt-0.5 text-[11px] leading-tight text-white/75">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quote Highlight */}
              <div className="mt-3.5 rounded-lg border-l-4 border-accent bg-accent/15 px-3 py-1.5">
                <p className="text-[11px] sm:text-xs italic text-white font-medium">
                  &ldquo;{role.quote}&rdquo;
                </p>
              </div>
            </div>

            {/* Right: Smaller Phone Mockup (Fits 100% inside container card with padding) */}
            <div className="flex items-center justify-center lg:col-span-5 py-2">
              <div className="group relative w-[130px] sm:w-[145px] lg:w-[155px] animate-float">
                <div className="absolute -inset-4 rounded-full bg-primary/25 blur-xl -z-10 transition-all duration-700 group-hover:scale-135 group-hover:bg-primary/45 group-hover:blur-2xl" />
                <PhoneMockup tilted={true} />
                <div className="mt-2 text-center transition-all duration-300 group-hover:scale-105">
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary/90 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-md backdrop-blur-md border border-white/10 transition-colors group-hover:border-primary/50 group-hover:text-primary">
                    <QrCode className="h-2.5 w-2.5 text-primary" />
                    Offline-First Mobile Architecture
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
