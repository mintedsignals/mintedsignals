import { MarketsListing, marketsMetadata } from "@/components/markets/MarketsListing";

const filters = { page: 1 };

export const generateMetadata = () => marketsMetadata(filters);

export default function MarketsPage() {
  return <MarketsListing filters={filters} />;
}
