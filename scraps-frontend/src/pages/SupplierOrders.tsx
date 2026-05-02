import { useEffect, useState } from "react";
import {
  Package, CheckCircle2, Truck, XCircle, Clock,
  ArrowRight, ShoppingBag, IndianRupee, User
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
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
  orderDate: string;
  statusUpdatedAt?: string;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  PLACED:    { label: "Pending",   cls: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmed", cls: "bg-blue-100 text-blue-700" },
  SHIPPED:   { label: "Shipped",   cls: "bg-violet-100 text-violet-700" },
  DELIVERED: { label: "Delivered", cls: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-100 text-red-600" },
};

const SupplierOrders = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      if (!user?.email) throw new Error("Supplier email not found. Please login again.");
      const res = await fetch(`http://localhost:8081/api/orders/supplier/${encodeURIComponent(user.email)}`);
      if (!res.ok) throw new Error((await res.text()) || "Failed to fetch orders");
      setOrders(await res.json());
    } catch (err: any) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8081/api/orders/${orderId}/status?status=${status}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Status update failed");
      toast.success(`Order marked as ${status} ✅`);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout role="supplier">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-foreground tracking-tighter">Incoming Orders</h1>
        <p className="text-muted-foreground font-medium mt-1">
          Review vendor orders and update fulfillment status in real time.
        </p>
      </div>

      {/* States */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-secondary/50 rounded-[2rem] animate-pulse" />
          ))}
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
          <p className="text-muted-foreground font-medium mt-2">Vendor orders will appear here once placed.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status] ?? { label: order.status, cls: "bg-muted text-muted-foreground" };
            return (
              <div key={order.id} className="card-premium p-8 bg-card">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Order Info */}
                  <div className="flex gap-5">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-secondary flex items-center justify-center text-primary shrink-0">
                      <Package size={24} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-black text-foreground">{order.productName}</h3>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                        {[
                          { icon: User, label: "Vendor", val: order.vendorEmail },
                          { icon: Package, label: "Qty", val: `${order.quantity}kg` },
                          { icon: IndianRupee, label: "Price", val: `₹${order.price}/kg` },
                          { icon: Clock, label: "Placed", val: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A" },
                        ].map(({ icon: Icon, label, val }) => (
                          <div key={label} className="flex items-center gap-2 text-muted-foreground">
                            <Icon size={13} className="text-accent shrink-0" />
                            <span className="font-bold text-foreground">{label}:</span> {val}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`self-start px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 ${cfg.cls}`}>
                    {cfg.label}
                  </span>
                </div>

                {/* Order Timeline (Supplier View) */}
                <div className="mt-8 pt-4 border-t border-border/20 w-full">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fulfillment Progress</p>
                    {order.status === "PLACED" || order.status === "CONFIRMED" ? (
                      <button
                        onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                        className="flex items-center gap-1.5 text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors"
                      >
                        <XCircle size={12} /> Cancel Order
                      </button>
                    ) : null}
                  </div>
                  <OrderTimeline 
                    currentStatus={order.status} 
                    statusUpdatedAt={order.statusUpdatedAt}
                    isVendor={false}
                    onUpdateStatus={(status) => updateOrderStatus(order.id, status)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SupplierOrders;