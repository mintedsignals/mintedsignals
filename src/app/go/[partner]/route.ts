import type { NextRequest } from "next/server";
import { isPartnerId, partners } from "@/config/partners";
import { buildPartnerUrl, logClick, parseMarketId } from "@/lib/affiliate";
import { getMarketById } from "@/lib/markets";

/**
 * Outbound affiliate links: /go/kalshi or /go/kalshi?m=kalshi:KXFED-26DEC-H0.
 * Redirects to the market's page on the partner's site (or the partner's homepage) with
 * the tracking parameters from src/config/partners.ts, and logs the click.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/go/[partner]">) {
  const { partner: partnerId } = await ctx.params;
  if (!isPartnerId(partnerId)) return new Response("Not found", { status: 404 });
  const partner = partners[partnerId];

  const marketId = parseMarketId(request.nextUrl.searchParams.get("m"));
  let marketUrl: string | null = null;
  if (marketId?.venue === partnerId) {
    try {
      marketUrl = (await getMarketById(`${marketId.venue}:${marketId.nativeId}`))?.url ?? null;
    } catch {
      // venue API down: send people to the partner's homepage rather than failing the click
    }
  }

  const destination = buildPartnerUrl(partner, marketUrl);

  const referer = request.headers.get("referer");
  let from: string | null = null;
  try {
    if (referer && new URL(referer).host === request.nextUrl.host) from = new URL(referer).pathname;
  } catch {}
  // HEAD requests (link checkers, some bots) redirect too, but aren't counted as clicks.
  if (request.method === "GET") logClick({
    partner: partnerId,
    marketId: marketId ? `${marketId.venue}:${marketId.nativeId}` : null,
    from,
    at: new Date().toISOString(),
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: destination.toString(),
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
