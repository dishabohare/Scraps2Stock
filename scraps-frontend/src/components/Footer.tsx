import { Link } from "react-router-dom";
import { Twitter, Instagram, Linkedin, ArrowRight, Heart } from "lucide-react";
import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="bg-forest text-white pt-32 pb-12 overflow-hidden relative">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -mb-48 -mr-48" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="flex items-center group">
              <Logo size="md" darkBg />
            </Link>
            <p className="text-white/50 font-medium text-lg leading-relaxed max-w-sm">
              Empowering India's street food entrepreneurs by digitizing the surplus supply chain. From mandi to plate, sustainably.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Navigation</h4>
              <ul className="space-y-4">
                <li><Link to="/marketplace" className="text-white/50 hover:text-white font-bold transition-colors">Marketplace</Link></li>
                <li><Link to="/features" className="text-white/50 hover:text-white font-bold transition-colors">Features</Link></li>
                <li><a href="#" className="text-white/50 hover:text-white font-bold transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-white/50 hover:text-white font-bold transition-colors">Vendor Hub</a></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Company</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-white/50 hover:text-white font-bold transition-colors">About Us</Link></li>
                <li><Link to="/about" className="text-white/50 hover:text-white font-bold transition-colors">Our Mission</Link></li>
                <li><a href="#" className="text-white/50 hover:text-white font-bold transition-colors">Partners</a></li>
                <li><a href="#" className="text-white/50 hover:text-white font-bold transition-colors">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Newsletter</h4>
              <p className="text-white/40 text-sm font-medium leading-relaxed">Weekly market insights straight to your inbox.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-accent transition-colors font-bold text-sm"
                />
                <button className="absolute right-2 top-2 w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            © 2026 Scraps2Stock. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            Made with <Heart size={10} className="text-accent fill-accent" /> for India's Entrepreneurs
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
