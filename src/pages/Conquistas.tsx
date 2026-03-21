import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  Trophy, Star, Flame, Heart, Shield, Zap, Target,
  Award, Lock, Share2, ChevronRight, Sparkles, Clock,
  TrendingUp, Crown, Medal, Gift, Check, Info, Loader2
} from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { achievementService } from "@/lib/services";
import { toast } from "sonner";

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

const RARITY_MAP: any = {
  "comum": { label: "Comum", color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20" },
  "raro": { label: "Raro", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  "épico": { label: "Épico", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  "lendário": { label: "Lendário", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
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

  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [all, userAchievements] = await Promise.all([
        achievementService.getAll(),
        achievementService.getUserAchievements(user.id)
      ]);
      setAchievements(all as any);
      setUnlockedIds(new Set(userAchievements.map(ua => ua.achievement_id)));
    } catch (error) {
      console.error("Erro ao carregar conquistas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Derived stats
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
      if (totalPoints >= 1000) return { level: 6, name: "Lenda Viva", icon: "🌌" };
      if (totalPoints >= 500) return { level: 5, name: "Mestre", icon: "👑" };
      if (totalPoints >= 300) return { level: 4, name: "Guerreiro", icon: "⚔️" };
      if (totalPoints >= 150) return { level: 3, name: "Determinado", icon: "🔥" };
      if (totalPoints >= 50) return { level: 2, name: "Iniciante Forte", icon: "💪" };
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Sincronizando seu Hall da Fama...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl pb-24 pt-10">
        <header className="mb-10 text-center animate-fade-in">
           <div className="inline-block p-4 rounded-full bg-amber-500/10 mb-4 border border-amber-500/20 shadow-lg shadow-amber-500/5">
             <Crown className="w-8 h-8 text-amber-500" />
           </div>
           <h1 className="text-4xl font-black tracking-tight mb-2">Conquistas</h1>
           <p className="text-muted-foreground text-sm font-medium">
             {stats.unlockedCount} de {achievements.length} badges desbloqueadas.
           </p>
        </header>

        {/* LEVEL CARD */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="rounded-[32px] bg-foreground text-background p-8 mb-8 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-[-40%] right-[-10%] w-72 h-72 bg-primary/20 blur-[100px] rounded-full" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-5xl border border-white/5 shadow-inner">
                {stats.currentLevel.icon}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Classificação</p>
                <p className="text-2xl font-black tracking-tight">{stats.currentLevel.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.3)]">
                <AnimatedCounter value={stats.totalPoints} />
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">PX Acumulados</p>
            </div>
          </div>
        </motion.div>

        {/* NEXT GOAL */}
        {stats.nextAchievement && (
          <div className="bg-card border-2 border-primary/5 rounded-[32px] p-6 mb-8 shadow-soft">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-xl bg-muted"><Target className="w-4 h-4 text-primary" /></div>
                 <div>
                   <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Próximo Alvo</p>
                   <p className="text-sm font-bold">{stats.nextAchievement.title}</p>
                 </div>
               </div>
               <div className="text-right">
                  <p className="text-xs font-bold text-primary">-{stats.nextAchievement.requirement_value - stats.diffDays} dias</p>
               </div>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border/50">
               <motion.div
                 initial={{ width: 0 }}
                 animate={{ width: `${stats.progress}%` }}
                 transition={{ duration: 1.5, ease: "circOut" }}
                 className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
               />
            </div>
          </div>
        )}

        {/* FILTERS */}
        <div className="flex gap-2 mb-8">
           {['all', 'unlocked', 'locked'].map(f => (
             <button
               key={f}
               onClick={() => setFilter(f as any)}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                 filter === f ? "bg-foreground text-background border-foreground shadow-lg" : "bg-card text-muted-foreground border-border hover:bg-muted"
               }`}
             >
               {f === 'all' ? "Tudo" : f === 'unlocked' ? "Concluídos" : "Bloqueados"}
             </button>
           ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
           {filteredList.map((badge, i) => {
             const unlocked = unlockedIds.has(badge.id);
             const rarity = RARITY_MAP[badge.rarity] || RARITY_MAP.comum;
             
             return (
               <motion.div
                 key={badge.id}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.04 }}
                 onClick={() => unlocked && setSelectedAchievement(badge)}
                 className={`group rounded-[28px] p-6 border-2 transition-all cursor-pointer ${
                   unlocked 
                   ? `${rarity.border} bg-card hover:shadow-xl hover:scale-[1.02]`
                   : "bg-muted/30 border-transparent grayscale opacity-40 hover:grayscale-0 hover:opacity-100"
                 }`}
               >
                 <div className="flex flex-col items-center text-center">
                    <div className={`w-20 h-20 rounded-[28px] mb-4 flex items-center justify-center text-4xl shadow-inner ${
                      unlocked ? "bg-white dark:bg-black/20 border border-border" : "bg-muted"
                    }`}>
                      {unlocked ? (badge.icon_url || "🏅") : <Lock className="w-8 h-8 text-muted-foreground" />}
                    </div>
                    <div className="mb-2">
                       <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border mb-2 inline-block ${rarity.bg} ${rarity.color} ${rarity.border}`}>
                         {rarity.label}
                       </span>
                       <h4 className="text-sm font-black tracking-tight line-clamp-1">{badge.title}</h4>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium leading-tight mb-4 line-clamp-2">
                       {badge.description}
                    </p>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-primary">+{badge.points} PX</span>
                       {unlocked && <Share2 className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />}
                    </div>
                 </div>
               </motion.div>
             );
           })}
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-6"
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="bg-card w-full max-w-md rounded-[40px] border-2 border-primary/10 p-8 shadow-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                <div className="text-center">
                   <div className="w-24 h-24 rounded-[32px] bg-primary/5 border-2 border-primary/10 flex items-center justify-center text-6xl mx-auto mb-6 shadow-soft">
                     {selectedAchievement.icon_url || "🏅"}
                   </div>
                   <h3 className="text-2xl font-black mb-2 tracking-tight">{selectedAchievement.title}</h3>
                   <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed">
                     {selectedAchievement.description}
                   </p>

                   {selectedAchievement.medical_fact && (
                     <div className="bg-primary/5 rounded-3xl p-6 text-left mb-8 border border-primary/10">
                        <div className="flex items-center gap-2 mb-3">
                           <Shield className="w-4 h-4 text-primary" />
                           <h4 className="text-xs font-black uppercase tracking-widest text-primary">Fato Médico</h4>
                        </div>
                        <p className="text-xs font-medium text-foreground/80 leading-relaxed italic">
                          "{selectedAchievement.medical_fact}"
                        </p>
                        {selectedAchievement.source && (
                          <p className="text-[10px] text-muted-foreground font-bold mt-4 uppercase">Fonte: {selectedAchievement.source}</p>
                        )}
                     </div>
                   )}

                   <div className="flex gap-4">
                     <Button className="flex-1 h-12 rounded-2xl font-black text-xs uppercase transition-all hover:scale-[1.02]" onClick={() => setSelectedAchievement(null)}>
                        Fechar
                     </Button>
                     <Button variant="outline" className="h-12 w-12 rounded-2xl p-0 transition-transform active:scale-90">
                        <Share2 className="w-5 h-5" />
                     </Button>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DISCLAIMER */}
        <div className="mt-16 p-6 rounded-[32px] bg-muted/30 border border-border text-center">
           <AlertCircle className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
           <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-relaxed">
             Marcos Clínicos Baseados em OMS/CDC.<br />
             Cada badge representa uma vitória biológica.
           </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Conquistas;

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
