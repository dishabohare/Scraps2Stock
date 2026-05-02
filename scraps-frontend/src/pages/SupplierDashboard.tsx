import { useEffect, useState, useMemo } from "react";
import { 
  Package, ShoppingCart, IndianRupee, TrendingUp, 
  Plus, ListChecks, Bell, ArrowUpRight,
  TrendingDown, AlertTriangle, Sparkles, Box
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { TrustBadge, getDemoTrustInfo } from "@/components/TrustBadge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";

interface ListingItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  supplierEmail: string;
}

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  vendorEmail: string;
  status: string;
}

const SupplierDashboard = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.email) return;
        const [listingsRes, ordersRes] = await Promise.all([
          fetch(`http://localhost:8081/api/inventory/supplier/${encodeURIComponent(user.email)}`),
          fetch(`http://localhost:8081/api/orders/supplier/${encodeURIComponent(user.email)}`)
        ]);

        if (listingsRes.ok) setListings(await listingsRes.json());
        if (ordersRes.ok) setOrders(await ordersRes.json());
      } catch (err) {
        console.error("Error fetching supplier data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.email]);

  const totalRevenue = orders
    .filter(o => o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.price * o.quantity, 0);

  const activeListingsCount = listings.length;
  const pendingOrders = orders.filter(o => o.status === "PLACED").length;
  const stockVolume = listings.reduce((sum, l) => sum + l.quantity, 0);

  const inventoryChartData = useMemo(() => {
    return listings.slice(0, 5).map(l => ({
      name: l.productName.length > 10 ? l.productName.substring(0, 10) + "..." : l.productName,
      quantity: l.quantity,
    }));
  }, [listings]);

  const COLORS = ['#064e3b', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <DashboardLayout role="supplier">
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-forest tracking-tighter">Supplier Command Center</h1>
            <p className="text-muted-foreground font-medium mb-2">Manage your surplus ecosystem and fulfill vendor orders.</p>
            {user?.email && (
              <div className="pt-2">
                <TrustBadge score={getDemoTrustInfo(user.email).score} level={getDemoTrustInfo(user.email).level} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/supplier/add-inventory" className="btn-premium-primary">
              <Plus size={18} /> Add Surplus
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: "Total Revenue", val: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-forest", bg: "bg-secondary", trend: "+8.2%" },
          { label: "Active Listings", val: activeListingsCount, icon: ListChecks, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending Orders", val: pendingOrders, icon: ShoppingCart, color: "text-amber", bg: "bg-amber/5", trend: "Needs Action" },
          { label: "Total Volume", val: `${stockVolume}kg`, icon: Box, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <div key={i} className="card-premium p-8 group">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-[1.25rem] ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 shadow-soft`}>
                <stat.icon size={26} />
              </div>
              {stat.trend && (
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${
                  stat.trend === "Needs Action" ? "bg-amber text-white shadow-amber" : "bg-white border border-primary/5 text-muted-foreground"
                }`}>
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <h3 className="text-3xl font-black text-forest tracking-tight">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 mb-12">
        {/* Chart Section */}
        <div className="lg:col-span-8 card-premium p-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-forest tracking-tight">Inventory Distribution</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Stock quantity per commodity</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-[10px] font-black text-forest uppercase tracking-widest">
                <TrendingUp size={12} /> Stock Growth
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            {listings.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '16px' }}
                  />
                  <Bar dataKey="quantity" radius={[8, 8, 0, 0]} barSize={40}>
                    {inventoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                <Box size={48} className="opacity-10" />
                <p className="font-bold">No active inventory data.</p>
              </div>
            )}
          </div>
        </div>

        {/* Side Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-forest p-10 rounded-[2.5rem] shadow-forest text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mt-16 -mr-16" />
            <Sparkles className="mb-6 text-accent" size={32} />
            <h3 className="text-2xl font-black mb-4 leading-tight">Mandi Demand <br /> is Spiking</h3>
            <p className="text-white/50 font-bold text-sm mb-8">Vendors are searching for onions and potatoes in your region. Consider listing more surplus.</p>
            <Link to="/supplier/add-inventory" className="btn-premium-accent w-full">
              List More Stock
            </Link>
          </div>

          <div className="card-premium p-10 border-amber/20 bg-amber/5">
            <div className="flex items-center gap-3 text-amber mb-6">
              <AlertTriangle size={24} />
              <h3 className="text-xl font-black">Expiring Soon</h3>
            </div>
            <div className="space-y-4">
              {listings.slice(0, 2).map((l, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-soft">
                  <div>
                    <p className="font-bold text-forest">{l.productName}</p>
                    <p className="text-[10px] font-black text-amber uppercase tracking-widest">2 Days Left</p>
                  </div>
                  <ArrowUpRight size={20} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card-premium">
          <div className="p-10 border-b border-primary/5 flex items-center justify-between">
            <h3 className="text-2xl font-black text-forest">Recent Sales</h3>
            <Link to="/supplier/orders" className="text-xs font-black text-accent uppercase tracking-widest hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-primary/5">
            {orders.filter(o => o.status === 'PLACED').length === 0 ? (
              <p className="p-10 text-center font-bold text-muted-foreground">No new orders to fulfill.</p>
            ) : (
              orders.filter(o => o.status === 'PLACED').slice(0, 5).map((order) => (
                <div key={order.id} className="p-8 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-forest/5 flex items-center justify-center text-forest">
                      <ShoppingCart size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-forest">{order.productName}</p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{order.vendorEmail}</p>
                    </div>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-amber text-white text-[10px] font-black uppercase tracking-widest shadow-amber">Pending</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card-premium">
          <div className="p-10 border-b border-primary/5 flex items-center justify-between">
            <h3 className="text-2xl font-black text-forest">Active Inventory</h3>
            <Link to="/supplier/listings" className="text-xs font-black text-accent uppercase tracking-widest hover:underline">Manage All</Link>
          </div>
          <div className="divide-y divide-primary/5">
            {listings.length === 0 ? (
              <p className="p-10 text-center font-bold text-muted-foreground">Your warehouse is currently empty.</p>
            ) : (
              listings.slice(0, 5).map((l) => (
                <div key={l.id} className="p-8 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-forest/5 flex items-center justify-center text-forest">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-forest">{l.productName}</p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">₹{l.price}/kg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-forest">{l.quantity}kg</p>
                    <div className="w-24 h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-forest" style={{ width: `${Math.min((l.quantity/500)*100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupplierDashboard;