import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlatformCardGrid } from "@/components/home/PlatformsSection";

export const metadata: Metadata = {
  title: "Prediction market platforms compared",
  description: "Polymarket and Kalshi compared: how each works, how it's regulated, fees, funding and who can use it.",
  alternates: { canonical: "/platforms" },
};

export default function PlatformsPage() {
  return (
    <div className="page-container flex flex-col gap-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Platforms" }]} />
      <header className="flex max-w-3xl flex-col gap-3">
        <span className="eyebrow">WHERE TO TRADE</span>
        <h1 className="font-display text-[36px] leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl">
          Prediction market platforms compared
        </h1>
        <p className="text-lg leading-[1.55] text-body">
          Where to trade, how each platform works and who can use it. For a side-by-side breakdown, read{" "}
          <Link href="/guides/polymarket-vs-kalshi">Polymarket vs Kalshi</Link>.
        </p>
      </header>
      <PlatformCardGrid />
      <section className="flex max-w-3xl flex-col gap-3 border-t border-line pt-8">
        <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">How we review platforms</h2>
        <p className="text-[17px] leading-[1.6] text-body">
          [CHECK: methodology: what we test, how platforms are compared, and how affiliate relationships are kept
          separate from reviews.] See our <Link href="/about">editorial policy</Link> and{" "}
          <Link href="/disclosure">affiliate disclosure</Link>.
        </p>
      </section>
    </div>
  );
}
