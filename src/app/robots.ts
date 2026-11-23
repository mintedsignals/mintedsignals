import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** Written as a static file at build time (static export). */
export const dynamic = "force-static";

/**
 * Production: crawl everything except affiliate redirects (/go/) and API routes.
 * Preview deployments (VERCEL_ENV=preview, if ever hosted on Vercel) block all crawling so
 * test copies of the site never end up in search results.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/go/", "/api/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
