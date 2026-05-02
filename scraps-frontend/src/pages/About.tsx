import { motion } from "framer-motion";
import { 
  Leaf, TrendingDown, IndianRupee, ShieldCheck, 
  ArrowRight, Search, Activity, Heart, Truck, 
  Store, Zap, RefreshCw, BarChart, BellRing
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-forest text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest to-accent/20 opacity-90" />
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-6 border border-accent/30">
                Our Story
              </span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
                About <span className="text-accent italic font-serif">Scraps2Stock</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-2xl mx-auto">
                Turning surplus food inventory into affordable supply for street vendors. We are building the most transparent, zero-waste local supply chain in India.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. Problem Section */}
        <section className="py-24 px-6 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-forest mb-4">The Problem</h2>
              <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: TrendingDown, title: "High Costs", desc: "Street vendors struggle with unpredictable, high raw material costs that squeeze their daily profits." },
                { icon: Leaf, title: "Massive Waste", desc: "Mandis, farms, and cold storages often have perfectly edible surplus stock that goes to waste." },
                { icon: ShieldCheck, title: "Lack of Trust", desc: "A lack of verified, trusted connections between local suppliers and micro-entrepreneurs causes lost value." }
              ].map((p, i) => (
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                  key={i} className="card-premium p-8 text-center bg-card"
                >
                  <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
                    <p.icon size={28} />
                  </div>
                  <h3 className="text-xl font-black mb-3">{p.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Solution Section */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <span className="text-accent text-[10px] font-black uppercase tracking-widest mb-4 block">The Solution</span>
            <h2 className="text-4xl md:text-5xl font-black text-forest mb-12">Bridging the Gap</h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="card-premium p-10 bg-primary text-primary-foreground border-none">
                <Store size={32} className="text-accent mb-6" />
                <h3 className="text-2xl font-black mb-4">For Vendors</h3>
                <p className="text-primary-foreground/80 leading-relaxed font-medium">
                  We provide direct access to verified suppliers. Vendors get incredibly affordable surplus produce, lowering their operating costs and boosting daily take-home profit.
                </p>
              </div>
              <div className="card-premium p-10 bg-card border border-border/50">
                <Truck size={32} className="text-forest mb-6" />
                <h3 className="text-2xl font-black text-forest mb-4">For Suppliers</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  We offer a marketplace to instantly liquidate excess inventory. Suppliers recover value from surplus stock before it spoils, turning potential waste into revenue.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. How It Works */}
        <section className="py-24 px-6 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-forest mb-4">How It Works</h2>
              <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-border/40 -translate-y-1/2 z-0" />
              {[
                { step: "01", title: "List Stock", desc: "Supplier lists surplus inventory." },
                { step: "02", title: "AI Scoring", desc: "System assigns Freshness & Trust scores." },
                { step: "03", title: "Discover", desc: "Vendors compare offers or create demand." },
                { step: "04", title: "Track", desc: "Order tracked via live timeline." },
                { step: "05", title: "Resolve", desc: "Built-in QA & Dispute resolution." },
              ].map((s, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-card border-4 border-background flex items-center justify-center text-accent font-black text-xl mb-4 shadow-sm">
                    {s.step}
                  </div>
                  <h4 className="font-black text-foreground mb-2">{s.title}</h4>
                  <p className="text-xs text-muted-foreground font-medium px-2">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Key Features */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-forest mb-4">Key Features</h2>
              <p className="text-muted-foreground font-medium">Built with cutting-edge technology for transparency.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: ShieldCheck, label: "Verified Suppliers" },
                { icon: BarChart, label: "Trust & Freshness Score" },
                { icon: RefreshCw, label: "Reverse Bidding" },
                { icon: Zap, label: "Smart Recommendations" },
                { icon: BellRing, label: "Real-time Notifications" },
                { icon: Activity, label: "Tracking Timeline" },
                { icon: ShieldCheck, label: "Dispute Resolution" },
                { icon: Search, label: "AI Help Assistant" },
              ].map((f, i) => (
                <div key={i} className="p-6 bg-card rounded-[2rem] border border-border/40 flex flex-col items-center justify-center text-center hover:border-accent/30 transition-colors group shadow-sm">
                  <f.icon size={28} className="text-muted-foreground mb-4 group-hover:text-accent transition-colors" />
                  <span className="text-xs font-black uppercase tracking-widest">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Impact */}
        <section className="py-24 px-6 bg-forest text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">Our Impact</h2>
              <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { val: "Reduces Food Waste", icon: Leaf },
                { val: "Lowers Vendor Costs", icon: IndianRupee },
                { val: "Helps Suppliers Earn", icon: TrendingDown },
                { val: "Builds Local Supply Chain", icon: Store },
              ].map((imp, i) => (
                <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
                    <imp.icon size={28} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{imp.val}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Mission */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <Heart size={48} className="text-accent mx-auto mb-8 animate-pulse" />
            <h2 className="text-3xl md:text-5xl font-black text-forest leading-tight mb-10">
              “Our mission is to make surplus food sourcing smarter, safer, and more affordable for India’s street food ecosystem.”
            </h2>
            <Link to="/signup" className="btn-premium-primary">
              Join the Movement <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default About;
