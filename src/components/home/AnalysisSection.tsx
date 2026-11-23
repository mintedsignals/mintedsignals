import Link from "next/link";
import { AdSlot, adSlotVisible } from "@/components/ads/AdSlot";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { OddsCalculator } from "@/components/tools/OddsCalculator";
import { analysisPlaceholders } from "@/config/home";

type Article = (typeof analysisPlaceholders)[number];

function ArticleRow({ article, last }: { article: Article; last?: boolean }) {
  return (
    <article className={`flex flex-wrap gap-6 border-t border-line py-6 ${last ? "border-b" : ""}`}>
      <div
        className={`flex h-[140px] flex-[0_0_220px] items-center justify-center rounded-control font-mono text-xs text-body ${article.coverClass}`}
      >
        [COVER IMAGE]
      </div>
      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-2">
        <span className="text-xs font-semibold tracking-[0.06em] text-link">{article.kicker}</span>
        <h3 className="font-display text-[23px] leading-[1.2] font-bold">
          {/* Articles arrive in phase 5; until then the list links to /analysis. */}
          <Link href="/analysis" className="text-ink no-underline hover:text-link">
            {article.title}
          </Link>
        </h3>
        <p className="text-[15px] leading-[1.55] text-body">{article.summary}</p>
        <span className="text-[13px] text-muted">[AUTHOR] · [DATE]</span>
      </div>
    </article>
  );
}

export function AnalysisSection() {
  const [first, second, ...rest] = analysisPlaceholders;

  return (
    <section id="analysis" className="border-t border-line">
      <div className="page-container flex flex-wrap items-start gap-12 pt-16 pb-[72px]">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col">
          <div className="flex flex-wrap items-end justify-between gap-3 pb-4">
            <h2 className="font-display text-[30px] font-bold tracking-[-0.03em] sm:text-[34px]">Latest analysis</h2>
            <Link href="/analysis" className="py-2 text-[15px] font-semibold">
              All articles →
            </Link>
          </div>

          <ArticleRow article={first} />
          <ArticleRow article={second} />
          {adSlotVisible("native") && (
            <aside aria-label="Sponsored" className="my-2">
              <AdSlot size="native" />
            </aside>
          )}
          {rest.map((a, i) => (
            <ArticleRow key={a.title} article={a} last={i === rest.length - 1} />
          ))}
        </div>

        <aside className="flex w-full min-w-0 flex-[1_1_300px] flex-col gap-7 lg:max-w-[340px]">
          <AdSlot size="300x250" tone="surface" />
          <OddsCalculator />
          <NewsletterForm />
          {/* Sticky: stays in view while the article list scrolls. */}
          <AdSlot size="300x600" tone="surface" className="lg:sticky lg:top-6" />
        </aside>
      </div>
    </section>
  );
}
