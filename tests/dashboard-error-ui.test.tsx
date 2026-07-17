import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const signOutAction = vi.hoisted(() => vi.fn());
vi.mock("@/app/dashboard/actions", () => ({ signOutAction }));

import DashboardError from "@/app/dashboard/error";
import DashboardLoadError from "@/components/DashboardLoadError";

describe("dashboard load failure UI", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("offers retry and a sign-out path back to login after dashboard loading fails", () => {
    const retry = vi.fn();
    render(<DashboardLoadError onRetry={retry} />);

    expect(screen.getByRole("heading", { name: "Dashboard unavailable" })).not.toBeNull();
    expect(screen.getByText(/return to login/i)).not.toBeNull();
    expect(screen.getByRole("button", { name: "Try again" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Sign out" })).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("wires the Next 16 error boundary retry callback to the fallback UI", () => {
    const retry = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(<DashboardError error={new Error("dashboard failed")} unstable_retry={retry} />);

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
