import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, ListChecks, MessageSquare,
  Settings, LogOut, Package, Users, Map
} from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  role: "vendor" | "supplier";
}

const DashboardSidebar = ({ role }: SidebarProps) => {
  const { logout } = useAuth();

  const vendorLinks = [
    { name: "Overview", icon: LayoutDashboard, path: "/vendor/dashboard" },
    { name: "Marketplace", icon: ShoppingBag, path: "/marketplace" },
    { name: "Nearby", icon: Map, path: "/vendor/nearby" },
    { name: "My Orders", icon: ListChecks, path: "/vendor/orders" },
    { name: "Bids", icon: MessageSquare, path: "/vendor/bids" },
  ];

  const supplierLinks = [
    { name: "Hub", icon: LayoutDashboard, path: "/supplier/dashboard" },
    { name: "Inventory", icon: Package, path: "/supplier/listings" },
    { name: "Orders", icon: ListChecks, path: "/supplier/orders" },
    { name: "Vendors", icon: Users, path: "/supplier/bid-requests" },
  ];

  const links = role === "vendor" ? vendorLinks : supplierLinks;

  const baseClass = "flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 group";
  const activeClass = `${baseClass} bg-accent text-white shadow-[0_8px_20px_rgba(245,158,11,0.35)]`;
  const inactiveClass = `${baseClass} text-white/50 hover:bg-white/5 hover:text-white`;

  return (
    <aside className="w-72 bg-primary h-screen sticky top-0 flex flex-col p-8 shrink-0">
      {/* Brand */}
      <div className="mb-14">
        <Logo size="md" darkBg />
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25 mb-5 px-3">
          Main Menu
        </p>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => isActive ? activeClass : inactiveClass}
          >
            {({ isActive }) => (
              <>
                <link.icon
                  size={20}
                  className={isActive ? "text-white" : "group-hover:text-accent transition-colors"}
                />
                {link.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-6 border-t border-white/10">
        <NavLink
          to="/profile"
          className={({ isActive }) => isActive ? activeClass : inactiveClass}
        >
          {({ isActive }) => (
            <>
              <Settings size={20} className={isActive ? "text-white" : ""} />
              Settings
            </>
          )}
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
