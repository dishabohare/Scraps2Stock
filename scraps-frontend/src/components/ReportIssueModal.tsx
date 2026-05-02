import { useState } from "react";
import { AlertTriangle, UploadCloud, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: number;
    productName: string;
    supplierEmail: string;
  } | null;
}

const ISSUE_TYPES = [
  "Poor quality item",
  "Wrong quantity delivered",
  "Late delivery",
  "Price mismatch / Overcharged",
  "Fake supplier / No delivery",
  "Damaged or spoiled stock",
];

const ReportIssueModal = ({ isOpen, onClose, order }: ReportIssueModalProps) => {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const token = localStorage.getItem("token");

      const payload = {
        orderId: order.id,
        productName: order.productName,
        vendorEmail: user?.email || "unknown@vendor.com",
        supplierEmail: order.supplierEmail,
        issueType,
        description,
        proofImageUrl: proofImage ? proofImage.name : null,
        status: "Open"
      };

      const res = await fetch("http://localhost:8081/api/disputes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to submit report");

      // Automatically update the order status to DISPUTED
      await fetch(`http://localhost:8081/api/orders/${order.id}/status?status=DISPUTED`, {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      setSubmitted(true);
      toast.success("Issue reported successfully. Awaiting review.");
      
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setIssueType("");
        setDescription("");
        setProofImage(null);
        // Page reload to reflect new DISPUTED status in the timeline
        window.location.reload();
      }, 2000);
      
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border/40 p-0 overflow-hidden rounded-[2rem]">
        {submitted ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-2">Report Submitted</h2>
            <p className="text-muted-foreground font-medium">
              Our quality assurance team is reviewing this dispute. We will contact the supplier.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="p-6 pb-4 border-b border-border/20 bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black text-foreground">Report Issue</DialogTitle>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    Order #{order.id} • {order.productName}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Supplier</label>
                  <input 
                    type="text" 
                    value={order.supplierEmail} 
                    disabled 
                    className="w-full mt-1.5 px-4 py-3 bg-secondary/50 border border-border/40 rounded-xl text-sm font-bold text-muted-foreground" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Issue Type <span className="text-red-500">*</span></label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 bg-background border border-border/40 rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent outline-none transition-all"
                  >
                    <option value="" disabled>Select the problem...</option>
                    {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Description <span className="text-red-500">*</span></label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about the issue..."
                    rows={3}
                    className="w-full mt-1.5 px-4 py-3 bg-background border border-border/40 rounded-xl text-sm font-medium text-foreground focus:ring-2 focus:ring-accent outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Quality Proof (Optional)</label>
                  <p className="text-xs text-muted-foreground mb-2">Upload images of the received stock to speed up resolution.</p>
                  
                  <label className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${proofImage ? 'border-accent bg-accent/5' : 'border-border/40 hover:bg-secondary/40'}`}>
                    <UploadCloud className={proofImage ? 'text-accent' : 'text-muted-foreground'} size={28} />
                    <span className="mt-2 text-sm font-bold text-foreground">
                      {proofImage ? proofImage.name : "Click to upload image"}
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) setProofImage(e.target.files[0]);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-xl font-bold text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black shadow-lg shadow-red-600/20 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueModal;
