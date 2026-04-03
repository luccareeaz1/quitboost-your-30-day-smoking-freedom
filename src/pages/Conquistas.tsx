import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  Trophy, Star, Flame, Heart, Shield, Zap, Target,
  Award, Lock, Share2, ChevronRight, Sparkles, Clock,
  TrendingUp, Crown, Medal, Gift, Check, Info, Loader2, AlertCircle, ArrowRight
} from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { achievementService } from "@/lib/services";
import { toast } from "sonner";
import { AppleCard } from "@/components/ui/apple-card";

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  rarity: "comum" | "raro" | "épico" | "lendário";
  icon_url: string;
  requirement_type: string;
  requirement_value: number;
  medical_fact?: string;
  source?: string;
}

interface RarityConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
}

const RARITY_MAP: Record<string, RarityConfig> = {
  "comum": { label: "Comum", color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", glow: "" },
  "raro": { label: "Raro", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]" },
  "épico": { label: "Épico", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]" },
  "lendário": { label: "Lendário", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "shadow-glow" },
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
    const totalPoints = unlockedList.reduce((sum, a) => sum + a.points, 0);
    
    const lockedList = achievements.filter(a => !unlockedIds.has(a.id));
    const nextAchievement = lockedList.find(a => a.requirement_type === 'days') || null;
    
    let progress = 0;
    if (nextAchievement) {
       progress = Math.min(100, (diffDays / nextAchievement.requirement_value) * 100);
    }

    const currentLevel = (() => {
      if (totalPoints >= 1000) return { level: 6, name: "Lenda Galáctica", icon: "🌌" };
      if (totalPoints >= 500) return { level: 5, name: "Almirante", icon: "👑" };
      if (totalPoints >= 300) return { level: 4, name: "Veterano", icon: "⚔️" };
      if (totalPoints >= 150) return { level: 3, name: "Explorador", icon: "🔥" };
      if (totalPoints >= 50) return { level: 2, name: "Cadete", icon: "💪" };
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
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 1.5 }} 
            className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full shadow-glow" 
          />
          <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-[10px] italic animate-pulse text-center">Sincronizando Hall da Fama...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl pb-32 pt-12 relative z-10">
        <header className="mb-16 text-center">
           <motion.div 
             initial={{ scale: 0 }} 
             animate={{ scale: 1 }} 
             className="inline-block p-6 rounded-[2rem] bg-primary/10 mb-6 border border-primary/20 shadow-glow relative group"
           >
             <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:bg-primary/20 transition-all rounded-full" />
             <Crown className="w-10 h-10 text-primary relative z-10" />
           </motion.div>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 italic text-white leading-none">
             Hall da <span className="text-primary drop-shadow-glow">Fama</span>
           </h1>
           <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.5em] italic">
             {stats.unlockedCount} de {achievements.length} Protokollos Sincronizados
           </p>
        </header>

        {/* LEVEL CARD - PREMIUM GLASS */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative group mb-12"
        >
          <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
          <AppleCard className="bg-card/40 backdrop-blur-3xl p-10 relative overflow-hidden rounded-[2.5rem] border border-border/40 shadow-elevated">
            <div className="absolute top-[-40%] right-[-10%] w-96 h-96 bg-primary/10 blur-[100px] rounded-full animate-pulse" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-[1.5rem] bg-black/40 border border-primary/20 flex items-center justify-center text-6xl shadow-glow">
                  {stats.currentLevel.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 text-primary italic mb-2">Classificação de Frota</p>
                  <p className="text-4xl font-black tracking-tighter italic text-white uppercase">{stats.currentLevel.name}</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-6xl font-black text-primary drop-shadow-glow italic tracking-tighter leading-none">
                  <AnimatedCounter value={stats.totalPoints} />
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 text-white italic mt-2">PX Acumulados</p>
              </div>
            </div>
          </AppleCard>
        </motion.div>

        {/* PROGRESS TRACKER */}
        {stats.nextAchievement && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-card/20 backdrop-blur-md border border-border/20 rounded-[2.5rem] p-8 mb-12 shadow-inner"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
               <div className="flex items-center gap-4">
                 <div className="p-4 rounded-[1rem] bg-primary/10 border border-primary/20"><Target className="w-6 h-6 text-primary" /></div>
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Próximo Marco Neuronal</p>
                   <p className="text-xl font-black italic text-white">{stats.nextAchievement.title}</p>
                 </div>
               </div>
               <div className="text-center sm:text-right">
                  <p className="text-xl font-black text-primary italic tracking-tight italic">-{stats.nextAchievement.requirement_value - stats.diffDays} dias</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Para Sincronização</p>
               </div>
            </div>
            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
               <motion.div
                 initial={{ width: 0 }}
                 animate={{ width: `${stats.progress}%` }}
                 transition={{ duration: 2, ease: "circOut" }}
                 className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full shadow-glow relative"
               >
                 <div className="absolute inset-0 bg-white/20 animate-pulse opacity-50" />
               </motion.div>
            </div>
          </motion.div>
        )}

        {/* FILTERS - NEUMORPHIC DARK */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
           {['all', 'unlocked', 'locked'].map(f => (
             <button
               key={f}
               onClick={() => setFilter(f as 'all' | 'unlocked' | 'locked')}
               className={`px-8 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.3em] border transition-all italic hover:scale-105 active:scale-95 ${
                 filter === f 
                 ? "bg-primary text-white border-primary shadow-glow" 
                 : "bg-card/40 text-muted-foreground border-border/40 hover:bg-card/60 backdrop-blur-xl"
               }`}
             >
               {f === 'all' ? "Arsenal Completo" : f === 'unlocked' ? "Sincronizados" : "Bloqueados"}
             </button>
           ))}
        </div>

        {/* ACHIEVEMENT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredList.map((badge, i) => {
             const unlocked = unlockedIds.has(badge.id);
             const rarity = RARITY_MAP[badge.rarity] || RARITY_MAP.comum;
             
             return (
               <motion.div
                 key={badge.id}
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 whileInView={{ opacity: 1, scale: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.05 }}
                 onClick={() => unlocked && setSelectedAchievement(badge)}
                 className={`group rounded-[2.5rem] p-8 border transition-all duration-500 relative overflow-hidden ${
                   unlocked 
                   ? `bg-card/40 backdrop-blur-xl border-border/40 cursor-pointer hover:border-primary/40 hover:shadow-elevated hover:scale-[1.03]`
                   : "bg-white/5 border-transparent opacity-30 grayscale cursor-not-allowed"
                 }`}
               >
                 {unlocked && (
                    <div className={`absolute -top-10 -right-10 w-24 h-24 ${rarity.color.replace('text-', 'bg-')}/5 blur-[40px] rounded-full group-hover:scale-150 transition-transform`} />
                 )}
                 <div className="flex flex-col items-center text-center relative z-10">
                    <div className={`w-24 h-24 rounded-[1.8rem] mb-6 flex items-center justify-center text-5xl transition-all duration-500 shadow-inner ${
                      unlocked ? `bg-black/40 border ${rarity.border} ${rarity.glow}` : "bg-white/5 border border-white/5"
                    } group-hover:scale-110 group-hover:rotate-6`}>
                      {unlocked ? (badge.icon_url || "🏅") : <Lock className="w-10 h-10 text-white/20" />}
                    </div>
                    <div className="mb-4">
                       <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border mb-3 inline-block italic ${rarity.bg} ${rarity.color} ${rarity.border}`}>
                         {rarity.label}
                       </span>
                       <h4 className="text-lg font-black tracking-tighter text-white italic line-clamp-1 group-hover:text-primary transition-colors">{badge.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground font-bold leading-relaxed mb-6 line-clamp-2 italic opacity-60">
                       {badge.description}
                    </p>
                    <div className="flex items-center justify-between w-full mt-auto pt-6 border-t border-white/5">
                       <span className="text-[10px] font-black text-primary italic uppercase tracking-widest">+{badge.points} PX</span>
                       {unlocked && <Share2 className="w-4 h-4 text-muted-foreground hover:text-white transition-colors" />}
                    </div>
                 </div>
               </motion.div>
             );
           })}
        </div>

        {/* MODAL - ULTRA PREMIUM OVERLAY */}
        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                className="bg-card w-full max-w-xl rounded-[3rem] border border-primary/20 p-10 shadow-glow relative overflow-hidden text-center"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute inset-0 bg-primary/2 pointer-events-none" />
                <div className="w-40 h-40 rounded-[2.5rem] bg-black/60 border border-primary/30 flex items-center justify-center text-8xl mx-auto mb-10 shadow-glow rotate-3">
                  {selectedAchievement.icon_url || "🏅"}
                </div>
                <h3 className="text-4xl font-black italic text-white tracking-tighter mb-4 leading-none">{selectedAchievement.title}</h3>
                <p className="text-xl font-bold italic text-white/60 mb-10 leading-relaxed px-4">
                  {selectedAchievement.description}
                </p>

                {selectedAchievement.medical_fact && (
                  <div className="bg-primary/5 rounded-[2rem] p-8 text-left mb-10 border border-primary/20 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                       <Shield className="w-5 h-5 text-primary drop-shadow-glow" />
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic leading-none">Dados de Biocontrole</h4>
                    </div>
                    <p className="text-sm font-bold text-white/80 leading-relaxed italic relative z-10">
                      "{selectedAchievement.medical_fact}"
                    </p>
                    {selectedAchievement.source && (
                      <p className="text-[10px] text-muted-foreground font-black mt-6 uppercase tracking-[0.2em] italic relative z-10 opacity-40">Fonte: {selectedAchievement.source}</p>
                    )}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    className="flex-1 h-16 rounded-[1.5rem] bg-white text-black font-black italic uppercase tracking-[0.3em] text-[11px] transition-all hover:scale-105 active:scale-95 shadow-glow" 
                    onClick={() => setSelectedAchievement(null)}
                  >
                     Cerrar Protokollo
                  </Button>
                  <Button variant="outline" className="h-16 w-16 rounded-[1.5rem] border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-90 border-none">
                     <Share2 className="w-6 h-6 text-white" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMMAND FOOTER */}
        <div className="mt-24 p-12 rounded-[2.5rem] bg-card/20 backdrop-blur-md border border-border/20 text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <AlertCircle className="w-8 h-8 text-primary/40 mx-auto mb-6 group-hover:animate-bounce" />
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] leading-loose italic max-w-2xl mx-auto">
             Marcos Evolutivos Sincronizados com Dados de Saúde Real.<br />
             Cada emblema representa a reconquista de autonomia celular.
           </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Conquistas;

// Custom utility components can go here
