import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Check, Circle, Flame, Trophy, Users, Filter,
  Clock, Zap, Brain, Heart, Shield, Star, ChevronRight,
  TrendingUp, Award, Timer, Sparkles, Lock, Info, Loader2, AlertCircle, Navigation
} from "lucide-react";
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
  comportamental: { label: "Comportamental", icon: Brain, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
  mindfulness: { label: "Mindfulness", icon: Heart, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  fisico: { label: "Físico", icon: Zap, color: "text-[#528114]", bg: "bg-[#528114]/10", border: "border-[#528114]/20" },
  social: { label: "Social", icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  cognitivo: { label: "Cognitivo", icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
};

const DIFFICULTY_MAP: Record<string, { label: string; color: string; bg: string }> = {
  facil: { label: "Fácil", color: "text-emerald-600", bg: "bg-emerald-50" },
  medio: { label: "Médio", color: "text-amber-600", bg: "bg-amber-50" },
  dificil: { label: "Difícil", color: "text-red-600", bg: "bg-red-50" },
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
    if (totalPoints >= 1000) return { level: 6, name: "Lenda", icon: "💎", next: null, progress: 100 };
    if (totalPoints >= 500) return { level: 5, name: "Mestre", icon: "👑", next: 1000, progress: ((totalPoints - 500) / 500) * 100 };
    if (totalPoints >= 300) return { level: 4, name: "Veterano", icon: "⚔️", next: 500, progress: ((totalPoints - 300) / 200) * 100 };
    if (totalPoints >= 150) return { level: 3, name: "Guerreiro", icon: "🔥", next: 300, progress: ((totalPoints - 150) / 150) * 100 };
    if (totalPoints >= 50) return { level: 2, name: "Iniciante", icon: "💪", next: 150, progress: ((totalPoints - 50) / 100) * 100 };
    return { level: 1, name: "Recruta", icon: "🌱", next: 50, progress: (totalPoints / 50) * 100 };
  }, [totalPoints]);

  const filteredChallenges = useMemo(() => {
    if (challenges.length === 0) return [];
    
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const seed = parseInt(today);

    const typeChallenges = challenges.filter(c => c.is_weekly === showWeekly);
    
    const categoryChallenges = selectedCategory === "all" 
      ? typeChallenges 
      : typeChallenges.filter(c => c.category === selectedCategory);

    if (showWeekly) return categoryChallenges;

    const shuffled = [...categoryChallenges].sort((a, b) => {
      const hashA = (parseInt(a.id.substring(0, 4), 16) + seed) % 101;
      const hashB = (parseInt(b.id.substring(0, 4), 16) + seed) % 101;
      return hashA - hashB;
    });

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
          <Loader2 className="w-8 h-8 text-[#528114] animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-white min-h-screen pb-32">
        <div className="bg-[#528114] text-white pt-10 pb-8 px-4 flex flex-col items-center rounded-b-3xl">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/20 shadow-sm text-4xl">
            {currentLevel.icon}
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Central de Missões</h1>
          <p className="text-white/80 font-medium text-sm">
            Nível {currentLevel.level} • {currentLevel.name}
          </p>
        </div>

        <div className="px-4 py-8 max-w-lg mx-auto space-y-8">

          {/* LEVEL PROGRESS */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-center mb-6">
               <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-[#528114] mb-1">Pontos Atuais</p>
                  <p className="text-4xl font-light text-black flex items-end gap-1">
                     {totalPoints} <span className="text-base font-bold text-gray-400 mb-1">PX</span>
                  </p>
               </div>
             </div>

             {currentLevel.next && (
               <div className="space-y-3">
                 <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                   <span>Nível {currentLevel.level + 1}</span>
                   <span className="text-[#528114]">{currentLevel.next - totalPoints} PX Faltantes</span>
                 </div>
                 <div className="w-full h-2.5 bg-[#F2F2F7] rounded-full overflow-hidden">
                   <motion.div
                     initial={{ width: 0 }}
                     animate={{ width: `${currentLevel.progress}%` }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     className="h-full bg-[#528114]"
                   />
                 </div>
               </div>
             )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowWeekly(false)}
              className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                !showWeekly ? "bg-[#528114] text-white" : "bg-[#F2F2F7] text-gray-500 hover:bg-gray-200"
              }`}
            >
              Missões Diárias
            </button>
            <button
              onClick={() => setShowWeekly(true)}
              className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                showWeekly ? "bg-[#528114] text-white" : "bg-[#F2F2F7] text-gray-500 hover:bg-gray-200"
              }`}
            >
              Objetivos Mensais
            </button>
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                showLeaderboard ? "bg-[#528114] text-white" : "bg-[#F2F2F7] text-gray-500 hover:bg-gray-200"
              }`}
            >
              <Users className="w-4 h-4" />
            </button>
          </div>

          {/* LEADERBOARD VIEW */}
          <AnimatePresence mode="wait">
            {showLeaderboard && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm mb-2">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#528114] mb-6 flex items-center gap-2">
                    <Trophy className="w-4 h-4" /> Ranking Elite
                  </h3>
                  <div className="space-y-4">
                    {leaderboard.length > 0 ? leaderboard.slice(0, 5).map((entry, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          i === 0 ? "bg-[#528114] text-white shadow-md" : "bg-[#F2F2F7] text-gray-500"
                        }`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold text-black truncate">{entry.display_name || "Membro"}</p>
                           <p className="text-xs text-gray-500">Combo: {entry.current_streak || 0} dias</p>
                        </div>
                        <div className="text-right">
                           <p className="text-base font-bold text-[#528114]">{entry.total_points}</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PX</p>
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center py-6 text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mb-2 text-gray-300" />
                        <p className="text-xs font-semibold">Carregando...</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CATEGORY FILTERS */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["all", ...Object.keys(CHALLENGE_CATEGORIES)].map(catId => (
              <button
                key={catId}
                onClick={() => setSelectedCategory(catId)}
                className={`flex-shrink-0 h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  selectedCategory === catId 
                  ? "bg-black text-white" 
                  : "bg-[#F2F2F7] text-gray-500 hover:bg-gray-200"
                }`}
              >
                {catId === "all" ? "Todas" : CHALLENGE_CATEGORIES[catId].label}
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
                <div
                   key={c.id}
                   className={`rounded-[20px] bg-white border outline-none overflow-hidden transition-colors ${
                     isDone ? "border-transparent bg-gray-50 opacity-60 grayscale" : "border-gray-100 hover:border-gray-200 shadow-sm"
                   }`}
                >
                  <div className="p-5 flex items-start gap-4">
                    <button 
                      onClick={() => handleToggle(c.id)}
                      disabled={isDone || isSyncing === c.id}
                      className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors border ${
                        isDone ? "bg-[#528114] border-[#528114] text-white" : "bg-[#F2F2F7] border-transparent text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      {isSyncing === c.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : isDone ? (
                        <Check className="w-6 h-6 stroke-[3px]" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0" onClick={() => setExpandedChallenge(isExpanded ? null : c.id)}>
                      <div className="flex justify-between items-start cursor-pointer">
                        <div className="space-y-2">
                          <h4 className={`text-base font-bold leading-tight ${isDone ? "text-gray-500 line-through" : "text-black"}`}>
                            {c.title}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                             <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
                               {cat.label}
                             </span>
                             <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${diff.bg} ${diff.color}`}>
                               {diff.label}
                             </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-[#528114]">+{c.points}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">PX</p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 mt-4 border-t border-gray-100 space-y-4">
                              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                {c.description}
                              </p>
                              <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                   <Brain size={16} className="text-gray-400" />
                                   <div className="flex flex-col">
                                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base</span>
                                     <span className="text-xs font-bold text-gray-700">{c.technique}</span>
                                   </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                   <Shield size={16} className="text-gray-400" />
                                   <div className="flex flex-col">
                                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fonte Médica</span>
                                     <span className="text-xs font-bold text-gray-700 truncate max-w-[200px]">{c.source}</span>
                                   </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default Desafios;
