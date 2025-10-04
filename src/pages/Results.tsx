import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, TrendingUp, Droplets, Leaf, DollarSign, Award, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Results = () => {
  const { regionId } = useParams();

  // Mock results data
  const results = {
    yield: 4.2,
    maxYield: 5.0,
    waterUsage: 65,
    soilHealth: 82,
    carbonFootprint: 45,
    profit: 12500,
    sustainabilityScore: 78,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={`/simulation/${regionId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2" />
              Back to Simulation
            </Button>
          </Link>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Simulation Results
          </h1>
          <Link to={`/simulation/${regionId}`}>
            <Button variant="gaming" size="sm">
              <RotateCcw className="mr-2" />
              Try Again
            </Button>
          </Link>
        </div>
      </header>

      {/* Results Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Overall Score */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-4 border-primary animate-pulse-glow">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{results.sustainabilityScore}</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2 text-foreground">Great Job!</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your sustainable farming practices earned you a strong sustainability score. Here's how your farm performed:
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <MetricCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Crop Yield"
            value={`${results.yield} tons/hectare`}
            max={results.maxYield}
            current={results.yield}
            color="primary"
          />
          <MetricCard
            icon={<Droplets className="w-6 h-6" />}
            title="Water Efficiency"
            value={`${results.waterUsage}% used`}
            max={100}
            current={100 - results.waterUsage}
            color="secondary"
          />
          <MetricCard
            icon={<Leaf className="w-6 h-6" />}
            title="Soil Health"
            value={`${results.soilHealth}% healthy`}
            max={100}
            current={results.soilHealth}
            color="primary"
          />
          <MetricCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Profit"
            value={`$${results.profit.toLocaleString()}`}
            max={15000}
            current={results.profit}
            color="accent"
          />
        </div>

        {/* AgroBot Analysis */}
        <div className="rounded-xl border-2 border-primary/30 bg-card p-6 mb-8 shadow-[0_0_30px_hsl(var(--primary)/0.1)]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-foreground">AgroBot Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Your irrigation strategy was efficient, using drip irrigation to minimize water waste. 
                The soil health improved by 12% this season due to your organic fertilizer choices. 
                Consider implementing cover crops next season to further boost soil nutrients and reduce erosion.
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-semibold">Tip:</span> NASA's SMAP data shows optimal soil 
                moisture levels were maintained 85% of the time. Try to maintain this consistency for best results.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={`/simulation/${regionId}`}>
            <Button variant="hero" size="lg">
              <RotateCcw className="mr-2" />
              Run Another Simulation
            </Button>
          </Link>
          <Link to="/regions">
            <Button variant="gaming" size="lg">
              Try Different Region
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

const MetricCard = ({
  icon,
  title,
  value,
  max,
  current,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  max: number;
  current: number;
  color: string;
}) => {
  const percentage = (current / max) * 100;
  
  return (
    <div className="p-6 rounded-xl border-2 border-border bg-card hover:border-primary/50 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-${color}/10 text-${color}`}>
          {icon}
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
        </div>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default Results;
