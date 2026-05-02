import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  color?: "emerald" | "amber" | "slate";
}

const colorMap = {
  emerald: {
    icon: "bg-primary/10 text-primary",
    glow: "group-hover:shadow-glow-emerald/30",
    accent: "from-primary/10 to-transparent",
  },
  amber: {
    icon: "bg-accent/15 text-accent-foreground",
    glow: "group-hover:shadow-glow-amber/30",
    accent: "from-accent/10 to-transparent",
  },
  slate: {
    icon: "bg-muted text-muted-foreground",
    glow: "",
    accent: "from-muted to-transparent",
  },
};

const StatCard = ({ label, value, sub, icon: Icon, color = "slate" }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    className={`group relative bg-card border border-border rounded-2xl p-6 shadow-premium overflow-hidden transition-all duration-300 hover:shadow-premium-hover ${colorMap[color].glow}`}
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colorMap[color].accent} rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-8 translate-x-8`} />
    <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <div className={`p-2.5 rounded-xl ${colorMap[color].icon} transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-3xl font-black text-foreground tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground mt-1.5">{sub}</p>
    </div>
  </motion.div>
);

export default StatCard;
