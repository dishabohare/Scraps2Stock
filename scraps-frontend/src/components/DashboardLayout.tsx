import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { Menu, Search, UserCircle2 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import NotificationBell from "./NotificationBell";

interface LayoutProps {
  children: React.ReactNode;
  role: "vendor" | "supplier";
}

const DashboardLayout = ({ children, role }: LayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { name: "User", email: "" };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar role={role} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-72 z-50 transition-transform duration-500 lg:hidden
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <DashboardSidebar role={role} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/30 px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:flex items-center flex-1 max-w-sm bg-secondary/60 rounded-2xl px-4 py-2.5 border border-border/20 focus-within:border-primary/20 transition-all">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none flex-1 px-3 text-sm font-medium"
              />
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <ThemeToggle />
              <NotificationBell />

              <div className="flex items-center gap-3 pl-4 border-l border-border/30">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-foreground leading-none">{user.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{role}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-forest relative">
                  <UserCircle2 size={22} />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-accent rounded-full border-2 border-background" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
