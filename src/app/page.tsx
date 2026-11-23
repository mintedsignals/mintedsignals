import type { Metadata } from "next";
import { AdvertiseBand } from "@/components/home/AdvertiseBand";
import { AnalysisSection } from "@/components/home/AnalysisSection";
import { GuidesSection } from "@/components/home/GuidesSection";
import { Hero } from "@/components/home/Hero";
import { PlatformsSection } from "@/components/home/PlatformsSection";
import { JsonLd } from "@/components/JsonLd";
import { websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <Hero />
      <PlatformsSection />
      <GuidesSection />
      <AnalysisSection />
      <AdvertiseBand />
    </>
  );
}
