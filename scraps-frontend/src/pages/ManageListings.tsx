import { useEffect, useState } from "react";
import {
  Package, MapPin, IndianRupee, Calendar,
  AlertTriangle, Edit2, Trash2, Plus, Box
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import FreshnessCard from "@/components/FreshnessCard";

interface InventoryItem {
  id: number;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  location: string;
  expiryDate: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone?: string;
  status: string;
}

const getExpiryMeta = (expiryDate: string) => {
  const today = new Date(new Date().toDateString());
  const expiry = new Date(expiryDate);
  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0)   return { label: "Expired",       cls: "bg-red-100 text-red-700",        dot: "bg-red-500" };
  if (diffDays <= 2)  return { label: "Critical Risk",  cls: "bg-orange-100 text-orange-700",  dot: "bg-orange-500" };
  if (diffDays <= 5)  return { label: "Expiring Soon",  cls: "bg-amber-100 text-amber-700",    dot: "bg-amber-500" };
  return               { label: "Active",              cls: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" };
};

const ManageListings = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [listings, setListings] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      if (!user?.email) return;
      const res = await fetch(`http://localhost:8081/api/inventory/supplier/${encodeURIComponent(user.email)}`);
      if (!res.ok) throw new Error("Failed to fetch listings");
      setListings(await res.json());
    } catch (err: any) {
      toast.error(err.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Remove this listing permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8081/api/inventory/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.text()) || "Delete failed");
      setListings(prev => prev.filter(i => i.id !== id));
      toast.success("Listing removed ✓");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleEdit = async (item: InventoryItem) => {
    const newPrice = prompt("New price (₹/kg):", String(item.price));
    if (newPrice === null) return;
    const newQty = prompt("New quantity (kg):", String(item.quantity));
    if (newQty === null) return;
    const newExpiry = prompt("New expiry (YYYY-MM-DD):", item.expiryDate);
    if (newExpiry === null) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8081/api/inventory/update/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...item, price: Number(newPrice), quantity: Number(newQty), expiryDate: newExpiry }),
      });
      if (!res.ok) throw new Error((await res.text()) || "Update failed");
      const updated = await res.json();
      setListings(prev => prev.map(i => (i.id === item.id ? updated : i)));
      toast.success("Listing updated ✨");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  return (
    <DashboardLayout role="supplier">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter">Inventory Manager</h1>
          <p className="text-muted-foreground font-medium mt-1">
            {listings.length} active listings — update prices, quantities, and expiry.
          </p>
        </div>
        <Link to="/supplier/add-inventory" className="btn-premium-primary self-start">
          <Plus size={18} /> Add Stock
        </Link>
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-56 bg-secondary/50 rounded-[2rem] animate-pulse" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="card-premium p-20 text-center border-dashed border-2">
          <Box className="mx-auto mb-6 text-muted-foreground opacity-20" size={52} />
          <p className="text-xl font-black text-foreground">Warehouse is empty</p>
          <p className="text-muted-foreground font-medium mt-2 mb-8">Add your first surplus listing to start receiving orders.</p>
          <Link to="/supplier/add-inventory" className="btn-premium-primary">
            <Plus size={18} /> Add First Listing
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {listings.map((l) => {
            const expiry = getExpiryMeta(l.expiryDate);
            const isLowStock = l.quantity > 0 && l.quantity <= 10;
            const isOutOfStock = l.quantity <= 0;

            return (
              <div key={l.id} className="card-premium p-8 bg-card group">
                {/* Top Row */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                      <Package size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground group-hover:text-accent transition-colors">{l.productName}</h3>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{l.category}</p>
                    </div>
                  </div>

                  {/* Edit / Delete */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(l)}
                      className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                      title="Edit listing"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(l.id)}
                      className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all"
                      title="Delete listing"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${expiry.cls}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${expiry.dot}`} />
                    {expiry.label}
                  </span>
                  {isOutOfStock && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-muted text-muted-foreground">
                      Out of Stock
                    </span>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700">
                      <AlertTriangle size={10} /> Low Stock
                    </span>
                  )}
                </div>

                {/* Freshness Score — full card */}
                <FreshnessCard
                  expiryDate={l.expiryDate}
                  category={l.category}
                />

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: IndianRupee, label: "Price", val: `₹${l.price}/kg` },
                    { icon: Package,    label: "Qty",   val: `${l.quantity}kg` },
                    { icon: MapPin,     label: "From",  val: l.location },
                    { icon: Calendar,   label: "Expiry",val: l.expiryDate },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/60">
                      <Icon size={14} className="text-accent shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
                        <p className="text-sm font-bold text-foreground">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageListings;