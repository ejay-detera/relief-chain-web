"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavItems } from "@/lib/dashboard/nav";
import { useSidebar } from "@/components/dashboard/SidebarProvider";

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-secondary transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo header — same height as Topbar so they align */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-white/10 ${
          collapsed ? "justify-center" : "gap-3 px-5"
        }`}
      >
        <Image
          alt="Relief Chain"
          aria-hidden="true"
          height={32}
          src="/assets/Logo-Icon.svg"
          width={32}
          className="shrink-0"
        />
        {!collapsed && (
          <div className="min-w-0 overflow-hidden">
            <p className="truncate text-sm font-bold leading-tight text-white">
              Relief Chain
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
              SuperAdmin Portal
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-hidden py-3" aria-label="Dashboard navigation">
        {dashboardNavItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(pathname, item.href);

          if (item.disabled) return null;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 border-l-4 py-3 text-sm font-semibold transition-colors ${
                collapsed ? "justify-center px-0" : "px-6"
              } ${
                active
                  ? "border-primary bg-white/10 text-white"
                  : "border-transparent text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon aria-hidden="true" size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
