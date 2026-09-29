"use client";

import { useSidebar } from "@/components/dashboard/SidebarProvider";

export default function DynamicMain({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <main
      className={`min-h-screen flex-1 p-6 pt-22 transition-all duration-300 ease-in-out ${
        collapsed ? "ml-16" : "ml-64"
      }`}
    >
      {children}
    </main>
  );
}
