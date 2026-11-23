import { describe, expect, it } from "vitest";
import { consoleProvider, getNewsletterProvider, parseSignup } from "./index";

describe("parseSignup", () => {
  it("normalises a valid email and keeps a safe source path", () => {
    expect(parseSignup({ email: "  You@Example.com ", source: "/guides/what-is-a-prediction-market" })).toEqual({
      ok: true,
      subscriber: { email: "you@example.com", source: "/guides/what-is-a-prediction-market" },
    });
  });

  it("rejects missing or malformed emails", () => {
    for (const body of [{}, { email: "" }, { email: "nope" }, { email: "a@b" }, { email: 42 }, { email: `${"a".repeat(250)}@x.io` }]) {
      expect(parseSignup(body)).toMatchObject({ ok: false, status: 400 });
    }
    expect(parseSignup(null)).toMatchObject({ ok: false, status: 400 });
  });

  it("drops sources that aren't plain site paths", () => {
    const result = parseSignup({ email: "a@b.co", source: "https://evil.example" });
    expect(result).toEqual({ ok: true, subscriber: { email: "a@b.co", source: null } });
  });

  it("flags bots that fill the honeypot", () => {
    expect(parseSignup({ email: "a@b.co", website: "http://spam" })).toEqual({ ok: true, bot: true });
  });
});

describe("getNewsletterProvider", () => {
  it("uses the console provider in development when nothing is configured", () => {
    expect(getNewsletterProvider({ NODE_ENV: "development" })).toBe(consoleProvider);
  });

  it("has no provider in production until one is configured", () => {
    expect(getNewsletterProvider({ NODE_ENV: "production" })).toBeNull();
    expect(getNewsletterProvider({ NODE_ENV: "production", NEWSLETTER_PROVIDER: "unknown" })).toBeNull();
    // The console provider logs email addresses, so it's refused in production.
    expect(getNewsletterProvider({ NODE_ENV: "production", NEWSLETTER_PROVIDER: "console" })).toBeNull();
  });
});
