import { allMarketsViewSegments, MarketsListing, marketsMetadata } from "@/components/markets/MarketsListing";
import { parseFilterSegments } from "@/lib/markets/filters";

/** /markets/page/N: later pages of the unfiltered list. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const views = await allMarketsViewSegments();
  return views.filter((s) => s[0] === "page").map((s) => ({ n: s[1] }));
}

const parse = async (params: PageProps<"/markets/page/[n]">["params"]) => parseFilterSegments(["page", (await params).n]);

export async function generateMetadata({ params }: PageProps<"/markets/page/[n]">) {
  return marketsMetadata(await parse(params));
}

export default async function Page({ params }: PageProps<"/markets/page/[n]">) {
  return <MarketsListing filters={await parse(params)} />;
}
