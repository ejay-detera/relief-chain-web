"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, LogOut, PanelLeftClose, PanelLeftOpen, User } from "lucide-react";

import { signOutAction } from "@/app/(dashboard)/actions";
import { useSidebar } from "@/components/dashboard/SidebarProvider";

type TopbarProps = {
  email: string;
};

export default function Topbar({ email }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { collapsed, toggle } = useSidebar();

  const avatarInitial = email.charAt(0).toUpperCase();

  return (
    <header
      className={`fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-dark/8 bg-white/95 px-4 shadow-sm backdrop-blur-md transition-all duration-300 ease-in-out ${
        collapsed ? "left-16" : "left-64"
      }`}
    >
      {/* Left: sidebar toggle */}
      <button
        onClick={toggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-dark/40 transition hover:bg-muted hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {collapsed ? (
          <PanelLeftOpen aria-hidden="true" size={20} />
        ) : (
          <PanelLeftClose aria-hidden="true" size={20} />
        )}
      </button>

      {/* Right: user menu */}
      <div className="relative flex items-center gap-2">
        <button
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className="flex items-center gap-2.5 rounded-xl border border-dark/10 bg-muted/60 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-secondary transition hover:border-dark/20 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-white">
            {avatarInitial}
          </span>
          <span className="hidden max-w-[140px] truncate sm:inline">{email}</span>
          <ChevronDown
            aria-hidden="true"
            size={14}
            className={`text-dark/50 transition-transform ${menuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {menuOpen ? (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              aria-hidden="true"
              onClick={() => setMenuOpen(false)}
            />
            <div
              className="absolute right-0 top-full z-20 mt-2 w-60 overflow-hidden rounded-2xl border border-dark/10 bg-white shadow-xl"
              role="menu"
            >
              {/* User info */}
              <div className="border-b border-dark/8 bg-muted/50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-dark/40">
                  Signed in as
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-secondary">
                  {email}
                </p>
              </div>

              <div className="py-1.5">
                <Link
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-secondary transition hover:bg-muted"
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  role="menuitem"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10">
                    <User aria-hidden="true" size={14} />
                  </span>
                  View profile
                </Link>

                <div className="my-1.5 border-t border-dark/8" />

                <form action={signOutAction}>
                  <button
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50"
                    role="menuitem"
                    type="submit"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100">
                      <LogOut aria-hidden="true" size={14} />
                    </span>
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
}
