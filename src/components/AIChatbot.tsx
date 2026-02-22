import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import ginnieMascot from "@/assets/ginnie-mascot.png";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const QUICK_ACTIONS = [
  { label: "🐾 What is Tidbit Tails?", message: "What is Tidbit Tails?" },
  { label: "🚨 Report Emergency", message: "I found an injured animal and need help" },
  { label: "💛 Volunteer", message: "How can I volunteer?" },
  { label: "☕ Pup Cafés", message: "Tell me about the pup cafés" },
];

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamChat = useCallback(async (allMessages: Message[]) => {
    setIsLoading(true);
    let assistantSoFar = "";

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        upsert(errData.error || "Oops! Something went wrong. Please try again 🐾");
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsert(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch {
      upsert("Couldn't connect right now. Try again soon! 🐾");
    }
    setIsLoading(false);
  }, []);

  const handleSend = useCallback(
    (text?: string) => {
      const msg = (text || input).trim();
      if (!msg || isLoading) return;
      const userMsg: Message = { role: "user", content: msg };
      const updated = [...messages, userMsg];
      setMessages(updated);
      setInput("");
      streamChat(updated);
    },
    [input, isLoading, messages, streamChat]
  );

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest("a");
    if (anchor?.getAttribute("href")?.startsWith("#")) {
      e.preventDefault();
      const id = anchor.getAttribute("href")!.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Blossom Floating button */}
      <motion.div
        className="fixed bottom-8 right-8 z-[100]"
        initial={{ scale: 0, scaleY: 0.5 }}
        animate={{ scale: 1, scaleY: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full shadow-glow-primary flex items-center justify-center relative overflow-hidden backdrop-blur-md border-2 border-white/80"
          style={{ background: "var(--grad-fire)" }}
          aria-label="Open chat"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="absolute inset-0 rounded-full animate-pulse bg-white/20" />
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <img src={ginnieMascot} alt="Ginnie" className="w-10 h-10 object-contain" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-full right-0 mb-4 whitespace-nowrap glass rounded-2xl px-4 py-2 text-[12px] font-black text-foreground shadow-card pointer-events-none border border-white"
          >
            Hi! I'm Ginnie! 🐾
            <div className="absolute top-full right-6 w-3 h-3 bg-white rotate-45 -translate-y-1.5 border-r border-b border-white/20" />
          </motion.div>
        )}
      </motion.div>

      {/* Blossom Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed bottom-28 right-8 z-[100] w-[380px] max-w-[calc(100vw-2rem)] glass rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-white/60"
            style={{ maxHeight: "min(600px, calc(100vh - 10rem))" }}
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center gap-4 relative overflow-hidden" style={{ background: "var(--grad-fire)" }}>
              <div className="absolute inset-0 shimmer opacity-20" />
              <motion.div
                animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner"
              >
                <img src={ginnieMascot} alt="Ginnie" className="w-10 h-10 object-contain" />
              </motion.div>
              <div className="relative">
                <h3 className="font-black text-white text-[16px] tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Ginnie AI</h3>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Your guide to Tidbit Tails 🐾</p>
              </div>
              <div className="ml-auto relative flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                <span className="text-white/90 text-[9px] font-black uppercase">Active</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white/40" onClick={handleClick}>
              {messages.length === 0 && (
                <div className="space-y-4 py-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-foreground/70 text-center font-bold px-4"
                  >
                    Woof! I'm Ginnie! 🐾 <br /> Let me help you explore Tidbit Tails!
                  </motion.div>
                  <div className="grid grid-cols-1 gap-2">
                    {QUICK_ACTIONS.map((qa, i) => (
                      <motion.button
                        key={qa.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        onClick={() => handleSend(qa.message)}
                        className="text-[13px] text-left px-5 py-3 rounded-2xl glass hover:bg-white transition-all duration-300 text-foreground font-black border border-white/40 hover:shadow-md hover:-translate-y-0.5"
                      >
                        {qa.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden mt-1 border border-white" style={{ background: "var(--grad-honey)" }}><img src={ginnieMascot} alt="Ginnie" className="w-7 h-7 object-contain" /></div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-[24px] px-5 py-3 text-[14px] font-medium shadow-sm transition-all ${msg.role === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "glass text-foreground rounded-bl-none border border-white/60"
                      }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-primary prose-a:text-primary prose-a:font-black">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden border border-white" style={{ background: "var(--grad-honey)" }}><img src={ginnieMascot} alt="Ginnie" className="w-7 h-7 object-contain" /></div>
                  <div className="glass rounded-[24px] rounded-bl-none px-5 py-4 flex items-center gap-2 border border-white/60">
                    {[0, 0.2, 0.4].map((d) => (
                      <motion.div
                        key={d}
                        className="w-2.5 h-2.5 rounded-full bg-primary/40"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: d }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white/60 backdrop-blur-xl border-t border-white/40">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your companion..."
                  className="flex-1 text-[14px] glass rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/60 font-black transition-all border border-white/60"
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 shadow-glow-primary border-2 border-white/40"
                  style={{ background: "var(--grad-fire)" }}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </motion.button>
              </form>
              <div className="flex items-center justify-center gap-2 mt-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                <Sparkles className="w-3 h-3" />
                Ginnie AI · Tidbit Tails
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
