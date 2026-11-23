"use client";

import { OPEN_CONSENT_EVENT } from "@/config/analytics";

/** Footer link that reopens the consent banner, so visitors can change their choice. */
export function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="cursor-pointer p-0 text-left text-link hover:text-ink"
    >
      Cookie settings
    </button>
  );
}
