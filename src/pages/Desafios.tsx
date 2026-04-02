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
  metadata?: Record<string, any>;
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
          <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Sincronizando Conquistas Galácticas...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl pb-32 pt-10 animate-fade-in space-y-12">
        <header className="mb-14 text-center">
          <div className="inline-block p-6 rounded-3xl bg-emerald-500/10 mb-6 shadow-2xl border border-emerald-500/20 relative group overflow-hidden">
             <div className="absolute inset-0 bg-emerald-500/5 rotate-45 group-hover:bg-emerald-500/10 transition-colors" />
             <Trophy size={36} className="text-emerald-400 relative z-10" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 text-white italic">Mission <span className="text-emerald-400 drop-shadow-glow">Control.</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">Protocolos de Gamificação Aplicada • Nível de Dificuldade: Adaptativo</p>
        </header>

        {/* LEVEL PROGRESS */}
        <AppleCard
          variant="glass-dark"
          className="rounded-[40px] border-emerald-500/20 p-10 mb-12 relative overflow-hidden shadow-2xl group"
        >
          <div className="absolute top-[-50%] right-[-20%] w-80 h-80 bg-emerald-500/5 blur-[120px] rounded-full group-hover:bg-emerald-500/10 transition-colors duration-1000" />
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-10">
              <div className="flex items-center gap-6">
                <div className="text-5xl bg-white/5 w-20 h-20 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl group-hover:rotate-12 transition-transform duration-700">{currentLevel.icon}</div>
                <div className="text-center sm:text-left">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400 glow-sm">Rank: Categoria {currentLevel.level}</p>
                  <p className="text-3xl font-black tracking-tighter text-white italic">{currentLevel.name}</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">{totalPoints}</p>
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">PX Acumulados</p>
              </div>
            </div>

            {currentLevel.next && (
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                  <span>Upgrade para Categoria {currentLevel.level + 1}</span>
                  <span className="text-emerald-400">{currentLevel.next - totalPoints} PX para o Salto</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentLevel.progress}%` }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  />
                </div>
              </div>
            )}
          </div>
        </AppleCard>

        {/* TABS & LB */}
        <div className="flex gap-3 mb-10">
          <button
            onClick={() => setShowWeekly(false)}
            className={`flex-1 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
              !showWeekly ? "bg-white text-black shadow-2xl" : "bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10"
            }`}
          >
            Missões Diárias
          </button>
          <button
            onClick={() => setShowWeekly(true)}
            className={`flex-1 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
              showWeekly ? "bg-white text-black shadow-2xl" : "bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10"
            }`}
          >
            Objetivos Mensais
          </button>
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className={`w-14 h-14 rounded-2xl transition-all border flex items-center justify-center ${showLeaderboard ? "bg-emerald-500 border-emerald-400 text-black shadow-2xl" : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"}`}
          >
            <Users className="w-5 h-5" />
          </button>
        </div>

        {/* LEADERBOARD VIEW */}
        <AnimatePresence mode="wait">
          {showLeaderboard && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <AppleCard variant="glass-dark" className="border-emerald-500/10 rounded-[32px] p-8 shadow-2xl bg-emerald-500/5">
                <h3 className="text-xl font-black text-white italic tracking-tighter mb-8 flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-amber-400" /> Ranking da Frota Elite
                </h3>
                <div className="space-y-6">
                  {leaderboard.length > 0 ? leaderboard.slice(0, 5).map((entry, i) => (
                    <div key={i} className="flex items-center gap-6 group relative">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                        i === 0 ? "bg-amber-400/20 border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]" : "bg-white/5 border-white/10 text-gray-400"
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                         <p className="text-base font-black text-white truncate group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{entry.display_name || "Comandante Solitário"}</p>
                         <div className="flex items-center gap-3 mt-1">
                           <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest italic group-hover:text-gray-400 transition-colors">Neural Sync {entry.current_streak}D</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-lg font-black text-emerald-400 drop-shadow-glow">{entry.total_points}</p>
                         <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">PX</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center py-6 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] animate-pulse">Sincronizando Dados da Frota...</p>
                  )}
                </div>
              </AppleCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CATEGORY FILTERS */}
        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
          {["all", ...Object.keys(CHALLENGE_CATEGORIES)].map(catId => (
            <button
              key={catId}
              onClick={() => setSelectedCategory(catId)}
              className={`h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                selectedCategory === catId 
                ? "bg-white text-black border-white shadow-2xl" 
                : "bg-white/5 border-white/10 text-gray-500 hover:border-emerald-500/40"
              }`}
            >
              {catId === "all" ? "Filtro: Base" : CHALLENGE_CATEGORIES[catId].label}
            </button>
          ))}
        </div>

        {/* CHALLENGES FEED */}
        <div className="space-y-6">
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
                transition={{ delay: i * 0.05 }}
              >
                <AppleCard
                   variant="glass-dark"
                   className={`group rounded-[32px] border transition-all duration-700 overflow-hidden p-0 ${
                     isDone ? "border-emerald-500/20 opacity-50 bg-emerald-500/5" : "border-white/5 hover:border-emerald-500/30"
                   }`}
                >
                  <div className="p-8 flex items-start gap-6">
                    <button 
                      onClick={() => handleToggle(c.id)}
                      disabled={isDone || isSyncing === c.id}
                      className={`mt-1 shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                        isDone ? "bg-emerald-500 border-white text-black shadow-[0_0_20px_#10b981]" : "bg-white/5 border-white/10 text-gray-600 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                      }`}
                    >
                      {isSyncing === c.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : isDone ? (
                        <Check className="w-7 h-7 stroke-[3px]" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-4 cursor-pointer" onClick={() => setExpandedChallenge(isExpanded ? null : c.id)}>
                        <div className="space-y-3">
                          <h4 className={`text-xl font-black tracking-tight leading-tight italic ${isDone ? "text-gray-500 line-through" : "text-white"}`}>
                            {c.title}
                          </h4>
                          <div className="flex flex-wrap gap-2 pt-1">
                             <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-sm border ${cat.bg} ${cat.color} ${cat.border} tracking-widest`}>
                               PROTOCOL: {cat.label}
                             </span>
                             <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-sm border ${diff.bg} ${diff.color} border-current opacity-60 tracking-widest`}>
                               {diff.label}
                             </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xl font-black text-emerald-400 drop-shadow-glow">+{c.points}</p>
                          <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">PX</p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pt-6 mt-6 border-t border-white/5 space-y-6"
                          >
                            <p className="text-base text-gray-400 leading-relaxed font-bold">
                              {c.description}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                 <Brain size={16} className="text-emerald-400" />
                                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Base Neural: {c.technique}</span>
                              </div>
                              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                 <Shield size={16} className="text-emerald-400" />
                                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fonte Info: {c.source}</span>
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
        <AppleCard variant="glass-dark" className="mt-16 p-10 rounded-[32px] border-white/5 text-center bg-transparent">
           <Navigation size={28} className="text-emerald-400 mx-auto mb-4 animate-pulse" />
           <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] leading-relaxed italic">
             Protocolos de Expansão de Consciência e Resiliência<br />
             Bases: OMS • CDC • INCA • TCC v2.0
           </p>
        </AppleCard>
      </div>
    </AppLayout>
  );
};

export default Desafios;
