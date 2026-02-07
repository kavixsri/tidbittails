import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const QUICK_ACTIONS = [
  { label: "🐾 About Tidbit Tails", message: "What is Tidbit Tails?" },
  { label: "🚨 Report Emergency", message: "I found an injured animal and need help" },
  { label: "🤝 Volunteer", message: "How can I volunteer?" },
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
        upsert(errData.error || "Sorry, something went wrong. Please try again.");
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
      upsert("Sorry, I couldn't connect. Please try again later.");
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

  // Handle navigation links in markdown
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
      {/* Floating button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-warm gradient-warm p-0"
          aria-label="Open chat"
        >
          {isOpen ? <X className="w-6 h-6 text-primary-foreground" /> : <MessageCircle className="w-6 h-6 text-primary-foreground" />}
        </Button>
      </motion.div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden"
            style={{ maxHeight: "min(520px, calc(100vh - 8rem))" }}
          >
            {/* Header */}
            <div className="gradient-warm px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-primary-foreground text-sm">Tidbit Tails AI</h3>
                <p className="text-primary-foreground/70 text-xs">Ask me anything 🐾</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3" onClick={handleClick}>
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Hi! I'm your Tidbit Tails assistant. How can I help?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_ACTIONS.map((qa) => (
                      <button
                        key={qa.label}
                        onClick={() => handleSend(qa.message)}
                        className="text-xs text-left px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full gradient-warm flex-shrink-0 flex items-center justify-center mt-1">
                      <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none [&_p]:m-0 [&_ul]:mt-1 [&_ol]:mt-1 [&_a]:text-primary [&_a]:underline">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full gradient-warm flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-xl px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 text-sm bg-muted rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="rounded-lg flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
