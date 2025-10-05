import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sprout, Globe2, Database, Trophy, Gamepad2 } from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center animate-fade-in">
          {/* Logo/Title */}
          <div className="mb-8 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <Sprout className="w-12 h-12 text-primary animate-pulse-glow" />
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                AgroVerse
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl text-muted-foreground font-semibold">
              Guardians of the Green Planet
            </h2>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-foreground/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Learn sustainable agriculture through an immersive farming simulation powered by{" "}
            <span className="text-primary font-semibold">NASA Earth datasets</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/regions">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                <Sprout className="mr-2" />
                Start Farming
              </Button>
            </Link>
            <Link to="/game-map">
              <Button variant="gaming" size="xl" className="w-full sm:w-auto">
                <Gamepad2 className="mr-2" />
                Game Zone
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                <Database className="mr-2" />
                Explore NASA Data
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <FeatureCard
              icon={<Globe2 className="w-8 h-8" />}
              title="Real NASA Data"
              description="Use authentic satellite imagery, soil moisture, and climate data"
            />
            <FeatureCard
              icon={<Sprout className="w-8 h-8" />}
              title="Sustainable Farming"
              description="Learn eco-friendly practices and optimize resource usage"
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8" />}
              title="Compete & Learn"
              description="Earn badges, climb leaderboards, and join teams"
            />
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-float" style={{ animationDelay: "2s" }} />
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="group relative p-6 rounded-xl bg-card border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Index;
