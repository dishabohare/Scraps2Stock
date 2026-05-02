import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Vendors", href: "#vendors" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-4" : "py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div 
          className={`relative flex items-center justify-between px-8 py-4 rounded-[2rem] transition-all duration-500 ${
            scrolled ? "bg-background/80 backdrop-blur-xl shadow-premium border border-border/40" : "bg-transparent"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <Logo size="md" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-forest/60 hover:text-forest transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-6">
            <ThemeToggle />
            <Link 
              to="/login" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-forest hover:text-accent transition-colors dark:text-white"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="bg-forest text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-forest hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden w-10 h-10 flex items-center justify-center text-forest"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 p-6 lg:hidden"
          >
            <div className="bg-card rounded-[2.5rem] shadow-premium border border-border/40 p-8 flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-black text-forest flex items-center justify-between group"
                >
                  {link.name}
                  <ArrowRight size={18} className="text-accent opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
              <hr className="border-primary/5" />
              <div className="flex flex-col gap-4">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-center rounded-2xl text-[10px] font-black uppercase tracking-widest text-forest bg-secondary"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-center rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-forest"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
