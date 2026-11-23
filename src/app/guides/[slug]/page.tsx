import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { JsonLd } from "@/components/JsonLd";
import { getGuide, guideEntries, robotsFor } from "@/content";
import { articleJsonLd, defaultOgImages } from "@/lib/seo";

/** Wait for the guide before responding, so unknown slugs get a real 404. */
export const instant = false;

export function generateStaticParams() {
  return guideEntries.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    robots: robotsFor(guide.status),
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      modifiedTime: guide.updated,
      images: defaultOgImages,
    },
  };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const { default: Body } = await guide.load();
  const others = guideEntries.filter((g) => g.slug !== guide.slug);

  return (
    <ArticleLayout
      breadcrumbs={[{ label: "Guides", href: "/guides" }, { label: guide.title }]}
      eyebrow={`${guide.number} · ${guide.topic.toUpperCase()}`}
      title={guide.title}
      updated={guide.updated}
      status={guide.status}
      aside={
        <nav aria-label="More guides" className="rounded-card border border-line p-5">
          <h2 className="mb-3 font-display text-lg font-bold">More guides</h2>
          <ul className="flex flex-col gap-3">
            {others.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="flex flex-col gap-0.5 text-ink no-underline hover:text-link">
                  <span className="font-mono text-xs font-semibold text-link">
                    {g.number} · {g.topic}
                  </span>
                  <span className="text-[15px] leading-snug font-semibold">{g.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      }
    >
      <JsonLd
        data={articleJsonLd({ path: `/guides/${guide.slug}`, title: guide.title, description: guide.description, updated: guide.updated })}
      />
      <Body />
    </ArticleLayout>
  );
}
