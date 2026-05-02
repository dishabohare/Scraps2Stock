import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { 
  ArrowLeft, ArrowRight, ShieldCheck, IndianRupee, 
  Tag, Clock, CheckCircle2, AlertCircle, Sparkles, UserCircle
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { TrustBadge, getDemoTrustInfo } from "@/components/TrustBadge";
import FreshnessCard from "@/components/FreshnessCard";

interface BidOffer {
  id: number;
  bidRequestId: number;
  supplierEmail: string;
  offeredPrice: number;
  status: string;
}

interface InventorySnap {
  supplierEmail: string;
  expiryDate?: string;
  category?: string;
}

const OfferComparison = () => {
  const { bidId } = useParams();
  const [offers, setOffers] = useState<BidOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  // Inventory snapshot: latest listing per supplier (for freshness)
  const [invSnap, setInvSnap] = useState<Record<string, InventorySnap>>({});

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8081/api/bids/offers/${bidId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch offers");
      const data = await res.json();
      setOffers(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    // Fetch all inventory to get freshness data per supplier
    fetch("http://localhost:8081/api/inventory/all")
      .then(r => r.json())
      .then((data: InventorySnap[]) => {
        // Keep the first (latest) listing per supplier
        const snap: Record<string, InventorySnap> = {};
        data.forEach(item => {
          if (!snap[item.supplierEmail]) snap[item.supplierEmail] = item;
        });
        setInvSnap(snap);
      })
      .catch(() => { /* non-fatal */ });
  }, [bidId]);

  const handleAccept = async (offerId: number) => {
    try {
      setAcceptingId(offerId);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8081/api/bids/accept/${offerId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to accept offer");
      toast.success("Offer accepted! Logistics initiated. ✅");
      fetchOffers();
    } catch (err: any) {
      toast.error(err.message || "Accept failed");
    } finally {
      setAcceptingId(null);
    }
  };

  const [sortBy, setSortBy] = useState<"price" | "trust">("price");

  const lowestPrice = useMemo(() => {
    if (offers.length === 0) return null;
    return Math.min(...offers.map((o) => o.offeredPrice));
  }, [offers]);

  const sortedOffers = useMemo(() => {
    return [...offers].sort((a, b) => {
      if (sortBy === "price") {
        return a.offeredPrice - b.offeredPrice;
      } else {
        return getDemoTrustInfo(b.supplierEmail).score - getDemoTrustInfo(a.supplierEmail).score;
      }
    });
  }, [offers, sortBy]);

  const acceptedExists = offers.some((o) => o.status === "ACCEPTED");

  return (
    <DashboardLayout role="vendor">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/vendor/bids" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-forest tracking-tighter">Market Offer Comparison</h1>
            <p className="text-muted-foreground font-medium">Analyze and accept the most competitive surplus offers for Request #{bidId}.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Summary Side */}
        <div className="lg:col-span-4">
          <div className="card-premium p-8 bg-forest text-white sticky top-28 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
            <Sparkles className="text-accent mb-6" size={32} />
            <h2 className="text-2xl font-black mb-6 tracking-tight">Procurement Summary</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Offers</span>
                <span className="text-xl font-black">{offers.length}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Market Low</span>
                <span className="text-xl font-black text-accent">₹{lowestPrice || "0"}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Sourcing Status</span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                  acceptedExists ? 'bg-emerald-500 text-white' : 'bg-amber text-white'
                }`}>
                  {acceptedExists ? "Fulfillment" : "Negotiation"}
                </span>
              </div>
            </div>

            <div className="mt-10 p-5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] font-medium text-white/50 leading-relaxed">
                Accepting an offer will automatically notify the supplier and initiate the payment/logistics workflow.
              </p>
            </div>
          </div>
        </div>

        {/* Offers List */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-forest tracking-tight">Active Supplier Bids</h2>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "price" | "trust")}
                className="bg-card border border-border/40 rounded-xl px-3 py-1.5 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="price">Sort by Price</option>
                <option value="trust">Sort by Trust Score</option>
              </select>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Clock size={14} /> Refreshed 1m ago
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-secondary/50 rounded-[2rem] animate-pulse" />
              ))}
            </div>
          ) : sortedOffers.length === 0 ? (
            <div className="card-premium p-24 text-center border-dashed border-2">
              <AlertCircle size={48} className="mx-auto text-muted-foreground opacity-20 mb-6" />
              <p className="text-lg font-black text-forest">No offers yet</p>
              <p className="text-muted-foreground font-medium mt-2">Wait for suppliers to analyze your request and submit their rates.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedOffers.map((o) => (
                <div
                  key={o.id}
                  className={`card-premium p-8 bg-white flex flex-col md:flex-row justify-between items-center gap-8 border-2 transition-all ${
                    o.status === 'ACCEPTED' ? 'border-forest ring-4 ring-forest/5' : 'border-transparent'
                  }`}
                >
                  <div className="flex gap-6 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-secondary flex items-center justify-center text-primary shadow-soft">
                      <UserCircle size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-black text-forest">{o.supplierEmail.split('@')[0]}</h3>
                        {o.offeredPrice === lowestPrice && (
                          <span className="px-3 py-1 bg-accent/10 text-accent rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                            <Tag size={10} /> Best Rate
                          </span>
                        )}
                      </div>
                      <div className="mb-3">
                        <TrustBadge score={getDemoTrustInfo(o.supplierEmail).score} level={getDemoTrustInfo(o.supplierEmail).level} />
                      </div>
                      {/* Freshness score for this supplier's inventory */}
                      <div className="mb-3">
                        <FreshnessCard
                          expiryDate={invSnap[o.supplierEmail]?.expiryDate}
                          category={invSnap[o.supplierEmail]?.category}
                          compact
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-forest/5 text-forest rounded-lg">
                          Status: {o.status}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-secondary text-muted-foreground rounded-lg">
                          ID #{o.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Offered Price</p>
                      <p className="text-4xl font-black text-forest">₹{o.offeredPrice}<span className="text-sm text-muted-foreground">/kg</span></p>
                    </div>

                    {o.status === "ACCEPTED" ? (
                      <div className="flex items-center gap-2 px-8 py-4 bg-forest text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-forest">
                        <CheckCircle2 size={16} /> Order Initiated
                      </div>
                    ) : o.status === "REJECTED" ? (
                      <span className="px-8 py-4 bg-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                        Bid Declined
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAccept(o.id)}
                        disabled={acceptedExists || acceptingId === o.id}
                        className="btn-premium-primary !px-10 !py-4 !rounded-2xl group shadow-forest disabled:opacity-50"
                      >
                        {acceptingId === o.id ? "Processing..." : "Accept Offer"}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OfferComparison;