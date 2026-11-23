import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Advertise with us",
  description: "Display, sponsored market widgets, newsletter placements and featured platform listings.",
};

export default function Page() {
  return <PagePlaceholder eyebrow="FOR BRANDS AND NETWORKS" title="Advertise with us" intro="Display, sponsored market widgets, newsletter placements and featured platform listings." phase={5} />;
}
