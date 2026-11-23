import { allMarketsViewSegments, MarketsListing, marketsMetadata } from "@/components/markets/MarketsListing";
import { parseFilterSegments } from "@/lib/markets/filters";

/** /markets/venue/… views (see src/lib/markets/filters.ts for the URL shapes). */
export const dynamicParams = false;

export async function generateStaticParams() {
  const views = await allMarketsViewSegments();
  return views.filter((s) => s[0] === "venue").map((s) => ({ filter: s.slice(1) }));
}

const parse = async (params: PageProps<"/markets/venue/[...filter]">["params"]) => parseFilterSegments(["venue", ...(await params).filter]);

export async function generateMetadata({ params }: PageProps<"/markets/venue/[...filter]">) {
  return marketsMetadata(await parse(params));
}

export default async function Page({ params }: PageProps<"/markets/venue/[...filter]">) {
  return <MarketsListing filters={await parse(params)} />;
}
