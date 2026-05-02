import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, Leaf, ArrowRight, Activity, TrendingDown,
  RefreshCw, MapPin, Zap, BellRing, Star, Cpu, Search,
  Store, Package, Scale, Camera, AlertCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const Features = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-forest text-white">
          <div className="absolute inset-0 bg-gradient-to-tr from-forest via-forest to-accent/20 opacity-90" />
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-6 border border-accent/30">
                Platform Capabilities
              </span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
                Smart Features Built for <br />
                <span className="text-accent italic font-serif">Surplus Food</span> Sourcing.
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-3xl mx-auto">
                From verified suppliers to real-time freshness scoring, Scraps2Stock helps vendors buy smarter and suppliers sell surplus faster before it spoils.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. Core Features Grid */}
        <section className="py-24 px-6 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-forest mb-4">Core Technology</h2>
              <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[
                { icon: Leaf, title: "AI Freshness Score", badge: "AI", desc: "Automated 0-100 scoring based on harvest dates, storage type, and decay rates." },
                { icon: Star, title: "Trust Score Engine", badge: "Smart", desc: "Suppliers are rated dynamically based on successful deliveries and dispute history." },
                { icon: RefreshCw, title: "Reverse Bidding", badge: "Real-time", desc: "Vendors can post their budget and demand, forcing suppliers to compete." },
                { icon: Zap, title: "Smart Recommendations", badge: "AI", desc: "Personalized deals based on your location, trust scores, and exact price needs." },
                { icon: MapPin, title: "Nearby Supplier Discovery", badge: "Smart", desc: "Location-based map integration to find the closest fresh surplus deals instantly." },
                { icon: Cpu, title: "AI Help Assistant", badge: "AI", desc: "An intelligent onboarding chat assistant to guide you through procurement." },
              ].map((f, i) => (
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                  key={i} className="card-premium p-8 bg-card border border-border/40 hover:border-accent/40 transition-colors group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-secondary text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <f.icon size={24} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-secondary text-muted-foreground rounded-md border border-border/50">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-3 leading-tight">{f.title}</h3>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Vendor Features & 4. Supplier Features */}
        <section className="py-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Vendors */}
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
                <span className="text-accent font-black text-[10px] uppercase tracking-[0.3em] mb-6 block">For Buyers</span>
                <h2 className="text-4xl lg:text-5xl font-black text-forest tracking-tighter mb-8">
                  Supercharge your street food stall.
                </h2>
                <div className="space-y-6">
                  {[
                    { title: "Create Demand Bids", desc: "Don't see what you want? Post a bid and let suppliers come to you." },
                    { title: "Compare Supplier Offers", desc: "Review multiple counter-offers side-by-side to ensure the best margin." },
                    { title: "View Freshness Scores", desc: "Never guess quality again. Data-backed freshness prevents bad purchases." },
                    { title: "Track Orders & Report Issues", desc: "Full delivery tracking with safe dispute resolution if items arrive damaged." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-1">
                        <Store size={14} />
                      </div>
                      <div>
                        <h4 className="font-black text-foreground mb-1">{item.title}</h4>
                        <p className="text-sm font-medium text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              <div className="relative">
                <div className="aspect-square rounded-[3rem] bg-secondary/50 border border-border/40 p-8 relative">
                  {/* Decorative Elements */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 blur-[80px] rounded-full" />
                  <div className="absolute top-10 right-10 w-full max-w-[280px] card-premium p-6 shadow-2xl z-10 animate-bounce [animation-duration:4s]">
                     <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Smart Match</span>
                       <span className="text-[10px] font-black text-accent">92%</span>
                     </div>
                     <p className="font-black text-foreground mb-1">Onions - Grade A</p>
                     <p className="text-sm text-emerald-600 font-bold">₹15/kg • 4km Away</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Suppliers */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="aspect-square rounded-[3rem] bg-forest/5 border border-forest/10 p-8 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
                  <div className="absolute bottom-10 left-10 w-full max-w-[280px] card-premium p-6 shadow-2xl z-10 bg-forest text-white animate-bounce [animation-duration:5s]">
                     <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Demand Alert</span>
                       <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                     </div>
                     <p className="font-black text-white mb-1">Vendor Bid Received</p>
                     <p className="text-sm text-white/70 font-bold">20kg Potatoes @ ₹10/kg</p>
                  </div>
                </div>
              </div>
              <motion.div className="order-1 lg:order-2" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
                <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 block">For Sellers</span>
                <h2 className="text-4xl lg:text-5xl font-black text-forest tracking-tighter mb-8">
                  Never let excess stock go to waste.
                </h2>
                <div className="space-y-6">
                  {[
                    { title: "List Surplus Stock", desc: "Instantly upload inventory that is nearing its shelf life." },
                    { title: "Capture Vendor Demand", desc: "Fulfill direct vendor bids instead of waiting for traditional wholesale buyers." },
                    { title: "Build Trust Score", desc: "Consistently deliver good produce to earn a high Trust Score, boosting visibility." },
                    { title: "Track Performance", desc: "View detailed analytics on revenue recovered from stock that would have been thrown away." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-1">
                        <Package size={14} />
                      </div>
                      <div>
                        <h4 className="font-black text-foreground mb-1">{item.title}</h4>
                        <p className="text-sm font-medium text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. Trust & Safety */}
        <section className="py-24 px-6 bg-forest text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 origin-top-right z-0" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <ShieldCheck size={48} className="text-accent mx-auto mb-6" />
              <h2 className="text-4xl font-black mb-4">Enterprise-Grade Trust & Safety</h2>
              <p className="text-white/70 font-medium max-w-2xl mx-auto">We protect both buyers and sellers, ensuring fair trade and high-quality produce.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              {[
                { icon: ShieldCheck, title: "FSSAI Verified", desc: "Suppliers undergo strict verification before their listings go live on the marketplace." },
                { icon: Camera, title: "Quality Proof System", desc: "Vendors and Suppliers can upload photo evidence during fulfillment to prevent fraud." },
                { icon: Scale, title: "Admin Dispute Panel", desc: "A dedicated resolution center where admins can penalize bad actors and refund victims." },
              ].map((t, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <t.icon size={32} className="text-accent mx-auto mb-6" />
                  <h3 className="text-xl font-black mb-3">{t.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed font-medium">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. CTA Section */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-4xl mx-auto card-premium p-16 lg:p-24 bg-card border-border/40 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-forest mb-8 tracking-tighter">
                Ready to experience the platform?
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                <Link to="/signup" className="btn-premium-primary !px-10 !py-5">
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link to="/marketplace" className="btn-premium-outline !px-10 !py-5">
                  Explore Marketplace <Search size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Features;
