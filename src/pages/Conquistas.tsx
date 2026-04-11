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
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 pb-32">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-left">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 shadow-sm">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Galeria de Honra</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Suas <span className="text-primary italic">Maiores Vitórias</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Cada conquista é um marco na sua nova vida livre de fumo.</p>
        </div>

        <Card className="bg-slate-900 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-2xl shadow-slate-200">
           <div className={cn("w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-lg", stats.currentLevel.color)}>
             <stats.currentLevel.icon className="w-8 h-8" />
           </div>
           <div>
             <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Nível {stats.currentLevel.level}</p>
             <h3 className="text-2xl font-black text-white">{stats.currentLevel.name}</h3>
             <p className="text-xs font-bold text-primary">{stats.totalPoints} Pontos de Honra</p>
           </div>
        </Card>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Achievement List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex gap-4 mb-8">
            {['all', 'unlocked', 'locked'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as 'all' | 'unlocked' | 'locked')}
                className={cn(
                  "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  filter === f 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                  : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
                )}
              >
                {f === 'all' ? "Toda a Coleção" : f === 'unlocked' ? "Desbloqueadas" : "Por Alcançar"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             {filteredList.map((badge, i) => {
               const unlocked = unlockedIds.has(badge.id);
               const rarity = RARITY_MAP[badge.rarity] || RARITY_MAP.comum;
               
               return (
                 <motion.div
                   key={badge.id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.05 }}
                   onClick={() => unlocked && setSelectedAchievement(badge)}
                   className={cn(
                     "p-6 rounded-[2.5rem] bg-white border border-slate-100 transition-all group relative overflow-hidden",
                     unlocked ? "cursor-pointer hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1" : "opacity-40 grayscale-0 bg-slate-50/50"
                   )}
                 >
                   {!unlocked && <Lock className="absolute top-6 right-6 w-4 h-4 text-slate-300" />}
                   
                   <div className="flex items-center gap-6">
                     <div className={cn(
                       "w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner transition-transform group-hover:rotate-6",
                       unlocked ? rarity.bg : "bg-slate-200"
                     )}>
                        {badge.emoji || badge.icon || "🏅"}
                     </div>
                     
                     <div className="flex-1 min-w-0">
                       <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg mb-2 inline-block", rarity.bg, rarity.color)}>
                         {rarity.label}
                       </span>
                       <h4 className="text-lg font-black text-slate-900 truncate tracking-tight">{badge.title}</h4>
                       <p className="text-xs text-slate-500 font-bold mt-1">+{badge.points} Honor Points</p>
                     </div>
                   </div>
                 </motion.div>
               );
             })}
          </div>
        </div>

        {/* Next Goal Area */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10 relative overflow-hidden">
             <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Próxima Meta</h3>
               <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                 <Target className="w-5 h-5" />
               </div>
             </div>

             {stats.nextAchievement ? (
               <div className="space-y-10">
                 <div className="flex items-center gap-4">
                   <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl grayscale opacity-50">
                     {stats.nextAchievement.emoji || "🏅"}
                   </div>
                   <div>
                     <h4 className="font-black text-lg text-slate-900">{stats.nextAchievement.title}</h4>
                     <p className="text-xs text-slate-400 font-bold">Faltam {Math.max(0, (stats.nextAchievement.required_days || 0) - stats.diffDays)} dias</p>
                   </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black text-primary uppercase tracking-widest">
                       <span>Progresso da Missão</span>
                       <span>{Math.round(stats.progress)}%</span>
                    </div>
                    <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.progress}%` }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                 </div>
                 
                 <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-start gap-4">
                    <TrendingUp className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <p className="text-sm font-bold text-emerald-800 leading-relaxed">
                      Continue firme! No dia {stats.nextAchievement.required_days}, seu corpo terá removido quase todo o alcatrão acumulado.
                    </p>
                 </div>
               </div>
             ) : (
               <div className="text-center py-20">
                 <p className="text-slate-400 font-bold">Você alcançou todas as metas!</p>
               </div>
             )}
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10 bg-gradient-to-br from-primary to-emerald-600 text-white">
             <h3 className="text-2xl font-black mb-4">Compartilhar Sucesso</h3>
             <p className="text-white/80 font-medium mb-10 leading-relaxed">Mostre ao mundo quanto você é forte. Inspire outras pessoas a também serem livres.</p>
             <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl h-14 font-black uppercase tracking-widest text-xs gap-3">
               <Share2 className="w-4 h-4" />
               Postar no Clube
             </Button>
          </Card>
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
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl relative z-10 text-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center text-6xl mx-auto mb-10 shadow-inner">
                {selectedAchievement.emoji || selectedAchievement.icon || "🏅"}
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{selectedAchievement.title}</h3>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">Emblema de Honra Desbloqueado</p>
              
              <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">
                {selectedAchievement.description}
              </p>

              {selectedAchievement.medical_fact && (
                <div className="bg-emerald-50 rounded-[2.5rem] p-8 mb-10 border border-emerald-100 text-left relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Shield className="w-20 h-20 text-primary" />
                   </div>
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                        <Shield className="w-4 h-4" />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Fato Médico Protegido</h4>
                   </div>
                   <p className="text-sm text-emerald-900 font-bold leading-relaxed relative z-10">
                     {selectedAchievement.medical_fact}
                   </p>
                </div>
              )}

              <Button 
                className="w-full bg-slate-900 text-white font-black h-16 rounded-2xl uppercase tracking-widest text-xs active:scale-95 transition-all shadow-xl shadow-slate-200" 
                onClick={() => setSelectedAchievement(null)}
              >
                 Confirmar
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
