import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: Route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative max-w-lg"
      >
        {/* Big 404 */}
        <div className="text-[10rem] font-black text-foreground/5 leading-none tracking-tighter select-none">
          404
        </div>

        <div className="-mt-20 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8"
          >
            <Search size={32} className="text-primary" />
          </motion.div>

          <h1 className="text-4xl font-black text-foreground mb-4 tracking-tight">Page not found</h1>
          <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
            The page you're looking for doesn't exist or may have moved.<br />
            Let's get you back on track.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="btn-premium-primary">
              <Home size={16} /> Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-premium-outline"
            >
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
