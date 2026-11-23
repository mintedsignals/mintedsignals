import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/PagePlaceholder";
import { guides } from "@/config/site";

const findGuide = (slug: string) => guides.find((g) => g.slug === slug);

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const guide = findGuide((await params).slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.summary,
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();

  return (
    <PagePlaceholder
      eyebrow={`${guide.number} · ${guide.topic.toUpperCase()}`}
      title={guide.title}
      intro={guide.summary}
      phase={5}
    />
  );
}
