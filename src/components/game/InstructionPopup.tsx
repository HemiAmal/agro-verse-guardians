import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface InstructionPopupProps {
  title: string;
  description: string;
  instructions: string[];
  onStart: () => void;
}

export const InstructionPopup = ({ title, description, instructions, onStart }: InstructionPopupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="border-2 border-primary shadow-[0_0_40px_hsl(var(--primary)/0.3)]">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h4 className="font-semibold text-foreground mb-3">How to Play:</h4>
            <ul className="space-y-2">
              {instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{instruction}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={onStart} variant="hero" size="lg" className="w-full">
              Start Game
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};
