import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Prediction market guides",
  description: "Plain-English guides to how prediction markets work, from reading odds to resolution.",
};

export default function Page() {
  return <PagePlaceholder eyebrow="LEARN" title="Prediction market guides" intro="Plain-English guides to how prediction markets work, from reading odds to resolution." phase={5} />;
}
