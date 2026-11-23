import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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

export default nextConfig;
