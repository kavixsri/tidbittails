import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Phone, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const animalTypes = ["Dog", "Cat", "Bird", "Cow", "Monkey", "Other"];
const urgencyLevels = [
  { value: "low", label: "Low - Not in immediate danger" },
  { value: "medium", label: "Medium - Needs attention soon" },
  { value: "high", label: "High - Injured or in distress" },
  { value: "critical", label: "Critical - Life threatening" },
];

export const EmergencySection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reporter_name: "",
    reporter_phone: "",
    reporter_email: "",
    animal_type: "",
    description: "",
    location: "",
    urgency: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("emergencies").insert([formData]);

      if (error) throw error;

      toast({
        title: "Emergency Reported! 🚨",
        description: "Our rescue team has been notified. We'll contact you shortly.",
      });

      setFormData({
        reporter_name: "",
        reporter_phone: "",
        reporter_email: "",
        animal_type: "",
        description: "",
        location: "",
        urgency: "medium",
      });
    } catch (error) {
      console.error("Error submitting emergency:", error);
      toast({
        title: "Error",
        description: "Failed to submit emergency. Please call our helpline.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="emergency" className="py-20 bg-destructive/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-destructive/10 text-destructive rounded-full text-sm font-medium mb-4">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            Emergency Help
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Report an Animal Emergency
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Found an injured or distressed animal? Report it immediately and our network 
            will dispatch the nearest rescue team.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Emergency Hotline Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full gradient-warm text-primary-foreground">
              <CardContent className="p-8 flex flex-col justify-center h-full">
                <Phone className="w-16 h-16 mb-6 opacity-90" />
                <h3 className="text-2xl font-heading font-bold mb-4">
                  24/7 Emergency Helpline
                </h3>
                <p className="text-primary-foreground/80 mb-6">
                  For immediate assistance, call our emergency helpline. Our team is available 
                  round the clock to help animals in distress.
                </p>
                <a
                  href="tel:+911234567890"
                  className="text-4xl font-heading font-bold hover:opacity-80 transition-opacity"
                >
                  +91-123-456-7890
                </a>
                <p className="text-sm text-primary-foreground/60 mt-4">
                  Calls are free and monitored 24/7
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Emergency Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Submit Emergency Report</CardTitle>
                <CardDescription>
                  Fill out this form and our team will respond immediately.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.reporter_name}
                        onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.reporter_phone}
                        onChange={(e) => setFormData({ ...formData, reporter_phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="animal">Animal Type *</Label>
                      <Select
                        value={formData.animal_type}
                        onValueChange={(value) => setFormData({ ...formData, animal_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select animal type" />
                        </SelectTrigger>
                        <SelectContent>
                          {animalTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency Level *</Label>
                      <Select
                        value={formData.urgency}
                        onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          {urgencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Enter detailed location (landmark, street, area)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the situation - condition of the animal, visible injuries, etc."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="destructive"
                    className="w-full"
                    disabled={isSubmitting || !formData.animal_type}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Emergency Report
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
