"use client";

import { useId, useState } from "react";

/**
 * "The daily brief" signup. Phase 6 posts this to an API route; until then it says so
 * instead of pretending to subscribe anyone.
 */
export function NewsletterForm() {
  const id = useId();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      id="newsletter"
      className="flex scroll-mt-6 flex-col gap-3 rounded-card bg-ink p-[22px] text-white"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage("Signups open soon. Thanks for your interest!");
      }}
    >
      <h3 className="font-display text-xl font-bold">The daily brief</h3>
      <p className="text-sm leading-normal text-dark-text">
        The five markets that moved most overnight, in a two-minute read.
      </p>
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
      <button
        type="submit"
        className="min-h-11 cursor-pointer rounded-control bg-accent p-[13px] text-[15px] font-semibold text-white hover:bg-link"
      >
        Subscribe free
      </button>
      <p role="status" className="text-[13px] text-dark-text empty:hidden">
        {message}
      </p>
    </form>
  );
}
