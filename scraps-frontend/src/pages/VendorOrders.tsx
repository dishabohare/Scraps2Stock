import { useEffect, useState } from "react";
import {
  Package, Clock, ShoppingBag, IndianRupee,
  CheckCircle2, Truck, XCircle, User, AlertTriangle
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import ReportIssueModal from "@/components/ReportIssueModal";
import OrderTimeline, { OrderStatus } from "@/components/OrderTimeline";
import { toast } from "sonner";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  vendorEmail: string;
  supplierEmail: string;
  status: OrderStatus;
  createdAt: string;
  statusUpdatedAt?: string;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  PLACED:    { label: "Pending",   cls: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmed", cls: "bg-blue-100 text-blue-700" },
  SHIPPED:   { label: "Shipped",   cls: "bg-violet-100 text-violet-700" },
  DELIVERED: { label: "Delivered", cls: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-100 text-red-600" },
};

const VendorOrders = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportOrder, setReportOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8081/api/orders/vendor/${encodeURIComponent(user?.email ?? "")}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        setOrders(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.email]);

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8081/api/orders/${orderId}/status?status=${newStatus}`, {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      const updatedOrder = await res.json();
      setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
      toast.success("Order status updated.");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout role="vendor">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-foreground tracking-tighter">My Procurement Log</h1>
        <p className="text-muted-foreground font-medium mt-1">
          Track every purchase and monitor real-time delivery status.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-36 bg-secondary/50 rounded-[2rem] animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="card-premium p-16 text-center border-red-200 bg-red-50">
          <XCircle className="mx-auto mb-4 text-red-400" size={40} />
          <p className="font-bold text-red-600">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card-premium p-20 text-center border-dashed border-2">
          <ShoppingBag className="mx-auto mb-6 text-muted-foreground opacity-20" size={52} />
          <p className="text-xl font-black text-foreground">No orders yet</p>
          <p className="text-muted-foreground font-medium mt-2 max-w-xs mx-auto">
            Head to the marketplace and start sourcing fresh surplus inventory.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((o) => {
            const cfg = STATUS_CONFIG[o.status] ?? { label: o.status, cls: "bg-muted text-muted-foreground" };
            return (
              <div key={o.id} className="card-premium p-8 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex gap-5">
                  <div className="w-13 h-13 w-12 h-12 rounded-[1.25rem] bg-secondary flex items-center justify-center text-primary shrink-0">
                    <Package size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground">{o.productName}</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Package size={12} className="text-accent" />{o.quantity}kg
                      </span>
                      <span className="flex items-center gap-1.5 font-bold">
                        <IndianRupee size={12} className="text-accent" />₹{o.price}/kg
                      </span>
                      <span className="flex items-center gap-1.5 font-bold">
                        <User size={12} className="text-accent" />{o.supplierEmail}
                      </span>
                      <span className="flex items-center gap-1.5 font-bold">
                        <Clock size={12} className="text-accent" />
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-lg font-black text-foreground">₹{o.price * o.quantity}</p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.cls}`}>
                      {cfg.label}
                    </span>
                  </div>
                  
                  {o.status !== "CANCELLED" && (
                    <button
                      onClick={() => setReportOrder(o)}
                      className="flex items-center gap-1.5 text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors mt-2"
                    >
                      <AlertTriangle size={12} /> Report Issue
                    </button>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/20 w-full">
                  <OrderTimeline 
                    currentStatus={o.status} 
                    statusUpdatedAt={o.statusUpdatedAt}
                    isVendor={true}
                    onUpdateStatus={(status) => handleUpdateStatus(o.id, status)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ReportIssueModal 
        isOpen={!!reportOrder} 
        onClose={() => setReportOrder(null)} 
        order={reportOrder} 
      />
    </DashboardLayout>
  );
};

export default VendorOrders;