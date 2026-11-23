"use client";

import { usePathname } from "next/navigation";
import { useId, useState } from "react";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done" } | { kind: "error"; message: string };

/** "The daily brief" signup. Posts to /api/newsletter (provider chosen in src/lib/newsletter). */
export function NewsletterForm() {
  const id = useId();
  const pathname = usePathname();
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), website: form.get("website"), source: pathname }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      setState(res.ok && data.ok ? { kind: "done" } : { kind: "error", message: data.error ?? "Something went wrong. Please try again." });
    } catch {
      setState({ kind: "error", message: "Couldn't connect. Please try again." });
    }
  }

  return (
    <form id="newsletter" className="flex scroll-mt-6 flex-col gap-3 rounded-card bg-ink p-[22px] text-white" onSubmit={onSubmit}>
      <h3 className="font-display text-xl font-bold">The daily brief</h3>
      <p className="text-sm leading-normal text-dark-text">The five markets that moved most overnight, in a two-minute read.</p>
      {state.kind === "done" ? (
        <p role="status" className="rounded-control bg-[#1A1F27] px-3.5 py-3 text-[15px]">
          You’re on the list. Look out for the first brief in your inbox.
        </p>
      ) : (
        <>
          <label htmlFor={id} className="text-[13px] text-dark-text">
            Email address
          </label>
          <input
            id={id}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="min-h-11 rounded-control border border-[#3A404C] bg-[#1A1F27] px-3.5 py-3 text-[15px] text-white placeholder:text-dark-label"
          />
          {/* Honeypot: hidden from people, filled in by bots. */}
          <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <button
            type="submit"
            disabled={state.kind === "sending"}
            className="min-h-11 cursor-pointer rounded-control bg-accent p-[13px] text-[15px] font-semibold text-white hover:bg-link disabled:cursor-wait disabled:opacity-70"
          >
            {state.kind === "sending" ? "Subscribing…" : "Subscribe free"}
          </button>
          <p role="status" className="text-[13px] text-[#FDBA8C] empty:hidden">
            {state.kind === "error" ? state.message : ""}
          </p>
        </>
      )}
    </form>
  );
}
