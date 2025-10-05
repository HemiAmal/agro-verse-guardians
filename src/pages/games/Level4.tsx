import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GameHeader } from "@/components/game/GameHeader";
import { InstructionPopup } from "@/components/game/InstructionPopup";
import { ResultPopup } from "@/components/game/ResultPopup";
import { NASADataPanel } from "@/components/game/NASADataPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface PriceData {
  day: number;
  price: number;
  rainfall: number;
  drought: number;
}

const Level4 = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [points, setPoints] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [sold, setSold] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      generatePriceData();
    }
  }, [gameStarted]);

  const generatePriceData = () => {
    const data: PriceData[] = [];
    let basePrice = 100;
    
    for (let day = 1; day <= 14; day++) {
      const rainfall = 30 + Math.random() * 70;
      const drought = rainfall < 40 ? 70 + Math.random() * 30 : 20 + Math.random() * 40;
      
      // Price increases with drought
      const priceVariation = (drought - 50) * 0.8 + (Math.random() - 0.5) * 10;
      basePrice = Math.max(50, Math.min(200, basePrice + priceVariation));
      
      data.push({
        day,
        price: Math.round(basePrice),
        rainfall: Math.round(rainfall),
        drought: Math.round(drought),
      });
    }
    setPriceHistory(data);
  };

  const handleStart = () => {
    setShowInstructions(false);
    setGameStarted(true);
    startDaySimulation();
  };

  const startDaySimulation = () => {
    const interval = setInterval(() => {
      setCurrentDay(prev => {
        if (prev >= 14) {
          clearInterval(interval);
          if (!sold) {
            handleSell(14); // Force sell on last day
          }
          return 14;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const handleSell = (day?: number) => {
    const sellDay = day || currentDay;
    const sellPrice = priceHistory[sellDay - 1]?.price || 100;
    const maxPrice = Math.max(...priceHistory.slice(0, sellDay).map(d => d.price));
    const minPrice = Math.min(...priceHistory.slice(0, sellDay).map(d => d.price));
    
    setSold(true);

    let earnedPoints = 0;
    let performance: "excellent" | "good" | "fair" | "poor" = "poor";
    let feedback = "";

    const priceRatio = (sellPrice - minPrice) / (maxPrice - minPrice || 1);

    if (priceRatio >= 0.9) {
      earnedPoints = 55;
      performance = "excellent";
      feedback = "Perfect timing! You sold at peak price when drought was severe.";
      toast.success("🎯 Excellent market prediction!");
    } else if (priceRatio >= 0.7) {
      earnedPoints = 40;
      performance = "good";
      feedback = "Good timing! You caught a high price period.";
      toast("👍 Good sale!");
    } else if (priceRatio >= 0.4) {
      earnedPoints = 20;
      performance = "fair";
      feedback = "Moderate timing. You could have waited for better prices.";
      toast("⚠️ Could be better");
    } else {
      earnedPoints = 10;
      performance = "poor";
      feedback = "Poor timing. You sold when prices were low.";
      toast.error("📉 Low price sale");
    }

    setPoints(earnedPoints);
    
    setTimeout(() => {
      setShowResult(true);
      updateProgress(4, earnedPoints);
    }, 1000);
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
    setSold(false);
    setPoints(0);
    setCurrentDay(1);
    generatePriceData();
    startDaySimulation();
  };

  const currentData = priceHistory.slice(0, currentDay);
  const currentPrice = priceHistory[currentDay - 1]?.price || 100;
  const currentDrought = priceHistory[currentDay - 1]?.drought || 50;

  return (
    <div className="min-h-screen bg-background">
      <GameHeader points={points} maxPoints={55} levelName="Level 4: Market Master" />

      {showInstructions && (
        <InstructionPopup
          title="💹 Market Master"
          description="Decide when to sell crops based on weather and drought trends"
          instructions={[
            "Watch the price chart update daily over 14 days",
            "Monitor rainfall and drought levels from NASA data",
            "Prices rise during drought conditions",
            "Sell at the best time for maximum profit!"
          ]}
          onStart={handleStart}
        />
      )}

      {showResult && (
        <ResultPopup
          xpGained={points}
          feedback={`You sold for $${currentPrice}. ${points >= 50 ? "Excellent market analysis!" : points >= 30 ? "Decent profit!" : "Need better timing!"}`}
          performance={points >= 50 ? "excellent" : points >= 30 ? "good" : points >= 15 ? "fair" : "poor"}
          onReplay={handleReplay}
          nextLevel="/games/level5"
        />
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* NASA Data Panel */}
          <div className="lg:col-span-1">
            <NASADataPanel
              title="NASA Climate Data"
              dataPoints={[
                { label: "Current Day", value: currentDay.toString(), unit: "/ 14", color: "text-foreground" },
                { label: "Crop Price", value: currentPrice.toString(), unit: "$", color: currentPrice > 140 ? "text-primary" : "text-foreground" },
                { label: "Drought Level", value: currentDrought.toString(), unit: "%", color: currentDrought > 70 ? "text-destructive" : "text-accent" },
                { label: "Rainfall", value: priceHistory[currentDay - 1]?.rainfall.toFixed(0) || "0", unit: "mm", color: "text-secondary" },
              ]}
            />

            {!sold && (
              <Card className="mt-6 border-2 border-primary/20">
                <CardContent className="p-4">
                  <Button
                    onClick={() => handleSell()}
                    variant="hero"
                    size="lg"
                    className="w-full"
                  >
                    Sell Crops Now
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Current price: ${currentPrice}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Market Chart */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Market Price Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem"
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={3} name="Price ($)" />
                    <Line type="monotone" dataKey="drought" stroke="hsl(var(--destructive))" strokeWidth={2} name="Drought (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">Market Scene</h3>
                <div className="min-h-[150px] flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-center"
                  >
                    <div className="text-6xl mb-4">🏪</div>
                    <p className="text-2xl font-bold text-foreground">
                      {sold ? "Crops Sold!" : "Waiting to Sell..."}
                    </p>
                    <p className="text-lg text-muted-foreground mt-2">
                      {sold ? `Final Price: $${currentPrice}` : `Day ${currentDay}/14`}
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level4;
