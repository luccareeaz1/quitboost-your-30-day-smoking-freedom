import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Star, Flame, Heart, Shield, Zap, Target,
  Award, Lock, Share2, ChevronRight, Sparkles, Clock,
  TrendingUp, Crown, Medal, Gift, Check, Info, Loader2, AlertCircle, ArrowRight,
  TrendingDown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { achievementService } from "@/lib/services";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  points: number | null;
  emoji: string | null;
  icon: string | null;
  color: string | null;
  rarity: string | null;
  required_days: number | null;
  medical_fact?: string | null;
  medical_source?: string | null;
}

const RARITY_MAP: Record<string, any> = {
  "comum": { label: "Comum", color: "text-slate-400", bg: "bg-slate-100", border: "border-slate-200" },
  "raro": { label: "Raro", color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-100" },
  "épico": { label: "Épico", color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" },
  "lendário": { label: "Lendário", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
};

export default function Conquistas() {
  const { user, profile } = useAuth();
  
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [all, userAchievements] = await Promise.all([
        achievementService.getAll(),
        achievementService.getUserAchievements(user.id)
      ]);
      setAchievements(all as Achievement[]);
      setUnlockedIds(new Set(userAchievements.map(ua => ua.achievement_id)));
    } catch (error) {
      console.error("Erro ao carregar conquistas:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(() => {
    if (!profile) return null;
    const quitDate = new Date(profile.quit_date || new Date().toISOString());
    const diffDays = Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const unlockedList = achievements.filter(a => unlockedIds.has(a.id));
    const totalPoints = unlockedList.reduce((sum, a) => sum + (a.points || 0), 0);
    
    const lockedList = achievements.filter(a => !unlockedIds.has(a.id));
    const nextAchievement = lockedList.find(a => a.required_days != null) || null;
    
    let progress = 0;
    if (nextAchievement) {
       progress = Math.min(100, Math.max(0, (diffDays / (nextAchievement.required_days || 1)) * 100));
    }

    const currentLevel = (() => {
      if (totalPoints >= 1000) return { level: 6, name: "Lenda", icon: Crown, color: "text-rose-500" };
      if (totalPoints >= 500) return { level: 5, name: "Mestre", icon: Trophy, color: "text-amber-500" };
      if (totalPoints >= 300) return { level: 4, name: "Veterano", icon: Medal, color: "text-indigo-500" };
      if (totalPoints >= 150) return { level: 3, name: "Guerreiro", icon: Zap, color: "text-primary" };
      if (totalPoints >= 50) return { level: 2, name: "Iniciante", icon: Flame, color: "text-orange-500" };
      return { level: 1, name: "Recruta", icon: Star, color: "text-slate-400" };
    })();

    return { diffDays, totalPoints, unlockedCount: unlockedList.length, nextAchievement, progress, currentLevel };
  }, [profile, achievements, unlockedIds]);

  const filteredList = useMemo(() => {
    if (filter === "unlocked") return achievements.filter(a => unlockedIds.has(a.id));
    if (filter === "locked") return achievements.filter(a => !unlockedIds.has(a.id));
    return achievements;
  }, [achievements, unlockedIds, filter]);

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-vh-60 gap-6">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="px-6 py-8 md:px-10 md:py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Trophy className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Galeria de Conquistas</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Suas <span className="text-blue-600">Grandes Vitórias</span></h1>
            <p className="text-slate-500 mt-2 text-sm">Acompanhe cada marco alcançado na sua nova jornada.</p>
          </div>

          <div className="p-4 md:p-6 border border-slate-200 bg-white rounded-2xl flex items-center gap-4 shadow-sm">
             <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
               <stats.currentLevel.icon className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Nível {stats.currentLevel.level}</p>
               <h3 className="text-lg font-bold text-slate-900 leading-tight">{stats.currentLevel.name}</h3>
               <p className="text-[11px] font-semibold text-blue-600">{stats.totalPoints} Pontos</p>
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Achievement List */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'all', label: 'Toda a Coleção' },
                { id: 'unlocked', label: 'Desbloqueadas' },
                { id: 'locked', label: 'Por Alcançar' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={cn(
                    "px-5 py-2 rounded-lg text-xs font-semibold transition-all border",
                    filter === f.id 
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm" 
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredList.map((badge, i) => {
                const unlocked = unlockedIds.has(badge.id);
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => unlocked && setSelectedAchievement(badge)}
                    className={cn(
                      "p-4 rounded-xl border transition-all flex items-center gap-4 bg-white",
                      unlocked ? "cursor-pointer border-slate-200 hover:border-blue-300 hover:shadow-sm" : "opacity-30 border-slate-100 bg-slate-50/50 grayscale"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0",
                      unlocked ? "bg-blue-50 text-blue-600" : "bg-slate-200"
                    )}>
                      {badge.emoji || badge.icon || "🏅"}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">{badge.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">+{badge.points} Pontos</p>
                    </div>

                    {!unlocked && <Lock className="w-3.5 h-3.5 text-slate-300" />}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 md:p-8 border border-slate-200 bg-white rounded-2xl shadow-sm">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-slate-900">Próxima Meta</h3>
                 <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Target className="w-4 h-4" />
                 </div>
               </div>

               {stats.nextAchievement ? (
                 <div className="space-y-6">
                   <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-2xl grayscale opacity-30 border border-slate-100">
                       {stats.nextAchievement.emoji || "🏅"}
                     </div>
                     <div>
                       <h4 className="font-bold text-sm text-slate-900">{stats.nextAchievement.title}</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Faltam {Math.max(0, (stats.nextAchievement.required_days || 0) - stats.diffDays)} dias</p>
                     </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex justify-between text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                         <span>Progresso</span>
                         <span>{Math.round(stats.progress)}{"%"}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.progress}%` }}
                          className="h-full bg-blue-600 rounded-full"
                        />
                      </div>
                   </div>
                   
                   <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                     No dia {stats.nextAchievement.required_days}, sua capacidade pulmonar terá uma melhora definitiva de {"15%"}.
                   </p>
                 </div>
               ) : (
                 <div className="text-center py-10">
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Coleção Completa!</p>
                 </div>
               )}
            </div>

            <div className="p-8 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
               <h3 className="text-lg font-bold mb-2">Compartilhar</h3>
               <p className="text-white/80 text-xs font-medium mb-8 leading-relaxed">Inspire outras pessoas com suas conquistas na comunidade.</p>
               <Button className="w-full bg-white text-blue-600 hover:bg-slate-50 rounded-lg h-10 text-xs font-bold uppercase tracking-widest gap-2">
                 <Share2 className="w-3.5 h-3.5" />
                 Postar no Clube
               </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
              onClick={() => setSelectedAchievement(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white w-full max-w-md rounded-2xl p-8 md:p-10 shadow-lg relative z-10 text-center border border-slate-200"
            >
              <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center text-4xl mx-auto mb-6 border border-blue-100">
                {selectedAchievement.emoji || selectedAchievement.icon || "🏅"}
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">{selectedAchievement.title}</h3>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-6">Emblema Desbloqueado</p>
              
              <p className="text-slate-500 font-medium mb-8 leading-relaxed text-sm">
                {selectedAchievement.description}
              </p>

              {selectedAchievement.medical_fact && (
                <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100 text-left">
                   <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      <h4 className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Impacto na sua Saúde</h4>
                   </div>
                   <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                     {selectedAchievement.medical_fact}
                   </p>
                </div>
              )}

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-lg uppercase tracking-widest text-xs" 
                onClick={() => setSelectedAchievement(null)}
              >
                 Continuar
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
