import type { Category } from "@/config/site";

/** Category tabs shown on the hottest-markets widget (from the design). */
export const WIDGET_CATEGORIES = ["Politics", "Crypto", "Economy", "Sports", "Culture"] as const satisfies Category[];

/** Rows shown in the widget. */
export const WIDGET_LIMIT = 8;
