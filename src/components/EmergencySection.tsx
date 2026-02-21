import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Send, Loader2, Siren, MapPin, AlertOctagon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const animalTypes = ["Dog 🐕", "Cat 🐈", "Bird 🐦", "Cow 🐄", "Monkey 🐒", "Other 🐾"];
const urgencyLevels = [
  { value: "low", label: "🟢 Low — not in immediate danger", color: "#06d6a0" },
  { value: "medium", label: "🟡 Medium — needs attention soon", color: "#d97706" },
  { value: "high", label: "🟠 High — injured or in distress", color: "#ea580c" },
  { value: "critical", label: "🔴 Critical — life threatening", color: "#e11d48" },
];

const empty = {
  reporter_name: "", reporter_phone: "", reporter_email: "",
  animal_type: "", description: "", location: "", urgency: "medium",
};

const inputClass =
  "h-11 rounded-xl text-[13px] font-medium bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400/20";

export const EmergencySection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(empty);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string, v: string) => setFormData((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("emergencies").insert([formData]);
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Emergency Reported! 🚨", description: "Rescue team notified. We'll call you shortly." });
      setTimeout(() => { setSubmitted(false); setFormData(empty); }, 4500);
    } catch {
      toast({ title: "Error", description: "Failed to submit. Please call our helpline directly.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="emergency" className="py-24 relative overflow-hidden">
      {/* ── Warm light background for this section ── */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 10% 30%, hsl(12 100% 95%) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 90% 70%, hsl(4 90% 95%) 0%, transparent 50%), " +
            "hsl(20 60% 97%)",
        }}
      />
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: "hsl(12 100% 80%)" }} />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "hsl(258 78% 80%)" }} />

      <div className="container mx-auto px-5 md:px-8 relative z-10">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] mb-4 text-red-500">
            <Siren className="w-3.5 h-3.5" />
            Emergency Help
          </span>
          <h2
            className="text-[clamp(34px,5vw,58px)] font-black leading-none text-foreground"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Spotted an<br />
            animal in{" "}
            <span style={{ WebkitTextStroke: "2.5px #e11d48", color: "transparent" }}>
              crisis?
            </span>{" "}
            🚨
          </h2>
          <p className="mt-4 text-muted-foreground text-[15px] max-w-lg leading-relaxed font-medium">
            Report it right here. Our network dispatches the nearest rescue team — day or night, no animal left behind.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 max-w-5xl">
          {/* ── Left: Hotline + Steps ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {/* Hotline card */}
            <div
              className="rounded-3xl p-7 relative overflow-hidden text-white shadow-lg"
              style={{ background: "var(--grad-fire)" }}
            >
              <div className="absolute top-0 right-0 text-[120px] opacity-10 leading-none select-none">🚨</div>
              <Phone className="w-10 h-10 text-white mb-4 drop-shadow" />
              <h3
                className="text-white font-black text-xl mb-2"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                24/7 Helpline
              </h3>
              <p className="text-white/80 text-[13px] leading-relaxed mb-5 font-medium">
                Call immediately for life-threatening situations. Our team is always on standby.
              </p>
              <a
                href="tel:+911234567890"
                className="block text-white font-black text-[26px] hover:scale-105 transition-transform origin-left"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.02em" }}
              >
                +91-123-456-7890
              </a>
              <p className="text-white/60 text-[11px] font-bold uppercase tracking-wider mt-2">
                Free · Available 24/7 · Rapid Response
              </p>
            </div>

            {/* What happens next */}
            <div className="glass-card rounded-3xl p-6 shadow-card">
              <h4
                className="text-foreground font-black mb-4 text-[14px]"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                What happens next?
              </h4>
              {[
                { num: "1", text: "Your report reaches our team instantly" },
                { num: "2", text: "Nearest rescue volunteer is dispatched" },
                { num: "3", text: "You receive a status update on your phone" },
              ].map((step) => (
                <div key={step.num} className="flex items-center gap-3 mb-3 last:mb-0">
                  <span
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-black text-[12px] text-white shadow-sm"
                    style={{ background: "var(--grad-fire)" }}
                  >
                    {step.num}
                  </span>
                  <p className="text-muted-foreground text-[13px] font-medium">{step.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-3xl p-7 shadow-card">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <span className="text-6xl mb-4 block">✅</span>
                    <h3
                      className="text-foreground font-black text-2xl mb-2"
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
                      Report Received!
                    </h3>
                    <p className="text-muted-foreground font-medium text-[14px]">
                      Our rescue team has been notified. You'll receive a call shortly.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                    <h3
                      className="text-foreground font-black text-[17px] mb-5"
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
                      <AlertOctagon className="inline w-5 h-5 mr-2 text-red-500 -mt-0.5" />
                      Submit Emergency Report
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="sos-name" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Your Name *
                        </Label>
                        <Input
                          id="sos-name"
                          required
                          value={formData.reporter_name}
                          onChange={(e) => set("reporter_name", e.target.value)}
                          placeholder="Full name"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="sos-phone" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Phone Number *
                        </Label>
                        <Input
                          id="sos-phone"
                          type="tel"
                          required
                          value={formData.reporter_phone}
                          onChange={(e) => set("reporter_phone", e.target.value)}
                          placeholder="+91 98765 43210"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Animal Type *
                        </Label>
                        <Select value={formData.animal_type} onValueChange={(v) => set("animal_type", v)}>
                          <SelectTrigger className={`${inputClass} w-full`}>
                            <SelectValue placeholder="Select animal" />
                          </SelectTrigger>
                          <SelectContent>
                            {animalTypes.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Urgency *
                        </Label>
                        <Select value={formData.urgency} onValueChange={(v) => set("urgency", v)}>
                          <SelectTrigger className={`${inputClass} w-full`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {urgencyLevels.map((u) => (
                              <SelectItem key={u.value} value={u.value}>
                                <span style={{ color: u.color }}>{u.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sos-loc" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        <MapPin className="inline w-3 h-3 mr-1 -mt-0.5" />
                        Location *
                      </Label>
                      <Input
                        id="sos-loc"
                        required
                        value={formData.location}
                        onChange={(e) => set("location", e.target.value)}
                        placeholder="Landmark, street, area — more detail = faster help"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sos-desc" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Describe the situation *
                      </Label>
                      <Textarea
                        id="sos-desc"
                        required
                        value={formData.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="Describe the animal's condition, visible injuries, whether it's mobile…"
                        rows={3}
                        className="rounded-xl text-[13px] font-medium bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400/20 resize-none"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !formData.animal_type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 rounded-2xl text-white font-black text-[14px] flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                      style={{ background: "linear-gradient(135deg, #ff4d00 0%, #e11d48 60%, #9b5de5 100%)" }}
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending alert…</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Emergency Alert 🚨</>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
