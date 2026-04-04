import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  Trophy, Star, Flame, Heart, Shield, Zap, Target,
  Award, Lock, Share2, ChevronRight, Sparkles, Clock,
  TrendingUp, Crown, Medal, Gift, Check, Info, Loader2, AlertCircle, ArrowRight
} from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { achievementService } from "@/lib/services";

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

interface RarityConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
}

const RARITY_MAP: Record<string, RarityConfig> = {
  "comum": { label: "Comum", color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-200" },
  "raro": { label: "Raro", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  "épico": { label: "Épico", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
  "lendário": { label: "Lendário", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
};

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const ctrl = animate(0, value, { duration: 2, ease: "easeOut", onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => ctrl.stop();
  }, [value]);
  return <span>{display}</span>;
}

const Conquistas = () => {
  const navigate = useNavigate();
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
      if (totalPoints >= 1000) return { level: 6, name: "Lenda", icon: "💎" };
      if (totalPoints >= 500) return { level: 5, name: "Mestre", icon: "👑" };
      if (totalPoints >= 300) return { level: 4, name: "Veterano", icon: "⚔️" };
      if (totalPoints >= 150) return { level: 3, name: "Guerreiro", icon: "🔥" };
      if (totalPoints >= 50) return { level: 2, name: "Iniciante", icon: "💪" };
      return { level: 1, name: "Recruta", icon: "🌱" };
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
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl mb-4 border border-white/20 shadow-sm">
            {stats.currentLevel.icon}
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">{stats.currentLevel.name}</h1>
          <p className="text-white/80 font-medium">{stats.unlockedCount} de {achievements.length} conquistas</p>
        </div>

        <div className="px-4 py-8 max-w-lg mx-auto space-y-8">
          
          <div className="bg-[#F2F2F7] rounded-[24px] p-6 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase text-gray-400 tracking-widest mb-1">Total de Pontos</p>
            <p className="text-5xl font-light text-[#528114] tracking-tight">
              <AnimatedCounter value={stats.totalPoints} /> 
              <span className="text-lg font-bold ml-1">PX</span>
            </p>
          </div>

          {stats.nextAchievement && (
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-[#528114]/10 rounded-xl">
                   <Target className="w-6 h-6 text-[#528114]" />
                 </div>
                 <div>
                   <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Próximo Marco</p>
                   <p className="text-lg font-bold text-black">{stats.nextAchievement.title}</p>
                 </div>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
                 <motion.div
                   initial={{ width: 0 }}
                   animate={{ width: `${stats.progress}%` }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="h-full bg-[#528114]"
                 />
              </div>
              <p className="text-sm font-medium text-gray-500 text-right">
                Restam {(stats.nextAchievement.required_days || 0) - stats.diffDays} dias
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {['all', 'unlocked', 'locked'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as 'all' | 'unlocked' | 'locked')}
                className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  filter === f 
                  ? "bg-[#528114] text-white" 
                  : "bg-[#F2F2F7] text-gray-500 hover:bg-gray-200"
                }`}
              >
                {f === 'all' ? "Tudo" : f === 'unlocked' ? "Desbloqueado" : "Bloqueado"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
             {filteredList.map((badge, i) => {
               const unlocked = unlockedIds.has(badge.id);
               const rarity = RARITY_MAP[badge.rarity] || RARITY_MAP.comum;
               
               return (
                 <div
                   key={badge.id}
                   onClick={() => unlocked && setSelectedAchievement(badge)}
                   className={`flex items-center gap-4 p-4 rounded-[20px] transition-all bg-white border ${
                     unlocked ? "border-gray-200 active:scale-95 cursor-pointer shadow-sm" : "border-transparent opacity-60 grayscale cursor-not-allowed bg-gray-50"
                   }`}
                 >
                   <div className={`w-16 h-16 shrink-0 rounded-[14px] flex items-center justify-center text-3xl ${unlocked ? "bg-[#F2F2F7]" : "bg-gray-200"}`}>
                     {unlocked ? (badge.emoji || badge.icon || "🏅") : <Lock className="w-6 h-6 text-gray-400" />}
                   </div>
                   
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-base font-bold truncate ${unlocked ? "text-black" : "text-gray-500"}`}>{badge.title}</h4>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${rarity.bg} ${rarity.color}`}>
                          {rarity.label}
                        </span>
                     </div>
                     <p className="text-sm font-medium text-gray-500 line-clamp-1">{badge.description}</p>
                   </div>
                   
                   <div className="text-sm font-bold text-[#528114]">
                     {unlocked && (
                        <span>+{badge.points} XP</span>
                     )}
                   </div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] p-8 pb-12 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 sm:hidden" />
              
              <div className="w-24 h-24 rounded-2xl bg-[#F2F2F7] flex items-center justify-center text-5xl mx-auto mb-6">
                {selectedAchievement.emoji || selectedAchievement.icon || "🏅"}
              </div>
              
              <h3 className="text-2xl font-bold text-center text-black mb-2">{selectedAchievement.title}</h3>
              <p className="text-[15px] text-center text-gray-500 mb-8 leading-relaxed">
                {selectedAchievement.description}
              </p>

              {selectedAchievement.medical_fact && (
                <div className="bg-[#528114]/5 rounded-2xl p-5 mb-8 border border-[#528114]/10">
                  <div className="flex items-center gap-2 mb-2">
                     <Shield className="w-4 h-4 text-[#528114]" />
                     <h4 className="text-xs font-bold uppercase tracking-widest text-[#528114]">Fato Médico</h4>
                  </div>
                  <p className="text-[13px] text-gray-700 font-medium leading-relaxed">
                    {selectedAchievement.medical_fact}
                  </p>
                </div>
              )}

              <button 
                className="w-full bg-[#528114] text-white font-bold h-14 rounded-[16px] text-[15px] active:scale-95 transition-transform" 
                onClick={() => setSelectedAchievement(null)}
              >
                 Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </AppLayout>
  );
};

export default Conquistas;

// Custom utility components can go here
