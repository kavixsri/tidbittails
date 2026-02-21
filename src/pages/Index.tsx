import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { NetworkNodesSection } from "@/components/NetworkNodesSection";
import { NGODirectorySection } from "@/components/NGODirectorySection";
import { EmergencySection } from "@/components/EmergencySection";
import { EventsSection } from "@/components/EventsSection";
import { VolunteerSection } from "@/components/VolunteerSection";
import { PupCafeSection } from "@/components/PupCafeSection";
import { Footer } from "@/components/Footer";
import { AIChatbot } from "@/components/AIChatbot";
import { CursorTrail } from "@/components/CursorTrail";

const Index = () => {
  const { data: stats } = useQuery({
    queryKey: ["network-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("network_stats").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: nodes = [], isLoading: nodesLoading } = useQuery({
    queryKey: ["regional-nodes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("regional_nodes").select("*").order("region");
      if (error) throw error;
      return data;
    },
  });

  const { data: ngos = [], isLoading: ngosLoading } = useQuery({
    queryKey: ["ngos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ngos")
        .select("*")
        .order("is_verified", { ascending: false })
        .order("animals_rescued", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("date", new Date().toISOString().split("T")[0])
        .order("is_featured", { ascending: false })
        .order("date");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background" style={{ cursor: "none" }}>
      <CursorTrail />
      <Header />
      <main>
        <HeroSection stats={stats} />
        <NetworkNodesSection nodes={nodes} ngos={ngos} isLoading={nodesLoading} />
        <NGODirectorySection ngos={ngos} isLoading={ngosLoading} />
        <EmergencySection />
        <EventsSection events={events} isLoading={eventsLoading} />
        <VolunteerSection />
        <PupCafeSection ngos={ngos} isLoading={ngosLoading} />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
