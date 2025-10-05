import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Satellite } from "lucide-react";

interface DataPoint {
  label: string;
  value: string;
  unit: string;
  color?: string;
}

interface NASADataPanelProps {
  title: string;
  dataPoints: DataPoint[];
}

export const NASADataPanel = ({ title, dataPoints }: NASADataPanelProps) => {
  return (
    <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Satellite className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {dataPoints.map((point, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{point.label}</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-bold ${point.color || "text-foreground"}`}>
                {point.value}
              </span>
              <span className="text-xs text-muted-foreground">{point.unit}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
