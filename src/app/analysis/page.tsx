import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Prediction market analysis",
  description: "Analysis of the markets moving the most each day.",
};

export default function Page() {
  return <PagePlaceholder eyebrow="ANALYSIS" title="Prediction market analysis" intro="Analysis of the markets moving the most each day." phase={5} />;
}
