import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  MapPin,
  IndianRupee,
  AlertTriangle,
  SlidersHorizontal,
  ShieldCheck,
  MessageCircle,
  Tag,
  Filter,
  ArrowRight,
  TrendingDown,
  ChevronDown,
  X,
  Sparkles,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { TrustBadge, getDemoTrustInfo } from "@/components/TrustBadge";
import FreshnessCard from "@/components/FreshnessCard";

interface Product {
  id: number;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  location: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone?: string;
  status: string;
  expiryDate?: string;
  trustScore?: number;
}

const Marketplace = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/inventory/all");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        const enrichedData = data.map((item: Product, index: number) => ({
          ...item,
          trustScore: item.trustScore ?? 60 + ((index * 13) % 35),
        }));
        setProducts(enrichedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const isNotExpired = p.expiryDate
        ? new Date(p.expiryDate) >= new Date(new Date().toDateString())
        : true;

      return (
        isNotExpired &&
        p.productName.toLowerCase().includes(search.toLowerCase()) &&
        (category ? p.category.toLowerCase() === category.toLowerCase() : true) &&
        (location ? p.location.toLowerCase().includes(location.toLowerCase()) : true) &&
        (maxPrice ? p.price <= Number(maxPrice) : true)
      );
    });
    if (sortBy === "fssaiOnly") {
      result = result.filter(p => getDemoTrustInfo(p.supplierEmail).level === "FSSAI");
    }

    if (sortBy === "priceLowHigh") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHighLow") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "trustHighLow" || sortBy === "trustedFirst") {
      result = [...result].sort((a, b) => getDemoTrustInfo(b.supplierEmail).score - getDemoTrustInfo(a.supplierEmail).score);
    }

    return result;
  }, [products, search, category, location, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setMaxPrice("");
    setSortBy("");
  };

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date(new Date().toDateString());
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: "Expired", className: "bg-red-100 text-red-600" };
    if (diffDays <= 2) return { label: "Urgent", className: "bg-amber text-white shadow-amber" };
    return { label: `${diffDays} days left`, className: "bg-forest/5 text-forest" };
  };

  return (
    <DashboardLayout role="vendor">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-forest tracking-tighter mb-2">Market Sourcing Hub</h1>
        <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-2xl">
          Direct access to vetted surplus inventory. Professional procurement for modern entrepreneurs.
        </p>
      </div>

      {/* Modern Search & Filter */}
      <div className="card-premium p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />
        
        <div className="flex flex-col lg:flex-row gap-6 relative z-10">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-forest transition-colors" size={20} />
            <input
              placeholder="Search for commodities (e.g. Tomatoes, Spices)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 pl-16 pr-8 rounded-2xl bg-secondary/50 border-none outline-none focus:ring-4 focus:ring-primary/10 font-bold text-forest transition-all"
            />
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 px-8 h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                showFilters ? "bg-forest text-white" : "bg-white border-2 border-primary/5 text-forest hover:bg-secondary"
              }`}
            >
              <Filter size={16} /> Filters { (category || location || maxPrice) && "•" }
            </button>
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-16 px-10 rounded-2xl bg-white border-2 border-primary/5 outline-none focus:ring-4 focus:ring-primary/10 font-black uppercase tracking-widest text-[10px] text-forest appearance-none cursor-pointer"
              >
                <option value="">Sort By</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="trustedFirst">Trusted First</option>
                <option value="trustHighLow">Highest Trust Score</option>
                <option value="fssaiOnly">FSSAI Verified Only</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-forest/40 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 mt-10 border-t border-primary/5">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-14 px-6 rounded-xl bg-white border-2 border-primary/5 outline-none focus:ring-4 focus:ring-primary/10 font-bold text-forest"
                  >
                    <option value="">All Categories</option>
                    {["Vegetables", "Fruits", "Grains", "Spices", "Dairy"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-2">Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      placeholder="Mandi or City..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-14 pl-12 pr-6 rounded-xl bg-white border-2 border-primary/5 outline-none focus:ring-4 focus:ring-primary/10 font-bold text-forest"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-2">Max Price (₹/kg)</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="number"
                      placeholder="Budget cap..."
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full h-14 pl-12 pr-6 rounded-xl bg-white border-2 border-primary/5 outline-none focus:ring-4 focus:ring-primary/10 font-bold text-forest"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-primary/5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{filteredProducts.length} Listings Found</p>
                <button onClick={clearFilters} className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Reset Filters</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-6" />
          <p className="font-black uppercase tracking-widest text-[10px]">Syncing live market...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="card-premium p-24 text-center border-dashed border-2">
          <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center text-forest mx-auto mb-8">
            <Search size={40} />
          </div>
          <h3 className="text-3xl font-black text-forest tracking-tight mb-4">No deals found</h3>
          <p className="text-muted-foreground font-medium mb-10 max-w-sm mx-auto">Try adjusting your filters or expand your search area for more surplus inventory.</p>
          <button onClick={clearFilters} className="btn-premium-primary">Clear All Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.quantity <= 0;
            const expiry = getExpiryStatus(p.expiryDate);
            
            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`card-premium p-8 group flex flex-col ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-secondary flex items-center justify-center text-primary group-hover:bg-forest group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-soft">
                    <Package size={28} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {isOutOfStock ? (
                      <span className="px-3 py-1 bg-muted text-muted-foreground rounded-lg text-[9px] font-black uppercase tracking-widest">Sold Out</span>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest">In Stock</span>
                    )}
                    {expiry && <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${expiry.className}`}>{expiry.label}</span>}
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-forest tracking-tight mb-1 group-hover:text-accent transition-colors">{p.productName}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <Tag size={12} className="text-accent" /> {p.category}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-5 bg-secondary/50 rounded-2xl border border-primary/5">
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Rate / kg</p>
                      <p className="text-xl font-black text-forest">₹{p.price}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Available</p>
                      <p className="text-xl font-black text-forest">{p.quantity}kg</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-forest/70">
                      <div className="w-8 h-8 rounded-xl bg-white border border-primary/5 flex items-center justify-center shadow-soft">
                        <MapPin size={14} className="text-accent" />
                      </div>
                      {p.location}
                    </div>
                    {/* Freshness Score */}
                    <FreshnessCard
                      expiryDate={p.expiryDate}
                      category={p.category}
                      compact
                    />
                    <div className="pt-2">
                      <TrustBadge score={getDemoTrustInfo(p.supplierEmail).score} level={getDemoTrustInfo(p.supplierEmail).level} />
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-3">
                  <button 
                    disabled={isOutOfStock}
                    onClick={() => navigate(`/order/${p.id}`)}
                    className="btn-premium-primary w-full !py-5 !rounded-2xl shadow-forest group"
                  >
                    Place Procurement <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <a
                    href={`https://wa.me/${p.supplierPhone?.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in your surplus ${p.productName} on S2S.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-2xl border-2 border-primary/5 bg-white text-forest text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-secondary hover:border-forest/10 transition-all"
                  >
                    <MessageCircle size={18} className="text-accent" /> Chat Supplier
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Marketplace;