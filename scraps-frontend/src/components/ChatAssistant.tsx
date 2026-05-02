import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, MapPin, IndianRupee, Leaf, ShieldCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { computeFreshness } from "@/lib/freshness";
import { haversineKm, getSupplierCoords, DEFAULT_CENTER } from "@/lib/supplierCoords";
import { getDemoTrustInfo } from "@/components/TrustBadge";

interface InventoryItem {
  id: number;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  supplierName: string;
  supplierEmail: string;
  expiryDate?: string;
}

interface ScoredItem extends InventoryItem {
  freshness: number;
  distance: number;
  trustScore: number;
  isVerified: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  items?: ScoredItem[];
}

const QUICK_PROMPTS = [
  "I need onions under ₹25",
  "Show me fresh tomatoes",
  "Find cheapest potatoes",
  "Trusted suppliers near me",
];

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: "init",
    role: "assistant",
    text: "Hi! I'm your Smart Procurement Assistant (Rule-Based Demo). What surplus inventory are you looking for today?",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const processQuery = async (query: string) => {
    setLoading(true);
    try {
      // 1. Fetch raw inventory
      const res = await fetch("http://localhost:8081/api/inventory/all");
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data: InventoryItem[] = await res.json();

      // 2. Score inventory
      let userLoc = DEFAULT_CENTER;
      if ("geolocation" in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
          userLoc = [pos.coords.latitude, pos.coords.longitude];
        } catch { /* ignore fallback */ }
      }

      const scoredItems: ScoredItem[] = data.filter(d => d.quantity > 0).map(item => {
        const coords = getSupplierCoords(item.supplierEmail);
        const distance = coords ? haversineKm(userLoc[0], userLoc[1], coords.lat, coords.lng) : 50;
        return {
          ...item,
          freshness: computeFreshness(item.expiryDate, item.category).score,
          distance,
          ...getDemoTrustInfo(item.supplierEmail),
        };
      });

      // 3. Simple Rule-Based NLP Logic
      const q = query.toLowerCase();
      let filtered = [...scoredItems];
      let responseText = "Here is what I found for you:";

      // Product matching
      const keywords = ["tomato", "onion", "potato", "carrot", "leafy", "fruit", "vegetable"];
      const foundProduct = keywords.find(k => q.includes(k));
      if (foundProduct) {
        filtered = filtered.filter(i => i.productName.toLowerCase().includes(foundProduct) || i.category.toLowerCase().includes(foundProduct));
      } else if (q.includes("chaat")) {
        filtered = filtered.filter(i => i.productName.toLowerCase().includes("potato") || i.productName.toLowerCase().includes("onion"));
        responseText = "For a chaat stall, I recommend these potatoes and onions:";
      }

      // Price matching (e.g. "under 25")
      const priceMatch = q.match(/under (?:rs|rupees|₹)?\s*(\d+)/) || q.match(/less than \s*(\d+)/);
      if (priceMatch) {
        const targetPrice = parseInt(priceMatch[1], 10);
        filtered = filtered.filter(i => i.price <= targetPrice);
      }

      // Freshness matching
      if (q.includes("fresh")) {
        filtered = filtered.sort((a, b) => b.freshness - a.freshness);
        if (filtered.length > 0) filtered = filtered.filter(i => i.freshness >= 70); // only good ones
      }

      // Trust matching
      if (q.includes("trust") || q.includes("verif")) {
        filtered = filtered.filter(i => i.trustScore >= 80 || i.isVerified);
        filtered.sort((a, b) => b.trustScore - a.trustScore);
      }

      // Distance matching
      if (q.includes("near") || q.includes("close")) {
        filtered.sort((a, b) => a.distance - b.distance);
      } else if (q.includes("cheap") || q.includes("lowest")) {
        filtered.sort((a, b) => a.price - b.price);
      } else {
        // Default sort by freshness + trust
        filtered.sort((a, b) => (b.freshness + b.trustScore) - (a.freshness + a.trustScore));
      }

      // Limit results
      const finalItems = filtered.slice(0, 3);

      if (finalItems.length === 0) {
        responseText = "I couldn't find any inventory matching your exact request. Try adjusting the price or product name.";
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        text: responseText,
        items: finalItems.length > 0 ? finalItems : undefined
      }]);

    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        text: "Sorry, I am having trouble connecting to the database right now."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text }]);
    setInput("");
    processQuery(text);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/30 hover:scale-110 active:scale-95 transition-all z-50 ${isOpen ? 'hidden' : ''}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[85vh] bg-card border border-border/40 shadow-2xl rounded-3xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="px-5 py-4 bg-primary text-primary-foreground flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-black text-sm">S2S Assistant</h3>
                <p className="text-[10px] opacity-80 uppercase tracking-widest font-black flex items-center gap-1">
                  <Sparkles size={8} /> AI Demo Mode
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-secondary/20">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-accent text-white" : "bg-primary text-white"}`}>
                    {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-sm ${
                    msg.role === "user" 
                      ? "bg-accent text-white rounded-br-sm" 
                      : "bg-card border border-border/50 text-foreground rounded-bl-sm shadow-sm"
                  }`}>
                    <p className="leading-relaxed font-medium">{msg.text}</p>
                  </div>
                </div>

                {/* Render Assistant Result Cards */}
                {msg.items && (
                  <div className="mt-3 ml-8 space-y-3 w-[85%]">
                    {msg.items.map(item => (
                      <div key={item.id} className="bg-card border border-border/40 p-3 rounded-xl shadow-sm hover:border-accent/40 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-foreground text-sm leading-tight">{item.productName}</h4>
                          <span className="text-xs font-black text-accent bg-accent/10 px-2 py-0.5 rounded-md">₹{item.price}/kg</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                            <Leaf size={10} /> Fresh: <span className={item.freshness > 70 ? 'text-emerald-600' : 'text-amber-600'}>{item.freshness}%</span>
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                            <MapPin size={10} /> {item.distance.toFixed(1)} km
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 col-span-2">
                            <ShieldCheck size={10} className={item.isVerified ? "text-primary" : ""} /> 
                            {item.supplierName} ({item.trustScore} Trust)
                          </p>
                        </div>

                        <button 
                          onClick={() => { setIsOpen(false); navigate(`/order/${item.id}`); }}
                          className="w-full py-1.5 bg-secondary text-foreground text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-colors"
                        >
                          View Deal
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0"><Bot size={12} /></div>
                <div className="px-4 py-3 bg-card border border-border/50 rounded-2xl rounded-bl-sm flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 pt-2 pb-1 bg-card flex overflow-x-auto gap-2 custom-scrollbar shrink-0">
            {QUICK_PROMPTS.map(p => (
              <button 
                key={p} 
                onClick={() => handleSend(p)}
                className="px-3 py-1.5 bg-secondary/50 hover:bg-secondary text-[10px] font-bold text-muted-foreground whitespace-nowrap rounded-lg transition-colors border border-border/40"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-card border-t border-border/40 shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="flex items-center gap-2"
            >
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about inventory, prices, distance..."
                className="flex-1 bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-colors shrink-0"
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
