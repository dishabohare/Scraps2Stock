import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Leaf, Clock, ShoppingBag } from "lucide-react";

const OrderSuccess = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
    <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

    {/* Floating particles */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2.5 h-2.5 rounded-full ${
            i % 3 === 0 ? "bg-primary/30" : i % 3 === 1 ? "bg-accent/40" : "bg-primary/15"
          }`}
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 4) * 15}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0], y: [-20, 20] }}
          transition={{ delay: 0.5 + i * 0.1, duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="max-w-md w-full relative"
    >
      <div className="card-premium bg-card p-12 text-center">
        {/* Check Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping" />
          <CheckCircle2 size={48} className="text-primary relative z-10" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-black text-foreground mb-3 tracking-tight"
        >
          Order Confirmed! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground font-medium mb-8 leading-relaxed"
        >
          Your procurement order is placed. You just helped divert food from waste!
        </motion.p>

        {/* Order Meta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-secondary/60 rounded-2xl p-5 mb-5 space-y-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground font-bold flex items-center gap-2">
              <ShoppingBag size={14} className="text-accent" /> Order ID
            </span>
            <span className="font-mono font-black text-foreground">#S2S-{Math.floor(Math.random() * 9000) + 1000}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground font-bold flex items-center gap-2">
              <Clock size={14} className="text-accent" /> Delivery ETA
            </span>
            <span className="font-bold text-foreground">Tomorrow, 8 AM</span>
          </div>
        </motion.div>

        {/* Eco Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 mb-8"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-700">
            <Leaf size={16} />
            You prevented ~12kg of food waste today
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4"
        >
          <Link
            to="/marketplace"
            className="flex-1 btn-premium-primary !rounded-2xl !py-4 justify-center"
          >
            Order More <ArrowRight size={14} />
          </Link>
          <Link
            to="/vendor/dashboard"
            className="flex-1 btn-premium-outline !rounded-2xl !py-4 justify-center"
          >
            Dashboard
          </Link>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

export default OrderSuccess;
