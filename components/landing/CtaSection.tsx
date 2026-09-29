"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="bg-secondary text-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Ready to modernize disaster relief in your municipality?
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-white/80">
            Join local government units, humanitarian organizations, and local merchant networks
            transforming emergency aid with transparency and accountability.
          </p>
          <div className="mt-5 flex justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-secondary shadow-lg transition hover:scale-105 hover:bg-primary/90"
            >
              <span>Go to Super Admin dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
