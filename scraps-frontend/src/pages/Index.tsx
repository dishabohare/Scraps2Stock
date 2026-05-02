import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import {
  ArrowRight, Leaf, TrendingDown, Truck, ShieldCheck, Zap, BarChart3,
  Store, CheckCircle2, ArrowUpRight, Sparkles, ShoppingBag, Award,
  ChevronRight, Globe, Shield
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpChatbot } from "@/components/HelpChatbot";
import heroImg from "@/assets/hero-market.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 origin-top-right -z-10" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <motion.div 
                initial="hidden" 
                animate="visible" 
                className="space-y-8"
              >
                <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                  <Sparkles size={14} className="text-accent" />
                  India's Premier Surplus Network
                </motion.div>

                <motion.h1 variants={fadeUp} custom={1} className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-forest">
                  Feeding the <br />
                  <span className="text-accent italic font-serif serif-italic">Future</span> with <br />
                  Surplus Stock.
                </motion.h1>

                <motion.p variants={fadeUp} custom={2} className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed font-medium">
                  We connect street food entrepreneurs with high-quality surplus inventory from farms and mandis. Reducing waste, maximizing profit.
                </motion.p>

                <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-5 pt-4">
                  <Link to="/signup" className="btn-premium-primary group">
                    Join the Network <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/marketplace" className="btn-premium-outline">
                    Explore Market
                  </Link>
                </motion.div>

                <motion.div variants={fadeUp} custom={4} className="flex items-center gap-8 pt-10">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-secondary flex items-center justify-center text-[10px] font-black text-primary overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-4 border-background bg-accent flex items-center justify-center text-[10px] font-black text-white">
                      +2k
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-forest">2,400+ Vendors</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sourcing daily</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 relative">
              <motion.div 
                style={{ y, opacity }}
                className="relative z-10"
              >
                <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-premium border-[12px] border-white/50 bg-secondary/50">
                  <img src={heroImg} alt="Market" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
                </div>

                {/* Floating Stats */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-10 bg-card p-6 rounded-[2.5rem] shadow-premium border border-border/50 max-w-[220px]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                      <TrendingDown size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Savings</p>
                      <p className="text-xl font-black text-forest">₹4.6k</p>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[65%]" />
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 20, 0] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-10 -left-10 bg-forest p-8 rounded-[2.5rem] shadow-premium text-white max-w-[240px]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 text-accent flex items-center justify-center">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Deal</p>
                      <p className="text-lg font-black leading-tight">Prime Tomatoes</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-accent">₹12/kg</span>
                    <span className="text-[10px] font-bold px-2 py-1 bg-white/10 rounded-lg">-40%</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-24 border-y border-primary/5 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-16">Our Trusted Partners</p>
          <div className="flex overflow-hidden relative grayscale opacity-40">
            <div className="flex animate-marquee gap-24 items-center">
              {["Azadpur Mandi", "Greenline Wholesale", "Krishna Agro", "Metro Suppliers", "Delhi Fresh", "Sabzi Express"].map((name, i) => (
                <span key={i} className="text-3xl font-black text-forest whitespace-nowrap tracking-tighter uppercase">{name}</span>
              ))}
              {["Azadpur Mandi", "Greenline Wholesale", "Krishna Agro", "Metro Suppliers", "Delhi Fresh", "Sabzi Express"].map((name, i) => (
                <span key={`dup-${i}`} className="text-3xl font-black text-forest whitespace-nowrap tracking-tighter uppercase">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <span className="text-accent font-black text-[10px] uppercase tracking-[0.3em] mb-6 block">Why Choose Us</span>
            <h2 className="text-5xl lg:text-6xl font-black text-forest mb-8 tracking-tighter">
              Professional sourcing for the <span className="text-accent italic font-serif">modern</span> vendor.
            </h2>
            <p className="text-lg text-muted-foreground font-medium">We've modernized the food supply chain with data-driven insights and sustainable practices.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: TrendingDown, title: "Fair Pricing", desc: "Save up to 40% by sourcing high-quality surplus stock direct from the source." },
              { icon: Leaf, title: "Zero Waste", desc: "Every order helps reduce food waste in India's complex supply chain." },
              { icon: Truck, title: "Fast Delivery", desc: "Reliable logistics designed for the unique needs of street food entrepreneurs." },
              { icon: ShieldCheck, title: "Verified Stock", desc: "Every listing goes through a strict quality check before hitting the market." },
              { icon: Zap, title: "Instant Deals", desc: "Real-time alerts for price drops on the produce you need most." },
              { icon: BarChart3, title: "Data Insights", desc: "Track your savings and waste reduction through your personal dashboard." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-premium p-10 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  <f.icon size={26} />
                </div>
                <h3 className="text-xl font-black text-forest mb-4 tracking-tight">{f.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Vendors Section */}
      <section className="py-32 px-6 bg-forest text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 origin-top-right" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-accent font-black text-[10px] uppercase tracking-[0.3em] mb-8 block">For Entrepreneurs</span>
              <h2 className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter leading-[0.95]">
                Grow your business with <span className="text-accent italic font-serif">smarter</span> sourcing.
              </h2>
              <div className="space-y-8 mb-12">
                {[
                  "Access to wholesale surplus at fraction of market rates",
                  "Verified quality with money-back guarantee",
                  "No minimum order requirements for delivery",
                  "Digital invoicing and performance tracking"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="font-bold text-white/80">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="btn-premium-accent">
                Start Saving Now <ChevronRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Globe, val: "12+", label: "Major Cities" },
                { icon: Shield, val: "150+", label: "Verified Farms" },
                { icon: Award, val: "4.8/5", label: "Vendor Rating" },
                { icon: Zap, val: "24/7", label: "Market Access" }
              ].map((s, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <s.icon size={24} className="text-accent mb-6" />
                  <p className="text-4xl font-black mb-2">{s.val}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="card-premium p-16 lg:p-24 relative overflow-hidden bg-forest"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
            
            <div className="relative z-10 space-y-10">
              <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">
                Ready to transform your <span className="text-accent italic font-serif">inventory?</span>
              </h2>
              <p className="text-xl text-white/60 font-medium max-w-2xl mx-auto">
                Join 2,400+ vendors and 150+ suppliers building India's most sustainable food network.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link to="/signup" className="btn-premium-accent !px-12 !py-6 !text-sm">Create Free Account</Link>
                <Link to="/login" className="btn-premium-outline !text-white !border-white/20 hover:!bg-white/10 !px-12 !py-6 !text-sm">Log in to Portal</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Floating Help Chatbot */}
      <HelpChatbot />
    </div>
  );
};

export default Index;
