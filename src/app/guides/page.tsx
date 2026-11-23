import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { guideEntries } from "@/content";

export const metadata: Metadata = {
  title: "Prediction market guides",
  description:
    "Plain-English guides to prediction markets: how they work, reading odds, Polymarket vs Kalshi, resolution, liquidity and legality.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div className="page-container flex flex-col gap-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Guides" }]} />
      <header className="flex max-w-[640px] flex-col gap-3">
        <span className="eyebrow">LEARN</span>
        <h1 className="font-display text-[36px] leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl">
          Prediction markets 101
        </h1>
        <p className="text-lg leading-[1.55] text-body">
          Start with the basics, then learn to read odds, compare platforms and understand how markets are settled.
        </p>
      </header>
      <ol className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
        {guideEntries.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guides/${g.slug}`}
              className="flex h-full min-h-[168px] flex-col gap-3 rounded-card border border-line p-6 text-ink no-underline hover:border-ink hover:text-ink"
            >
              <span className="font-mono text-[13px] font-semibold text-link">
                {g.number} · {g.topic}
              </span>
              <span className="font-display text-[21px] leading-[1.2] font-bold">{g.title}</span>
              <span className="text-sm leading-normal text-muted">{g.summary}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
