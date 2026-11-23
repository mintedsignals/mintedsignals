import "server-only";

const TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 4;
const MAX_RETRY_WAIT_MS = 5_000;

export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Wait before retry n (1-based): Retry-After if the server sent one, else 0.5s, 1s, 2s. */
export function retryDelayMs(attempt: number, retryAfter: string | null): number {
  const seconds = retryAfter ? Number(retryAfter) : NaN;
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, MAX_RETRY_WAIT_MS);
  return Math.min(500 * 2 ** (attempt - 1), MAX_RETRY_WAIT_MS);
}

/**
 * GET a JSON endpoint with a timeout, retrying network errors, 429 (rate limited) and 5xx.
 * Returns null on 404 so callers can tell "not found" from "API down".
 */
export async function getJson<T>(url: string): Promise<T | null> {
  let lastError: unknown;
  let retryAfter: string | null = null;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) await sleep(retryDelayMs(attempt, retryAfter));
    retryAfter = null;
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store", // caching happens one level up, on the normalised result
      });
      if (res.status === 404) return null;
      if (res.ok) return (await res.json()) as T;
      lastError = new HttpError(`${res.status} from ${new URL(url).host}`, res.status);
      if (res.status !== 429 && res.status < 500) break; // other 4xx won't fix themselves
      retryAfter = res.headers.get("retry-after");
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
