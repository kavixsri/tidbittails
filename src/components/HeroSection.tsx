import { motion } from "framer-motion";
import { Heart, Users, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-dog.jpg";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
}

const StatCard = ({ icon, value, label, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex flex-col items-center p-4 bg-card/80 backdrop-blur-sm rounded-xl shadow-card"
  >
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
      {icon}
    </div>
    <span className="text-2xl md:text-3xl font-heading font-bold text-foreground">{value}</span>
    <span className="text-sm text-muted-foreground">{label}</span>
  </motion.div>
);

interface HeroSectionProps {
  stats: {
    total_animals_rescued: number;
    total_volunteers: number;
    total_ngos: number;
    total_nodes: number;
  } | null;
}

export const HeroSection = ({ stats }: HeroSectionProps) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
      
      {/* Floating shapes */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-secondary/20 blur-xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              🐾 Delhi's Unified Animal Welfare Network
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground mb-6 leading-tight">
              Every Stray Deserves{" "}
              <span className="text-gradient">Love & Care</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              TIDBIT TAILS connects Delhi's animal welfare organizations, creating a seamless network 
              of rescue, treatment, and rehabilitation services for our furry friends.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button variant="hero" size="lg" asChild>
                <a href="#emergency" className="gap-2">
                  <Phone className="w-5 h-5" />
                  Report Emergency
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#volunteer">Become a Volunteer</a>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              icon={<Heart className="w-6 h-6 text-primary" />}
              value={stats ? `${(stats.total_animals_rescued / 1000).toFixed(1)}K+` : "20K+"}
              label="Animals Rescued"
              delay={0.2}
            />
            <StatCard
              icon={<Users className="w-6 h-6 text-primary" />}
              value={stats?.total_volunteers?.toString() || "716"}
              label="Volunteers"
              delay={0.3}
            />
            <StatCard
              icon={<Heart className="w-6 h-6 text-secondary" />}
              value={stats?.total_ngos?.toString() || "16"}
              label="Partner NGOs"
              delay={0.4}
            />
            <StatCard
              icon={<MapPin className="w-6 h-6 text-secondary" />}
              value={stats?.total_nodes?.toString() || "4"}
              label="Regional Nodes"
              delay={0.5}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
