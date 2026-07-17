import DashboardLoadError from "@/components/DashboardLoadError";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import {
  requireSuperAdmin,
  type SuperAdminSession,
} from "@/lib/auth/require-super-admin";

function isNextRedirectError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("digest" in error)) {
    return false;
  }

  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

function DashboardShell({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: SuperAdminSession;
}>) {
  return (
    <div className="flex min-h-full flex-1 bg-muted font-sans">
      <Sidebar />
      <Topbar email={session.email} />
      <main className="ml-64 mt-16 min-h-screen w-[calc(100%-16rem)] flex-1 p-6">
        {children}
      </main>
    </div>
  );
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session: SuperAdminSession | undefined;

  try {
    session = await requireSuperAdmin();
  } catch (error) {
    // redirect() uses a framework control-flow exception and must pass through.
    if (isNextRedirectError(error)) {
      throw error;
    }
  }

  if (!session) {
    return <DashboardLoadError />;
  }

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
