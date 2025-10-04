import { Card } from "@/components/ui/card";
import { Droplets, TrendingUp, Cloud, Thermometer } from "lucide-react";

interface DataPanelProps {
  regionId: string;
}

export const DataPanel = ({ regionId }: DataPanelProps) => {
  // Mock NASA data
  const data = {
    rainfall: 45.2,
    soilMoisture: 0.32,
    ndvi: 0.68,
    temperature: 28.5,
  };

  return (
    <Card className="p-6 border-2 border-border bg-card/80 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
        <span className="w-2 h-6 bg-secondary rounded-full" />
        NASA Earth Data
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DataCard
          icon={<Cloud className="w-5 h-5" />}
          label="Rainfall"
          value={`${data.rainfall} mm`}
          source="GPM/IMERG"
          color="secondary"
        />
        <DataCard
          icon={<Droplets className="w-5 h-5" />}
          label="Soil Moisture"
          value={`${data.soilMoisture} m³/m³`}
          source="SMAP"
          color="primary"
        />
        <DataCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="NDVI"
          value={data.ndvi.toFixed(2)}
          source="MODIS"
          color="primary"
        />
        <DataCard
          icon={<Thermometer className="w-5 h-5" />}
          label="Temperature"
          value={`${data.temperature}°C`}
          source="NLDAS"
          color="accent"
        />
      </div>

      <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-semibold">Data Source:</span> NASA Earth Observations - 
          Real-time satellite data from multiple missions
        </p>
      </div>
    </Card>
  );
};

const DataCard = ({
  icon,
  label,
  value,
  source,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  source: string;
  color: string;
}) => {
  return (
    <div className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className={`text-${color} mb-2`}>{icon}</div>
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xs text-primary/70 mt-1">{source}</div>
    </div>
  );
};
