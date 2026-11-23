import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Prediction markets",
  description: "Every market we track on Polymarket and Kalshi, filterable by category and venue.",
};

export default function Page() {
  return <PagePlaceholder eyebrow="MARKETS" title="Prediction markets" intro="Every market we track on Polymarket and Kalshi, filterable by category and venue." phase={4} />;
}
