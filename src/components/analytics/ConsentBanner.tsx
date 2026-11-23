"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { OPEN_CONSENT_EVENT } from "@/config/analytics";
import { CONSENT_CHANGED_EVENT, readConsent, saveConsent, type ConsentChoice } from "@/lib/analytics";

/** The stored choice, kept in sync with localStorage (and other tabs). */
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  };
}

/**
 * Asks once whether analytics cookies may be used. Until the visitor accepts, Google Analytics
 * runs in Consent Mode "denied" (no cookies). Reject is as easy as Accept. The footer's
 * "Cookie settings" link reopens it.
 */
export function ConsentBanner() {
  // "server" while prerendering (the static HTML can't know the choice), so nothing is shown
  // until the browser has read it.
  const stored = useSyncExternalStore(subscribe, () => readConsent() ?? "unset", () => "server");
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!reopened && stored !== "unset") return null;

  const choose = (choice: ConsentChoice) => {
    saveConsent(choice);
    setReopened(false);
  };

  const button = "min-h-11 flex-1 cursor-pointer rounded-control px-5 text-sm font-semibold sm:flex-none";

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-[720px] flex-col gap-4 rounded-card border border-line bg-white p-5 shadow-[0_12px_32px_rgba(14,17,22,0.16)] sm:flex-row sm:items-center"
    >
      <p className="flex-1 text-sm leading-normal text-body">
        We&apos;d like to use analytics cookies to see how the site is used. You can accept or reject them; the site
        works the same either way. <Link href="/privacy">Privacy policy</Link>
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={() => choose("denied")} className={`${button} border border-line-strong bg-white text-ink hover:border-ink`}>
          Reject
        </button>
        <button type="button" onClick={() => choose("granted")} className={`${button} bg-ink text-white hover:bg-body`}>
          Accept
        </button>
      </div>
    </div>
  );
}
