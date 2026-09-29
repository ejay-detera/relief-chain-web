"use client";

import { useEffect } from "react";

import DashboardLoadError from "@/components/DashboardLoadError";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function DashboardError({ error, unstable_retry }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard failed to load", error);
  }, [error]);

  return <DashboardLoadError onRetry={unstable_retry} />;
}
