import { Shield, ShieldAlert, ShieldCheck, ShieldPlus, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type VerificationLevel = "UNVERIFIED" | "BASIC" | "TRUSTED" | "FSSAI";

interface TrustBadgeProps {
  score?: number; // 0-100
  level?: VerificationLevel;
  showScore?: boolean;
}

// Helper to deterministically generate a score and level based on a string (e.g. email)
export const getDemoTrustInfo = (seedStr: string) => {
  const sum = seedStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const score = 40 + (sum % 61); // Score between 40 and 100
  
  let level: VerificationLevel = "UNVERIFIED";
  if (score >= 90) level = "FSSAI";
  else if (score >= 75) level = "TRUSTED";
  else if (score >= 55) level = "BASIC";

  return { score, level };
};

export const TrustBadge = ({ score = 0, level = "UNVERIFIED", showScore = true }: TrustBadgeProps) => {
  let trustColor = "text-red-500 bg-red-500/10 border-red-500/20";
  let trustText = "Low Trust";
  
  if (score >= 80) {
    trustColor = "text-emerald-600 bg-emerald-600/10 border-emerald-600/20";
    trustText = "High Trust";
  } else if (score >= 50) {
    trustColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
    trustText = "Medium Trust";
  }

  const renderBadge = () => {
    switch (level) {
      case "FSSAI":
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[10px] font-black uppercase tracking-wider">
            <ShieldPlus size={12} /> FSSAI Verified
          </div>
        );
      case "TRUSTED":
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
            <ShieldCheck size={12} /> Trusted Supplier
          </div>
        );
      case "BASIC":
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-wider">
            <Shield size={12} /> Basic Verified
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border text-[10px] font-black uppercase tracking-wider">
            <ShieldAlert size={12} /> Unverified
          </div>
        );
    }
  };

  return (
    <div className="flex items-center gap-3">
      {renderBadge()}
      
      {showScore && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`cursor-help flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-wider transition-colors ${trustColor}`}>
                <span className="font-bold">Score: {score}</span>
                <Info size={10} className="opacity-70" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs p-4 bg-card text-foreground border-border shadow-premium rounded-xl">
              <div className="space-y-2">
                <p className="font-black text-sm border-b border-border pb-2 mb-2">Trust Score: {score}/100 ({trustText})</p>
                <p className="text-xs text-muted-foreground">Based on:</p>
                <ul className="text-xs space-y-1 font-medium">
                  <li className="flex justify-between"><span>Verification:</span> <span className="text-primary">{level}</span></li>
                  <li className="flex justify-between"><span>Completed Orders:</span> <span>{(score * 3) % 250}+</span></li>
                  <li className="flex justify-between"><span>Response Time:</span> <span>&lt;{10 - Math.floor(score/12)}h</span></li>
                  <li className="flex justify-between"><span>Complaints:</span> <span className="text-emerald-600">0 in last 30d</span></li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
