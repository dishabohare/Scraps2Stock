import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { 
  Package, IndianRupee, ArrowRight, MessageSquare, 
  Clock, CheckCircle2, TrendingDown, Info, Sparkles 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface BidRequest {
  id: number;
  productName: string;
  quantity: number;
  maxPrice: number;
  vendorEmail: string;
  status: string;
  acceptedSupplierEmail?: string | null;
}

const CreateBid = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [bids, setBids] = useState<BidRequest[]>([]);
  const [listLoading, setListLoading] = useState(true);

  const fetchBids = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await fetch("http://localhost:8081/api/bids/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch bids");

      const data = await res.json();
      const myBids = data.filter(
        (bid: BidRequest) => bid.vendorEmail === currentUser.email
      );

      setBids(myBids);
    } catch (err: any) {
      toast.error(err.message || "Failed to load bids");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const handleSubmit = async () => {
    if (!productName || !quantity || !maxPrice) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const res = await fetch("http://localhost:8081/api/bids/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productName,
          quantity: Number(quantity),
          maxPrice: Number(maxPrice),
          vendorEmail: currentUser.email,
        }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to create bid");

      toast.success("Bid request published to market ✅");
      setProductName("");
      setQuantity("");
      setMaxPrice("");
      await fetchBids();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="vendor">
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-forest tracking-tighter">Strategic Bidding</h1>
            <p className="text-muted-foreground font-medium">Create open bid requests to get the best surplus deals from suppliers.</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-amber/10 border border-amber/20 rounded-2xl text-amber">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Active Bidding Open</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Form Section */}
        <div className="lg:col-span-5">
          <div className="card-premium p-10 bg-white sticky top-28">
            <h2 className="text-2xl font-black text-forest tracking-tight mb-8">New Bid Request</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Commodity Name</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    placeholder="e.g. Organic Bell Peppers"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/50 border-none outline-none focus:ring-4 focus:ring-primary/10 font-bold text-forest transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Qty (kg)</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full h-14 px-4 rounded-xl bg-secondary/50 border-none outline-none focus:ring-4 focus:ring-primary/10 font-bold text-forest transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Max Price (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="number"
                      placeholder="15"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/50 border-none outline-none focus:ring-4 focus:ring-primary/10 font-bold text-forest transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-forest/5 border border-forest/10 flex gap-4">
                <Info size={20} className="text-forest shrink-0" />
                <p className="text-[10px] font-medium text-forest/70 leading-relaxed">
                  Bids are visible to all verified suppliers. They will submit competitive offers for your review.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-premium-primary w-full !py-5 !rounded-2xl shadow-forest group"
              >
                {loading ? "Publishing..." : "Launch Bid Request"}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-forest tracking-tight">Active Market Bids</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <Clock size={14} /> Tracking {bids.length} requests
            </div>
          </div>

          {listLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-secondary/50 rounded-[2rem] animate-pulse" />
              ))}
            </div>
          ) : bids.length === 0 ? (
            <div className="card-premium p-16 text-center border-dashed border-2">
              <MessageSquare size={48} className="mx-auto text-muted-foreground opacity-20 mb-6" />
              <p className="text-lg font-black text-forest">No active bids</p>
              <p className="text-muted-foreground font-medium mt-2">Start your first bid request to find the best market rates.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className="card-premium p-8 bg-white flex flex-col md:flex-row md:items-center justify-between gap-8 group"
                >
                  <div className="flex gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-forest group-hover:text-white transition-colors duration-500">
                      <TrendingDown size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-forest group-hover:text-accent transition-colors">{bid.productName}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                          <Package size={12} className="text-accent" /> {bid.quantity}kg
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                          <IndianRupee size={12} className="text-accent" /> Max ₹{bid.maxPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      bid.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber/10 text-amber'
                    }`}>
                      {bid.status}
                    </div>
                    
                    <Link
                      to={`/vendor/offers/${bid.id}`}
                      className="btn-premium-outline !px-6 !py-3 !text-[9px] w-full sm:w-auto"
                    >
                      Compare Offers
                    </Link>
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

export default CreateBid;