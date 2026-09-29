"use client";

import Link from "next/link";
import { Smartphone, QrCode } from "lucide-react";

import Grainient from "@/components/Grainient";
import PhoneMockup from "@/components/PhoneMockup";

export default function HeroSection() {
  return (
    <section
      id="overview"
      className="relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden px-6 pb-6 pt-20 sm:px-12 sm:pt-24 lg:pt-20"
    >
      {/* Original Grainient Background with original bg-secondary/35 overlay */}
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

      <div className="mx-auto max-w-7xl w-full">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Left Content (Matches Reference Layout - Pill badge removed) */}
          <div className="flex flex-col items-start lg:col-span-7 text-left">
            {/* Headline */}
            <h1 className="animate-fade-in-up mt-2 text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-extrabold leading-[1.14] tracking-tight text-white">
              Coordinating disaster relief between organizations and the communities they serve
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up animation-delay-150 mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-white/95">
              Relief Chain connects local government units, beneficiaries, and merchants on one
              platform, so aid reaches the people who need it with accountability at every step.
            </p>

            {/* Action Buttons */}
            <div className="animate-fade-in-up animation-delay-300 mt-6 flex flex-wrap items-center gap-3.5">
              <Link
                className="rounded-lg bg-primary px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-secondary transition hover:scale-105 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                href="/login"
              >
                Go to Super Admin dashboard
              </Link>

              <a
                href="#mobile-app"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/15 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <Smartphone className="h-4 w-4 text-primary" />
                <span>Explore Mobile App</span>
              </a>
            </div>

            {/* Metric Highlights */}
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-white/20 pt-4 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white">0%</p>
                <p className="mt-0.5 text-xs text-white/80">Cash Handling Risk</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white">&lt; 3s</p>
                <p className="mt-0.5 text-xs text-white/80">Redemption Finality</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white">100%</p>
                <p className="mt-0.5 text-xs text-white/80">On-Chain Audit Trail</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Showcase: Tilted Phone with Overview Container ON TOP */}
          <div className="relative flex items-center justify-center lg:col-span-5 pt-4">
            <div className="relative flex items-center justify-center">
              {/* Tilted CSS Phone Mockup */}
              <div className="relative z-10 w-[200px] sm:w-[220px] lg:w-[230px] animate-float">
                <PhoneMockup tilted={true} />
                <div className="mt-2 text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/90 px-3.5 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur-md">
                    <QrCode className="h-3 w-3 text-primary" />
                    Mobile App: Offline QR Engine
                  </span>
                </div>
              </div>

              {/* Overview Container placed on TOP RIGHT of the phone (z-20) for maximum viewability */}
              <div className="hidden sm:block absolute -right-16 sm:-right-32 lg:-right-40 -top-6 sm:-top-10 z-20 w-72 rounded-2xl border border-white/40 bg-white/95 p-4 shadow-2xl backdrop-blur-lg animate-float-delayed text-dark">
                <div className="flex items-center justify-between border-b border-dark/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <span className="text-xs font-bold text-secondary">Super Admin Overview</span>
                  </div>
                  <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-secondary">
                    Active
                  </span>
                </div>
                <div className="mt-2.5 space-y-2 text-xs">
                  <div className="flex justify-between text-dark/70">
                    <span>Verified Beneficiaries:</span>
                    <span className="font-bold text-secondary">28,450</span>
                  </div>
                  <div className="flex justify-between text-dark/70">
                    <span>Disbursed Relief Vouchers:</span>
                    <span className="font-bold text-secondary">₱14.8M RCPHP</span>
                  </div>
                  <div className="flex justify-between text-dark/70">
                    <span>Redemption Rate:</span>
                    <span className="font-bold text-primary">96.8%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[88%] rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
