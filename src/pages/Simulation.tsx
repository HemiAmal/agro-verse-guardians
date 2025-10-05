import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import { DecisionPanel } from "@/components/simulation/DecisionPanel";
import { MapView } from "@/components/simulation/MapView";
import { DataPanel } from "@/components/simulation/DataPanel";
import GameIntroPanel from "@/components/simulation/gameIntroPanel";

const Simulation = () => {
  const { regionId } = useParams();
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    // Simulate for demo
    setTimeout(() => {
      window.location.href = `/results/${regionId}`;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/regions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2" />
              Back to Regions
            </Button>
          </Link>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Simulation Dashboard - {regionId?.replace("-", " ").toUpperCase()}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Map & Data */}
          <div className="lg:col-span-2 space-y-6">
            <MapView regionId={regionId || ""} />
            <DataPanel regionId={regionId || ""} />
          </div>

          {/* Right: Decision Panel */}
          <div className="lg:col-span-1">
            <DecisionPanel onRunSimulation={handleRunSimulation} isSimulating={isSimulating} />
          </div>
          <div className="lg:col-span-1">
              <GameIntroPanel ></GameIntroPanel>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Simulation;
