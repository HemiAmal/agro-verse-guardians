import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GameHeader } from "@/components/game/GameHeader";
import { InstructionPopup } from "@/components/game/InstructionPopup";
import { ResultPopup } from "@/components/game/ResultPopup";
import { NASADataPanel } from "@/components/game/NASADataPanel";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface GridCell {
  x: number;
  y: number;
  ndvi: number;
  infected: boolean;
  sprayed: boolean;
}

const Level3 = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [points, setPoints] = useState(0);
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [sprayCount, setSprayCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      initializeGrid();
    }
  }, [gameStarted]);

  const initializeGrid = () => {
    const newGrid: GridCell[] = [];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 8; x++) {
        const infected = Math.random() < 0.25; // 25% infection rate
        newGrid.push({
          x,
          y,
          ndvi: infected ? 0.2 + Math.random() * 0.1 : 0.6 + Math.random() * 0.3,
          infected,
          sprayed: false,
        });
      }
    }
    setGrid(newGrid);
  };

  const handleStart = () => {
    setShowInstructions(false);
    setGameStarted(true);
  };

  const handleSpray = (index: number) => {
    if (grid[index].sprayed) return;

    const newGrid = [...grid];
    newGrid[index].sprayed = true;
    setGrid(newGrid);
    setSprayCount(sprayCount + 1);

    if (newGrid[index].infected) {
      toast.success("Pest eliminated! 🐛");
    } else {
      toast.error("Don't spray healthy crops!");
    }

    // Check if all infected cells are sprayed
    const allInfectedSprayed = newGrid.every(cell => !cell.infected || cell.sprayed);
    if (allInfectedSprayed) {
      calculateScore(newGrid);
    }
  };

  const calculateScore = (finalGrid: GridCell[]) => {
    const totalInfected = finalGrid.filter(c => c.infected).length;
    const correctSprays = finalGrid.filter(c => c.infected && c.sprayed).length;
    const wrongSprays = finalGrid.filter(c => !c.infected && c.sprayed).length;
    const missedPests = totalInfected - correctSprays;

    let earnedPoints = correctSprays * 20 - wrongSprays * 10 - missedPests * 5;
    earnedPoints = Math.max(0, earnedPoints);

    let performance: "excellent" | "good" | "fair" | "poor" = "poor";
    if (correctSprays === totalInfected && wrongSprays === 0) {
      performance = "excellent";
      earnedPoints += 30; // Bonus
    } else if (correctSprays >= totalInfected * 0.8 && wrongSprays <= 2) {
      performance = "good";
    } else if (correctSprays >= totalInfected * 0.5) {
      performance = "fair";
    }

    setPoints(earnedPoints);
    setTimeout(() => {
      setShowResult(true);
      updateProgress(3, earnedPoints);
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
    setPoints(0);
    setSprayCount(0);
    initializeGrid();
  };

  const getCellColor = (cell: GridCell) => {
    if (cell.sprayed) {
      return cell.infected ? "bg-primary" : "bg-destructive";
    }
    if (cell.ndvi < 0.3) return "bg-red-900"; // Unhealthy
    if (cell.ndvi < 0.5) return "bg-yellow-700"; // Moderate
    return "bg-green-700"; // Healthy
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader points={points} maxPoints={100} levelName="Level 3: Pest Patrol" />

      {showInstructions && (
        <InstructionPopup
          title="🐛 Pest Patrol"
          description="Identify and treat pest-affected zones using NASA NDVI data"
          instructions={[
            "Red/Dark zones indicate low NDVI (unhealthy vegetation)",
            "Click on infected cells to spray pesticide",
            "Avoid spraying healthy green zones (penalty!)",
            "Clear all pests with minimal sprays for bonus points"
          ]}
          onStart={handleStart}
        />
      )}

      {showResult && (
        <ResultPopup
          xpGained={points}
          feedback={`You sprayed ${sprayCount} times. ${points >= 80 ? "Excellent pest management!" : points >= 40 ? "Good job, but some mistakes made." : "Need more precision!"}`}
          performance={points >= 80 ? "excellent" : points >= 40 ? "good" : points >= 20 ? "fair" : "poor"}
          onReplay={handleReplay}
          nextLevel="/games/level4"
        />
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* NASA Data Panel */}
          <div className="lg:col-span-1">
            <NASADataPanel
              title="NASA MODIS NDVI"
              dataPoints={[
                { label: "NDVI Threshold", value: "0.3", unit: "", color: "text-primary" },
                { label: "Infected Zones", value: grid.filter(c => c.infected).length.toString(), unit: "cells", color: "text-destructive" },
                { label: "Spray Used", value: sprayCount.toString(), unit: "times", color: "text-foreground" },
                { label: "Resolution", value: "250m", unit: "", color: "text-muted-foreground" },
              ]}
            />

            <Card className="mt-6 border-2 border-primary/20">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-700 rounded" />
                    <span className="text-muted-foreground">Healthy (NDVI &gt; 0.5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-700 rounded" />
                    <span className="text-muted-foreground">Moderate (0.3-0.5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-900 rounded" />
                    <span className="text-muted-foreground">Infected (&lt; 0.3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded" />
                    <span className="text-muted-foreground">Sprayed (Correct)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-destructive rounded" />
                    <span className="text-muted-foreground">Sprayed (Wrong!)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Farm Grid */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-foreground text-center">
                  Drone View - Farm Field
                </h3>
                <div className="grid grid-cols-8 gap-2">
                  {grid.map((cell, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSpray(index)}
                      disabled={cell.sprayed}
                      className={`aspect-square rounded-lg ${getCellColor(cell)} border-2 ${
                        cell.sprayed ? "border-foreground" : "border-border hover:border-primary"
                      } transition-all relative`}
                    >
                      {cell.sprayed && (
                        <span className="absolute inset-0 flex items-center justify-center text-2xl">
                          {cell.infected ? "✓" : "✗"}
                        </span>
                      )}
                      {!cell.sprayed && cell.infected && (
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute inset-0 flex items-center justify-center text-xl"
                        >
                          🐛
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Click on infected (red) zones to spray pesticide
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Level3;
