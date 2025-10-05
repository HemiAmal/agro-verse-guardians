import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, RotateCcw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ResultPopupProps {
  xpGained: number;
  feedback: string;
  performance: "excellent" | "good" | "fair" | "poor";
  onReplay: () => void;
  nextLevel?: string;
  isLastLevel?: boolean;
}

export const ResultPopup = ({ xpGained, feedback, performance, onReplay, nextLevel, isLastLevel }: ResultPopupProps) => {
  const performanceColors = {
    excellent: "text-primary",
    good: "text-secondary",
    fair: "text-accent",
    poor: "text-destructive",
  };

  const performanceEmojis = {
    excellent: "🌟",
    good: "👍",
    fair: "💪",
    poor: "📚",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-primary shadow-[0_0_40px_hsl(var(--primary)/0.3)]">
          <CardHeader className="text-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
            >
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-3xl">
              {isLastLevel ? "🎉 Congratulations!" : "Level Complete!"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-5xl mb-2">{performanceEmojis[performance]}</div>
              <p className={`text-xl font-bold ${performanceColors[performance]} capitalize mb-2`}>
                {performance} Performance!
              </p>
              <p className="text-sm text-muted-foreground">{feedback}</p>
            </div>
            
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
              <p className="text-sm text-muted-foreground mb-1">XP Gained</p>
              <p className="text-3xl font-bold text-primary">+{xpGained}</p>
            </div>

            {isLastLevel && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-center"
              >
                <p className="text-lg font-semibold text-foreground">
                  You've mastered NASA-powered smart farming! 🌾
                </p>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={onReplay} variant="outline" size="lg" className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              Replay
            </Button>
            {nextLevel && !isLastLevel ? (
              <Link to={nextLevel} className="flex-1">
                <Button variant="hero" size="lg" className="w-full">
                  Next Level
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/game-map" className="flex-1">
                <Button variant="hero" size="lg" className="w-full">
                  Back to Map
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};
