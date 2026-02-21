import { useState } from "react";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { Heart, Users, Clock, Award, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const regions = ["North Delhi", "South Delhi", "East Delhi", "West Delhi", "Any Region"];
const skillOptions = [
  { label: "Animal Handling", emoji: "🐾" },
  { label: "First Aid", emoji: "🩺" },
  { label: "Driving", emoji: "🚗" },
  { label: "Photography", emoji: "📸" },
  { label: "Social Media", emoji: "📱" },
  { label: "Event Management", emoji: "🎪" },
  { label: "Fundraising", emoji: "💝" },
  { label: "Veterinary", emoji: "💊" },
];

const benefits = [
  { icon: Heart, label: "Make a Difference", sub: "Directly save animal lives", color: "#f72585", bg: "var(--grad-candy)" },
  { icon: Users, label: "Join a Community", sub: "Connect with fellow animal lovers", color: "#118ab2", bg: "var(--grad-ocean)" },
  { icon: Clock, label: "Flexible Hours", sub: "Serve on your own schedule", color: "#ff7b00", bg: "var(--grad-honey)" },
  { icon: Award, label: "Get Certified", sub: "Build skills & earn recognition", color: "#9b5de5", bg: "var(--grad-candy)" },
];

const empty = { name: "", email: "", phone: "", preferred_region: "", availability: "", experience: "", motivation: "" };
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } } };

export const VolunteerSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [formData, setFormData] = useState(empty);
  const set = (k: string, v: string) => setFormData((f) => ({ ...f, [k]: v }));

  const toggleSkill = (skill: string) =>
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("volunteers").insert([{ ...formData, skills: selectedSkills }]);
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Application Submitted! 🎉", description: "Thank you! We'll contact you within 48 hours." });
    } catch {
      toast({ title: "Submission Failed", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="volunteer" className="py-24 relative overflow-hidden">
      {/* Section background */}
      <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(160deg, hsl(162 50% 96%) 0%, hsl(258 40% 97%) 100%)" }} />
      <div className="absolute top-12 right-4 w-72 h-72 blob float opacity-[0.08]" style={{ background: "var(--grad-candy)" }} />
      <div className="absolute bottom-12 left-4 w-56 h-56 blob-3 float-3 opacity-[0.06]" style={{ background: "var(--grad-ocean)" }} />

      <div className="container mx-auto px-5 md:px-8 relative z-10">
        {/* Section header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] mb-4" style={{ color: "#9b5de5" }}>
            <span className="w-8 h-[2px] rounded-full" style={{ background: "var(--grad-candy)" }} />
            Join Our Team
            <span className="w-8 h-[2px] rounded-full" style={{ background: "var(--grad-candy)" }} />
          </span>
          <h2 className="text-[clamp(34px,5vw,58px)] font-black leading-none text-foreground" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Become a<br />
            <span className="text-gradient-violet">Volunteer</span> 🤍
          </h2>
          <p className="mt-4 text-muted-foreground text-[15px] max-w-lg leading-relaxed font-medium">
            No experience needed — just compassion and a willingness to show up. Join Delhi's largest animal welfare network today.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left: benefits + testimonial */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {benefits.map((b, i) => (
              <motion.div
                key={b.label}
                variants={item}
                className={`glass-card rounded-[20px] p-5 flex items-center gap-4 relative overflow-hidden hover:-translate-y-0.5 transition-transform ${i % 2 === 1 ? "tilt-card-right" : "tilt-card"}`}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md" style={{ background: b.bg }}>
                  <b.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-black text-[14px] text-foreground" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{b.label}</h4>
                  <p className="text-muted-foreground text-[12px] font-medium mt-0.5">{b.sub}</p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-10" style={{ background: b.bg }} />
              </motion.div>
            ))}

            {/* Quick stat strip */}
            <motion.div variants={item} className="rounded-[20px] p-5 relative overflow-hidden" style={{ background: "var(--grad-dusk)" }}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-4 text-6xl select-none">🏆</div>
              </div>
              <p className="text-white/70 text-[12px] font-bold uppercase tracking-wider mb-1">Community Milestone</p>
              <p className="text-white font-black text-[28px] leading-none" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>716+</p>
              <p className="text-white/60 text-[13px] font-medium">active volunteers across Delhi</p>
            </motion.div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-3xl p-10 text-center"
              >
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: "#06d6a0" }} />
                <h3 className="font-black text-2xl mb-2 text-foreground" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Welcome to the team! 🎉</h3>
                <p className="text-muted-foreground font-medium">We'll review your application and get back to you within 48 hours. Get ready to make a difference!</p>
              </motion.div>
            ) : (
              <div className="glass-card rounded-3xl p-7 shadow-card">
                <h3 className="font-black text-[18px] mb-6 text-foreground" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Volunteer Application
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="v-name" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Full Name *</Label>
                      <Input id="v-name" required value={formData.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className="rounded-xl h-11 text-[13px] glass-sm border-white/30" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="v-email" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email *</Label>
                      <Input id="v-email" type="email" required value={formData.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" className="rounded-xl h-11 text-[13px] glass-sm border-white/30" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="v-phone" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Phone *</Label>
                      <Input id="v-phone" type="tel" required value={formData.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" className="rounded-xl h-11 text-[13px] glass-sm border-white/30" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Preferred Region</Label>
                      <Select value={formData.preferred_region} onValueChange={(v) => set("preferred_region", v)}>
                        <SelectTrigger className="rounded-xl h-11 text-[13px] glass-sm border-white/30">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Skills picker */}
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Skills (select all that apply)</Label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((s) => {
                        const active = selectedSkills.includes(s.label);
                        return (
                          <button
                            key={s.label}
                            type="button"
                            onClick={() => toggleSkill(s.label)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-200"
                            style={active
                              ? { background: "var(--grad-candy)", color: "#fff", boxShadow: "var(--shadow-glow-violet)" }
                              : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
                            }
                          >
                            {s.emoji} {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="v-avail" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Availability</Label>
                    <Input id="v-avail" value={formData.availability} onChange={(e) => set("availability", e.target.value)} placeholder="e.g., Weekends, 2-3 hrs on Saturdays" className="rounded-xl h-11 text-[13px] glass-sm border-white/30" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="v-motiv" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Why you want to volunteer *</Label>
                    <Textarea
                      id="v-motiv"
                      required
                      value={formData.motivation}
                      onChange={(e) => set("motivation", e.target.value)}
                      placeholder="Share what drives you to help animals..."
                      rows={3}
                      className="rounded-xl text-[13px] glass-sm border-white/30 resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-2xl text-white font-black text-[14px] flex items-center justify-center gap-2 disabled:opacity-60 relative overflow-hidden"
                    style={{ background: "var(--grad-dusk)" }}
                  >
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Application</>}
                  </motion.button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
