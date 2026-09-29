"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-3.5 sm:px-12 backdrop-blur-xl bg-white/10 border-b border-white/15 shadow-sm transition-all">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/assets/Logo.svg"
          alt="Relief Chain"
          width={120}
          height={60}
          priority
          className="h-8 sm:h-10 w-auto drop-shadow-sm"
        />
      </Link>

      <nav className="hidden items-center gap-8 md:flex text-sm font-semibold text-white/95">
        <a href="#overview" className="transition hover:text-white drop-shadow-sm">
          Overview
        </a>
        <a href="#mobile-app" className="transition hover:text-white drop-shadow-sm">
          Mobile App
        </a>
        <a href="#web-app" className="transition hover:text-white drop-shadow-sm">
          Web Portal
        </a>
        <a href="#technology" className="transition hover:text-white drop-shadow-sm">
          Technology
        </a>
        <a href="#leverage" className="transition hover:text-white drop-shadow-sm">
          Impact
        </a>
        <a href="#faq" className="transition hover:text-white drop-shadow-sm">
          FAQ
        </a>
      </nav>

      <Link
        className="rounded-lg bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-secondary shadow-md transition hover:bg-white/90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        href="/login"
      >
        Super Admin login
      </Link>
    </header>
  );
}
