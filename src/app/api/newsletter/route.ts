import { getNewsletterProvider, parseSignup } from "@/lib/newsletter";

/** POST { email, source?, website? } -> 200 { ok: true } | 4xx/5xx { ok: false, error }. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseSignup(body);
  if (!parsed.ok) return Response.json({ ok: false, error: parsed.error }, { status: parsed.status });
  if ("bot" in parsed) return Response.json({ ok: true }); // honeypot: look successful, do nothing

  const provider = getNewsletterProvider();
  if (!provider) {
    return Response.json({ ok: false, error: "Signups aren't open yet. Please check back soon." }, { status: 503 });
  }

  try {
    const result = await provider.subscribe(parsed.subscriber);
    if (!result.ok) return Response.json({ ok: false, error: result.error }, { status: 502 });
    return Response.json({ ok: true });
  } catch (error) {
    console.error(`[newsletter] ${provider.name} failed`, error);
    return Response.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
