import Image from "next/image";

interface PhoneMockupProps {
  className?: string;
  tilted?: boolean;
}

export default function PhoneMockup({
  className = "",
  tilted = false,
}: PhoneMockupProps) {
  const tiltClasses = tilted
    ? "transform -rotate-6 sm:-rotate-12 skew-y-1 sm:skew-y-2 shadow-[-16px_24px_30px_rgba(0,0,0,0.55)] transition-all duration-700 ease-out group-hover:rotate-0 group-hover:skew-y-0 group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-[0_25px_50px_rgba(111,202,75,0.35)] group-hover:ring-primary/50 group-hover:ring-2"
    : "shadow-xl transition-all duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-2";

  return (
    <div
      className={`relative mx-auto w-full rounded-[36px] sm:rounded-[38px] border-[6px] sm:border-[7px] border-dark bg-dark ring-1 ring-white/20 select-none cursor-pointer ${tiltClasses} ${className}`}
    >
      {/* Side Hardware Buttons */}
      <div className="absolute -left-[9px] top-[50px] h-[16px] w-[3px] rounded-l bg-dark/80" />
      <div className="absolute -left-[9px] top-[75px] h-[26px] w-[3px] rounded-l bg-dark/80" />
      <div className="absolute -left-[9px] top-[110px] h-[26px] w-[3px] rounded-l bg-dark/80" />
      <div className="absolute -right-[9px] top-[80px] h-[34px] w-[3px] rounded-r bg-dark/80" />

      {/* Screen Container */}
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[29px] sm:rounded-[31px] bg-white">
        {/* Dynamic Island / Top Camera Notch */}
        <div className="absolute left-1/2 top-1.5 z-30 flex h-3 w-14 -translate-x-1/2 items-center justify-end rounded-full bg-black px-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-dark/60 ring-1 ring-white/10" />
        </div>

        {/* Screen Content: User's ReliefChain-phone use.png */}
        <Image
          src="/assets/ReliefChain-phone use.png"
          alt="Relief Chain Mobile Application"
          fill
          sizes="(max-width: 640px) 150px, (max-width: 1024px) 175px, 220px"
          priority
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
        />

        {/* Realistic Screen Glare overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />

        {/* Dynamic Interactive Light Sheen sweep on Hover */}
        <div className="pointer-events-none absolute -inset-full top-0 h-full w-[200%] -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
      </div>

      {/* Home Indicator bar at bottom */}
      <div className="absolute bottom-1.5 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-white/70 transition-all duration-300 group-hover:bg-primary" />
    </div>
  );
}
