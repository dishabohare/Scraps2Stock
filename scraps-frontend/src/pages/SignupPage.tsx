import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Mail, Lock, User,
  Store, Factory, CheckCircle2
} from "lucide-react";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

interface SignupPageProps {
  lockedRole?: "vendor" | "supplier";
}

const SignupPage = ({ lockedRole }: SignupPageProps) => {
  const [role, setRole] = useState<"vendor" | "supplier">(lockedRole ?? "vendor");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      const res = await fetch("http://localhost:8081/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dataToSend, role: role.toUpperCase() }),
      });
      if (res.ok) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        const errText = await res.text();
        setError(`Registration failed: ${errText || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 lg:py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -ml-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -mr-48 -mb-48 pointer-events-none" />

      <Link to="/" className="absolute top-10 left-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </Link>

      <div className="w-full max-w-7xl grid lg:grid-cols-12 gap-16 items-center relative z-10">
        {/* Info Column */}
        <div className="hidden lg:flex flex-col gap-12 lg:col-span-5">
          <Logo size="lg" />

          <h2 className="text-6xl font-black text-foreground tracking-tighter leading-[0.9]">
            Build the future <br />of <span className="text-accent italic">food supply.</span>
          </h2>

          <div className="space-y-5">
            {[
              "Join 2,400+ entrepreneurs across India",
              "Access verified B2B inventory daily",
              "Automated logistics and digital receipts",
              "Direct from source, zero middleman"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-foreground font-bold">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 card-premium p-10 lg:p-16 bg-card shadow-premium"
        >
          <div className="mb-10">
            <h1 className="text-4xl font-black text-foreground tracking-tighter mb-3">Create Account</h1>
            <p className="text-muted-foreground font-medium">
              {lockedRole ? `Registering as a ${lockedRole}.` : "Choose your partner role to get started."}
            </p>
          </div>

          {/* Role Selector — hidden if lockedRole */}
          {!lockedRole && (
            <div className="grid grid-cols-2 gap-5 mb-10">
              {(["vendor", "supplier"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 group ${
                    role === r ? "border-primary bg-secondary shadow-soft" : "border-border hover:border-primary/20"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    role === r ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground group-hover:bg-primary/10"
                  }`}>
                    {r === "vendor" ? <Store size={26} /> : <Factory size={26} />}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-black tracking-tight ${role === r ? "text-foreground" : "text-muted-foreground"}`}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      {r === "vendor" ? "Street Food Hub" : "Farm / Mandi"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Arjun Sharma"
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/60 border border-border/30 outline-none focus:ring-4 focus:ring-primary/10 font-bold text-foreground transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="arjun@example.com"
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/60 border border-border/30 outline-none focus:ring-4 focus:ring-primary/10 font-bold text-foreground transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="password" required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/60 border border-border/30 outline-none focus:ring-4 focus:ring-primary/10 font-bold text-foreground transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="password" required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary/60 border border-border/30 outline-none focus:ring-4 focus:ring-primary/10 font-bold text-foreground transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium-primary w-full !py-5 !text-[10px] !rounded-2xl group mt-4"
            >
              {loading ? "Creating Account..." : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Already a partner?{" "}
              <Link to="/login" className="text-primary font-black hover:underline underline-offset-4">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;