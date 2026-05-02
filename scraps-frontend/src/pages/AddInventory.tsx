import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { 
  Package, Tag, MapPin, Calendar, IndianRupee, 
  ArrowRight, ArrowLeft, PlusCircle, Info, Sparkles 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

const AddInventory = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    qty: "",
    price: "",
    location: "",
    expiry: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.qty || !form.price || !form.location || !form.expiry) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const payload = {
        productName: form.name,
        category: form.category,
        quantity: Number(form.qty),
        price: Number(form.price),
        location: form.location,
        expiryDate: form.expiry,
        supplierName: user.name,
        supplierEmail: user.email,
        supplierPhone: user.phone,
        status: "ACTIVE",
      };

      const res = await fetch("http://localhost:8081/api/inventory/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to add inventory");
      }

      toast.success("Inventory published successfully 🎉");
      navigate("/supplier/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="supplier">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/supplier/dashboard" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-forest tracking-tighter">List Surplus Stock</h1>
            <p className="text-muted-foreground font-medium">Turn your excess inventory into capital by reaching 2k+ street vendors.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="card-premium p-10 bg-white shadow-premium border-primary/5">
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Commodity Details</label>
                  <div className="relative group">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-forest transition-colors" size={18} />
                    <input
                      placeholder="e.g. Fresh Red Onions"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/50 border-none outline-none focus:ring-4 focus:ring-primary/10 font-bold text-forest transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Market Category</label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-forest transition-colors" size={18} />
                    <select
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/50 border-none outline-none focus:ring-4 focus:ring-primary/10 font-bold text-forest transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Grains">Grains</option>
                      <option value="Spices">Spices</option>
                      <option value="Dairy">Dairy</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Volume (kg)</label>
                    <input
                      type="number"
                      placeholder="500"
                      value={form.qty}
                      onChange={(e) => handleChange("qty", e.target.value)}
                      className="w-full h-14 px-6 rounded-xl bg-secondary/50 border-none outline-none focus:ring-4 focus:ring-primary/10 font-bold text-forest transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Price / kg (₹)</label>
                    <div className="relative group">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-forest transition-colors" size={16} />
                      <input
                        type="number"
                        placeholder="12"
                        value={form.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/50 border-none outline-none focus:ring-4 focus:ring-primary/10 font-bold text-forest transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Source Location</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-forest transition-colors" size={16} />
                      <input
                        placeholder="Mandi or Farm"
                        value={form.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/50 border-none outline-none focus:ring-4 focus:ring-primary/10 font-bold text-forest transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Quality Expiry</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-forest transition-colors" size={16} />
                      <input
                        type="date"
                        value={form.expiry}
                        onChange={(e) => handleChange("expiry", e.target.value)}
                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/50 border-none outline-none focus:ring-4 focus:ring-primary/10 font-bold text-forest transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-premium-primary w-full !py-6 !rounded-2xl shadow-forest group"
                >
                  {loading ? "Publishing Deal..." : "Post to Marketplace"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="card-premium p-8 bg-forest text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
              <Sparkles className="text-accent mb-6" size={32} />
              <h3 className="text-xl font-black mb-4">Pro Supplier Tip</h3>
              <p className="text-white/50 text-sm font-medium leading-relaxed mb-6">
                Accurate weight and source location help vendors plan their morning procurement better. This leads to 2x faster sales.
              </p>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <PlusCircle className="text-accent" size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Build Market Trust</span>
              </div>
            </div>

            <div className="card-premium p-8 border-primary/5 bg-secondary/30">
              <div className="flex gap-4">
                <Info className="text-forest shrink-0" size={20} />
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-forest uppercase tracking-widest">Market Rules</h4>
                  <ul className="space-y-3">
                    {[
                      "Only list stock available for immediate transport",
                      "Ensure pricing is competitive with local mandis",
                      "Keep expiry dates updated to avoid returns"
                    ].map((rule, i) => (
                      <li key={i} className="text-xs font-bold text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddInventory;