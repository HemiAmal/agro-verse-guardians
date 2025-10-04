import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Droplets, Sprout } from "lucide-react";
import asiaImage from "@/assets/region-asia.jpg";
import africaImage from "@/assets/region-africa.jpg";
import southAmericaImage from "@/assets/region-southamerica.jpg";
import northAmericaImage from "@/assets/region-northamerica.jpg";
import europeImage from "@/assets/region-europe.jpg";
import marsImage from "@/assets/region-mars.jpg";

const regions = [
  {
    id: "south-asia",
    name: "South Asia",
    image: asiaImage,
    challenge: "Monsoon irrigation & rice cultivation",
    climate: "Tropical monsoon",
    difficulty: "Medium",
  },
  {
    id: "africa",
    name: "Sub-Saharan Africa",
    image: africaImage,
    challenge: "Water scarcity & soil conservation",
    climate: "Semi-arid savanna",
    difficulty: "Hard",
  },
  {
    id: "south-america",
    name: "South America",
    image: southAmericaImage,
    challenge: "Rainforest edge farming & biodiversity",
    climate: "Tropical rainforest",
    difficulty: "Medium",
  },
  {
    id: "north-america",
    name: "North America",
    image: northAmericaImage,
    challenge: "Industrial scale & precision agriculture",
    climate: "Temperate continental",
    difficulty: "Easy",
  },
  {
    id: "europe",
    name: "Europe",
    image: europeImage,
    challenge: "Sustainable intensification",
    climate: "Temperate maritime",
    difficulty: "Easy",
  },
  {
    id: "mars",
    name: "Mars Colony",
    image: marsImage,
    challenge: "Hydroponic farming in hostile environment",
    climate: "Martian atmosphere",
    difficulty: "Extreme",
    bonus: true,
  },
];

const Regions = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Select Your Region
          </h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Regions Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          Choose a region to begin your farming journey. Each region presents unique challenges based on real NASA Earth observation data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      </main>
    </div>
  );
};

const RegionCard = ({ region }: { region: typeof regions[0] }) => {
  const difficultyColor = {
    Easy: "text-primary",
    Medium: "text-accent",
    Hard: "text-secondary",
    Extreme: "text-destructive",
  }[region.difficulty];

  return (
    <Link to={`/simulation/${region.id}`}>
      <div className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-[0_0_40px_hsl(var(--primary)/0.3)] cursor-pointer bg-card">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={region.image}
            alt={region.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          {region.bonus && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold animate-pulse-glow">
              BONUS
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {region.name}
            </h3>
            <span className={`text-sm font-semibold ${difficultyColor}`}>
              {region.difficulty}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Sprout className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{region.challenge}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Droplets className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              <span>{region.climate}</span>
            </div>
          </div>

          <Button variant="gaming" size="sm" className="w-full">
            Start Simulation
          </Button>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
};

export default Regions;
