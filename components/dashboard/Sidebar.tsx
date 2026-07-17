"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavItems } from "@/lib/dashboard/nav";

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-secondary py-6">
      <div className="mb-8 flex items-center gap-3 px-6">
        <Image alt="" aria-hidden="true" height={32} src="/assets/Logo-Icon.svg" width={32} />
        <div>
          <p className="text-lg font-bold leading-tight text-white">Relief Chain</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            SuperAdmin Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1" aria-label="Dashboard navigation">
        {dashboardNavItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(pathname, item.href);

          if (item.disabled) {
            return (
              <span
                key={item.label}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center justify-between gap-3 px-6 py-3 text-white/30"
              >
                <span className="flex items-center gap-3">
                  <Icon aria-hidden="true" size={20} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                  Soon
                </span>
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 border-l-4 px-6 py-3 text-sm font-semibold transition-colors ${
                active
                  ? "border-primary bg-white/10 text-white"
                  : "border-transparent text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon aria-hidden="true" size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
