import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/PagePlaceholder";
import { platforms } from "@/config/site";

const findPlatform = (slug: string) => platforms.find((p) => p.slug === slug);

export function generateStaticParams() {
  return platforms.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/platforms/[slug]">): Promise<Metadata> {
  const platform = findPlatform((await params).slug);
  if (!platform) return {};
  return {
    title: `${platform.name} review`,
    description: `Our ${platform.name} review: how it works, fees, funding and who can use it.`,
    alternates: { canonical: `/platforms/${platform.slug}` },
  };
}

export default async function PlatformPage({ params }: PageProps<"/platforms/[slug]">) {
  const platform = findPlatform((await params).slug);
  if (!platform) notFound();

  return <PagePlaceholder eyebrow="PLATFORM REVIEW" title={`${platform.name} review`} phase={5} />;
}
