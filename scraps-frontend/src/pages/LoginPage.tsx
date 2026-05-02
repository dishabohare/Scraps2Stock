import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft, ArrowRight, Mail, Lock,
  ShieldCheck, Zap, TrendingDown
} from "lucide-react";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

interface LoginPageProps {
  lockedRole?: "vendor" | "supplier";
}

const LoginPage = ({ lockedRole }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const userPayload = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        };
        login(data.token, userPayload);
        // Normalize: strip ROLE_ prefix and uppercase to get a clean role key
        const role = (data.role as string ?? "")
          .replace(/^ROLE_/i, "")
          .toUpperCase();
        if (role === "VENDOR") {
          navigate("/vendor/dashboard");
        } else if (role === "SUPPLIER") {
          navigate("/supplier/dashboard");
        } else if (role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          setError(`Unknown account role "${data.role}". Please contact support.`);
        }
      } else if (res.status === 401) {
        setError("Invalid email or password");
      } else {
        const errText = await res.text();
        setError(`Login failed: ${errText || "Invalid credentials."}`);
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

      <Link to="/" className="absolute top-10 left-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </Link>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Branding / Info Side */}
        <div className="hidden lg:flex flex-col gap-14">
          <Logo size="lg" />

          <div className="space-y-4">
            <h2 className="text-5xl font-black text-foreground tracking-tighter leading-none">
              Modernize your <br />
              <span className="text-accent italic">food sourcing</span> <br />
              today.
            </h2>
            {lockedRole && (
              <p className="text-sm font-bold text-accent uppercase tracking-widest">
                Logging in as {lockedRole}
              </p>
            )}
          </div>

          <div className="space-y-8">
            {[
              { icon: ShieldCheck, title: "Verified Network", desc: "Access 150+ vetted suppliers across India." },
              { icon: Zap, title: "Real-time Deals", desc: "Instant notifications for fresh surplus stock." },
              { icon: TrendingDown, title: "Cost Savings", desc: "Reduce procurement costs by up to 40%." },
            ].map((f, i) => (
              <div key={i} className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0 shadow-soft">
                  <f.icon size={20} />
                </div>
                <div>
                  <h4 className="font-black text-foreground tracking-tight">{f.title}</h4>
                  <p className="text-sm text-muted-foreground font-medium">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-premium p-12 lg:p-16 bg-card shadow-premium"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-black text-foreground tracking-tighter mb-3">Welcome Back</h1>
            <p className="text-muted-foreground font-medium">
              {lockedRole ? `Sign in to your ${lockedRole} portal.` : "Log in to manage your inventory and orders."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-16 pl-14 pr-6 rounded-2xl bg-secondary/60 border border-border/30 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 font-bold text-foreground transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Password</label>
                <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline underline-offset-4">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-16 pl-14 pr-6 rounded-2xl bg-secondary/60 border border-border/30 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 font-bold text-foreground transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium-primary w-full !py-5 !text-[10px] !rounded-2xl group"
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              New to the network?{" "}
              <Link to="/signup" className="text-primary font-black hover:underline underline-offset-4">
                Join as a Partner
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;