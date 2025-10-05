import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, ArrowLeft, Trophy, Star, Lock, Play, Clock, Award, Rocket, Satellite, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import mapBackground from "@/assets/game-map-background.jpg";
import farmerCharacter from "@/assets/farmer-character.png";
import wizardMap from "@/assets/wizardMap212.png";

interface Level {
  id: number;
  name: string;
  description: string;
  icon: string;
  route: string;
  position: { x: number; y: number };
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  rewards: number;
}

const levels: Level[] = [
  {
    id: 1,
    name: "Cosmic Seed Selection",
    description: "Choose optimal seeds using NASA satellite temperature and rainfall data",
    icon: "🌱",
    route: "/games/level1",
    position: { x: 15, y: 80 },
    difficulty: "Easy",
    estimatedTime: "5 min",
    rewards: 100,
  },
  {
    id: 2,
    name: "Orbital Water Management",
    description: "Optimize irrigation using NASA's advanced soil moisture monitoring",
    icon: "💧",
    route: "/games/level2",
    position: { x: 35, y: 60 },
    difficulty: "Easy",
    estimatedTime: "8 min",
    rewards: 150,
  },
  {
    id: 3,
    name: "Satellite Pest Detection",
    description: "Identify pest-affected zones using NASA NDVI satellite imagery",
    icon: "🐛",
    route: "/games/level3",
    position: { x: 50, y: 45 },
    difficulty: "Medium",
    estimatedTime: "12 min",
    rewards: 200,
  },
  {
    id: 4,
    name: "Space-Age Market Analysis",
    description: "Analyze drought patterns from space to optimize crop trading",
    icon: "💹",
    route: "/games/level4",
    position: { x: 65, y: 30 },
    difficulty: "Medium",
    estimatedTime: "15 min",
    rewards: 250,
  },
  {
    id: 5,
    name: "Galactic Farm Commander",
    description: "Master seasonal planning with NASA's climate forecasting systems",
    icon: "🚀",
    route: "/games/level5",
    position: { x: 85, y: 15 },
    difficulty: "Hard",
    estimatedTime: "20 min",
    rewards: 300,
  },
];

interface GameProgress {
  completed: number[];
  current: number;
  scores: { [key: number]: number };
  totalScore: number;
  achievements: string[];
}

const GameMap = () => {
  const navigate = useNavigate();
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    completed: [],
    current: 1,
    scores: {},
    totalScore: 0,
    achievements: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear progress when the program starts (new session)
    const initializeGame = () => {
      // Check if this is a new session by looking for a session flag
      const sessionFlag = sessionStorage.getItem("gameSessionStarted");
      
      if (!sessionFlag) {
        // New session - clear localStorage and set session flag
        localStorage.removeItem("gameProgress");
        sessionStorage.setItem("gameSessionStarted", "true");
      }

      // Load progress from localStorage with error handling
      try {
        const savedProgress = localStorage.getItem("gameProgress");
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          setGameProgress({
            completed: progress.completed || [],
            current: progress.current || 1,
            scores: progress.scores || {},
            totalScore: progress.totalScore || 0,
            achievements: progress.achievements || [],
          });
        } else {
          // Set default progress for new session
          setGameProgress({
            completed: [],
            current: 1,
            scores: {},
            totalScore: 0,
            achievements: [],
          });
        }
      } catch (error) {
        console.error("Error loading game progress:", error);
        // Reset to default on error
        setGameProgress({
          completed: [],
          current: 1,
          scores: {},
          totalScore: 0,
          achievements: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
  }, []);

  const saveProgress = (newProgress: GameProgress) => {
    try {
      localStorage.setItem("gameProgress", JSON.stringify(newProgress));
      setGameProgress(newProgress);
    } catch (error) {
      console.error("Error saving game progress:", error);
    }
  };

  const isLevelUnlocked = (levelId: number) => {
    return levelId === 1 || gameProgress.completed.includes(levelId - 1);
  };

  const isLevelCompleted = (levelId: number) => {
    return gameProgress.completed.includes(levelId);
  };

  const getLevelScore = (levelId: number) => {
    return gameProgress.scores[levelId] || 0;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-gradient-to-r from-emerald-500/20 to-green-400/20 text-emerald-300 border border-emerald-500/40";
      case "Medium":
        return "bg-gradient-to-r from-amber-500/20 to-orange-400/20 text-amber-300 border border-amber-500/40";
      case "Hard":
        return "bg-gradient-to-r from-red-500/20 to-pink-400/20 text-red-300 border border-red-500/40";
      default:
        return "bg-gradient-to-r from-slate-500/20 to-gray-400/20 text-slate-300 border border-slate-500/40";
    }
  };

  const handleLevelClick = (level: Level) => {
    if (isLevelUnlocked(level.id)) {
      navigate(level.route);
    }
  };

  const completionPercentage = (gameProgress.completed.length / levels.length) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto">
              <Satellite className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 rounded-full animate-ping mx-auto" />
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Initializing AgroVerse</h3>
            <p className="text-slate-400">Connecting to NASA satellites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Enhanced Space Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
        </div>

        {/* Floating Space Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-10 text-4xl opacity-20"
          >
            🛰️
          </motion.div>
          <motion.div
            animate={{ x: [0, -80, 0], y: [0, 30, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-40 right-20 text-3xl opacity-25"
          >
            🌍
          </motion.div>
          <motion.div
            animate={{ x: [0, 120, 0], y: [0, -30, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-40 left-20 text-2xl opacity-20"
          >
            🚀
          </motion.div>
        </div>

        {/* Premium Header */}
        <header className="relative z-20 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-2xl shadow-2xl">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <Link to="/">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-300 transition-all duration-300 border border-transparent hover:border-emerald-500/30"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Mission Control
                </Button>
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 bg-slate-800/50 rounded-2xl px-6 py-3 border border-slate-700/50 backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Sprout className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Satellite className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      AgroVerse
                    </h1>
                    <p className="text-xs text-slate-400 font-medium">NASA Space Farm Academy</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-700/50">
                  <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {gameProgress.totalScore}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Cosmic Points</div>
                </div>
                <Badge className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-700 text-slate-300 border border-slate-600/50 hover:border-emerald-500/50 transition-all">
                  <Trophy className="w-4 h-4 mr-2 text-emerald-400" />
                  {gameProgress.completed.length}/5 Missions
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 py-16">
          {/* Hero Title Section */}
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl px-8 py-3 border border-slate-600/50 mb-8"
            >
              <Globe className="w-5 h-5 text-cyan-400" />
              <span className="text-slate-300 font-medium">NASA-Powered Agriculture Training</span>
              <Rocket className="w-5 h-5 text-emerald-400" />
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Space Farm
              </span>
              <br />
              <span className="text-white">Academy</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
              Master the art of cosmic agriculture through progressive space missions. 
              Harness NASA's cutting-edge satellite technology and become the ultimate 
              <span className="text-emerald-400 font-medium"> AgroVerse Guardian</span>.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative w-full max-w-7xl mx-auto h-[700px] rounded-3xl border border-slate-700/30 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-16"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:80px_80px]" />
            
            <div 
              className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat "
              style={{ backgroundImage: `url(${wizardMap})`, zIndex: 1 }}
            ></div>
            {/* Enhanced Level Nodes */}
            {levels.map((level, index) => {
              const unlocked = isLevelUnlocked(level.id);
              const completed = isLevelCompleted(level.id);
              const isCurrent = gameProgress.current === level.id && !completed;
              const score = getLevelScore(level.id);

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: index * 0.2 + 0.8,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  className="absolute"
                  style={{
                    left: `${level.position.x}%`,
                    top: `${level.position.y}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={unlocked ? { scale: 1.15, rotate: 5 } : {}}
                        whileTap={unlocked ? { scale: 0.9 } : {}}
                        onHoverStart={() => setHoveredLevel(level.id)}
                        onHoverEnd={() => setHoveredLevel(null)}
                        onClick={() => handleLevelClick(level)}
                        className={`relative ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      >
                        {(completed || isCurrent) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-full blur-xl scale-150" />
                        )}
                        
                        <div
                          className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl transition-all duration-500 border-2 relative ${
                            completed
                              ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-600 text-white border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.6)]"
                              : unlocked
                              ? "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-emerald-400 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)]"
                              : "bg-gradient-to-br from-slate-800/60 via-slate-900/60 to-slate-800/60 text-slate-500 border-slate-600/50"
                          }`}
                        >
                          {!unlocked ? (
                            <Lock className="w-7 h-7" />
                          ) : completed ? (
                            <div className="relative">
                              <Trophy className="w-7 h-7" />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-sm"
                              />
                            </div>
                          ) : (
                            <span className="text-3xl">{level.icon}</span>
                          )}
                        </div>

                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-emerald-500 rounded-full flex items-center justify-center text-sm font-bold text-emerald-400 shadow-lg">
                          {level.id}
                        </div>
                        {completed && score > 0 && (
                          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            {score}
                          </div>
                        )}

                        {isCurrent && (
                          <>
                            <motion.div
                              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 rounded-full border-2 border-emerald-400"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                              className="absolute inset-0 rounded-full border-2 border-cyan-400"
                            />
                          </>
                        )}
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-slate-800/95 border-slate-700 backdrop-blur-sm">
                      <div className="text-center">
                        <p className="font-semibold text-white">{level.name}</p>
                        <p className="text-sm text-slate-300 mt-1 max-w-xs">{level.description}</p>
                        {!unlocked && <p className="text-sm text-red-400 mt-2">🔒 Complete previous mission to unlock</p>}
                      </div>
                    </TooltipContent>
                  </Tooltip>

                  {/* Enhanced Hover Card */}
                  <AnimatePresence>
                    {hoveredLevel === level.id && unlocked && (
                      <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.8 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                        className="absolute top-28 left-1/2 -translate-x-1/2 w-80 z-40"
                      >
                        <Card className="border border-slate-700/50 shadow-2xl bg-slate-900/95 backdrop-blur-2xl overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
                          <CardHeader className="pb-4 relative">
                            <CardTitle className="text-xl flex items-center gap-4 text-white">
                              <span className="text-3xl">{completed ? "🏆" : level.icon}</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  Mission {level.id}: {level.name}
                                  {completed && <Star className="w-4 h-4 text-yellow-400" />}
                                </div>
                                {completed && score > 0 && (
                                  <div className="text-sm text-emerald-400 font-normal mt-1">
                                    Achievement Score: {score} points
                                  </div>
                                )}
                              </div>
                            </CardTitle>
                            <CardDescription className="text-sm text-slate-400 leading-relaxed">
                              {level.description}
                            </CardDescription>
                            <div className="flex items-center gap-2 mt-4 flex-wrap">
                              <Badge className={`text-xs font-medium ${getDifficultyColor(level.difficulty)}`}>
                                {level.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 bg-slate-800/50">
                                <Clock className="w-3 h-3 mr-1" />
                                {level.estimatedTime}
                              </Badge>
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 bg-slate-800/50">
                                <Award className="w-3 h-3 mr-1" />
                                {level.rewards} pts
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 relative">
                            <Button 
                              onClick={() => handleLevelClick(level)}
                              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                              size="sm"
                            >
                              <Play className="mr-2 h-4 w-4" />
                              {completed ? "Replay Mission" : "Start Mission"}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Enhanced Farmer Character */}
            <motion.div
              animate={{
                left: `${levels[Math.min(gameProgress.current - 1, levels.length - 1)]?.position.x}%`,
                top: `${levels[Math.min(gameProgress.current - 1, levels.length - 1)]?.position.y}%`,
              }}
              transition={{ duration: 2, type: "spring", damping: 25 }}
              className="absolute w-20 h-20 -translate-x-1/2 -translate-y-20"
              style={{ zIndex: 15 }}
            >
              <motion.div
                className="relative"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-lg scale-150" />
                <img
                  src={farmerCharacter}
                  alt="Space Farmer"
                  className="w-full h-full object-contain drop-shadow-2xl relative z-10"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enhanced Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8"
          >
            {/* Enhanced Progress Card */}
            <Card className="border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3 text-white text-lg">
                  <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg">
                    <Trophy className="w-5 h-5 text-emerald-400" />
                  </div>
                  Mission Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">Academy Completion</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      {Math.round(completionPercentage)}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={completionPercentage} className="h-4 bg-slate-800" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-sm" />
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {levels.map((level) => (
                      <div
                        key={level.id}
                        className={`h-3 rounded-full transition-all duration-500 ${
                          isLevelCompleted(level.id)
                            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            : isLevelUnlocked(level.id)
                            ? "bg-slate-600"
                            : "bg-slate-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Stats Card */}
            <Card className="border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3 text-white text-lg">
                  <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                    <Star className="w-5 h-5 text-blue-400" />
                  </div>
                  Space Academy Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      {gameProgress.totalScore}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Cosmic Points</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {gameProgress.completed.length}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Missions Complete</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {gameProgress.achievements.length}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Achievements</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                      {gameProgress.current}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Current Mission</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Ambient Elements */}
        <div className="absolute top-32 left-32 w-40 h-40 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-32 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-16 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
      </div>
    </TooltipProvider>
  );
};

export default GameMap;
