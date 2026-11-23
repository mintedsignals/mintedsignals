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
 *
 * It also has a scheduled handler: every 30 minutes (triggers.crons in wrangler.jsonc) it asks
 * GitHub to run the "Rebuild and deploy" workflow, which fetches fresh odds and redeploys the
 * site. Cloudflare's timer is punctual; GitHub's own schedule only runs as a slower backup.
 */
import { isPartnerId, partners } from "../src/config/partners";
import { buildPartnerUrl, logClick, parseMarketId } from "../src/lib/affiliate";
import { getNewsletterProvider, parseSignup } from "../src/lib/newsletter";

export interface Env {
  /** The static site (the out/ folder). */
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** Newsletter provider name; unset means "signups aren't open yet". */
  NEWSLETTER_PROVIDER?: string;
  /**
   * Worker secret: a GitHub fine-grained token for this repo with "Actions: read and write",
   * used only to start the rebuild workflow. Set in the dashboard, never in the repo.
   */
  GITHUB_DISPATCH_TOKEN?: string;
}

/** The workflow the timer starts (.github/workflows/deploy.yml). */
export const REBUILD_WORKFLOW_URL =
  "https://api.github.com/repos/mintedsignals/mintedsignals/actions/workflows/deploy.yml/dispatches";

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/go/")) return handleGo(request, url);
    if (url.pathname === "/api/newsletter") return handleNewsletter(request, env);
    return env.ASSETS.fetch(request);
  },

  /** Cloudflare cron trigger: start the rebuild (see the note at the top). */
  async scheduled(_controller: unknown, env: Env): Promise<void> {
    await triggerRebuild(env);
  },
};

/**
 * Ask GitHub to run the rebuild workflow on main. Logs the outcome; never throws, so a GitHub
 * hiccup just means this slot is skipped and the next one tries again.
 */
export async function triggerRebuild(env: Env, fetcher: typeof fetch = fetch): Promise<boolean> {
  if (!env.GITHUB_DISPATCH_TOKEN) {
    console.warn("[rebuild] GITHUB_DISPATCH_TOKEN is not set; skipping");
    return false;
  }
  try {
    const res = await fetcher(REBUILD_WORKFLOW_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_DISPATCH_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "mintedsignals-rebuild-timer",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ref: "main" }),
    });
    if (res.status === 204) {
      console.info("[rebuild] workflow started");
      return true;
    }
    console.error(`[rebuild] GitHub answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return false;
  } catch (error) {
    console.error("[rebuild] request failed", error);
    return false;
  }
}

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
