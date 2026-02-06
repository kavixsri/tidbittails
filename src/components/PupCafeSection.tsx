import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, MapPin, Phone, Clock, ChevronRight, Utensils, Star, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type NGO = Tables<"ngos">;

interface PupCafeSectionProps {
  ngos: NGO[];
  isLoading: boolean;
}

const cafeMenuItems = [
  { name: "Pup-uccino", price: "₹120", desc: "Frothy milk drink for your furry friend", category: "Drinks" },
  { name: "Bark-ista Latte", price: "₹180", desc: "Signature coffee with oat milk", category: "Drinks" },
  { name: "Tail Wagger Smoothie", price: "₹150", desc: "Banana & peanut butter blend", category: "Drinks" },
  { name: "Pawsome Pancakes", price: "₹220", desc: "Fluffy pancakes with honey drizzle", category: "Snacks" },
  { name: "Biscuit Bones", price: "₹90", desc: "Homemade dog-safe biscuits", category: "Pet Treats" },
  { name: "Veggie Paw Bowl", price: "₹250", desc: "Fresh veggies with hummus", category: "Mains" },
];

export const PupCafeSection = ({ ngos, isLoading }: PupCafeSectionProps) => {
  const [selectedCafe, setSelectedCafe] = useState<NGO | null>(null);
  const [activeTab, setActiveTab] = useState<"menu" | "reserve">("menu");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    party_size: "2",
    reservation_date: "",
    reservation_time: "",
    special_requests: "",
  });

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCafe) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("cafe_reservations").insert({
        ngo_id: selectedCafe.id,
        guest_name: form.guest_name.trim(),
        guest_email: form.guest_email.trim(),
        guest_phone: form.guest_phone.trim(),
        party_size: parseInt(form.party_size),
        reservation_date: form.reservation_date,
        reservation_time: form.reservation_time,
        special_requests: form.special_requests.trim() || null,
      });
      if (error) throw error;
      toast.success("Reservation confirmed! 🐾", { description: `See you at ${selectedCafe.name}!` });
      setForm({ guest_name: "", guest_email: "", guest_phone: "", party_size: "2", reservation_date: "", reservation_time: "", special_requests: "" });
      setActiveTab("menu");
    } catch {
      toast.error("Couldn't make reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const regionColors: Record<string, string> = {
    North: "bg-blue-100 text-blue-700 border-blue-200",
    South: "bg-emerald-100 text-emerald-700 border-emerald-200",
    East: "bg-amber-100 text-amber-700 border-amber-200",
    West: "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <section id="pupcafe" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Coffee className="w-4 h-4" />
            <span className="font-medium text-sm">Pup Cafés</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sip, Snack & Snuggle
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visit our partner pup cafés across Delhi — enjoy great food while spending 
            time with adorable rescue pups looking for forever homes.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ngos.map((ngo, i) => (
              <motion.div
                key={ngo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => { setSelectedCafe(ngo); setActiveTab("menu"); }}
                className="group cursor-pointer bg-card rounded-xl border border-border p-6 hover:shadow-warm transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <Badge variant="outline" className={regionColors[ngo.region] || "bg-muted text-muted-foreground"}>
                    {ngo.region}
                  </Badge>
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                  {ngo.name} Café
                </h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {ngo.description || "A cozy pup café where you can meet adorable rescues over coffee."}
                </p>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{ngo.address}</span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Menu & Reserve</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedCafe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedCafe(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl"
              >
                {/* Header */}
                <div className="gradient-warm p-6 rounded-t-2xl relative">
                  <button
                    onClick={() => setSelectedCafe(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
                  >
                    <X className="w-4 h-4 text-primary-foreground" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                      <Coffee className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-primary-foreground">
                        {selectedCafe.name} Café
                      </h3>
                      <div className="flex items-center gap-3 text-primary-foreground/80 text-sm mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedCafe.address}</span>
                        {selectedCafe.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {selectedCafe.phone}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-primary-foreground/80 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Open daily · 10:00 AM – 9:00 PM</span>
                    <Star className="w-4 h-4 ml-2 fill-current" />
                    <span>4.5 rating</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border">
                  <button
                    onClick={() => setActiveTab("menu")}
                    className={`flex-1 py-3 text-center font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                      activeTab === "menu" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Utensils className="w-4 h-4" /> Menu
                  </button>
                  <button
                    onClick={() => setActiveTab("reserve")}
                    className={`flex-1 py-3 text-center font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                      activeTab === "reserve" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Users className="w-4 h-4" /> Reserve a Table
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {activeTab === "menu" ? (
                    <div className="space-y-3">
                      {["Drinks", "Snacks", "Pet Treats", "Mains"].map((cat) => {
                        const items = cafeMenuItems.filter((m) => m.category === cat);
                        if (!items.length) return null;
                        return (
                          <div key={cat}>
                            <h4 className="font-heading font-semibold text-foreground mb-2">{cat}</h4>
                            {items.map((item) => (
                              <div key={item.name} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                                <div>
                                  <p className="font-medium text-foreground text-sm">{item.name}</p>
                                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                                </div>
                                <span className="font-semibold text-primary text-sm whitespace-nowrap ml-4">{item.price}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                      <Button onClick={() => setActiveTab("reserve")} className="w-full mt-4 gradient-warm text-primary-foreground">
                        Reserve a Table
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleReserve} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">Name *</label>
                          <Input required maxLength={100} value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} placeholder="Your name" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">Phone *</label>
                          <Input required maxLength={15} value={form.guest_phone} onChange={(e) => setForm({ ...form, guest_phone: e.target.value })} placeholder="+91-XXXXXXXXXX" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                        <Input required type="email" maxLength={255} value={form.guest_email} onChange={(e) => setForm({ ...form, guest_email: e.target.value })} placeholder="you@example.com" />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">Date *</label>
                          <Input required type="date" min={new Date().toISOString().split("T")[0]} value={form.reservation_date} onChange={(e) => setForm({ ...form, reservation_date: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">Time *</label>
                          <Input required type="time" value={form.reservation_time} onChange={(e) => setForm({ ...form, reservation_time: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">Guests</label>
                          <Input required type="number" min={1} max={10} value={form.party_size} onChange={(e) => setForm({ ...form, party_size: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Special Requests</label>
                        <Textarea maxLength={500} value={form.special_requests} onChange={(e) => setForm({ ...form, special_requests: e.target.value })} placeholder="Any dietary needs or preferences?" rows={3} />
                      </div>
                      <Button type="submit" disabled={isSubmitting} className="w-full gradient-warm text-primary-foreground">
                        {isSubmitting ? "Booking..." : "Confirm Reservation 🐾"}
                      </Button>
                    </form>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
