import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Regions from "./pages/Regions";
import Simulation from "./pages/Simulation";
import Results from "./pages/Results";
import About from "./pages/About";
import GameMap from "./pages/GameMap";
import Level1 from "./pages/games/Level1";
import Level2 from "./pages/games/Level2";
import Level3 from "./pages/games/Level3";
import Level4 from "./pages/games/Level4";
import Level5 from "./pages/games/Level5";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/simulation/:regionId" element={<Simulation />} />
          <Route path="/results/:regionId" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="/game-map" element={<GameMap />} />
          <Route path="/games/level1" element={<Level1 />} />
          <Route path="/games/level2" element={<Level2 />} />
          <Route path="/games/level3" element={<Level3 />} />
          <Route path="/games/level4" element={<Level4 />} />
          <Route path="/games/level5" element={<Level5 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
