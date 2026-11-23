import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { JsonLd } from "@/components/JsonLd";
import { articleEntries, getArticle, robotsFor } from "@/content";
import { articleJsonLd, defaultOgImages } from "@/lib/seo";

/** Static export: only the listed pages exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return articleEntries.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/analysis/[slug]">): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/analysis/${article.slug}` },
    robots: robotsFor(article.status),
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      modifiedTime: article.updated,
      images: defaultOgImages,
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/analysis/[slug]">) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const { default: Body } = await article.load();

  return (
    <ArticleLayout
      breadcrumbs={[{ label: "Analysis", href: "/analysis" }, { label: article.title }]}
      eyebrow={article.kicker}
      title={article.title}
      intro={article.summary}
      byline={article.author}
      updated={article.updated}
      status={article.status}
    >
      <JsonLd
        data={articleJsonLd({
          path: `/analysis/${article.slug}`,
          title: article.title,
          description: article.description,
          updated: article.updated,
          author: article.author,
        })}
      />
      <Body />
    </ArticleLayout>
  );
}
