/**
 * Freshness scoring engine for Scraps2Stock.
 *
 * Works entirely on frontend with data already in the inventory response.
 * No backend changes required — uses expiryDate + category as inputs.
 *
 * Score 0–100:
 *   > 75  →  Low risk   (green)
 *   40–75 →  Medium risk (amber)
 *   < 40  →  High risk  (red)
 */

export type SpoilageRisk = "LOW" | "MEDIUM" | "HIGH";

export interface FreshnessResult {
  score: number;          // 0–100
  risk: SpoilageRisk;
  label: string;          // "Excellent" | "Good" | "Fair" | "Critical"
  daysLeft: number | null;
  bestBefore: string;     // human-readable e.g. "3 days left"
}

/** Categories that decay faster than average */
const FAST_DECAY = new Set(["Vegetables", "Dairy", "Leafy Greens", "Herbs"]);
const SLOW_DECAY = new Set(["Grains", "Spices", "Pulses", "Oils"]);

/**
 * Compute freshness score from item fields available in the existing API response.
 *
 * @param expiryDate  ISO date string from inventory (YYYY-MM-DD)
 * @param category    e.g. "Vegetables", "Fruits", "Grains"
 * @param storageType "cold" | "room" | undefined — optional, falls back to category heuristic
 */
export function computeFreshness(
  expiryDate?: string | null,
  category?: string | null,
  storageType?: "cold" | "room" | null
): FreshnessResult {
  // ── 1. Days-left calculation ──────────────────────────────────────────────
  let daysLeft: number | null = null;
  if (expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000);
  }

  // ── 2. Base score from days remaining ────────────────────────────────────
  // No expiry data → neutral 65 (we don't penalise if backend didn't send it)
  let score = 65;
  if (daysLeft !== null) {
    if (daysLeft <= 0)  score = 0;
    else if (daysLeft === 1) score = 20;
    else if (daysLeft === 2) score = 35;
    else if (daysLeft === 3) score = 52;
    else if (daysLeft === 4) score = 65;
    else if (daysLeft === 5) score = 74;
    else if (daysLeft <= 7)  score = 82;
    else if (daysLeft <= 14) score = 90;
    else                     score = 96;
  }

  // ── 3. Category modifier ──────────────────────────────────────────────────
  const cat = (category ?? "").trim();
  if (FAST_DECAY.has(cat)) score = Math.max(0, score - 8);
  if (SLOW_DECAY.has(cat)) score = Math.min(100, score + 6);

  // ── 4. Storage modifier ───────────────────────────────────────────────────
  // Cold storage slows decay; room temp slightly accelerates for fresh produce
  if (storageType === "cold")  score = Math.min(100, score + 5);
  if (storageType === "room" && FAST_DECAY.has(cat)) score = Math.max(0, score - 5);

  score = Math.round(score);

  // ── 5. Risk bucket ────────────────────────────────────────────────────────
  let risk: SpoilageRisk;
  let label: string;
  if (score >= 75) { risk = "LOW";    label = score >= 90 ? "Excellent" : "Good"; }
  else if (score >= 40) { risk = "MEDIUM"; label = "Fair"; }
  else { risk = "HIGH"; label = daysLeft !== null && daysLeft <= 0 ? "Expired" : "Critical"; }

  // ── 6. Human-readable "best before" ──────────────────────────────────────
  let bestBefore: string;
  if (daysLeft === null)          bestBefore = "Check expiry";
  else if (daysLeft <= 0)         bestBefore = "Expired";
  else if (daysLeft === 1)        bestBefore = "Expires today";
  else if (daysLeft === 2)        bestBefore = "Expires tomorrow";
  else if (daysLeft <= 7)         bestBefore = `${daysLeft} days left`;
  else if (daysLeft <= 14)        bestBefore = `${daysLeft} days left`;
  else                            bestBefore = `${daysLeft}+ days left`;

  return { score, risk, label, daysLeft, bestBefore };
}

/** Colour tokens by risk level — works in both light and dark mode */
export const riskStyles: Record<SpoilageRisk, {
  bar: string;       // progress bar fill
  badge: string;     // badge background + text
  dot: string;       // indicator dot
}> = {
  LOW:    { bar: "bg-emerald-500",   badge: "bg-emerald-50  text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", dot: "bg-emerald-500" },
  MEDIUM: { bar: "bg-amber-400",     badge: "bg-amber-50    text-amber-700   dark:bg-amber-900/30   dark:text-amber-400",   dot: "bg-amber-400" },
  HIGH:   { bar: "bg-red-500",       badge: "bg-red-50      text-red-700     dark:bg-red-900/30     dark:text-red-400",     dot: "bg-red-500" },
};
