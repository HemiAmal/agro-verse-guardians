import { useState } from "react";
import { motion } from "framer-motion";
import { GameHeader } from "@/components/game/GameHeader";
import { InstructionPopup } from "@/components/game/InstructionPopup";
import { ResultPopup } from "@/components/game/ResultPopup";
import { NASADataPanel } from "@/components/game/NASADataPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Level5 = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [points, setPoints] = useState(0);
  const [crop, setCrop] = useState("wheat");
  const [irrigation, setIrrigation] = useState([30]);
  const [fertilizer, setFertilizer] = useState([20]);
  const [simulating, setSimulating] = useState(false);

  const handleStart = () => {
    setShowInstructions(false);
  };

  const handleRunSimulation = () => {
    setSimulating(true);
    
    setTimeout(() => {
      const temp = 22;
      const rainfall = 85;
      const waterEfficiency = Math.abs(irrigation[0] - 35) < 10 ? 1 : 0.7;
      const fertilizerScore = fertilizer[0] > 50 ? 0.6 : 1;
      const yield_score = 70 + waterEfficiency * 20 + fertilizerScore * 10;
      
      let earnedPoints = Math.round(yield_score);
      let performance: "excellent" | "good" | "fair" | "poor" = "poor";
      
      if (yield_score >= 90) {
        performance = "excellent";
        earnedPoints = 100;
      } else if (yield_score >= 75) {
        performance = "good";
      } else if (yield_score >= 60) {
        performance = "fair";
      }

      setPoints(earnedPoints);
      setSimulating(false);
      setShowResult(true);
      updateProgress(5, earnedPoints);
    }, 3000);
  };

  const updateProgress = (level: number, score: number) => {
    const progress = JSON.parse(localStorage.getItem("gameProgress") || '{"completed":[],"current":1,"totalPoints":0}');
    if (!progress.completed.includes(level)) {
      progress.completed.push(level);
    }
    progress.totalPoints = (progress.totalPoints || 0) + score;
    localStorage.setItem("gameProgress", JSON.stringify(progress));
  };

  const handleReplay = () => {
    setShowResult(false);
    setPoints(0);
    setCrop("wheat");
    setIrrigation([30]);
    setFertilizer([20]);
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader points={points} maxPoints={100} levelName="Level 5: Climate Commander" />

      {showInstructions && (
        <InstructionPopup
          title="☀️ Climate Commander"
          description="Plan your entire farming season using NASA climate data"
          instructions={[
            "Select crop type based on predicted climate",
            "Optimize irrigation levels for water efficiency",
            "Balance fertilizer use for sustainability",
            "Run the simulation to see your farm's performance"
          ]}
          onStart={handleStart}
        />
      )}

      {showResult && (
        <ResultPopup
          xpGained={points}
          feedback="Simulation complete! You've mastered NASA-powered sustainable farming."
          performance={points >= 90 ? "excellent" : points >= 70 ? "good" : points >= 50 ? "fair" : "poor"}
          onReplay={handleReplay}
          isLastLevel
        />
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <NASADataPanel
              title="NASA POWER Forecast"
              dataPoints={[
                { label: "Avg Temp", value: "22", unit: "°C", color: "text-foreground" },
                { label: "Rainfall", value: "85", unit: "mm", color: "text-secondary" },
                { label: "Humidity", value: "65", unit: "%", color: "text-accent" },
                { label: "Season", value: "Spring", unit: "", color: "text-primary" },
              ]}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Farm Planning</h3>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Crop Type</label>
                  <Select value={crop} onValueChange={setCrop}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wheat">🌾 Wheat</SelectItem>
                      <SelectItem value="corn">🌽 Corn</SelectItem>
                      <SelectItem value="rice">🌾 Rice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Irrigation: {irrigation[0]}%</label>
                  <Slider value={irrigation} onValueChange={setIrrigation} max={100} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Fertilizer: {fertilizer[0]}kg/ha</label>
                  <Slider value={fertilizer} onValueChange={setFertilizer} max={100} />
                </div>
                <Button onClick={handleRunSimulation} variant="hero" size="lg" className="w-full" disabled={simulating}>
                  {simulating ? "Simulating..." : "Run Season Simulation"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level5;
