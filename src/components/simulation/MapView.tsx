import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, ZoomIn, ZoomOut } from "lucide-react";

interface MapViewProps {
  regionId: string;
}

export const MapView = ({ regionId }: MapViewProps) => {
  return (
    <Card className="p-6 border-2 border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <span className="w-2 h-6 bg-primary rounded-full" />
          Interactive Map
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Layers className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden border border-border">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Layers className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Interactive Map View
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Region: {regionId.replace("-", " ").toUpperCase()}
            </p>
          </div>
        </div>

        {/* Mock data layers overlay */}
        <div className="absolute top-4 right-4 space-y-2">
          <div className="px-3 py-2 bg-card/90 backdrop-blur-sm rounded-lg border border-primary/30 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-foreground">NDVI Active</span>
            </div>
          </div>
          <div className="px-3 py-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted-foreground/30 rounded-full" />
              <span className="text-muted-foreground">Soil Moisture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="text-xs">
          Toggle NDVI
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          Toggle Rainfall
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          Toggle Soil Moisture
        </Button>
      </div>
    </Card>
  );
};
