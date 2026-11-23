import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { articleEntries } from "@/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Prediction market analysis",
  description: "Analysis of the prediction markets moving the most: what moved, why, and what to watch next.",
  alternates: { canonical: "/analysis" },
};

export default function AnalysisPage() {
  const articles = [...articleEntries].sort((a, b) => b.updated.localeCompare(a.updated));
  return (
    <div className="page-container flex flex-col gap-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Analysis" }]} />
      <header className="flex max-w-3xl flex-col gap-3">
        <span className="eyebrow">ANALYSIS</span>
        <h1 className="font-display text-[36px] leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl">Latest analysis</h1>
        <p className="text-lg leading-[1.55] text-body">What moved in prediction markets, why, and what to watch next.</p>
      </header>
      <div className="max-w-4xl">
        {articles.map((a) => (
          <article key={a.slug} className="flex flex-wrap gap-6 border-t border-line py-6 last:border-b">
            <div
              className={`flex h-[140px] flex-[0_0_220px] items-center justify-center rounded-control font-mono text-xs text-body ${a.coverClass}`}
            >
              [COVER IMAGE]
            </div>
            <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-2">
              <span className="text-xs font-semibold tracking-[0.06em] text-link">{a.kicker}</span>
              <h2 className="font-display text-[23px] leading-[1.2] font-bold">
                <Link href={`/analysis/${a.slug}`} className="text-ink no-underline hover:text-link">
                  {a.title}
                </Link>
              </h2>
              <p className="text-[15px] leading-[1.55] text-body">{a.summary}</p>
              <span className="text-[13px] text-muted">
                {a.author} · {a.status === "draft" ? "[DATE]" : formatDate(`${a.updated}T00:00:00Z`)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
