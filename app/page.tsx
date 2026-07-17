import Image from "next/image";
import Link from "next/link";

import Grainient from "@/components/Grainient";

const features = [
  {
    title: "Organization onboarding",
    description:
      "LGUs register through the Relief Chain mobile app and submit accreditation details for review.",
  },
  {
    title: "Super Admin oversight",
    description:
      "A dedicated dashboard lets Relief Chain staff review, approve, or reject organization registrations.",
  },
  {
    title: "Transparent status tracking",
    description:
      "Applicants see their registration status in real time, with clear reasons whenever a decision requires changes.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-white font-sans">
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-6 sm:px-12">
        <Image src="/assets/Logo.svg" alt="Relief Chain" width={140} height={79} priority />
        <Link
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-secondary shadow-sm transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          href="/login"
        >
          Super Admin login
        </Link>
      </header>

      <section className="relative isolate flex min-h-[640px] flex-1 items-center justify-center overflow-hidden px-6 py-24 text-center sm:px-12">
        <div className="absolute inset-0 -z-10">
          <Grainient
            color1="#6FCA4B"
            color2="#112E58"
            color3="#E4CF10"
            timeSpeed={0.2}
            colorBalance={0.1}
            warpStrength={1.1}
            warpFrequency={4.0}
            warpSpeed={1.4}
            warpAmplitude={45.0}
            blendSoftness={0.12}
            rotationAmount={360.0}
            noiseScale={1.6}
            grainAmount={0.08}
            grainScale={2.5}
            grainAnimated
            contrast={1.25}
            saturation={1.05}
            zoom={1.1}
          />
          <div className="absolute inset-0 bg-secondary/35" />
        </div>

        <div className="flex flex-col items-center gap-8">
          <p className="animate-fade-in-up text-sm font-semibold uppercase tracking-[0.2em] text-white">
            Relief Chain
          </p>
          <h1 className="animate-fade-in-up animation-delay-150 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Coordinating disaster relief between organizations and the communities they serve
          </h1>
          <p className="animate-fade-in-up animation-delay-300 max-w-xl text-lg leading-8 text-white/90">
            Relief Chain connects local government units, beneficiaries, and merchants on one
            platform, so aid reaches the people who need it with accountability at every step.
          </p>
          <Link
            className="animate-fade-in-up animation-delay-450 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-secondary transition hover:scale-105 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            href="/login"
          >
            Go to Super Admin dashboard
          </Link>
        </div>
      </section>

      <section className="bg-muted px-6 py-16 sm:px-12">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          {features.map((feature, index) => (
            <div
              className="animate-fade-in rounded-2xl bg-white p-6 shadow-sm shadow-secondary/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-secondary/10"
              key={feature.title}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <h2 className="text-lg font-semibold text-secondary">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-dark/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-dark/50 sm:px-12">
        &copy; {new Date().getFullYear()} Relief Chain. All rights reserved.
      </footer>
    </main>
  );
}
