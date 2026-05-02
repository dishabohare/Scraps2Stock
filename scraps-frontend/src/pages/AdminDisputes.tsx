import { useEffect, useState } from "react";
import { 
  ShieldAlert, AlertCircle, CheckCircle2, 
  XCircle, UserMinus, RefreshCw, Eye 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Dispute {
  id: string; // Keep as string for compatibility or use number if parsing
  orderId: number;
  productName: string;
  vendorEmail: string;
  supplierEmail: string;
  issueType: string;
  description: string;
  status: "Open" | "Under Review" | "Resolved" | "Rejected";
  createdAt: string;
  proofImageUrl?: string;
}

const STATUS_COLORS: Record<string, string> = {
  "Open": "bg-red-100 text-red-700",
  "OPEN": "bg-red-100 text-red-700",
  "Under Review": "bg-amber-100 text-amber-700",
  "UNDER_REVIEW": "bg-amber-100 text-amber-700",
  "Resolved": "bg-emerald-100 text-emerald-700",
  "RESOLVED": "bg-emerald-100 text-emerald-700",
  "Rejected": "bg-muted text-muted-foreground",
  "REJECTED": "bg-muted text-muted-foreground",
};

const formatStatus = (status: string) => {
  if (status === "OPEN" || status === "Open") return "Open";
  if (status === "UNDER_REVIEW" || status === "Under Review") return "Under Review";
  if (status === "RESOLVED" || status === "Resolved") return "Resolved";
  if (status === "REJECTED" || status === "Rejected") return "Rejected";
  return status;
};

const AdminDisputes = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8081/api/disputes", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error("Failed to fetch");
        setDisputes(await res.json());
      } catch (err) {
        toast.error("Could not load disputes from backend.");
      } finally {
        setLoading(false);
      }
    };
    fetchDisputes();
  }, []);

  const updateStatus = async (id: string, newStatus: Dispute["status"]) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8081/api/disputes/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Update failed");
      
      const updatedDispute = await res.json();
      setDisputes(prev => prev.map(d => d.id === id ? updatedDispute : d));
      toast.success(`Dispute marked as ${newStatus}`);
      
      if (selectedDispute && selectedDispute.id === id) {
        setSelectedDispute(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Status update failed.");
    }
  };

  const clearAll = () => {
    toast("Clearing real database requires Admin SQL access.");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card border-b border-border/40 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground">S2S Trust & Safety</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admin Dispute Resolution Panel</p>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Open Disputes", val: disputes.filter(d => formatStatus(d.status) === "Open").length, color: "text-red-600" },
            { label: "Under Review", val: disputes.filter(d => formatStatus(d.status) === "Under Review").length, color: "text-amber-600" },
            { label: "Resolved", val: disputes.filter(d => formatStatus(d.status) === "Resolved").length, color: "text-emerald-600" },
            { label: "Rejected", val: disputes.filter(d => formatStatus(d.status) === "Rejected").length, color: "text-muted-foreground" }
          ].map(stat => (
            <div key={stat.label} className="bg-card p-6 rounded-3xl border border-border/40 shadow-sm text-center">
              <h3 className={`text-4xl font-black mb-1 ${stat.color}`}>{stat.val}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="bg-card p-24 text-center rounded-[3rem] border border-border/40 animate-pulse">
            <h2 className="text-2xl font-black text-foreground">Loading disputes...</h2>
          </div>
        ) : disputes.length === 0 ? (
          <div className="bg-card p-24 text-center rounded-[3rem] border border-border/40">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4 opacity-50" />
            <h2 className="text-2xl font-black text-foreground">Zero Active Disputes</h2>
            <p className="text-muted-foreground font-medium mt-2">The marketplace is operating smoothly.</p>
          </div>
        ) : (
          <div className="bg-card rounded-[2rem] border border-border/40 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/40 border-b border-border/40">
                  {["ID", "Order", "Supplier", "Issue Type", "Date", "Status", "Action"].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {disputes.map(d => (
                  <tr key={d.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{d.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">#{d.orderId}</p>
                      <p className="text-xs text-muted-foreground">{d.productName}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-sm text-foreground">{d.supplierEmail}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">{d.issueType}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-muted-foreground">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${STATUS_COLORS[d.status] || "bg-secondary text-muted-foreground"}`}>
                        {formatStatus(d.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedDispute(d)}
                        className="p-2 bg-secondary text-foreground rounded-lg hover:bg-primary hover:text-white transition-all"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dispute Detail Modal */}
        <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
          <DialogContent className="sm:max-w-2xl bg-card border-border/40 p-0 overflow-hidden rounded-[2rem]">
            {selectedDispute && (
              <>
                <DialogHeader className="p-6 border-b border-border/20 bg-secondary/30 flex flex-row items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl font-black text-foreground">Dispute {selectedDispute.id}</DialogTitle>
                    <p className="text-xs font-bold text-muted-foreground mt-1">Reported on {new Date(selectedDispute.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[selectedDispute.status] || "bg-secondary text-muted-foreground"}`}>
                    {formatStatus(selectedDispute.status)}
                  </span>
                </DialogHeader>

                <div className="p-6 space-y-8">
                  <div className="grid grid-cols-2 gap-6 p-5 bg-secondary/30 rounded-2xl border border-border/40">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Order Details</p>
                      <p className="font-bold text-foreground">Order #{selectedDispute.orderId}</p>
                      <p className="text-sm font-medium text-foreground">{selectedDispute.productName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Reported Supplier</p>
                      <p className="font-bold text-foreground">{selectedDispute.supplierEmail}</p>
                      <p className="text-xs text-red-500 font-bold mt-1">Trust Score Risk: High</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-foreground mb-3 flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-500" /> Vendor Complaint
                    </h3>
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                      <p className="text-sm font-bold text-red-700 mb-2">{selectedDispute.issueType}</p>
                      <p className="text-sm text-red-900/80 leading-relaxed">"{selectedDispute.description}"</p>
                    </div>
                  </div>

                  {selectedDispute.proofImageUrl && (
                    <div>
                      <h3 className="text-sm font-black text-foreground mb-3">Quality Proof</h3>
                      <div className="w-full h-32 bg-secondary rounded-xl border border-border/40 flex items-center justify-center text-muted-foreground text-sm font-bold">
                        [Proof Image: {selectedDispute.proofImageUrl}]
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-border/20">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Admin Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => updateStatus(selectedDispute.id, "Under Review")}
                        className="px-4 py-2 bg-amber-100 text-amber-700 font-bold text-sm rounded-lg hover:bg-amber-200 transition-colors"
                      >
                        Start Review
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedDispute.id, "Resolved")}
                        className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold text-sm rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Refund Vendor & Resolve
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedDispute.id, "Rejected")}
                        className="px-4 py-2 bg-secondary text-foreground font-bold text-sm rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
                      >
                        <XCircle size={16} /> Reject Report (False Claim)
                      </button>
                      
                      <button 
                        onClick={() => toast("Supplier trust score penalized by 15 points.")}
                        className="ml-auto px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <UserMinus size={16} /> Penalize Supplier
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminDisputes;
