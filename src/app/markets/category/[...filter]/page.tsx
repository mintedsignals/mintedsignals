import { allMarketsViewSegments, MarketsListing, marketsMetadata } from "@/components/markets/MarketsListing";
import { parseFilterSegments } from "@/lib/markets/filters";

/** /markets/category/… views (see src/lib/markets/filters.ts for the URL shapes). */
export const dynamicParams = false;

export async function generateStaticParams() {
  const views = await allMarketsViewSegments();
  return views.filter((s) => s[0] === "category").map((s) => ({ filter: s.slice(1) }));
}

const parse = async (params: PageProps<"/markets/category/[...filter]">["params"]) => parseFilterSegments(["category", ...(await params).filter]);

export async function generateMetadata({ params }: PageProps<"/markets/category/[...filter]">) {
  return marketsMetadata(await parse(params));
}

export default async function Page({ params }: PageProps<"/markets/category/[...filter]">) {
  return <MarketsListing filters={await parse(params)} />;
}
