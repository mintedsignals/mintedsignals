import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` writes the whole site to out/ as plain files, served by
  // Cloudflare as static assets (free and unlimited on the Workers Free plan). Market odds
  // are fetched at build time; a scheduled rebuild keeps them fresh (docs/DEPLOY.md).
  // The two live features, /go redirects and newsletter signups, run in worker/index.ts.
  output: "export",
  experimental: {
    // Build every page in one worker process, so the market snapshot is fetched once per
    // build and shared by every page (several processes would each fetch it, and Kalshi
    // rate-limits that).
    staticGenerationMinPagesPerWorker: 100_000,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Guides, reviews and articles are MDX files in src/content. Plugins are named as strings
// so they work with Turbopack: GitHub tables, and id attributes on headings for anchor links.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
