"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-dark/10 bg-white py-8 text-xs sm:text-sm text-dark/60">
      <div className="mx-auto max-w-7xl px-6 sm:px-12">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <Image src="/assets/Logo.svg" alt="Relief Chain" width={100} height={50} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
            <a href="#overview" className="hover:text-secondary transition">
              Overview
            </a>
            <a href="#mobile-app" className="hover:text-secondary transition">
              Mobile App
            </a>
            <a href="#web-app" className="hover:text-secondary transition">
              Web Portal
            </a>
            <a href="#technology" className="hover:text-secondary transition">
              Technology
            </a>
            <a href="#leverage" className="hover:text-secondary transition">
              Impact
            </a>
            <a href="#faq" className="hover:text-secondary transition">
              FAQ
            </a>
          </div>

          <div className="text-[11px] text-dark/50">
            &copy; {new Date().getFullYear()} Relief Chain. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
