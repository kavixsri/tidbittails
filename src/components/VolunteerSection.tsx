import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Users, Clock, Award, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const regions = ["North Delhi", "South Delhi", "East Delhi", "West Delhi", "Any Region"];
const skillOptions = [
  "Animal Handling",
  "First Aid",
  "Driving",
  "Photography",
  "Social Media",
  "Event Management",
  "Fundraising",
  "Veterinary",
];

const benefits = [
  {
    icon: Heart,
    title: "Make a Difference",
    description: "Directly impact the lives of animals in need",
  },
  {
    icon: Users,
    title: "Join a Community",
    description: "Connect with like-minded animal lovers",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Volunteer on your own schedule",
  },
  {
    icon: Award,
    title: "Gain Experience",
    description: "Learn valuable skills and get certified",
  },
];

export const VolunteerSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_region: "",
    availability: "",
    experience: "",
    motivation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("volunteers").insert([{
        ...formData,
        skills: selectedSkills,
      }]);

      if (error) throw error;

      toast({
        title: "Application Submitted! 🎉",
        description: "Thank you for wanting to help! We'll contact you within 48 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        preferred_region: "",
        availability: "",
        experience: "",
        motivation: "",
      });
      setSelectedSkills([]);
    } catch (error) {
      console.error("Error submitting:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <section id="volunteer" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
            <Heart className="w-4 h-4 inline mr-1" />
            Join Our Team
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Become a Volunteer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Be a part of Delhi's largest animal welfare network. No experience needed - 
            just a heart full of compassion.
          </p>
        </motion.div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center h-full hover:shadow-soft transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-full gradient-cool mx-auto mb-4 flex items-center justify-center">
                    <benefit.icon className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Application</CardTitle>
              <CardDescription>
                Fill out this form and we'll get back to you within 48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vol-name">Full Name *</Label>
                    <Input
                      id="vol-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vol-email">Email *</Label>
                    <Input
                      id="vol-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vol-phone">Phone Number *</Label>
                    <Input
                      id="vol-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vol-region">Preferred Region</Label>
                    <Select
                      value={formData.preferred_region}
                      onValueChange={(value) => setFormData({ ...formData, preferred_region: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Skills (select all that apply)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {skillOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                        />
                        <label
                          htmlFor={skill}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vol-availability">Availability</Label>
                  <Input
                    id="vol-availability"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    placeholder="e.g., Weekends, 2-3 hours on Saturdays"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vol-experience">Previous Experience (if any)</Label>
                  <Textarea
                    id="vol-experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="Tell us about any relevant experience with animals or volunteering"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vol-motivation">Why do you want to volunteer? *</Label>
                  <Textarea
                    id="vol-motivation"
                    required
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    placeholder="Share what motivates you to help animals"
                    rows={3}
                  />
                </div>

                <Button type="submit" variant="secondary" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
