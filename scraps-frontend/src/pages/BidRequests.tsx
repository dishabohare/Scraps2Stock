import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  TrendingDown, Package, IndianRupee, User,
  ArrowRight, Sparkles, MessageSquare
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface BidRequest {
  id: number;
  productName: string;
  quantity: number;
  maxPrice: number;
  vendorEmail: string;
  status: string;
}

const BidRequests = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [requests, setRequests] = useState<BidRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [offeringId, setOfferingId] = useState<number | null>(null);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8081/api/bids/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch bid requests");
      const data = await res.json();
      setRequests(data.filter((bid: BidRequest) => bid.status === "OPEN"));
    } catch (err: any) {
      toast.error(err.message || "Failed to load bids");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const placeOffer = async (id: number) => {
    const price = prompt("Enter your competitive offer price (₹/kg):");
    if (!price) return;

    try {
      setOfferingId(id);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8081/api/bids/offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bidRequestId: id,
          supplierEmail: user.email,
          offeredPrice: Number(price),
        }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to place offer");
      toast.success("Offer submitted successfully ✅");
    } catch (err: any) {
      toast.error(err.message || "Offer failed");
    } finally {
      setOfferingId(null);
    }
  };

  return (
    <DashboardLayout role="supplier">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-foreground tracking-tighter">Open Market Bids</h1>
            <p className="text-muted-foreground font-medium">
              Vendors are looking for suppliers. Submit your best competitive offer.
            </p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-accent/10 border border-accent/20 rounded-2xl text-accent self-start">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">{requests.length} Active Requests</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-5">
          {[1, 2, 3].map(i => <div key={i} className="h-44 bg-secondary/50 rounded-[2rem] animate-pulse" />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="card-premium p-20 text-center border-dashed border-2">
          <MessageSquare className="mx-auto mb-6 text-muted-foreground opacity-20" size={52} />
          <p className="text-xl font-black text-foreground">No open bids right now</p>
          <p className="text-muted-foreground font-medium mt-2 max-w-xs mx-auto">
            Vendor bid requests will appear here when they're published.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((r) => (
            <div key={r.id} className="card-premium p-8 bg-card flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              {/* Bid Details */}
              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-[1.25rem] bg-secondary flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                  <TrendingDown size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground group-hover:text-accent transition-colors">{r.productName}</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-3 text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground font-bold">
                      <Package size={13} className="text-accent" />
                      {r.quantity}kg required
                    </span>
                    <span className="flex items-center gap-2 text-muted-foreground font-bold">
                      <IndianRupee size={13} className="text-accent" />
                      Budget cap: ₹{r.maxPrice}/kg
                    </span>
                    <span className="flex items-center gap-2 text-muted-foreground font-bold">
                      <User size={13} className="text-accent" />
                      {r.vendorEmail}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                  {r.status}
                </div>
                <button
                  onClick={() => placeOffer(r.id)}
                  disabled={offeringId === r.id}
                  className="btn-premium-primary !py-3 !px-6 !rounded-xl group/btn"
                >
                  {offeringId === r.id ? "Submitting..." : "Place Offer"}
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default BidRequests;