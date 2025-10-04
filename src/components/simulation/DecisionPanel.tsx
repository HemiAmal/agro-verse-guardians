import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Loader2 } from "lucide-react";

interface DecisionPanelProps {
  onRunSimulation: () => void;
  isSimulating: boolean;
}

export const DecisionPanel = ({ onRunSimulation, isSimulating }: DecisionPanelProps) => {
  const [crop, setCrop] = useState("rice");
  const [irrigation, setIrrigation] = useState(50);
  const [fertilizer, setFertilizer] = useState(50);

  return (
    <Card className="p-6 border-2 border-border bg-card/80 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
        <span className="w-2 h-8 bg-primary rounded-full" />
        Decision Panel
      </h2>

      <div className="space-y-6">
        {/* Crop Selection */}
        <div className="space-y-2">
          <Label htmlFor="crop" className="text-foreground">Crop Type</Label>
          <Select value={crop} onValueChange={setCrop}>
            <SelectTrigger id="crop" className="bg-muted border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rice">Rice</SelectItem>
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="corn">Corn</SelectItem>
              <SelectItem value="soybeans">Soybeans</SelectItem>
              <SelectItem value="cotton">Cotton</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Irrigation */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-foreground">Irrigation Level</Label>
            <span className="text-sm text-primary font-semibold">{irrigation}%</span>
          </div>
          <Slider
            value={[irrigation]}
            onValueChange={(val) => setIrrigation(val[0])}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Higher irrigation increases yield but uses more water
          </p>
        </div>

        {/* Fertilizer */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-foreground">Fertilizer Amount</Label>
            <span className="text-sm text-primary font-semibold">{fertilizer}%</span>
          </div>
          <Slider
            value={[fertilizer]}
            onValueChange={(val) => setFertilizer(val[0])}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Organic fertilizer improves soil health long-term
          </p>
        </div>

        {/* Conservation Options */}
        <div className="space-y-2">
          <Label className="text-foreground">Conservation Practices</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary" />
              <span className="text-sm text-foreground">Cover Cropping</span>
            </label>
            <label className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary" />
              <span className="text-sm text-foreground">No-Till Farming</span>
            </label>
            <label className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary" />
              <span className="text-sm text-foreground">Drip Irrigation</span>
            </label>
          </div>
        </div>

        {/* Run Simulation Button */}
        <Button
          onClick={onRunSimulation}
          disabled={isSimulating}
          variant="default"
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
        >
          {isSimulating ? (
            <>
              <Loader2 className="mr-2 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Play className="mr-2" />
              Run Simulation
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
