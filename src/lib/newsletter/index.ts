/**
 * Newsletter signups. The email provider sits behind `NewsletterProvider` so it can be
 * swapped without touching the form or the API route: add an implementation below and
 * select it with the NEWSLETTER_PROVIDER env var.
 */

export interface Subscriber {
  email: string;
  /** Where the signup came from, e.g. "/" or "/guides/what-is-a-prediction-market". */
  source: string | null;
}

export type SubscribeResult = { ok: true } | { ok: false; error: string };

export interface NewsletterProvider {
  readonly name: string;
  subscribe(subscriber: Subscriber): Promise<SubscribeResult>;
}

/** Development only: logs the signup (including the email) instead of sending it anywhere. */
export const consoleProvider: NewsletterProvider = {
  name: "console",
  async subscribe({ email, source }) {
    console.info(JSON.stringify({ type: "newsletter_signup", email, source }));
    return { ok: true };
  },
};

/**
 * The configured provider, or null if none is set (the route then says signups aren't
 * open yet). In development the console provider is used when nothing is configured.
 */
export function getNewsletterProvider(env: Record<string, string | undefined> = process.env): NewsletterProvider | null {
  const production = env.NODE_ENV === "production";
  switch (env.NEWSLETTER_PROVIDER) {
    case "console":
      // Never in production: it would write subscribers' email addresses to the server logs.
      return production ? null : consoleProvider;
    // case "buttondown": return buttondownProvider(env.BUTTONDOWN_API_KEY) — add when chosen
    case undefined:
    case "":
      return production ? null : consoleProvider;
    default:
      return null;
  }
}

export type ParsedSignup = { ok: true; subscriber: Subscriber } | { ok: false; status: number; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate a signup body. `website` is a honeypot field hidden from people: bots fill it,
 * and we then pretend success without subscribing anyone.
 */
export function parseSignup(body: unknown): ParsedSignup | { ok: true; bot: true } {
  if (typeof body !== "object" || body === null) return { ok: false, status: 400, error: "Invalid request." };
  const { email, source, website } = body as Record<string, unknown>;

  if (typeof website === "string" && website.trim() !== "") return { ok: true, bot: true };

  if (typeof email !== "string") return { ok: false, status: 400, error: "Enter your email address." };
  const normalized = email.trim().toLowerCase();
  if (normalized.length > 254 || !EMAIL.test(normalized)) {
    return { ok: false, status: 400, error: "That doesn't look like an email address." };
  }

  const safeSource = typeof source === "string" && /^\/[\w\-/]*$/.test(source) && source.length <= 200 ? source : null;
  return { ok: true, subscriber: { email: normalized, source: safeSource } };
}
