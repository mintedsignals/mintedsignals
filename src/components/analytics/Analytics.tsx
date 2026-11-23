"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect } from "react";
import { affiliateClickParams, trackEvent } from "@/lib/analytics";
import { ConsentBanner } from "./ConsentBanner";

/**
 * Google Analytics 4 plus the consent banner. Rendered only when a Measurement ID is set
 * (src/config/analytics.ts). Consent Mode defaults are set earlier, in <head> (layout.tsx).
 */
export function Analytics({ gaId }: { gaId: string }) {
  // One listener for the whole page: every click on a /go/ affiliate link becomes an event.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const params = affiliateClickParams(link.href, window.location.origin);
      if (params) trackEvent("affiliate_click", { ...params, page_path: window.location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <ConsentBanner />
    </>
  );
}
