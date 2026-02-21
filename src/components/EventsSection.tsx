import { useState } from "react";
import type { Variants } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Users, Loader2, X, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  max_attendees: number | null;
  current_attendees: number;
  is_featured: boolean;
  registration_required: boolean;
}

interface EventsSectionProps { events: Event[]; isLoading: boolean; }

const typeConfig: Record<string, { color: string; emoji: string }> = {
  adoption: { color: "#f72585", emoji: "💝" },
  vaccination: { color: "#118ab2", emoji: "💉" },
  fundraiser: { color: "#ff7b00", emoji: "💰" },
  awareness: { color: "#06d6a0", emoji: "🌿" },
  workshop: { color: "#9b5de5", emoji: "🔧" },
  other: { color: "#6c757d", emoji: "📌" },
};

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const card: Variants = { hidden: { opacity: 0, scale: 0.92, y: 20 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } } };

export const EventsSection = ({ events, isLoading }: EventsSectionProps) => {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [reg, setReg] = useState({ name: "", email: "", phone: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setIsRegistering(true);
    try {
      const { error } = await supabase.from("event_registrations").insert([{ event_id: selectedEvent.id, ...reg }]);
      if (error) throw error;
      toast({ title: "You're in! 🎉", description: `Registered for ${selectedEvent.title}. Check your email!` });
      setSelectedEvent(null);
      setReg({ name: "", email: "", phone: "" });
    } catch {
      toast({ title: "Oops!", description: "Registration failed. Try again.", variant: "destructive" });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <section id="events" className="py-24 relative overflow-hidden stripe-bg">
      {/* Decorative blobs */}
      <div className="absolute top-12 right-8 w-64 h-64 blob float opacity-[0.06]" style={{ background: "var(--grad-honey)" }} />
      <div className="absolute bottom-12 left-4 w-44 h-44 blob-2 float-3 opacity-[0.05]" style={{ background: "var(--grad-fire)" }} />

      <div className="container mx-auto px-5 md:px-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] mb-4" style={{ color: "#ff7b00" }}>
            <span className="w-8 h-[2px] rounded-full" style={{ background: "var(--grad-honey)" }} />
            What's Happening
            <span className="w-8 h-[2px] rounded-full" style={{ background: "var(--grad-honey)" }} />
          </span>
          <h2 className="text-[clamp(34px,5vw,58px)] font-black leading-none text-foreground" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Join our<br />
            <span className="text-gradient-honey">Events</span> 🎉
          </h2>
          <p className="mt-4 text-muted-foreground text-[15px] max-w-lg leading-relaxed font-medium">
            From adoption drives to awareness camps — find events near you and make a real difference in an animal's life.
          </p>
        </motion.div>

        {/* Events grid */}
        <AnimatePresence>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading
              ? Array(3).fill(0).map((_, i) => (
                <div key={i} className="glass-card rounded-[22px] p-6 animate-pulse h-56">
                  <div className="h-4 bg-muted rounded w-1/3 mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-3 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))
              : events.map((event) => {
                const cfg = typeConfig[event.event_type] || typeConfig.other;
                const full = event.max_attendees ? event.current_attendees >= event.max_attendees : false;
                return (
                  <motion.div key={event.id} variants={card}>
                    <div className={`glass-card rounded-[22px] p-6 h-full flex flex-col relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${event.is_featured ? "" : ""}`}>
                      {/* Left colored strip */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[22px]" style={{ background: cfg.color }} />

                      {/* Featured badge */}
                      {event.is_featured && (
                        <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white" style={{ background: "var(--grad-fire)" }}>
                          ⭐ Featured
                        </span>
                      )}

                      <div className="pl-3">
                        {/* Type chip */}
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold mb-3 px-3 py-1 rounded-full" style={{ background: cfg.color + "18", color: cfg.color }}>
                          {cfg.emoji} {event.event_type}
                        </span>

                        <h3 className="font-black text-[16px] text-foreground mb-3 leading-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                          {event.title}
                        </h3>

                        {event.description && (
                          <p className="text-[12px] text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{event.description}</p>
                        )}

                        <div className="space-y-2 mb-5">
                          <div className="flex items-center gap-2 text-[12px] text-muted-foreground font-medium">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cfg.color }} />
                            {format(new Date(event.date), "EEEE, MMM d, yyyy")}
                          </div>
                          {event.start_time && (
                            <div className="flex items-center gap-2 text-[12px] text-muted-foreground font-medium">
                              <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cfg.color }} />
                              {event.start_time.slice(0, 5)}{event.end_time ? ` – ${event.end_time.slice(0, 5)}` : ""}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-[12px] text-muted-foreground font-medium">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cfg.color }} />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          {event.max_attendees && (
                            <div className="flex items-center gap-2 text-[12px] text-muted-foreground font-medium">
                              <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cfg.color }} />
                              {event.current_attendees}/{event.max_attendees} spots filled
                              {/* Capacity bar */}
                              <span className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <span className="block h-full rounded-full transition-all" style={{ width: `${Math.min(100, (event.current_attendees / event.max_attendees) * 100)}%`, background: cfg.color }} />
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-auto">
                          {event.registration_required ? (
                            <motion.button
                              onClick={() => !full && setSelectedEvent(event)}
                              disabled={full}
                              whileHover={!full ? { scale: 1.03 } : {}}
                              whileTap={!full ? { scale: 0.97 } : {}}
                              className="w-full py-3 rounded-2xl text-[13px] font-black flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                              style={!full ? { background: cfg.color, color: "#fff" } : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                            >
                              {full ? "Fully Booked 😞" : <>Register Now <ArrowRight className="w-3.5 h-3.5" /></>}
                            </motion.button>
                          ) : (
                            <p className="text-center text-[12px] font-bold text-muted-foreground py-2">Walk-in welcome 🚶</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </motion.div>
        </AnimatePresence>

        {events.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <span className="text-5xl block mb-3">📅</span>
            <p className="text-muted-foreground font-bold">No upcoming events right now. Check back soon!</p>
          </div>
        )}
      </div>

      {/* Registration Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="glass-card border-white/40 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Register for {selectedEvent?.title} 🎉
            </DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">
              Fill in your details and we'll save your spot!
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4 pt-2">
            {[
              { id: "re-name", label: "Full Name *", type: "text", key: "name", placeholder: "Your name" },
              { id: "re-email", label: "Email *", type: "email", key: "email", placeholder: "you@email.com" },
              { id: "re-phone", label: "Phone", type: "tel", key: "phone", placeholder: "+91 98765 43210" },
            ].map((f) => (
              <div key={f.id} className="space-y-1.5">
                <Label htmlFor={f.id} className="text-[12px] font-bold">{f.label}</Label>
                <Input
                  id={f.id}
                  type={f.type}
                  required={f.label.includes("*")}
                  value={reg[f.key as keyof typeof reg]}
                  onChange={(e) => setReg({ ...reg, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="glass-sm rounded-xl border-white/30 text-[13px]"
                />
              </div>
            ))}
            <motion.button
              type="submit"
              disabled={isRegistering}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-2xl text-white text-[14px] font-black flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "var(--grad-fire)" }}
            >
              {isRegistering ? <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</> : "Confirm Registration 🎉"}
            </motion.button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
