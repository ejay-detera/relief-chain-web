"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";

import { signOutAction } from "@/app/dashboard/actions";

type TopbarProps = {
  email: string;
};

export default function Topbar({ email }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed right-0 top-0 z-30 flex h-16 w-[calc(100%-16rem)] items-center justify-between border-b border-dark/10 bg-white px-6">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        System status: Optimal
      </div>

      <div className="relative flex items-center gap-3">
        <button
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-secondary transition hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-secondary">
            <User aria-hidden="true" size={18} />
          </span>
          <span className="hidden max-w-[160px] truncate sm:inline">{email}</span>
          <ChevronDown aria-hidden="true" size={16} />
        </button>

        {menuOpen ? (
          <div
            className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-dark/10 bg-white py-2 shadow-lg"
            role="menu"
          >
            <p className="truncate px-4 py-2 text-xs text-dark/50">{email}</p>
            <Link
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-secondary hover:bg-muted"
              href="/dashboard/profile"
              onClick={() => setMenuOpen(false)}
              role="menuitem"
            >
              <User aria-hidden="true" size={16} />
              View profile
            </Link>
            <form action={signOutAction}>
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-red-700 hover:bg-red-50"
                role="menuitem"
                type="submit"
              >
                <LogOut aria-hidden="true" size={16} />
                Sign out
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </header>
  );
}
