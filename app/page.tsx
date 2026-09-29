import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import MobileAppSection from "@/components/landing/MobileAppSection";
import WebPortalSection from "@/components/landing/WebPortalSection";
import TechnologySection from "@/components/landing/TechnologySection";
import LeverageSection from "@/components/landing/LeverageSection";
import FaqSection from "@/components/landing/FaqSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-dark antialiased">
      <Navbar />
      <HeroSection />
      <MobileAppSection />
      <WebPortalSection />
      <TechnologySection />
      <LeverageSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
