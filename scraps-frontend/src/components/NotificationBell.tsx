/**
 * NotificationBell
 *
 * Dropdown notification panel — replaces the static bell button in DashboardLayout.
 *
 * Features:
 *  - Unread count badge
 *  - Scrollable list of notifications (title, message, timeAgo, type icon)
 *  - Per-item mark-as-read on click
 *  - Mark all read / Clear all buttons
 *  - Click-outside to close
 *  - Dark/light mode via Tailwind theme classes
 */

import { useRef, useEffect, useState } from "react";
import {
  Bell,
  Package,
  TrendingUp,
  ShoppingCart,
  Leaf,
  AlertTriangle,
  CheckCheck,
  Trash2,
  X,
} from "lucide-react";
import { useNotifications, timeAgo, NotifType, AppNotification } from "@/context/NotificationContext";
import { AnimatePresence, motion } from "framer-motion";

// ─── Icon + colour per notification type ─────────────────────────────────────

const TYPE_META: Record<
  NotifType,
  { Icon: React.FC<{ size?: number; className?: string }>; colour: string; dot: string }
> = {
  offer_received:  { Icon: TrendingUp,     colour: "text-blue-500",    dot: "bg-blue-500" },
  bid_accepted:    { Icon: CheckCheck,     colour: "text-emerald-500", dot: "bg-emerald-500" },
  order_update:    { Icon: ShoppingCart,   colour: "text-[#f5a623]",   dot: "bg-[#f5a623]" },
  new_surplus:     { Icon: Package,        colour: "text-[#2d6a4f]",   dot: "bg-[#2d6a4f]" },
  freshness_alert: { Icon: AlertTriangle,  colour: "text-red-500",     dot: "bg-red-500" },
};

// ─── Single notification row ──────────────────────────────────────────────────

const NotifRow = ({
  notif,
  onRead,
}: {
  notif: AppNotification;
  onRead: (id: string) => void;
}) => {
  const { Icon, colour, dot } = TYPE_META[notif.type];

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onClick={() => onRead(notif.id)}
      className={`w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
        ${notif.read
          ? "bg-transparent hover:bg-secondary/40"
          : "bg-primary/5 dark:bg-primary/10 hover:bg-primary/10"
        }`}
    >
      {/* Icon container */}
      <div className={`w-9 h-9 rounded-xl bg-secondary/60 dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon size={16} className={colour} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-bold leading-snug ${notif.read ? "text-muted-foreground" : "text-foreground"}`}>
            {notif.title}
          </p>
          {!notif.read && (
            <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
          )}
        </div>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed mt-0.5 line-clamp-2">
          {notif.message}
        </p>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">
          {timeAgo(notif.timestamp)}
        </p>
      </div>
    </motion.button>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const NotificationBell = () => {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        id="notification-bell-btn"
        aria-label="Open notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-border/30 text-foreground hover:bg-secondary transition-all"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#f5a623] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-background shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-[360px] max-h-[520px] flex flex-col bg-card border border-border/40 rounded-2xl shadow-2xl z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/20 shrink-0">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-[#2d6a4f]" />
                <span className="text-sm font-black text-foreground tracking-tight">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#f5a623]/15 text-[#f5a623] rounded-full text-[10px] font-black">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    title="Mark all as read"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-[#2d6a4f] hover:bg-secondary transition-all"
                  >
                    <CheckCheck size={15} />
                  </button>
                )}
                <button
                  onClick={clearAll}
                  title="Clear all"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary transition-all"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="overflow-y-auto flex-1 p-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                    <Leaf size={26} className="text-[#2d6a4f]" />
                  </div>
                  <p className="text-sm font-black text-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">
                    New market events will appear here.
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {notifications.map((n) => (
                    <NotifRow key={n.id} notif={n} onRead={markRead} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-border/20 shrink-0">
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest text-center">
                  Polling live market every 15s
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
