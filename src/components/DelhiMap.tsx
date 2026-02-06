import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapNode {
  id: string;
  name: string;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  animals_under_care: number;
  volunteers_count: number;
}

interface Ngo {
  id: string;
  name: string;
  region: string;
  address: string;
}

interface DelhiMapProps {
  nodes: MapNode[];
  ngos: Ngo[];
}

const regionColors: Record<string, string> = {
  "North Delhi": "#E85D04",   // warm orange
  "South Delhi": "#2D6A4F",   // deep green
  "East Delhi": "#7B2CBF",    // purple
  "West Delhi": "#0077B6",    // ocean blue
};

const regionColorsTailwind: Record<string, { bg: string; text: string }> = {
  "North Delhi": { bg: "bg-[#E85D04]", text: "text-[#E85D04]" },
  "South Delhi": { bg: "bg-[#2D6A4F]", text: "text-[#2D6A4F]" },
  "East Delhi": { bg: "bg-[#7B2CBF]", text: "text-[#7B2CBF]" },
  "West Delhi": { bg: "bg-[#0077B6]", text: "text-[#0077B6]" },
};

// Approximate NGO coordinates based on known Delhi localities
const ngoCoordinates: Record<string, { lat: number; lng: number }> = {
  "Friendicoes SECA": { lat: 28.5785, lng: 77.2424 },
  "People For Animals Delhi": { lat: 28.5740, lng: 77.2316 },
  "Animal Aid Unlimited Delhi": { lat: 28.7100, lng: 77.1930 },
  "Fauna Police": { lat: 28.7325, lng: 77.1143 },
  "Delhi Animal Care Trust": { lat: 28.5530, lng: 77.2065 },
  "Karuna Society": { lat: 28.5200, lng: 77.1580 },
  "House of Stray Animals": { lat: 28.5469, lng: 77.2433 },
  "SPCA Delhi": { lat: 28.5180, lng: 77.1855 },
  "East Delhi Pet Rescue": { lat: 28.6283, lng: 77.2770 },
  "Preet Vihar Animal Welfare": { lat: 28.6430, lng: 77.2970 },
  "Jeev Ashram": { lat: 28.6700, lng: 77.2900 },
  "Sanjay Gandhi Animal Care Centre": { lat: 28.6520, lng: 77.1220 },
  "Wildlife SOS": { lat: 28.6750, lng: 77.0600 },
  "All Creatures Great and Small": { lat: 28.6700, lng: 77.1030 },
  "CUPA Delhi": { lat: 28.6450, lng: 77.1210 },
  "West Delhi Animal Care": { lat: 28.6680, lng: 77.1310 },
};

const FitBounds = ({ nodes }: { nodes: MapNode[] }) => {
  const map = useMap();
  useEffect(() => {
    if (nodes.length > 0) {
      const bounds = nodes.map((n) => [n.latitude, n.longitude] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [nodes, map]);
  return null;
};

export const DelhiMap = ({ nodes, ngos }: DelhiMapProps) => {
  const delhiCenter: [number, number] = [28.6139, 77.2090];

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-2">
        {Object.entries(regionColorsTailwind).map(([region, colors]) => (
          <div key={region} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${colors.bg}`} />
            <span className="text-sm font-medium text-foreground">{region}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 ml-4">
          <div className="w-5 h-5 rounded-full border-2 border-foreground/50 bg-foreground/20" />
          <span className="text-sm text-muted-foreground">Node (large)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-foreground/50 bg-foreground/20" />
          <span className="text-sm text-muted-foreground">NGO (small)</span>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden shadow-soft border border-border" style={{ height: 480 }}>
        <MapContainer
          center={delhiCenter}
          zoom={11}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds nodes={nodes} />

          {/* Regional Nodes - large markers */}
          {nodes.map((node) => (
            <CircleMarker
              key={node.id}
              center={[node.latitude, node.longitude]}
              radius={14}
              pathOptions={{
                color: regionColors[node.region] || "#E85D04",
                fillColor: regionColors[node.region] || "#E85D04",
                fillOpacity: 0.7,
                weight: 3,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="text-base">{node.name}</strong>
                  <br />
                  <span className="text-muted-foreground">{node.address}</span>
                  <br />
                  <span>🐾 {node.animals_under_care} animals</span>
                  <br />
                  <span>👥 {node.volunteers_count} volunteers</span>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* NGOs - smaller markers */}
          {ngos.map((ngo) => {
            const coords = ngoCoordinates[ngo.name];
            if (!coords) return null;
            return (
              <CircleMarker
                key={ngo.id}
                center={[coords.lat, coords.lng]}
                radius={7}
                pathOptions={{
                  color: regionColors[ngo.region] || "#E85D04",
                  fillColor: regionColors[ngo.region] || "#E85D04",
                  fillOpacity: 0.5,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{ngo.name}</strong>
                    <br />
                    <span className="text-muted-foreground">{ngo.address}</span>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
