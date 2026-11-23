import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Build every page in one worker. Each worker has its own in-memory cache, so with the
    // default (several workers) the market snapshot loads once per worker, all at the same
    // time, and Kalshi rate-limits the build (429). One worker loads it once and reuses it.
    staticGenerationMinPagesPerWorker: 10_000,
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
