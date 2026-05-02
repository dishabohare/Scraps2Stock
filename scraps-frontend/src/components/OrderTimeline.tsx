import { Check, Clock, PackageCheck, Truck, ShieldAlert, CheckCircle2 } from "lucide-react";

export type OrderStatus = 
  | "PLACED" 
  | "CONFIRMED" 
  | "PACKED" 
  | "SHIPPED" 
  | "DELIVERED" 
  | "COMPLETED" 
  | "DISPUTED" 
  | "CANCELLED";

interface TimelineProps {
  currentStatus: OrderStatus;
  statusUpdatedAt?: string;
  isVendor?: boolean;
  onUpdateStatus?: (status: OrderStatus) => void;
}

const STEPS = [
  { id: "PLACED", label: "Offer Accepted", desc: "Awaiting supplier confirmation", icon: Clock },
  { id: "CONFIRMED", label: "Payment Pending", desc: "Verifying payment", icon: CheckCircle2 },
  { id: "PACKED", label: "Packed", desc: "Ready for dispatch", icon: PackageCheck },
  { id: "SHIPPED", label: "Out for Delivery", desc: "En route to destination", icon: Truck },
  { id: "DELIVERED", label: "Delivered", desc: "Pending vendor confirmation", icon: Check },
  { id: "COMPLETED", label: "Completed", desc: "Transaction finalized", icon: CheckCircle2 },
];

const OrderTimeline = ({ currentStatus, statusUpdatedAt, isVendor, onUpdateStatus }: TimelineProps) => {
  // If cancelled or disputed, show alternative timeline
  if (currentStatus === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600">
        <ShieldAlert size={20} />
        <div>
          <h4 className="font-bold text-sm">Order Cancelled</h4>
          <p className="text-xs font-medium opacity-80">This order was cancelled and will not be fulfilled.</p>
        </div>
      </div>
    );
  }

  if (currentStatus === "DISPUTED") {
    return (
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
        <ShieldAlert size={20} />
        <div>
          <h4 className="font-bold text-sm">Order Disputed</h4>
          <p className="text-xs font-medium opacity-80">Under review by Trust & Safety team.</p>
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex(s => s.id === currentStatus);

  return (
    <div className="w-full py-6">
      <div className="relative flex justify-between">
        {/* Connecting Line Background */}
        <div className="absolute top-5 left-[5%] right-[5%] h-1 bg-secondary rounded-full" />
        
        {/* Active Connecting Line */}
        <div 
          className="absolute top-5 left-[5%] h-1 bg-emerald-500 rounded-full transition-all duration-500" 
          style={{ width: `${Math.max(0, (currentIndex / (STEPS.length - 1)) * 90)}%` }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isActive = idx === currentIndex;
          const isNext = idx === currentIndex + 1;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex flex-col items-center w-24 z-10 group">
              {/* Circle */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-card transition-all duration-300
                  ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-secondary text-muted-foreground'}`}
              >
                <Icon size={16} />
              </div>

              {/* Text */}
              <div className="text-center mt-3">
                <p className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
                {isActive && statusUpdatedAt && (
                  <p className="text-[9px] font-bold text-muted-foreground mt-0.5">
                    {new Date(statusUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>

              {/* Action Buttons (Hover or active state based on role) */}
              {!isVendor && onUpdateStatus && isNext && step.id !== "COMPLETED" && (
                <button 
                  onClick={() => onUpdateStatus(step.id as OrderStatus)}
                  className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm whitespace-nowrap"
                >
                  Mark {step.label}
                </button>
              )}

              {isVendor && onUpdateStatus && isActive && step.id === "DELIVERED" && (
                <button 
                  onClick={() => onUpdateStatus("COMPLETED")}
                  className="absolute -bottom-8 bg-forest text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm whitespace-nowrap animate-pulse"
                >
                  Confirm Delivery
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
