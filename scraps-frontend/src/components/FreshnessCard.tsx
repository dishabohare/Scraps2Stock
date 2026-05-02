/**
 * FreshnessCard — displays Freshness Score + Spoilage Risk badge.
 *
 * Usage:
 *   <FreshnessCard expiryDate={item.expiryDate} category={item.category} />
 *
 * Compact (for tight cards):
 *   <FreshnessCard expiryDate={...} category={...} compact />
 */

import { computeFreshness, riskStyles } from "@/lib/freshness";
import { Leaf } from "lucide-react";

interface FreshnessCardProps {
  expiryDate?: string | null;
  category?: string | null;
  storageType?: "cold" | "room" | null;
  /** Compact mode — single row, smaller text */
  compact?: boolean;
}

const RISK_LABEL: Record<string, string> = {
  LOW: "Low Risk",
  MEDIUM: "Medium Risk",
  HIGH: "High Risk",
};

export const FreshnessCard = ({
  expiryDate,
  category,
  storageType,
  compact = false,
}: FreshnessCardProps) => {
  const f = computeFreshness(expiryDate, category, storageType);
  const styles = riskStyles[f.risk];

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {/* Score pill */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles.badge}`}>
          <Leaf size={10} />
          {f.score}/100
        </span>
        {/* Risk badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
          {RISK_LABEL[f.risk]}
        </span>
        {/* Best before */}
        <span className="text-[10px] font-bold text-muted-foreground">
          {f.bestBefore}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-secondary/40 border border-border/20">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf size={14} className="text-emerald-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Freshness Score
          </span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
          {RISK_LABEL[f.risk]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xl font-black text-foreground">{f.score}<span className="text-sm text-muted-foreground font-medium">/100</span></span>
          <span className="text-sm font-bold text-muted-foreground">{f.label}</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${styles.bar}`}
            style={{ width: `${f.score}%` }}
          />
        </div>
      </div>

      {/* Best-before */}
      <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
        {f.bestBefore}
      </p>
    </div>
  );
};

export default FreshnessCard;
