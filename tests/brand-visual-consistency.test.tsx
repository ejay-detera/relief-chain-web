import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSessionUser: vi.fn(),
  requireSuperAdmin: vi.fn(),
  redirect: vi.fn(),
  signOutAction: vi.fn(),
  listRegistrations: vi.fn(),
  loginAction: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({ getSessionUser: mocks.getSessionUser }));
vi.mock("@/lib/auth/require-super-admin", () => ({
  requireSuperAdmin: mocks.requireSuperAdmin,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect, usePathname: () => "/dashboard" }));
vi.mock("@/app/dashboard/actions", () => ({ signOutAction: mocks.signOutAction }));
vi.mock("@/lib/registrations/queries", () => ({
  listRegistrations: mocks.listRegistrations,
}));
vi.mock("@/app/login/actions", () => ({ loginAction: mocks.loginAction }));

import LoginForm from "@/app/login/LoginForm";
import LoginPage from "@/app/login/page";
import DashboardLayout from "@/app/dashboard/layout";
import OrganizationsPage from "@/app/dashboard/organizations/page";

// Brand-only Tailwind color utility prefixes wired to the CSS variables in
// app/globals.css (--color-primary, --color-secondary, --color-accent,
// --color-muted, --color-dark). "red-"/"white"/"black" are semantic/neutral
// utilities already used for error and contrast states, not brand colors,
// so they are allowed alongside the brand tokens below.
const nonBrandColorClassPattern =
  /\b(?:bg|text|border|ring|shadow|from|to|via)-(?:gray|slate|zinc|neutral|stone|blue|indigo|violet|purple|fuchsia|pink|rose|orange|amber|yellow|lime|green|emerald|teal|cyan|sky)-\d{2,3}\b/;
const arbitraryColorClassPattern = /\b(?:bg|text|border)-\[#[0-9a-fA-F]{3,8}\]/;

function assertOnlyBrandColors(container: HTMLElement) {
  const classAttributes = [...container.querySelectorAll("*")]
    .map((element) => element.getAttribute("class") ?? "")
    .join(" ");

  expect(classAttributes).not.toMatch(nonBrandColorClassPattern);
  expect(classAttributes).not.toMatch(arbitraryColorClassPattern);
  expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}/);
}

// Feature: organization-registration-review
// Requirement 14.1: brand colors (Green, Navy, Yellow, Light Gray) are used
// on the login page and Organization_Review_Dashboard.
// Requirement 14.2: the Plus Jakarta Sans font (wired as the `font-sans`
// theme token in app/globals.css / app/layout.tsx) is used on both.
describe("brand visual consistency: /login", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSessionUser.mockResolvedValue(null);
  });

  it("renders the login page using the brand color tokens and font-sans", async () => {
    const page = await LoginPage({ searchParams: Promise.resolve({}) });
    const { container } = render(page);

    const main = container.querySelector("main");
    expect(main?.className).toContain("font-sans");

    const overlay = container.querySelector(".bg-secondary\\/35");
    expect(overlay).not.toBeNull();

    const eyebrow = Array.from(container.querySelectorAll("p")).find(
      (p) => p.textContent === "Relief Chain",
    );
    expect(eyebrow?.className).toContain("text-primary");

    const heading = container.querySelector("h1");
    expect(heading?.textContent).toBe("Super Admin login");
    expect(heading?.className).toContain("text-secondary");

    assertOnlyBrandColors(container);
  });

  it("renders the login form's primary action using the brand primary/secondary tokens", () => {
    const { container, getByRole } = render(<LoginForm />);

    const submitButton = getByRole("button", { name: "Sign in" });
    expect(submitButton.className).toContain("bg-primary");
    expect(submitButton.className).toContain("text-secondary");

    const emailLabel = Array.from(container.querySelectorAll("label")).find(
      (label) => label.textContent === "Email address",
    );
    expect(emailLabel?.className).toContain("text-secondary");

    assertOnlyBrandColors(container);
  });
});

describe("brand visual consistency: /dashboard", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireSuperAdmin.mockResolvedValue({
      userId: "super-admin-1",
      email: "admin@example.com",
    });
    mocks.listRegistrations.mockResolvedValue([]);
  });

  it("renders the dashboard shell sidebar using the brand secondary token and font-sans", async () => {
    const layout = await DashboardLayout({ children: <div>dashboard content</div> });
    const { container } = render(layout);

    const shell = container.firstElementChild as HTMLElement;
    expect(shell.className).toContain("bg-muted");
    expect(shell.className).toContain("font-sans");

    const sidebar = container.querySelector("aside");
    expect(sidebar?.className).toContain("bg-secondary");

    assertOnlyBrandColors(container);
  });

  it("renders the organizations page content using the brand primary/secondary tokens", async () => {
    const page = await OrganizationsPage();
    const { container } = render(page);

    const heading = container.querySelector("h1");
    expect(heading?.textContent).toBe("Organizations");
    expect(heading?.className).toContain("text-secondary");

    const eyebrow = Array.from(container.querySelectorAll("p")).find(
      (p) => p.textContent === "Review queue",
    );
    expect(eyebrow?.className).toContain("text-primary");

    assertOnlyBrandColors(container);
  });
});
