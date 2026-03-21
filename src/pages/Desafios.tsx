import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Check, Circle, Flame, Trophy, Users, Filter,
  Clock, Zap, Brain, Heart, Shield, Star, ChevronRight,
  TrendingUp, Award, Timer, Sparkles, Lock, Info, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { challengeService, leaderboardService } from "@/lib/services";
import { toast } from "sonner";

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
  metadata?: any;
}

const CHALLENGE_CATEGORIES: any = {
  comportamental: { label: "Comportamental", icon: Brain, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  mindfulness: { label: "Mindfulness", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  fisico: { label: "Físico", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  social: { label: "Social", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  cognitivo: { label: "Cognitivo", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

const DIFFICULTY_MAP: any = {
  facil: { label: "Fácil", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  medio: { label: "Médio", color: "text-amber-500", bg: "bg-amber-500/10" },
  dificil: { label: "Difícil", color: "text-rose-500", bg: "bg-rose-500/10" },
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
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allChallenges, userCompletions, lbData] = await Promise.all([
        challengeService.getAll(),
        user ? challengeService.getUserChallenges(user.id) : Promise.resolve([]),
        leaderboardService.getTopUsers()
      ]);
      
      setChallenges(allChallenges as any);
      setCompletedIds(new Set(userCompletions.map(c => c.challenge_id)));
      setLeaderboard(lbData);
    } catch (error) {
      console.error("Erro ao carregar desafios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const totalPoints = useMemo(() => {
    return challenges
      .filter(c => completedIds.has(c.id))
      .reduce((sum, c) => sum + c.points, 0);
  }, [challenges, completedIds]);

  const currentLevel = useMemo(() => {
    if (totalPoints >= 1000) return { level: 5, name: "Mestre da Resiliência", icon: "👑", next: null, progress: 100 };
    if (totalPoints >= 500) return { level: 4, name: "Guerreiro Elite", icon: "⚔️", next: 1000, progress: ((totalPoints - 500) / 500) * 100 };
    if (totalPoints >= 250) return { level: 3, name: "Determinado", icon: "🔥", next: 500, progress: ((totalPoints - 250) / 250) * 100 };
    if (totalPoints >= 100) return { level: 2, name: "Iniciante Forte", icon: "💪", next: 250, progress: ((totalPoints - 100) / 150) * 100 };
    return { level: 1, name: "Primeiro Passo", icon: "🌱", next: 100, progress: (totalPoints / 100) * 100 };
  }, [totalPoints]);

  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => {
      const matchType = c.is_weekly === showWeekly;
      const matchCat = selectedCategory === "all" || c.category === selectedCategory;
      return matchType && matchCat;
    });
  }, [challenges, showWeekly, selectedCategory]);

  const handleToggle = async (challengeId: string) => {
    if (!user) {
      toast.error("Faça login para completar desafios.");
      return;
    }

    const wasCompleted = completedIds.has(challengeId);
    if (wasCompleted) return; // Prevent un-completing for now or implement if needed

    try {
      setIsSyncing(challengeId);
      await challengeService.completeChallenge(user.id, challengeId);
      setCompletedIds(prev => new Set([...prev, challengeId]));
      toast.success("Desafio concluído! +" + challenges.find(c => c.id === challengeId)?.points + " pts");
      loadData(); // Refresh to update leaderboard and points
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
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Sincronizando conquistas...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl pb-20 pt-10">
        <header className="mb-10 text-center">
          <div className="inline-block p-4 rounded-3xl bg-primary/10 mb-4 shadow-sm border border-primary/5">
             <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Desafios Galácticos</h1>
          <p className="text-muted-foreground text-sm font-medium">Ciência aplicada à gamificação para sua liberdade.</p>
        </header>

        {/* LEVEL PROGRESS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[32px] bg-foreground text-background p-8 mb-8 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-[-50%] right-[-20%] w-80 h-80 bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-50%] left-[-20%] w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl bg-background/10 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10">{currentLevel.icon}</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Nível {currentLevel.level}</p>
                  <p className="text-2xl font-black tracking-tight">{currentLevel.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">{totalPoints}</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Score Total</p>
              </div>
            </div>

            {currentLevel.next && (
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold opacity-60">
                  <span>Próximo Nível: {currentLevel.level + 1}</span>
                  <span>{currentLevel.next - totalPoints} pts para o destino</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentLevel.progress}%` }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary),0.8)]"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* TABS & LB */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShowWeekly(false)}
            className={`flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              !showWeekly ? "bg-foreground text-background shadow-lg" : "bg-card border border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            Diários
          </button>
          <button
            onClick={() => setShowWeekly(true)}
            className={`flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              showWeekly ? "bg-foreground text-background shadow-lg" : "bg-card border border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            Semanais
          </button>
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className={`px-4 rounded-2xl transition-all border ${showLeaderboard ? "bg-amber-500 border-amber-600 text-white shadow-lg" : "bg-card border-border text-muted-foreground"}`}
          >
            <Users className="w-5 h-5" />
          </button>
        </div>

        {/* LEADERBOARD VIEW */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-card border-2 border-primary/5 rounded-[32px] p-6 shadow-soft">
                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" /> TOP Guerreiros
                </h3>
                <div className="space-y-4">
                  {leaderboard.length > 0 ? leaderboard.slice(0, 5).map((entry, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        i === 0 ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-bold truncate">{entry.display_name || "Usuário"}</p>
                         <div className="flex items-center gap-2">
                           <span className="text-[10px] text-muted-foreground font-bold">STREAK {entry.current_streak}D</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-black text-primary">{entry.total_points}</p>
                         <p className="text-[9px] font-bold opacity-40">PTS</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center py-4 text-xs text-muted-foreground font-medium">Calculando rankings...</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CATEGORY FILTERS */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {["all", ...Object.keys(CHALLENGE_CATEGORIES)].map(catId => (
            <button
              key={catId}
              onClick={() => setSelectedCategory(catId)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
                selectedCategory === catId 
                ? "bg-primary text-primary-foreground border-primary shadow-md" 
                : "bg-card border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {catId === "all" ? "Tudo" : CHALLENGE_CATEGORIES[catId].label}
            </button>
          ))}
        </div>

        {/* CHALLENGES FEED */}
        <div className="space-y-4">
          {filteredChallenges.map((c, i) => {
            const isDone = completedIds.has(c.id);
            const cat = CHALLENGE_CATEGORIES[c.category] || CHALLENGE_CATEGORIES.comportamental;
            const diff = DIFFICULTY_MAP[c.difficulty] || DIFFICULTY_MAP.medio;
            const isExpanded = expandedChallenge === c.id;

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`group rounded-[28px] border-2 transition-all overflow-hidden ${
                  isDone ? "bg-primary/[0.03] border-primary/20" : "bg-card border-transparent shadow-soft hover:border-primary/10"
                }`}
              >
                <div className="p-5 flex items-start gap-4">
                  <button 
                    onClick={() => handleToggle(c.id)}
                    disabled={isDone || isSyncing === c.id}
                    className={`mt-1 shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center transition-all ${
                      isDone ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground hover:bg-primary/20"
                    }`}
                  >
                    {isSyncing === c.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isDone ? (
                      <Check className="w-5 h-5 stroke-[3px]" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2 pointer-cursor" onClick={() => setExpandedChallenge(isExpanded ? null : c.id)}>
                      <div>
                        <h4 className={`text-base font-bold tracking-tight leading-tight ${isDone ? "text-muted-foreground line-through opacity-60" : "text-foreground"}`}>
                          {c.title}
                        </h4>
                        <div className="flex gap-2 mt-2">
                           <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${cat.bg} ${cat.color} ${cat.border}`}>
                             {cat.label}
                           </span>
                           <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${diff.bg} ${diff.color}`}>
                             {diff.label}
                           </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-black text-primary">+{c.points}</p>
                        <p className="text-[9px] font-black opacity-30">PX</p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pt-4 mt-4 border-t border-border/50"
                        >
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            {c.description}
                          </p>
                          <div className="flex flex-col gap-2 p-3 bg-muted/40 rounded-2xl border border-muted">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                               <Info className="w-3.5 h-3.5 text-primary" />
                               Ciência: {c.technique}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                               <Shield className="w-3.5 h-3.5 text-emerald-500" />
                               Fonte: {c.source}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* MEDICAL DISCLAIMER */}
        <div className="mt-12 p-6 rounded-[32px] bg-muted/50 border border-border text-center">
           <AlertCircle className="w-6 h-6 text-primary mx-auto mb-2" />
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
             Protocolo de Desafios Baseado em Evidências<br />
             OMS • CDC • INCA • TCC
           </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Desafios;
