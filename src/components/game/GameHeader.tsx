import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout, ArrowLeft } from "lucide-react";

interface GameHeaderProps {
  points: number;
  maxPoints: number;
  levelName?: string;
}

export const GameHeader = ({ points, maxPoints, levelName }: GameHeaderProps) => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/game-map">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Map
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Sprout className="w-6 h-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {levelName || "Game Zone"}
          </h1>
        </div>
        <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
          <span className="text-sm font-medium text-primary">
            Points: {points} / {maxPoints}
          </span>
        </div>
      </div>
    </header>
  );
};
