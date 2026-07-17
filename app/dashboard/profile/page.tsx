import { Mail, ShieldCheck, User } from "lucide-react";

import ProfileForm from "@/components/dashboard/ProfileForm";
import { getOwnProfile } from "@/lib/profile/queries";

export default async function ProfilePage() {
  const profile = await getOwnProfile();
  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <section aria-labelledby="profile-title" className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-secondary" id="profile-title">
          Your profile
        </h1>
        <p className="mt-1 text-sm text-dark/60">
          View and update your Super Admin account details.
        </p>
      </div>

      <div className="rounded-2xl border border-dark/10 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-white">
            <User aria-hidden="true" size={28} />
          </span>
          <div>
            <p className="text-lg font-bold text-secondary">
              {profile.fullName ?? "Relief Chain Super Admin"}
            </p>
            <p className="flex items-center gap-1 text-sm text-dark/60">
              <ShieldCheck aria-hidden="true" size={14} />
              Super Admin
            </p>
          </div>
        </div>

        <dl className="mb-6 grid gap-4 border-t border-dark/10 pt-6 sm:grid-cols-2">
          <div>
            <dt className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-dark/50">
              <Mail aria-hidden="true" size={14} />
              Email address
            </dt>
            <dd className="mt-1 text-sm text-secondary">{profile.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-dark/50">
              Member since
            </dt>
            <dd className="mt-1 text-sm text-secondary">{memberSince}</dd>
          </div>
        </dl>

        <div className="border-t border-dark/10 pt-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-dark/50">
            Edit profile
          </h2>
          <ProfileForm initialFullName={profile.fullName ?? ""} />
        </div>
      </div>
    </section>
  );
}
