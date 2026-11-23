import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateNote } from "@/components/AffiliateNote";
import { ArticleLayout } from "@/components/ArticleLayout";
import { JsonLd } from "@/components/JsonLd";
import { goHref } from "@/config/partners";
import { getReview, reviewEntries, robotsFor } from "@/content";
import { platformCtaAllowed } from "@/lib/compliance";
import { formatChance } from "@/lib/format";
import { getHottestMarkets } from "@/lib/markets";
import { marketPath } from "@/lib/markets/links";
import { articleJsonLd, defaultOgImages } from "@/lib/seo";

/** Static export: only the listed pages exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return reviewEntries.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/platforms/[slug]">): Promise<Metadata> {
  const review = getReview((await params).slug);
  if (!review) return { title: "Review not found" };
  return {
    title: review.title,
    description: review.description,
    alternates: { canonical: `/platforms/${review.slug}` },
    robots: robotsFor(review.status),
    openGraph: {
      title: review.title,
      description: review.description,
      type: "article",
      modifiedTime: review.updated,
      images: defaultOgImages,
    },
  };
}

export default async function ReviewPage({ params }: PageProps<"/platforms/[slug]">) {
  const review = getReview((await params).slug);
  if (!review) notFound();
  const [{ default: Body }, busiest] = await Promise.all([
    review.load(),
    getHottestMarkets({ venue: review.venue, limit: 5 }),
  ]);

  return (
    <ArticleLayout
      breadcrumbs={[{ label: "Platforms", href: "/platforms" }, { label: review.title }]}
      eyebrow="PLATFORM REVIEW"
      title={review.title}
      updated={review.updated}
      status={review.status}
      aside={
        <>
          {platformCtaAllowed(review.venue) && (
            <div className="flex flex-col gap-3 rounded-card border border-line p-5">
              <h2 className="font-display text-lg font-bold">Visit {review.name}</h2>
              <p className="text-sm text-body">Check that {review.name} is available where you live before signing up.</p>
              <a
                href={goHref(review.venue)}
                rel="sponsored noopener"
                className="rounded-control bg-accent px-5 py-3.5 text-center text-[15px] font-semibold text-white no-underline hover:bg-link hover:text-white"
              >
                Visit {review.name}
              </a>
              <AffiliateNote />
            </div>
          )}
          {busiest.length > 0 && (
            <div className="rounded-card border border-line p-5">
              <h2 className="mb-3 font-display text-lg font-bold">Busiest on {review.name} now</h2>
              <ul className="flex flex-col gap-3">
                {busiest.map((m) => (
                  <li key={m.id}>
                    <Link href={marketPath(m)} className="flex items-start justify-between gap-3 text-ink no-underline hover:text-link">
                      <span className="text-sm leading-snug font-medium">{m.question}</span>
                      <span className="font-mono text-sm font-semibold">{formatChance(m.yesPrice)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/markets/venue/${review.venue}`} className="mt-4 inline-block text-sm font-semibold">
                All {review.name} markets →
              </Link>
            </div>
          )}
        </>
      }
    >
      <JsonLd
        data={articleJsonLd({ path: `/platforms/${review.slug}`, title: review.title, description: review.description, updated: review.updated })}
      />
      <Body />
    </ArticleLayout>
  );
}
