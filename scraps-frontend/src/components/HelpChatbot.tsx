import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, HelpCircle } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const QUICK_PROMPTS = [
  "What is Scraps2Stock?",
  "How does it work?",
  "What is vendor vs supplier?",
  "How do I save money?",
  "What is freshness score?",
  "What is trust score?",
  "How do I start?",
];

const INTENT_RESPONSES = [
  {
    keywords: ["what is", "scraps2stock", "platform", "concept"],
    response: "Scraps2Stock is a B2B marketplace that connects food suppliers with surplus inventory to street vendors who need affordable, quality ingredients. We turn surplus into value by preventing food waste and empowering small businesses."
  },
  {
    keywords: ["how does it work", "process", "flow"],
    response: "It's simple! Suppliers list their surplus items (like veggies or dairy) at discounted prices. Vendors browse these deals, check Freshness and Trust Scores, and place an order. We handle real-time tracking until the order is delivered."
  },
  {
    keywords: ["vendor vs supplier", "who is", "vendor", "supplier", "difference"],
    response: "A **Supplier** is a business (like a farm, warehouse, or wholesaler) with extra inventory they want to sell quickly before it spoils. \n\nA **Vendor** is a small business (like a chaat stall, local restaurant, or street cart) looking to buy high-quality ingredients at a discount."
  },
  {
    keywords: ["save money", "discount", "cheap", "affordable"],
    response: "Because suppliers are selling surplus stock that might otherwise go to waste, they offer it at heavily discounted prices. Vendors can source daily ingredients for their stalls at 30-60% below standard market rates!"
  },
  {
    keywords: ["freshness", "freshness score", "spoilage", "quality"],
    response: "The Freshness Score is an AI-driven metric (0-100) that tells you how fresh an item is. We calculate it based on the item's expiry date, storage conditions (like cold storage), and category decay rate, so you know exactly what you're buying."
  },
  {
    keywords: ["trust", "trust score", "verified", "safe", "fssai"],
    response: "The Trust Score (0-100) rates suppliers based on their successful delivery history, lack of disputes, and verified credentials (like FSSAI badges). It ensures vendors only deal with reliable, high-quality partners."
  },
  {
    keywords: ["start", "sign up", "register", "join"],
    response: "To start, simply click 'Sign Up' or 'Join Now' on our website. You'll choose whether you are a Vendor (buying) or a Supplier (selling). Once registered, you can immediately access the Sourcing Hub or start listing inventory!"
  },
  {
    keywords: ["bid", "bidding", "negotiate", "offer"],
    response: "Scraps2Stock includes a dynamic bidding system! If a supplier allows it, vendors can propose a lower price (a bid). The supplier can then accept, counter, or reject the bid, allowing for fair, real-time negotiations."
  }
];

export const HelpChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: "init",
    role: "assistant",
    text: "Hi! I can help you understand how Scraps2Stock works 😊",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const processQuery = (query: string) => {
    setLoading(true);
    
    setTimeout(() => {
      const q = query.toLowerCase();
      let bestResponse = "I'm not exactly sure about that. Try asking about our features, like 'What is Scraps2Stock', 'How does it work', or what 'Trust Scores' are!";
      
      let highestMatch = 0;

      for (const intent of INTENT_RESPONSES) {
        let matches = 0;
        for (const keyword of intent.keywords) {
          if (q.includes(keyword)) matches++;
        }
        
        if (matches > highestMatch) {
          highestMatch = matches;
          bestResponse = intent.response;
        }
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        text: bestResponse
      }]);
      setLoading(false);
    }, 600); // Simulate typing delay
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text }]);
    setInput("");
    processQuery(text);
  };

  return (
    <>
      {/* Floating Button with Tooltip */}
      <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 ${isOpen ? 'hidden' : ''}`}>
        <div className="bg-white text-foreground px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-black/5 animate-pulse flex items-center gap-2">
          <HelpCircle size={14} className="text-primary" /> Need Help?
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all"
        >
          <MessageSquare size={24} />
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-[380px] h-[550px] max-h-[85vh] bg-card border border-border/40 shadow-2xl rounded-[2rem] flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="px-5 py-4 bg-primary text-primary-foreground flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-black text-sm">S2S Assistant</h3>
                <p className="text-[10px] opacity-80 font-medium">Platform Guide</p>
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
                    <p className="leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
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
                placeholder="Ask me anything..."
                className="flex-1 bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
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
