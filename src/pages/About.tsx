import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Database, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

const datasets = [
  {
    name: "SMAP - Soil Moisture Active Passive",
    description: "Global soil moisture measurements at 9km resolution",
    url: "https://smap.jpl.nasa.gov/",
    usage: "Used for irrigation decision support and drought monitoring",
  },
  {
    name: "MODIS NDVI - Vegetation Health",
    description: "Normalized Difference Vegetation Index from Terra/Aqua satellites",
    url: "https://modis.gsfc.nasa.gov/",
    usage: "Tracks crop health and growth patterns",
  },
  {
    name: "GPM/IMERG - Precipitation",
    description: "Global Precipitation Measurement mission data",
    url: "https://gpm.nasa.gov/",
    usage: "Provides rainfall data for water management decisions",
  },
  {
    name: "Landsat - Surface Reflectance",
    description: "30-year archive of Earth imagery at 30m resolution",
    url: "https://landsat.gsfc.nasa.gov/",
    usage: "Land use classification and change detection",
  },
  {
    name: "NLDAS - Land Data Assimilation",
    description: "High-resolution land surface forcing fields",
    url: "https://ldas.gsfc.nasa.gov/nldas",
    usage: "Temperature and evapotranspiration data",
  },
];

const About = () => {
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
            About & NASA Data
          </h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Mission Statement */}
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Our Mission</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            AgroVerse combines authentic NASA Earth observation data with interactive gaming to teach 
            sustainable agriculture practices. We empower students and youth to understand the science 
            behind farming decisions and their environmental impact.
          </p>
        </section>

        {/* NASA Datasets */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">NASA Datasets Used</h2>
          </div>

          <div className="space-y-4">
            {datasets.map((dataset) => (
              <Card key={dataset.name} className="p-6 border-2 border-border hover:border-primary/50 transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{dataset.name}</h3>
                    <p className="text-muted-foreground mb-2">{dataset.description}</p>
                    <p className="text-sm text-primary/80">
                      <span className="font-semibold">Usage in AgroVerse:</span> {dataset.usage}
                    </p>
                  </div>
                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Attribution */}
        <section className="mb-12">
          <Card className="p-6 bg-primary/5 border-2 border-primary/30">
            <h3 className="text-xl font-bold mb-3 text-foreground">Data Attribution & Licensing</h3>
            <p className="text-sm text-muted-foreground mb-4">
              All NASA Earth observation data used in AgroVerse is publicly available and provided 
              under NASA's Open Data Policy. We acknowledge the following data providers:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• NASA Jet Propulsion Laboratory (JPL)</li>
              <li>• NASA Goddard Space Flight Center (GSFC)</li>
              <li>• USGS Landsat Program</li>
              <li>• Global Precipitation Measurement (GPM) Mission</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
              Citation: "Data provided by NASA's Earth Observing System Data and Information System (EOSDIS). 
              Accessed via AgroVerse educational platform."
            </p>
          </Card>
        </section>

        {/* Demo Note */}
        <section>
          <Card className="p-6 bg-accent/5 border-2 border-accent/30">
            <h3 className="text-lg font-bold mb-2 text-foreground">Demo Data Notice</h3>
            <p className="text-sm text-muted-foreground">
              For this demonstration, we use preprocessed NASA-derived sample data to ensure 
              consistent performance. The full production version integrates live API access 
              to real-time NASA Earth observations.
            </p>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default About;
