/**
 * The Cloudflare Worker for mintedsignals.io.
 *
 * Every page of the site is a static file built by `next build` (output: "export") and
 * served straight from Cloudflare's static assets, without running this code. That's free
 * and unlimited on the Workers Free plan. Only these two paths run here (see run_worker_first
 * in wrangler.jsonc), and both are tiny so they stay well inside the Free plan's 10 ms CPU:
 *
 *   GET  /go/<partner>?m=<market id>&to=<market page>   affiliate redirect, logged
 *   POST /api/newsletter                                 newsletter signup
 */
import { isPartnerId, partners } from "../src/config/partners";
import { buildPartnerUrl, logClick, parseMarketId } from "../src/lib/affiliate";
import { getNewsletterProvider, parseSignup } from "../src/lib/newsletter";

export interface Env {
  /** The static site (the out/ folder). */
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** Newsletter provider name; unset means "signups aren't open yet". */
  NEWSLETTER_PROVIDER?: string;
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/go/")) return handleGo(request, url);
    if (url.pathname === "/api/newsletter") return handleNewsletter(request, env);
    return env.ASSETS.fetch(request);
  },
};

export default worker;

const noStore = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

export function handleGo(request: Request, url: URL): Response {
  const partnerId = url.pathname.slice("/go/".length).replace(/\/$/, "");
  if (!isPartnerId(partnerId)) return new Response("Not found", { status: 404, headers: noStore });

  const market = parseMarketId(url.searchParams.get("m"));
  // Only use the destination for a market on this partner; buildPartnerUrl also refuses any
  // URL that isn't on the partner's own domains.
  const destination = buildPartnerUrl(partners[partnerId], market?.venue === partnerId ? url.searchParams.get("to") : null);

  // HEAD requests (link checkers, some bots) redirect too, but aren't counted as clicks.
  if (request.method === "GET") {
    let from: string | null = null;
    try {
      const referer = new URL(request.headers.get("referer") ?? "");
      if (referer.host === url.host) from = referer.pathname;
    } catch {}
    logClick({
      partner: partnerId,
      marketId: market ? `${market.venue}:${market.nativeId}` : null,
      from,
      at: new Date().toISOString(),
    });
  }

  return new Response(null, { status: 302, headers: { ...noStore, Location: destination.toString() } });
}

const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...noStore } });

export async function handleNewsletter(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const parsed = parseSignup(body);
  if (!parsed.ok) return json({ ok: false, error: parsed.error }, parsed.status);
  if ("bot" in parsed) return json({ ok: true }, 200); // honeypot: look successful, do nothing

  // Always "production" here, so the console provider (which logs email addresses) is refused.
  const provider = getNewsletterProvider({ NODE_ENV: "production", NEWSLETTER_PROVIDER: env.NEWSLETTER_PROVIDER });
  if (!provider) return json({ ok: false, error: "Signups aren't open yet. Please check back soon." }, 503);

  try {
    const result = await provider.subscribe(parsed.subscriber);
    if (!result.ok) return json({ ok: false, error: result.error }, 502);
    return json({ ok: true }, 200);
  } catch (error) {
    console.error(`[newsletter] ${provider.name} failed`, error);
    return json({ ok: false, error: "Something went wrong. Please try again." }, 502);
  }
}
