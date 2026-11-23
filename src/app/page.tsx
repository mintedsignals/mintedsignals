import { AdvertiseBand } from "@/components/home/AdvertiseBand";
import { AnalysisSection } from "@/components/home/AnalysisSection";
import { GuidesSection } from "@/components/home/GuidesSection";
import { Hero } from "@/components/home/Hero";
import { PlatformsSection } from "@/components/home/PlatformsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PlatformsSection />
      <GuidesSection />
      <AnalysisSection />
      <AdvertiseBand />
    </>
  );
}
