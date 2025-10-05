import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GameHeader } from "@/components/game/GameHeader";
import { InstructionPopup } from "@/components/game/InstructionPopup";
import { ResultPopup } from "@/components/game/ResultPopup";
import { NASADataPanel } from "@/components/game/NASADataPanel";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Crop {
  id: string;
  name: string;
  emoji: string;
  idealTemp: { min: number; max: number };
  idealRainfall: { min: number; max: number };
}

const crops: Crop[] = [
  { id: "rice", name: "Rice", emoji: "🌾", idealTemp: { min: 20, max: 35 }, idealRainfall: { min: 150, max: 300 } },
  { id: "wheat", name: "Wheat", emoji: "🌾", idealTemp: { min: 12, max: 25 }, idealRainfall: { min: 30, max: 90 } },
  { id: "corn", name: "Corn", emoji: "🌽", idealTemp: { min: 15, max: 30 }, idealRainfall: { min: 50, max: 150 } },
  { id: "cotton", name: "Cotton", emoji: "☁️", idealTemp: { min: 21, max: 37 }, idealRainfall: { min: 50, max: 100 } },
];

const Level1 = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [points, setPoints] = useState(0);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [temperature, setTemperature] = useState(0);
  const [rainfall, setRainfall] = useState(0);
  const [plantGrowth, setPlantGrowth] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted) {
      setTemperature(Math.round(10 + Math.random() * 30));
      setRainfall(Math.round(20 + Math.random() * 250));
    }
  }, [gameStarted]);

  const handleStart = () => {
    setShowInstructions(false);
    setGameStarted(true);
  };

  const handleCropSelect = (crop: Crop) => {
    setSelectedCrop(crop);
    
    const tempMatch = temperature >= crop.idealTemp.min && temperature <= crop.idealTemp.max;
    const rainMatch = rainfall >= crop.idealRainfall.min && rainfall <= crop.idealRainfall.max;
    
    let earnedPoints = 0;
    let feedback = "";
    let performance: "excellent" | "good" | "fair" | "poor" = "poor";

    if (tempMatch && rainMatch) {
      earnedPoints = 40;
      feedback = `Excellent choice! ${crop.name} thrives in these conditions. High humidity and warm climate are perfect!`;
      performance = "excellent";
      setPlantGrowth(100);
      toast.success("Perfect match! 🌟");
    } else if (tempMatch || rainMatch) {
      earnedPoints = 20;
      feedback = `${crop.name} can grow, but conditions are not ideal. Some stress expected.`;
      performance = "fair";
      setPlantGrowth(60);
      toast("Crop will grow, but not optimally", { icon: "⚠️" });
    } else {
      earnedPoints = 0;
      feedback = `Poor choice. ${crop.name} is not suitable for these conditions. The plant withered.`;
      performance = "poor";
      setPlantGrowth(20);
      toast.error("Crop failed to thrive");
    }

    setPoints(earnedPoints);
    
    setTimeout(() => {
      setShowResult(true);
      updateProgress(1, earnedPoints);
    }, 2000);
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
    setSelectedCrop(null);
    setPlantGrowth(0);
    setPoints(0);
    setTemperature(Math.round(10 + Math.random() * 30));
    setRainfall(Math.round(20 + Math.random() * 250));
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader points={points} maxPoints={40} levelName="Level 1: Seed Starter" />

      {showInstructions && (
        <InstructionPopup
          title="🌱 Seed Starter"
          description="Learn to choose the right crop based on NASA weather data"
          instructions={[
            "Review the current temperature and rainfall data from NASA",
            "Select the crop that best matches these conditions",
            "Watch your plant grow if you made the right choice!",
            "Earn bonus points for perfect matches"
          ]}
          onStart={handleStart}
        />
      )}

      {showResult && (
        <ResultPopup
          xpGained={points}
          feedback={`You earned ${points} points! ${selectedCrop?.name} ${plantGrowth === 100 ? "grew perfectly" : plantGrowth >= 60 ? "grew moderately" : "struggled to grow"}.`}
          performance={points >= 40 ? "excellent" : points >= 20 ? "fair" : "poor"}
          onReplay={handleReplay}
          nextLevel="/games/level2"
        />
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <NASADataPanel
              title="NASA POWER Data"
              dataPoints={[
                { label: "Temperature", value: temperature.toString(), unit: "°C", color: temperature > 25 ? "text-destructive" : "text-secondary" },
                { label: "Rainfall", value: rainfall.toString(), unit: "mm", color: rainfall > 150 ? "text-primary" : "text-accent" },
                { label: "Humidity", value: "75", unit: "%", color: "text-foreground" },
                { label: "Soil Type", value: "Loamy", unit: "", color: "text-muted-foreground" },
              ]}
            />
          </div>

          {/* Gameplay Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Select Your Crop</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {crops.map((crop) => (
                    <motion.button
                      key={crop.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => !selectedCrop && handleCropSelect(crop)}
                      disabled={!!selectedCrop}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        selectedCrop?.id === crop.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 bg-card"
                      } ${selectedCrop && selectedCrop.id !== crop.id ? "opacity-50" : ""}`}
                    >
                      <div className="text-5xl mb-2">{crop.emoji}</div>
                      <p className="text-sm font-semibold text-foreground">{crop.name}</p>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Visualization */}
            <Card className="border-2 border-primary/20 bg-gradient-to-b from-card to-card/50">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 text-foreground text-center">Farm Field</h3>
                <div className="min-h-[200px] flex items-end justify-center relative">
                  <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-primary/20 to-transparent rounded-lg" />
                  {selectedCrop && (
                    <motion.div
                      initial={{ scale: 0, y: 20 }}
                      animate={{ scale: plantGrowth / 100, y: 0 }}
                      transition={{ duration: 2, type: "spring" }}
                      className="text-8xl relative z-10"
                    >
                      {selectedCrop.emoji}
                    </motion.div>
                  )}
                  {!selectedCrop && (
                    <p className="text-muted-foreground text-center">Select a crop to plant...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level1;
