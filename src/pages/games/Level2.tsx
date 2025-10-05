import { useState } from "react";
import { motion } from "framer-motion";
import { GameHeader } from "@/components/game/GameHeader";
import { InstructionPopup } from "@/components/game/InstructionPopup";
import { ResultPopup } from "@/components/game/ResultPopup";
import { NASADataPanel } from "@/components/game/NASADataPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const Level2 = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [points, setPoints] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(15); // Current soil moisture %
  const [waterAmount, setWaterAmount] = useState([0]); // Irrigation amount
  const [gameStarted, setGameStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const targetMoisture = 35; // Ideal soil moisture
  const tolerance = 5; // ±5% tolerance

  const handleStart = () => {
    setShowInstructions(false);
    setGameStarted(true);
  };

  const handleApplyWater = () => {
    const finalMoisture = soilMoisture + waterAmount[0];
    setSoilMoisture(finalMoisture);
    setSubmitted(true);

    let earnedPoints = 0;
    let feedback = "";
    let performance: "excellent" | "good" | "fair" | "poor" = "poor";

    const difference = Math.abs(finalMoisture - targetMoisture);

    if (difference <= tolerance) {
      earnedPoints = 50;
      feedback = "Perfect irrigation! You achieved optimal soil moisture levels. Plants will thrive!";
      performance = "excellent";
      toast.success("Perfect moisture balance! 💧");
    } else if (difference <= 10) {
      earnedPoints = 25;
      feedback = "Good job! Moisture is slightly off but acceptable. Minor adjustments needed.";
      performance = "good";
      toast("Good irrigation, but could be better", { icon: "👍" });
    } else if (finalMoisture > targetMoisture + 10) {
      earnedPoints = 5;
      feedback = "Overwatering detected! Excess water reduces soil oxygen and may cause root rot.";
      performance = "poor";
      toast.error("Too much water! Soil is waterlogged");
    } else {
      earnedPoints = 10;
      feedback = "Soil is still too dry. Plants may experience drought stress.";
      performance = "fair";
      toast.error("Insufficient watering");
    }

    setPoints(earnedPoints);
    
    setTimeout(() => {
      setShowResult(true);
      updateProgress(2, earnedPoints);
    }, 1500);
  };

  const updateProgress = (level: number, score: number) => {
    const progress = JSON.parse(localStorage.getItem("gameProgress") || '{"completed":[],"current":1,"totalPoints":0}');
    if (!progress.completed.includes(level)) {
      progress.completed.push(level);
      progress.current = level + 1;
    }
    progress.totalPoints = (progress.totalPoints || 0) + score;
    localStorage.setItem("gameProgress", JSON.stringify(progress));
  };

  const handleReplay = () => {
    setShowResult(false);
    setSubmitted(false);
    setSoilMoisture(15);
    setWaterAmount([0]);
    setPoints(0);
  };

  const getMoistureColor = () => {
    const current = soilMoisture + (submitted ? 0 : waterAmount[0]);
    if (current < 25) return "bg-destructive";
    if (current >= targetMoisture - tolerance && current <= targetMoisture + tolerance) return "bg-primary";
    if (current > 45) return "bg-secondary";
    return "bg-accent";
  };

  const getMoistureLabel = () => {
    const current = soilMoisture + (submitted ? 0 : waterAmount[0]);
    if (current < 20) return "Too Dry 🏜️";
    if (current >= targetMoisture - tolerance && current <= targetMoisture + tolerance) return "Perfect 💚";
    if (current > 45) return "Waterlogged 🌊";
    return "Acceptable ✓";
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader points={points} maxPoints={50} levelName="Level 2: Water Wizard" />

      {showInstructions && (
        <InstructionPopup
          title="💧 Water Wizard"
          description="Master irrigation using NASA soil moisture data"
          instructions={[
            "Check the current soil moisture level from NASA SMAP data",
            "Adjust the irrigation slider to add water to the soil",
            "Target: 35% soil moisture (±5% tolerance)",
            "Avoid overwatering or underwatering for maximum points"
          ]}
          onStart={handleStart}
        />
      )}

      {showResult && (
        <ResultPopup
          xpGained={points}
          feedback={`Final soil moisture: ${soilMoisture.toFixed(1)}%. ${points >= 40 ? "Excellent water management!" : points >= 20 ? "Decent effort, but room for improvement." : "Need more practice with irrigation."}`}
          performance={points >= 40 ? "excellent" : points >= 20 ? "good" : points >= 10 ? "fair" : "poor"}
          onReplay={handleReplay}
          nextLevel="/games/level3"
        />
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* NASA Data Panel */}
          <div className="lg:col-span-1">
            <NASADataPanel
              title="NASA SMAP Data"
              dataPoints={[
                { label: "Current Moisture", value: soilMoisture.toFixed(1), unit: "%", color: soilMoisture < 25 ? "text-destructive" : "text-foreground" },
                { label: "Target Moisture", value: targetMoisture.toString(), unit: "%", color: "text-primary" },
                { label: "Evaporation Rate", value: "2.5", unit: "mm/day", color: "text-muted-foreground" },
                { label: "Soil Texture", value: "Sandy Loam", unit: "", color: "text-muted-foreground" },
              ]}
            />
          </div>

          {/* Gameplay Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Soil Visualization */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-foreground text-center">Soil Moisture Level</h3>
                
                {/* Moisture Bar */}
                <div className="relative h-64 bg-card border-2 border-border rounded-lg overflow-hidden">
                  <motion.div
                    animate={{ height: `${Math.min(soilMoisture + (submitted ? 0 : waterAmount[0]), 100)}%` }}
                    className={`absolute bottom-0 w-full ${getMoistureColor()} transition-colors duration-500`}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <p className="text-4xl font-bold text-foreground drop-shadow-lg">
                      {(soilMoisture + (submitted ? 0 : waterAmount[0])).toFixed(1)}%
                    </p>
                    <p className="text-lg text-foreground drop-shadow-lg mt-2">{getMoistureLabel()}</p>
                  </div>
                  
                  {/* Target line */}
                  <div 
                    className="absolute w-full border-2 border-dashed border-primary z-10"
                    style={{ bottom: `${targetMoisture}%` }}
                  >
                    <span className="absolute right-2 -top-3 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Target: {targetMoisture}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Irrigation Controls */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">Irrigation Control</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Water to Add: {waterAmount[0]}%
                    </label>
                    <Slider
                      value={waterAmount}
                      onValueChange={setWaterAmount}
                      max={50}
                      step={1}
                      disabled={submitted}
                      className="mb-4"
                    />
                  </div>
                  <Button
                    onClick={handleApplyWater}
                    disabled={submitted}
                    variant="hero"
                    size="lg"
                    className="w-full"
                  >
                    Apply Water 💧
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level2;
