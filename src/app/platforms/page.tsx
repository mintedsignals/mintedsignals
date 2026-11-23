import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Prediction market platforms compared",
  description: "Reviews of Polymarket and Kalshi: regulation, fees, funding and who can use each.",
};

export default function Page() {
  return <PagePlaceholder eyebrow="WHERE TO TRADE" title="Prediction market platforms compared" intro="Reviews of Polymarket and Kalshi: regulation, fees, funding and who can use each." phase={5} />;
}
