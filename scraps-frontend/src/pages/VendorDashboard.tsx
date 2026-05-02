import { useEffect, useState, useMemo } from "react";
import {
  IndianRupee, Clock, ArrowUpRight, Package,
  ShieldCheck, ArrowRight, Activity, Leaf
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import SmartRecommendations from "@/components/SmartRecommendations";
import { ChatAssistant } from "@/components/ChatAssistant";
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  supplierEmail: string;
  status: string;
  createdAt?: string;
}

const VendorDashboard = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.email) return;
        const res = await fetch(`http://localhost:8081/api/orders/vendor/${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.email]);

  const totalSpent = orders.reduce((sum, o) => sum + o.price * o.quantity, 0);
  const activeOrders = orders.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED").length;
  const wasteSaved = orders.reduce((sum, o) => sum + o.quantity, 0);

  const chartData = useMemo(() => [
    { name: "Mon", value: 2400 },
    { name: "Tue", value: 1398 },
    { name: "Wed", value: 9800 },
    { name: "Thu", value: 3908 },
    { name: "Fri", value: 4800 },
    { name: "Sat", value: 3800 },
    { name: "Sun", value: 4300 },
  ], []);

  const stats = [
    { label: "Inventory Spend", val: `₹${totalSpent.toLocaleString()}`, icon: IndianRupee, trend: "+12%" },
    { label: "Active Deliveries", val: String(activeOrders), icon: Clock, trend: "On time" },
    { label: "Waste Diverted", val: `${wasteSaved}kg`, icon: Leaf, trend: "+5.2%" },
  ];

  return (
    <DashboardLayout role="vendor">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-foreground tracking-tighter">Vendor Command Center</h1>
            <p className="text-muted-foreground font-medium">Hello {user?.name}, here's your supply chain today.</p>
          </div>
          <Link to="/marketplace" className="btn-premium-primary self-start">
            Sourcing Hub <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="card-premium p-8 group">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-[1.25rem] bg-secondary text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon size={26} />
              </div>
              <span className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-background shadow-soft border border-border/40 uppercase tracking-widest text-muted-foreground">
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-foreground">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* Smart Recommendations */}
      <div className="mb-10">
        <SmartRecommendations />
      </div>

      {/* Chart + Promo */}
      <div className="grid lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-8 card-premium p-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-foreground tracking-tight">Sourcing Volume</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Weekly procurement analytics</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-xl text-[10px] font-black text-foreground uppercase tracking-widest">
              <Activity size={12} /> Live
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="vendorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(162 45% 15%)" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="hsl(162 45% 15%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(162 20% 90%)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "hsl(210 10% 40%)" }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: "20px", border: "none", boxShadow: "0 20px 50px rgba(0,0,0,0.08)", padding: "14px" }} />
                <Area type="monotone" dataKey="value" stroke="hsl(162 45% 15%)" strokeWidth={3} fillOpacity={1} fill="url(#vendorGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="p-10 rounded-[2rem] bg-accent text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mt-14 group-hover:scale-150 transition-transform duration-700" />
            <ArrowUpRight className="mb-5 opacity-60" size={28} />
            <h3 className="text-xl font-black mb-3 leading-tight">Flash Deal: Organic Tomatoes</h3>
            <p className="text-white/70 text-sm font-bold mb-6">Up to 60% off bulk orders in Delhi-NCR.</p>
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white text-accent px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors">
              Claim Deal <ArrowRight size={14} />
            </Link>
          </div>

          <div className="card-premium p-8 bg-primary text-white">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-accent" size={22} />
              <h3 className="text-lg font-black">Eco Pioneer</h3>
            </div>
            <p className="text-white/50 text-sm font-medium leading-relaxed mb-5">You're in the top 10% of sustainable vendors this month.</p>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-accent">Badge Earned ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card-premium overflow-hidden">
        <div className="p-8 border-b border-border/30 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-foreground tracking-tight">Supply History</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Real-time procurement status</p>
          </div>
          <Link to="/vendor/orders" className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline underline-offset-4">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/40">
                {["Product", "Quantity", "Investment", "Status"].map(h => (
                  <th key={h} className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                <tr><td colSpan={4} className="px-8 py-16 text-center font-bold text-muted-foreground">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-16 text-center font-bold text-muted-foreground">No sourcing history yet.</td></tr>
              ) : orders.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-8 py-5 font-bold text-foreground">{order.productName}</td>
                  <td className="px-8 py-5 text-sm font-black text-muted-foreground">{order.quantity}kg</td>
                  <td className="px-8 py-5 text-sm font-black text-foreground">₹{order.price * order.quantity}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === "DELIVERED" ? "bg-emerald-100 text-emerald-700" :
                      order.status === "PLACED" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Chat Assistant */}
      <ChatAssistant />
    </DashboardLayout>
  );
};

export default VendorDashboard;
