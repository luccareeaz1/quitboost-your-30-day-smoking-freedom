import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Check, Circle, Flame, Trophy, Users, Filter,
  Clock, Zap, Brain, Heart, Shield, Star, ChevronRight,
  TrendingUp, Award, Timer, Sparkles, Lock, Info, Loader2, AlertCircle, Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { challengeService, leaderboardService } from "@/lib/services";
import { toast } from "sonner";
import { AppleCard } from "@/components/ui/apple-card";

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  difficulty: "facil" | "medio" | "dificil";
  technique: string;
  source: string;
  is_weekly: boolean;
  metadata?: Record<string, unknown>;
}

interface LeaderboardEntry {
  id: string;
  display_name: string;
  total_points: number;
  current_level: number;
  current_streak?: number;
}

interface CategoryConfig {
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
}

const CHALLENGE_CATEGORIES: Record<string, CategoryConfig> = {
  comportamental: { label: "Comportamental", icon: Brain, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  mindfulness: { label: "Mindfulness", icon: Heart, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  fisico: { label: "Físico", icon: Zap, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  social: { label: "Social", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  cognitivo: { label: "Cognitivo", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

const DIFFICULTY_MAP: Record<string, { label: string; color: string; bg: string }> = {
  facil: { label: "Fácil", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  medio: { label: "Médio", color: "text-amber-400", bg: "bg-amber-500/10" },
  dificil: { label: "Difícil", color: "text-rose-400", bg: "bg-rose-500/10" },
};

const Desafios = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showWeekly, setShowWeekly] = useState(false);
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [allChallenges, userCompletions, lbData] = await Promise.all([
        challengeService.getAll(),
        user ? challengeService.getUserChallenges(user.id) : Promise.resolve([]),
        leaderboardService.getTop()
      ]);
      
      setChallenges(allChallenges as Challenge[]);
      setCompletedIds(new Set(userCompletions.map(c => c.challenge_id)));
      setLeaderboard(lbData as unknown as LeaderboardEntry[]);
    } catch (error) {
      console.error("Erro ao carregar desafios:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalPoints = useMemo(() => {
    return challenges
      .filter(c => completedIds.has(c.id))
      .reduce((sum, c) => sum + c.points, 0);
  }, [challenges, completedIds]);

  const currentLevel = useMemo(() => {
    if (totalPoints >= 1000) return { level: 10, name: "Soberano Galáctico", icon: "👑", next: null, progress: 100 };
    if (totalPoints >= 500) return { level: 4, name: "Guerreiro Elite", icon: "⚔️", next: 1000, progress: ((totalPoints - 500) / 500) * 100 };
    if (totalPoints >= 250) return { level: 3, name: "Navegador Sóbrio", icon: "🚀", next: 500, progress: ((totalPoints - 250) / 250) * 100 };
    if (totalPoints >= 100) return { level: 2, name: "Piloto Aprendiz", icon: "🛰️", next: 250, progress: ((totalPoints - 100) / 150) * 100 };
    return { level: 1, name: "Cadete Espacial", icon: "🌱", next: 100, progress: (totalPoints / 100) * 100 };
  }, [totalPoints]);

  const filteredChallenges = useMemo(() => {
    if (challenges.length === 0) return [];
    
    // Create a seed based on current date (YYYYMMDD)
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const seed = parseInt(today);

    // Filter by type (Daily vs Weekly)
    const typeChallenges = challenges.filter(c => c.is_weekly === showWeekly);
    
    // Filter by Category
    const categoryChallenges = selectedCategory === "all" 
      ? typeChallenges 
      : typeChallenges.filter(c => c.category === selectedCategory);

    if (showWeekly) return categoryChallenges;

    // For Daily Missions, we shuffle deterministically based on date seed
    // and take a subset to ensure variety every 24h
    const shuffled = [...categoryChallenges].sort((a, b) => {
      // Simple hash function using the challenge ID and the date seed
      const hashA = (parseInt(a.id.substring(0, 4), 16) + seed) % 101;
      const hashB = (parseInt(b.id.substring(0, 4), 16) + seed) % 101;
      return hashA - hashB;
    });

    // Show top 8 challenges of the day (varied every 24h)
    return shuffled.slice(0, 8);
  }, [challenges, showWeekly, selectedCategory]);

  const handleToggle = async (challengeId: string) => {
    if (!user) {
      toast.error("Faça login para completar desafios.");
      return;
    }

    const wasCompleted = completedIds.has(challengeId);
    if (wasCompleted) return;

    try {
      setIsSyncing(challengeId);
      await challengeService.completeChallenge(user.id, challengeId);
      setCompletedIds(prev => new Set([...prev, challengeId]));
      toast.success("Missão concluída! +" + challenges.find(c => c.id === challengeId)?.points + " PX");
      loadData();
    } catch (error) {
      toast.error("Erro ao salvar progresso.");
    } finally {
      setIsSyncing(null);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-pulse shadow-glow">
            <Trophy size={40} fill="currentColor" />
          </div>
          <p className="text-muted-foreground font-black uppercase tracking-widest text-sm font-medium animate-pulse italic">
            Sincronizando Conquistas Galácticas...
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl pb-32 pt-10 animate-fade-in space-y-12 relative z-10">
        <header className="mb-14 text-center">
          <div className="inline-block p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl mb-8 shadow-elevated border border-border/40 relative group overflow-hidden">
             <div className="absolute inset-0 bg-primary/5 rotate-45 group-hover:bg-primary/10 transition-colors duration-700" />
             <Trophy size={48} className="text-primary relative z-10 drop-shadow-glow" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white italic leading-none">
            Mission <span className="text-primary drop-shadow-glow">Control.</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium font-black uppercase tracking-widest leading-relaxed italic">
            Protocolos de Gamificação Aplicada • Nível de Dificuldade: Adaptativo Neural
          </p>
        </header>

        {/* LEVEL PROGRESS */}
        <AppleCard
          className="rounded-[40px] border-primary/20 p-10 mb-12 relative overflow-hidden shadow-elevated group bg-card/40 backdrop-blur-3xl"
        >
          <div className="absolute top-[-50%] right-[-20%] w-80 h-80 bg-primary/10 blur-[120px] rounded-full group-hover:bg-primary/20 transition-all duration-1000" />
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-10 mb-12">
              <div className="flex items-center gap-8">
                <div className="text-5xl bg-black/60 w-24 h-24 rounded-[2rem] flex items-center justify-center border border-border/40 shadow-glow group-hover:rotate-12 transition-transform duration-700 backdrop-blur-md">
                  {currentLevel.icon}
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-base font-medium font-black uppercase tracking-widest text-primary italic leading-none mb-2">Rank: Categoria {currentLevel.level}</p>
                  <p className="text-4xl font-black tracking-tighter text-white italic leading-none">{currentLevel.name}</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-6xl font-black text-white drop-shadow-glow italic leading-none">{totalPoints}</p>
                <p className="text-base font-medium font-black uppercase tracking-widest text-muted-foreground mt-2 italic leading-none">PX Acumulados</p>
              </div>
            </div>

            {currentLevel.next && (
              <div className="space-y-5">
                <div className="flex justify-between text-base font-medium font-black uppercase tracking-widest text-muted-foreground italic leading-none">
                  <span>Upgrade para Categoria {currentLevel.level + 1}</span>
                  <span className="text-primary">{currentLevel.next - totalPoints} PX para o Salto</span>
                </div>
                <div className="w-full h-4 bg-black/60 rounded-full overflow-hidden border border-border/40 p-[2px] shadow-inner backdrop-blur-sm">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentLevel.progress}%` }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="h-full bg-primary rounded-full shadow-glow"
                  />
                </div>
              </div>
            )}
          </div>
        </AppleCard>

        {/* TABS & LB NAVIGATION */}
        <div className="flex flex-wrap gap-4 mb-12">
          <button
            onClick={() => setShowWeekly(false)}
            className={`flex-1 h-16 rounded-[1.2rem] text-base font-medium font-black uppercase tracking-widest transition-all italic ${
              !showWeekly ? "bg-white text-black shadow-glow scale-[1.02] border-white" : "bg-card/40 border border-border/40 text-muted-foreground hover:bg-card/60 hover:text-white"
            }`}
          >
            Missões Diárias
          </button>
          <button
            onClick={() => setShowWeekly(true)}
            className={`flex-1 h-16 rounded-[1.2rem] text-base font-medium font-black uppercase tracking-widest transition-all italic ${
              showWeekly ? "bg-white text-black shadow-glow scale-[1.02] border-white" : "bg-card/40 border border-border/40 text-muted-foreground hover:bg-card/60 hover:text-white"
            }`}
          >
            Objetivos Mensais
          </button>
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className={`w-16 h-16 rounded-[1.2rem] transition-all border flex items-center justify-center shadow-lg ${showLeaderboard ? "bg-primary border-primary text-primary-foreground shadow-glow scale-[1.05]" : "bg-card/40 border-border/40 text-muted-foreground hover:bg-card/60 hover:text-white"}`}
          >
            <Users className="w-7 h-7" />
          </button>
        </div>

        {/* LEADERBOARD VIEW */}
        <AnimatePresence mode="wait">
          {showLeaderboard && (
            <motion.div
              initial={{ height: 0, opacity: 0, scale: 0.98 }}
              animate={{ height: "auto", opacity: 1, scale: 1 }}
              exit={{ height: 0, opacity: 0, scale: 0.98 }}
              className="overflow-hidden mb-12"
            >
              <AppleCard className="border-primary/10 rounded-[40px] p-10 shadow-elevated bg-card/40 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
                <h3 className="text-2xl font-black text-white italic tracking-tighter mb-10 flex items-center gap-4 relative z-10 leading-none">
                  <Trophy className="w-8 h-8 text-primary drop-shadow-glow" fill="currentColor" /> Ranking da Frota Elite
                </h3>
                <div className="space-y-8 relative z-10">
                  {leaderboard.length > 0 ? leaderboard.slice(0, 5).map((entry, i) => (
                    <div key={i} className="flex items-center gap-8 group/entry relative">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border transition-all duration-500 ${
                        i === 0 ? "bg-primary text-primary-foreground border-white shadow-glow scale-110" : "bg-black/60 border-border/40 text-muted-foreground group-hover/entry:border-primary/40"
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                         <p className="text-lg font-black text-white truncate group-hover/entry:text-primary transition-colors uppercase tracking-tight italic">{entry.display_name || "Comandante Solitário"}</p>
                         <div className="flex items-center gap-3 mt-1">
                           <span className="text-sm font-medium text-muted-foreground font-black uppercase tracking-widest italic group-hover/entry:text-foreground transition-colors leading-none">Neural Sync {entry.current_streak}D</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-2xl font-black text-primary drop-shadow-glow italic leading-none">{entry.total_points}</p>
                         <p className="text-sm font-medium font-black text-muted-foreground uppercase tracking-widest mt-1 leading-none italic">PX</p>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center py-10 gap-4">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="text-sm font-medium text-muted-foreground font-black uppercase tracking-widest animate-pulse italic">
                        Sincronizando Dados da Frota...
                      </p>
                    </div>
                  )}
                </div>
              </AppleCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CATEGORY FILTERS */}
        <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          {["all", ...Object.keys(CHALLENGE_CATEGORIES)].map(catId => (
            <button
              key={catId}
              onClick={() => setSelectedCategory(catId)}
              className={`h-12 px-8 rounded-2xl text-sm font-medium font-black uppercase tracking-widest transition-all whitespace-nowrap border italic flex items-center gap-3 ${
                selectedCategory === catId 
                ? "bg-white text-black border-white shadow-glow scale-105" 
                : "bg-card/40 border-border/40 text-muted-foreground hover:border-primary/40 hover:text-white"
              }`}
            >
              {catId !== "all" && <span className="w-2 h-2 rounded-full bg-current shadow-glow" />}
              {catId === "all" ? "Filtro: Base Central" : CHALLENGE_CATEGORIES[catId].label}
            </button>
          ))}
        </div>

        {/* CHALLENGES FEED */}
        <div className="space-y-8">
          {filteredChallenges.map((c, i) => {
            const isDone = completedIds.has(c.id);
            const cat = CHALLENGE_CATEGORIES[c.category] || CHALLENGE_CATEGORIES.comportamental;
            const diff = DIFFICULTY_MAP[c.difficulty] || DIFFICULTY_MAP.medio;
            const isExpanded = expandedChallenge === c.id;

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              >
                <AppleCard
                   className={`group rounded-[40px] border transition-all duration-700 overflow-hidden p-0 shadow-elevated ${
                     isDone ? "border-primary/10 opacity-40 bg-card/10 blur-[0.5px]" : "border-border/40 hover:border-primary/30 bg-card/40 backdrop-blur-2xl"
                   }`}
                >
                  <div className="p-10 flex items-start gap-8">
                    <button 
                      onClick={() => handleToggle(c.id)}
                      disabled={isDone || isSyncing === c.id}
                      className={`mt-1 shrink-0 w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 border-2 relative ${
                        isDone ? "bg-primary border-white text-primary-foreground shadow-glow scale-110" : "bg-black/60 border-border/40 text-muted-foreground hover:bg-primary/20 hover:border-primary/40 hover:text-primary backdrop-blur-md"
                      }`}
                    >
                      {isSyncing === c.id ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : isDone ? (
                        <Check className="w-10 h-10 stroke-[4px]" />
                      ) : (
                        <Circle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-6 cursor-pointer" onClick={() => setExpandedChallenge(isExpanded ? null : c.id)}>
                        <div className="space-y-4">
                          <h4 className={`text-2xl font-black tracking-tighter leading-none italic transition-all duration-500 ${isDone ? "text-muted-foreground line-through opacity-60" : "text-white group-hover:text-primary"}`}>
                            {c.title}
                          </h4>
                          <div className="flex flex-wrap gap-3 pt-1">
                             <span className={`text-sm font-medium font-black uppercase px-4 py-1.5 rounded-full border shadow-sm ${cat.bg} ${cat.color} ${cat.border} tracking-widest italic leading-none`}>
                               PROTOCOL: {cat.label}
                             </span>
                             <span className={`text-sm font-medium font-black uppercase px-4 py-1.5 rounded-full border shadow-sm ${diff.bg} ${diff.color} border-current opacity-70 tracking-widest italic leading-none`}>
                               LVL: {diff.label}
                             </span>
                          </div>
                        </div>
                        <div className="text-right ml-6 shrink-0 pt-1">
                          <p className="text-3xl font-black text-primary drop-shadow-glow leading-none italic">+{c.points}</p>
                          <p className="text-sm font-medium font-black text-muted-foreground uppercase tracking-widest mt-1 italic leading-none">PX</p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            className="pt-10 mt-8 border-t border-border/20 space-y-8"
                          >
                            <p className="text-lg text-muted-foreground leading-relaxed font-bold italic">
                              {c.description}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="flex items-center gap-4 p-5 bg-black/40 rounded-[1.5rem] border border-border/20 backdrop-blur-md group/info">
                                 <Brain size={20} className="text-primary group-hover/info:scale-110 transition-transform" />
                                 <div className="flex flex-col">
                                   <span className="text-sm font-medium font-black text-primary uppercase tracking-widest italic mb-1">Base Neural</span>
                                   <span className="text-base font-medium font-bold text-white uppercase tracking-wider">{c.technique}</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4 p-5 bg-black/40 rounded-[1.5rem] border border-border/20 backdrop-blur-md group/info">
                                 <Shield size={20} className="text-primary group-hover/info:scale-110 transition-transform" />
                                 <div className="flex flex-col">
                                   <span className="text-sm font-medium font-black text-primary uppercase tracking-widest italic mb-1">Fonte Info</span>
                                   <span className="text-base font-medium font-bold text-white uppercase tracking-wider truncate max-w-[120px]">{c.source}</span>
                                 </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </AppleCard>
              </motion.div>
            );
          })}
        </div>

        {/* MEDICAL DISCLAIMER */}
        <AppleCard className="mt-20 p-12 rounded-[40px] border-border/20 text-center bg-transparent backdrop-blur-sm group hover:border-primary/20 transition-all duration-700">
           <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
             <Navigation size={32} className="text-primary animate-pulse shadow-glow" />
           </div>
           <p className="text-sm font-medium font-black text-muted-foreground uppercase tracking-widest leading-loose italic group-hover:text-white transition-colors">
             Protocolos de Expansão de Consciência e Resiliência Neural<br />
             <span className="text-primary/60 group-hover:text-primary transition-colors">Bases Globais: OMS • CDC • INCA • TCC v3.0</span>
           </p>
        </AppleCard>
      </div>
    </AppLayout>
  );
};

export default Desafios;
