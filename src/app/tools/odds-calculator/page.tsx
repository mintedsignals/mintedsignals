import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Prediction market odds calculator",
  description: "Turn a YES share price into implied chance, payout and profit.",
};

export default function Page() {
  return <PagePlaceholder eyebrow="TOOLS" title="Prediction market odds calculator" intro="Turn a YES share price into implied chance, payout and profit." phase={5} />;
}
