import { describe, expect, it } from "vitest";
import worker, { type Env } from "./index";

const env: Env = { ASSETS: { fetch: async () => new Response("static file", { status: 200 }) } };
const call = (path: string, init?: RequestInit, e: Env = env) =>
  worker.fetch(new Request(`https://mintedsignals.io${path}`, init), e);

describe("static files", () => {
  it("passes every other path to the static assets", async () => {
    const res = await call("/guides/what-is-a-prediction-market");
    expect(await res.text()).toBe("static file");
  });
});

describe("/go redirects", () => {
  it("sends a market link to the market's page on the partner", async () => {
    const res = await call(
      "/go/kalshi?m=kalshi%3AKXFEDDECISION-26DEC-H0&to=https%3A%2F%2Fkalshi.com%2Fmarkets%2Fkxfeddecision",
    );
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://kalshi.com/markets/kxfeddecision");
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("falls back to the partner's homepage", async () => {
    expect((await call("/go/polymarket")).headers.get("location")).toBe("https://polymarket.com/");
    // destination from a different venue's market is ignored
    const mismatch = await call("/go/kalshi?m=polymarket%3A1&to=https%3A%2F%2Fkalshi.com%2Fmarkets%2Fx");
    expect(mismatch.headers.get("location")).toBe("https://kalshi.com/");
  });

  it("never redirects off the partner's domain", async () => {
    const res = await call("/go/kalshi?m=kalshi%3AKX-1&to=https%3A%2F%2Fevil.example%2F");
    expect(res.headers.get("location")).toBe("https://kalshi.com/");
  });

  it("404s for unknown partners", async () => {
    expect((await call("/go/nope")).status).toBe(404);
  });
});

describe("/api/newsletter", () => {
  const post = (body: unknown, e?: Env) =>
    call("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }, e);

  it("says signups aren't open until a provider is configured", async () => {
    const res = await post({ email: "reader@example.com" });
    expect(res.status).toBe(503);
    expect((await res.json()).error).toMatch(/aren't open yet/);
  });

  it("refuses the console provider, which would log email addresses", async () => {
    expect((await post({ email: "reader@example.com" }, { ...env, NEWSLETTER_PROVIDER: "console" })).status).toBe(503);
  });

  it("validates input and quietly accepts honeypot bots", async () => {
    expect((await post({ email: "nope" })).status).toBe(400);
    expect((await post({ email: "a@b.co", website: "spam" })).status).toBe(200);
    expect((await call("/api/newsletter")).status).toBe(405);
  });
});
