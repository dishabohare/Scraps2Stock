/**
 * NotificationContext
 *
 * Manages all in-app notifications:
 *  - Notification state (list, unread count)
 *  - Polling engine: fetches orders + bids every 15s, generates typed notifications
 *  - Simulated live events (new surplus, low freshness alerts) for demo realism
 *  - mark-as-read / clear-all / push custom notification
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

export type NotifType =
  | "offer_received"
  | "bid_accepted"
  | "order_update"
  | "new_surplus"
  | "freshness_alert";

export interface AppNotification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  push: (n: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ─── Helpers ─────────────────────────────────────────────────────────────────

let _idCounter = 0;
const uid = () => `notif_${Date.now()}_${++_idCounter}`;

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60)  return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}
export { timeAgo };

/** Simulated surplus events — shown randomly to give real-time feel */
const SURPLUS_EVENTS: Array<{ title: string; message: string }> = [
  { title: "New Surplus Available 🌿", message: "Fresh Tomatoes (450 kg) listed near Nashik Farms" },
  { title: "Flash Deal 🔥",            message: "Kufri Potatoes dropped to ₹10/kg — 850 kg available" },
  { title: "Surplus Alert 📦",         message: "Green Chillies (80 kg) just listed in Delhi Mandi" },
  { title: "New Listing 🌾",           message: "Juicy Lemons batch from Nagpur Orchards is live" },
  { title: "Stock Update ✅",          message: "Nashik Onions — 1,200 kg listed at ₹14/kg" },
];

/** Low freshness alerts */
const FRESHNESS_ALERTS: Array<{ title: string; message: string }> = [
  { title: "⚠️ Freshness Alert",       message: "Fresh Coriander in your saved list expires in 2 days" },
  { title: "⏰ Act Fast",              message: "Red Tomatoes near expiry — grab before the deal ends" },
];

// ─── Provider ────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 15_000; // 15 seconds

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Track last-seen order and offer counts to detect new ones
  const lastOrderCount = useRef<number>(0);
  const lastOfferCount = useRef<number>(0);
  const simulationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Push helper ────────────────────────────────────────────────────────────
  const push = useCallback(
    (n: Omit<AppNotification, "id" | "timestamp" | "read">, showToast = true) => {
      const notif: AppNotification = {
        ...n,
        id: uid(),
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [notif, ...prev].slice(0, 50)); // cap at 50

      if (showToast) {
        toast(n.title, {
          description: n.message,
          duration: 4000,
        });
      }
    },
    []
  );

  // ── Poll orders ────────────────────────────────────────────────────────────
  const pollOrders = useCallback(async () => {
    const user = (() => {
      try { return JSON.parse(localStorage.getItem("user") ?? "null"); }
      catch { return null; }
    })();
    if (!user?.email) return;

    const token = localStorage.getItem("token");
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      // Fetch orders for this user's email
      const emailEnc = encodeURIComponent(user.email);
      const endpoint =
        user.role === "VENDOR"
          ? `http://localhost:8081/api/orders/vendor/${emailEnc}`
          : `http://localhost:8081/api/orders/supplier/${emailEnc}`;

      const res = await fetch(endpoint, { headers });
      if (!res.ok) return;
      const orders: { id: number; status: string; productName: string }[] = await res.json();

      if (lastOrderCount.current === 0) {
        lastOrderCount.current = orders.length;
        return;
      }

      if (orders.length > lastOrderCount.current) {
        const newOrders = orders.slice(0, orders.length - lastOrderCount.current);
        newOrders.forEach((o) => {
          push({
            type: "order_update",
            title: "New Order Received 🎉",
            message: `Order for "${o.productName}" is now ${o.status.toLowerCase()}.`,
          });
        });
        lastOrderCount.current = orders.length;
      }
    } catch {
      /* non-fatal — backend may be starting up */
    }
  }, [push]);

  // ── Poll bid offers ────────────────────────────────────────────────────────
  const pollBids = useCallback(async () => {
    const user = (() => {
      try { return JSON.parse(localStorage.getItem("user") ?? "null"); }
      catch { return null; }
    })();
    if (!user?.email || user.role !== "VENDOR") return;

    const token = localStorage.getItem("token");
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const emailEnc = encodeURIComponent(user.email);
      const res = await fetch(`http://localhost:8081/api/bids/vendor/${emailEnc}`, { headers });
      if (!res.ok) return;
      const bids: { id: number; status: string; productName: string }[] = await res.json();

      // Count accepted offers as a proxy for "new" events
      const accepted = bids.filter((b) => b.status === "CLOSED").length;
      if (lastOfferCount.current === 0) {
        lastOfferCount.current = accepted;
        return;
      }
      if (accepted > lastOfferCount.current) {
        push({
          type: "bid_accepted",
          title: "Bid Accepted! ✅",
          message: "A supplier accepted your bid request. Check Offer Comparison.",
        });
        lastOfferCount.current = accepted;
      }
    } catch {
      /* non-fatal */
    }
  }, [push]);

  // ── Simulated live events ─────────────────────────────────────────────────
  const scheduleSimulation = useCallback(() => {
    // Random delay between 25–55 seconds so it doesn't feel mechanical
    const delay = 25_000 + Math.random() * 30_000;
    simulationTimer.current = setTimeout(() => {
      const roll = Math.random();
      if (roll < 0.6) {
        // 60% chance: new surplus alert
        const evt = SURPLUS_EVENTS[Math.floor(Math.random() * SURPLUS_EVENTS.length)];
        push({ type: "new_surplus", ...evt });
      } else {
        // 40% chance: freshness alert
        const evt = FRESHNESS_ALERTS[Math.floor(Math.random() * FRESHNESS_ALERTS.length)];
        push({ type: "freshness_alert", ...evt });
      }
      scheduleSimulation(); // chain next simulation
    }, delay);
  }, [push]);

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Seed one welcome notification on first mount
    setNotifications([
      {
        id: uid(),
        type: "new_surplus",
        title: "Welcome to Scraps2Stock 🌿",
        message: "Live market is active. New surplus listings update every few seconds.",
        timestamp: new Date(),
        read: false,
      },
    ]);

    // Start polling
    pollOrders();
    pollBids();
    const interval = setInterval(() => {
      pollOrders();
      pollBids();
    }, POLL_INTERVAL_MS);

    // Start simulation
    scheduleSimulation();

    return () => {
      clearInterval(interval);
      if (simulationTimer.current) clearTimeout(simulationTimer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Actions ────────────────────────────────────────────────────────────────
  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markRead, markAllRead, clearAll, push }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be inside NotificationProvider");
  return ctx;
};
