import { motion } from "framer-motion";
import { MapPin, Phone, Users, Heart, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DelhiMap } from "@/components/DelhiMap";

interface RegionalNode {
  id: string;
  name: string;
  region: string;
  address: string;
  phone: string | null;
  email: string | null;
  status: string;
  animals_under_care: number;
  volunteers_count: number;
  facilities: unknown;
  latitude: number | null;
  longitude: number | null;
}

interface Ngo {
  id: string;
  name: string;
  region: string;
  address: string;
}

interface NetworkNodesSectionProps {
  nodes: RegionalNode[];
  ngos: Ngo[];
  isLoading: boolean;
}

// Helper to parse facilities from JSON
const parseFacilities = (facilities: unknown): string[] => {
  if (Array.isArray(facilities)) {
    return facilities.filter((f): f is string => typeof f === "string");
  }
  if (typeof facilities === "string") {
    try {
      const parsed = JSON.parse(facilities);
      if (Array.isArray(parsed)) {
        return parsed.filter((f): f is string => typeof f === "string");
      }
    } catch {
      return [];
    }
  }
  return [];
};

const statusColors: Record<string, string> = {
  active: "bg-green-500",
  expanding: "bg-amber-500",
  planned: "bg-blue-500",
};

export const NetworkNodesSection = ({ nodes, ngos, isLoading }: NetworkNodesSectionProps) => {
  return (
    <section id="nodes" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
            Our Network
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Regional Wellness Nodes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Four strategically located centers across Delhi providing comprehensive animal welfare services, 
            emergency care, and community support.
          </p>
        </motion.div>

        {/* Delhi Map */}
        <div className="mb-12">
          {nodes.length > 0 ? (
            <DelhiMap
              nodes={nodes.filter((n) => n.latitude && n.longitude).map((n) => ({
                ...n,
                latitude: Number(n.latitude),
                longitude: Number(n.longitude),
                animals_under_care: n.animals_under_care ?? 0,
                volunteers_count: n.volunteers_count ?? 0,
              }))}
              ngos={ngos}
            />
          ) : (
            <div className="h-[480px] bg-muted rounded-2xl animate-pulse" />
          )}
        </div>

        {/* Node Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-muted rounded w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-soft transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-heading">{node.name}</CardTitle>
                      <div className={`w-3 h-3 rounded-full ${statusColors[node.status]}`} />
                    </div>
                    <Badge variant="secondary" className="w-fit">{node.region}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{node.address}</span>
                    </div>
                    
                    {node.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{node.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-primary" />
                        <span className="font-medium">{node.animals_under_care}</span>
                        <span className="text-muted-foreground">animals</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-secondary" />
                        <span className="font-medium">{node.volunteers_count}</span>
                        <span className="text-muted-foreground">volunteers</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {parseFacilities(node.facilities).slice(0, 3).map((facility, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
