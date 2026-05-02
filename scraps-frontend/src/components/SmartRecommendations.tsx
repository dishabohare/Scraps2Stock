import { useEffect, useState, useMemo } from "react";
import { Sparkles, MapPin, IndianRupee, ShieldCheck, ArrowRight, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { computeFreshness } from "@/lib/freshness";
import { haversineKm, getSupplierCoords, DEFAULT_CENTER } from "@/lib/supplierCoords";
import { getDemoTrustInfo } from "@/components/TrustBadge";

interface InventoryItem {
  id: number;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  supplierName: string;
  supplierEmail: string;
  expiryDate?: string;
}

interface RecommendedItem extends InventoryItem {
  recScore: number;
  recReason: string;
  freshness: number;
  distance: number;
  trustScore: number;
  isVerified: boolean;
}

type FilterType = "BEST_MATCH" | "CHEAPEST" | "FRESHEST" | "NEAREST" | "TRUSTED";

const SmartRecommendations = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("BEST_MATCH");
  const [userLoc, setUserLoc] = useState<[number, number]>(DEFAULT_CENTER);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
        () => setUserLoc(DEFAULT_CENTER) // Fallback to Indore
      );
    }
  }, []);

  useEffect(() => {
    const fetchAndScore = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8081/api/inventory/all");
        if (!res.ok) throw new Error("Failed to fetch inventory");
        const data: InventoryItem[] = await res.json();

        // Find global min price to use for relative scoring
        const minPrice = Math.min(...data.map(d => d.price));

        const scoredItems: RecommendedItem[] = data
          .filter(d => d.quantity > 0) // Exclude out of stock
          .map(item => {
            // 1. Freshness (0-100) -> 30% weight
            const freshnessRes = computeFreshness(item.expiryDate, item.category);
            const freshnessScore = freshnessRes.score;

            // 2. Distance (0-100) -> 20% weight
            const coords = getSupplierCoords(item.supplierEmail);
            let distance = 50; // default 50km if unknown
            let distScore = 0;
            if (coords) {
              distance = haversineKm(userLoc[0], userLoc[1], coords.lat, coords.lng);
              // Max score if < 5km, 0 score if > 100km
              distScore = Math.max(0, 100 - (distance / 100) * 100);
            }

            // 3. Price (0-100) -> 30% weight
            // Score based on how close it is to the absolute cheapest item on the market
            const priceScore = Math.max(0, 100 - ((item.price - minPrice) / minPrice) * 50);

            // 4. Trust (0-100) -> 20% weight
            const trustInfo = getDemoTrustInfo(item.supplierEmail);
            const trustScore = trustInfo.score;

            // Final Recommendation Score (0-100)
            const recScore = Math.round(
              (freshnessScore * 0.30) +
              (priceScore * 0.30) +
              (distScore * 0.20) +
              (trustScore * 0.20)
            );

            // Determine Reason
            let recReason = "Top Pick for You";
            if (recScore > 85) {
              if (priceScore > 90) recReason = "Lowest Price Today";
              else if (freshnessScore > 90) recReason = "Best Freshness Near You";
              else if (distScore > 90) recReason = "Fast Delivery / Nearest";
              else if (trustScore > 90) recReason = "Top Trusted Supplier";
            } else {
               if (priceScore > freshnessScore && priceScore > distScore) recReason = "Great Value";
               else if (distScore > 80) recReason = "Close to your location";
               else recReason = "Good Quality Surplus";
            }

            return {
              ...item,
              recScore,
              recReason,
              freshness: freshnessScore,
              distance,
              trustScore,
              isVerified: trustInfo.isVerified
            };
          });

        setItems(scoredItems);
      } catch (err) {
        console.error("Error generating recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAndScore();
  }, [userLoc]);

  // Apply User Filter
  const filteredAndSorted = useMemo(() => {
    let result = [...items];
    switch (filter) {
      case "BEST_MATCH":
        result.sort((a, b) => b.recScore - a.recScore);
        break;
      case "CHEAPEST":
        result.sort((a, b) => a.price - b.price);
        break;
      case "FRESHEST":
        result.sort((a, b) => b.freshness - a.freshness);
        break;
      case "NEAREST":
        result.sort((a, b) => a.distance - b.distance);
        break;
      case "TRUSTED":
        result = result.filter(r => r.trustScore >= 80).sort((a, b) => b.trustScore - a.trustScore);
        break;
    }
    return result.slice(0, 4); // Show top 4
  }, [items, filter]);

  if (loading) {
    return (
      <div className="w-full flex gap-6 overflow-hidden">
        {[1, 2, 3].map(i => (
          <div key={i} className="min-w-[300px] h-64 bg-secondary/50 rounded-3xl animate-pulse shrink-0" />
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Sparkles className="text-accent" size={24} /> Recommended for You
          </h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
            AI-Scored surplus matching your procurement profile
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex overflow-x-auto gap-2 custom-scrollbar pb-2 sm:pb-0">
          {[
            { id: "BEST_MATCH", label: "Best Match" },
            { id: "CHEAPEST", label: "Cheapest" },
            { id: "FRESHEST", label: "Freshest" },
            { id: "NEAREST", label: "Nearest" },
            { id: "TRUSTED", label: "Trusted Only" }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as FilterType)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all
                ${filter === f.id 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredAndSorted.map(item => (
          <div key={item.id} className="card-premium p-6 flex flex-col group relative overflow-hidden bg-card hover:border-accent/40 transition-colors">
            {/* Top Badge */}
            <div className="absolute top-0 right-0 bg-accent text-white px-3 py-1.5 rounded-bl-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 z-10 shadow-sm">
              <Sparkles size={10} /> {item.recReason}
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-4 mt-2">
              <div>
                <h3 className="text-lg font-black text-foreground leading-tight group-hover:text-primary transition-colors">{item.productName}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.supplierName}</p>
                  {item.isVerified && <ShieldCheck size={12} className="text-accent" />}
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-secondary/40 p-2.5 rounded-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1 mb-1">
                  <IndianRupee size={10} /> Price
                </p>
                <p className="text-sm font-black text-foreground">₹{item.price}<span className="text-[10px] text-muted-foreground font-bold">/kg</span></p>
              </div>
              <div className="bg-secondary/40 p-2.5 rounded-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1 mb-1">
                  <Leaf size={10} /> Freshness
                </p>
                <p className={`text-sm font-black ${item.freshness > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {item.freshness}%
                </p>
              </div>
              <div className="bg-secondary/40 p-2.5 rounded-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1 mb-1">
                  <MapPin size={10} /> Distance
                </p>
                <p className="text-sm font-black text-foreground">{item.distance.toFixed(1)} km</p>
              </div>
              <div className="bg-secondary/40 p-2.5 rounded-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1 mb-1">
                  <ShieldCheck size={10} /> Trust
                </p>
                <p className="text-sm font-black text-primary">{item.trustScore}/100</p>
              </div>
            </div>

            {/* Score & Action */}
            <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Match Score</p>
                <p className="text-xl font-black text-accent">{item.recScore}%</p>
              </div>
              <button 
                onClick={() => navigate(`/order/${item.id}`)}
                className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartRecommendations;
