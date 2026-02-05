import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface EventsSectionProps {
  events: Event[];
  isLoading: boolean;
}

const eventTypeColors: Record<string, string> = {
  adoption: "bg-pink-500",
  vaccination: "bg-blue-500",
  fundraiser: "bg-amber-500",
  awareness: "bg-green-500",
  workshop: "bg-purple-500",
  other: "bg-gray-500",
};

export const EventsSection = ({ events, isLoading }: EventsSectionProps) => {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsRegistering(true);
    try {
      const { error } = await supabase.from("event_registrations").insert([{
        event_id: selectedEvent.id,
        ...registrationData,
      }]);

      if (error) throw error;

      toast({
        title: "Registration Successful! 🎉",
        description: `You're registered for ${selectedEvent.title}. We'll send details to your email.`,
      });

      setSelectedEvent(null);
      setRegistrationData({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Error registering:", error);
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <section id="events" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Calendar className="w-4 h-4 inline mr-1" />
            Upcoming Events
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Join Our Events
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From adoption drives to vaccination camps, find events near you and make a difference.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full hover:shadow-soft transition-all hover:-translate-y-1 ${
                  event.is_featured ? "ring-2 ring-primary" : ""
                }`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${eventTypeColors[event.event_type]}`} />
                        <Badge variant="outline" className="text-xs capitalize">
                          {event.event_type}
                        </Badge>
                      </div>
                      {event.is_featured && (
                        <Badge className="bg-primary">Featured</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg font-heading mt-2">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      
                      {event.start_time && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            {event.start_time.slice(0, 5)}
                            {event.end_time && ` - ${event.end_time.slice(0, 5)}`}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>

                      {event.max_attendees && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>
                            {event.current_attendees} / {event.max_attendees} registered
                          </span>
                        </div>
                      )}
                    </div>

                    {event.registration_required ? (
                      <Button
                        className="w-full"
                        onClick={() => setSelectedEvent(event)}
                        disabled={event.max_attendees ? event.current_attendees >= event.max_attendees : false}
                      >
                        {event.max_attendees && event.current_attendees >= event.max_attendees
                          ? "Fully Booked"
                          : "Register Now"}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full">
                        No Registration Required
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {events.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
          </div>
        )}

        {/* Registration Dialog */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register for {selectedEvent?.title}</DialogTitle>
              <DialogDescription>
                Fill in your details to reserve your spot.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name *</Label>
                <Input
                  id="reg-name"
                  required
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email *</Label>
                <Input
                  id="reg-email"
                  type="email"
                  required
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-phone">Phone Number</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isRegistering}>
                {isRegistering ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
