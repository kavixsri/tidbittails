import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Phone, Globe, CheckCircle, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NGO {
  id: string;
  name: string;
  region: string;
  description: string | null;
  address: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  services: string[];
  animals_rescued: number;
  established_year: number | null;
  is_verified: boolean;
}

interface NGODirectorySectionProps {
  ngos: NGO[];
  isLoading: boolean;
}

const regions = ["All Regions", "North Delhi", "South Delhi", "East Delhi", "West Delhi"];

export const NGODirectorySection = ({ ngos, isLoading }: NGODirectorySectionProps) => {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");

  const filteredNGOs = ngos.filter((ngo) => {
    const matchesSearch = ngo.name.toLowerCase().includes(search.toLowerCase()) ||
      ngo.description?.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = selectedRegion === "All Regions" || ngo.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <section id="ngos" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Partner Organizations
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Our NGO Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            16 dedicated organizations working together to create a safer Delhi for our furry friends.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search NGOs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {regions.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region)}
              >
                {region === "All Regions" && <Filter className="w-4 h-4 mr-1" />}
                {region.replace(" Delhi", "")}
              </Button>
            ))}
          </div>
        </div>

        {/* NGO Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
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
            filteredNGOs.map((ngo, index) => (
              <motion.div
                key={ngo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-soft transition-all hover:-translate-y-1">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-heading leading-tight">
                        {ngo.name}
                      </CardTitle>
                      {ngo.is_verified && (
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{ngo.region}</Badge>
                      {ngo.established_year && (
                        <span className="text-xs text-muted-foreground">
                          Est. {ngo.established_year}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ngo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ngo.description}
                      </p>
                    )}
                    
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{ngo.address}</span>
                    </div>

                    {ngo.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${ngo.phone}`} className="text-primary hover:underline">
                          {ngo.phone}
                        </a>
                      </div>
                    )}

                    {ngo.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={ngo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 pt-2">
                      {ngo.services.slice(0, 3).map((service, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {ngo.services.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{ngo.services.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-sm">
                        <span className="font-semibold text-primary">{ngo.animals_rescued.toLocaleString()}</span>
                        <span className="text-muted-foreground"> animals rescued</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {filteredNGOs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No NGOs found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};
