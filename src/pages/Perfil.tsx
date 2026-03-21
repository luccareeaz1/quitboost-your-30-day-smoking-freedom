import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  User, Trophy, Flame, Calendar, Cigarette, Wallet, Settings,
  Shield, Bell, Moon, Sun, Globe, Trash2, ChevronRight,
  LogOut, Edit3, Camera, Eye, EyeOff, Lock, Heart,
  Award, Target, Users, Bot, Sparkles, Clock, Check, Crown, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService, achievementService } from "@/lib/services";
import { toast } from "sonner";

interface Achievement {
  id: string;
  title: string;
  icon_url: string;
}

const Perfil = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, subscription } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);

  const [editData, setEditData] = useState({
    nome: "",
    bio: "",
    cigarrosPorDia: 0,
    anosFumando: 0,
    custoPorCigarro: 0,
    gatilhos: [] as string[],
  });

  useEffect(() => {
    if (profile) {
      setEditData({
        nome: profile.display_name || user?.email?.split("@")[0] || "Usuário",
        bio: profile.bio || "",
        cigarrosPorDia: profile.cigarettes_per_day || 0,
        anosFumando: profile.years_smoking || 0,
        custoPorCigarro: Number(profile.price_per_cigarette) || 0,
        gatilhos: profile.triggers || [],
      });
      
      // Load achievements for the badge bar
      achievementService.getUserAchievements(user!.id).then(ua => {
        setUserAchievements(ua.map(item => item.achievements) as any);
      });
    }
  }, [profile, user]);

  const stats = useMemo(() => {
    if (!profile) return null;
    const quitDate = new Date(profile.quit_date || new Date().toISOString());
    const diffDays = Math.max(0, Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60 * 60 * 24)));
    const cigarrosEvitados = diffDays * (profile.cigarettes_per_day || 0);
    const economia = cigarrosEvitados * (Number(profile.price_per_cigarette) || 0);
    const lifeRecoveredHours = Math.floor((cigarrosEvitados * 11) / 60);

    return { diffDays, cigarrosEvitados, economia, lifeRecoveredHours, quitDate };
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await profileService.updateProfile(user.id, {
        display_name: editData.nome,
        bio: editData.bio,
        daily_cigarettes: editData.cigarrosPorDia,
        years_smoking: editData.anosFumando,
        cigarette_cost: editData.custoPorCigarro,
        triggers: editData.gatilhos,
      });
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleGatilho = (gatilho: string) => {
    setEditData((prev) => ({
      ...prev,
      gatilhos: prev.gatilhos.includes(gatilho)
        ? prev.gatilhos.filter((g) => g !== gatilho)
        : [...prev.gatilhos, gatilho],
    }));
  };

  const ALL_GATILHOS = ["Café", "Álcool", "Estresse", "Após refeições", "Ansiedade", "Tédio", "Social", "Dirigir", "Acordar", "Antes de dormir"];

  if (loading || !profile || !stats) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Carregando seu universo...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 max-w-lg pb-32 pt-10 animate-fade-in">
        <header className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-black tracking-tight">Vidal.</h1>
            <div className="flex gap-2">
               <button onClick={() => setShowSettings(!showSettings)} className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-all rotate-0 active:rotate-90">
                  <Settings className="w-5 h-5 text-muted-foreground" />
               </button>
            </div>
        </header>

        {/* PROFILE HERO */}
        <section className="mb-8 p-8 rounded-[40px] bg-card border-none shadow-elevated relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-20 transition-opacity group-hover:opacity-40"><Sparkles className="w-20 h-20 text-primary" /></div>
           <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                 <div className="w-28 h-28 rounded-[40px] bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center border-4 border-background shadow-xl">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} className="w-full h-full object-cover rounded-[36px]" />
                    ) : (
                      <User className="w-12 h-12 text-primary" />
                    )}
                 </div>
                 <button onClick={() => setIsEditing(true)} className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all border-4 border-background">
                    <Edit3 className="w-4 h-4" />
                 </button>
              </div>
              <div className="mb-4">
                 <h2 className="text-2xl font-black tracking-tight">{profile.display_name || "Guerreiro"}</h2>
                 <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">
                   Livre desde {stats.quitDate.toLocaleDateString("pt-BR")}
                 </p>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 ${
                subscription === 'elite' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
              }`}>
                 {subscription === 'elite' ? <Crown className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                 Plano {subscription?.toUpperCase()}
              </div>
           </div>
        </section>

        {/* SHORTCUTS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="p-6 rounded-[32px] bg-emerald-500/5 border-2 border-emerald-500/10 flex flex-col items-center text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Dias Livres</p>
              <p className="text-3xl font-black text-emerald-600">{stats.diffDays}</p>
           </div>
           <div className="p-6 rounded-[32px] bg-blue-500/5 border-2 border-blue-500/10 flex flex-col items-center text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Economia</p>
              <p className="text-3xl font-black text-blue-600">R${Math.round(stats.economia)}</p>
           </div>
        </div>

        {/* BADGE BAR */}
        <section className="mb-8 bg-card rounded-[32px] border-none p-6 shadow-soft">
           <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Hall da Fama</h3>
              <button onClick={() => navigate("/conquistas")} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Ver todas</button>
           </div>
           <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-2">
              {userAchievements.length > 0 ? userAchievements.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-14 h-14 rounded-2xl bg-muted shrink-0 flex items-center justify-center text-2xl border border-border shadow-inner"
                >
                  {badge.icon_url || "🏅"}
                </motion.div>
              )) : (
                <div className="py-4 text-center w-full">
                   <p className="text-[10px] text-muted-foreground font-medium italic">Suas conquistas aparecerão aqui.</p>
                </div>
              )}
           </div>
        </section>

        {/* MENU */}
        <section className="space-y-3">
           {[
             { label: "Dashboard de Saúde", icon: Heart, path: "/", color: "text-rose-500" },
             { label: "Coach Neural AI", icon: Bot, path: "/coach", color: "text-violet-500" },
             { label: "Comunidade QuitBoost", icon: Users, path: "/comunidade", color: "text-blue-500" },
             { label: "Central de Desafios", icon: Target, path: "/desafios", color: "text-emerald-500" },
             { label: "Configurações da Conta", icon: Settings, action: () => setShowSettings(!showSettings), color: "text-slate-500" },
           ].map((item) => (
             <button
               key={item.label}
               onClick={item.action || (() => navigate(item.path!))}
               className="w-full h-20 rounded-[24px] bg-card flex items-center gap-5 px-6 group transition-all hover:bg-muted/50 border-2 border-transparent hover:border-border"
             >
                <div className={cn("w-12 h-12 rounded-2xl bg-muted flex items-center justify-center transition-transform group-hover:scale-110", item.color)}>
                   <item.icon size={22} />
                </div>
                <span className="flex-1 text-left font-black text-sm tracking-tight">{item.label}</span>
                <ChevronRight size={18} className="text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
             </button>
           ))}
        </section>

        {/* SETTINGS DRAWER (Simulated) */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
               <div className="bg-muted/30 rounded-[32px] p-6 space-y-4 border border-border">
                  <button onClick={signOut} className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border text-destructive font-bold text-sm">
                    Sair da Conta <LogOut size={16} />
                  </button>
                  <button onClick={() => setShowDeleteConfirm(true)} className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border text-muted-foreground font-bold text-sm">
                    Apagar Meus Dados <Trash2 size={16} />
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EDIT MODAL */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-6"
              onClick={() => !saving && setIsEditing(false)}
            >
               <motion.div
                 initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                 className="bg-card w-full max-w-md rounded-[40px] border-2 border-primary/10 p-8 shadow-2xl space-y-6 overflow-y-auto max-h-[90vh] no-scrollbar"
                 onClick={e => e.stopPropagation()}
               >
                  <h3 className="text-2xl font-black tracking-tight mb-2">Editar Identidade</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nome de Exibição</label>
                      <input value={editData.nome} onChange={e => setEditData({...editData, nome: e.target.value})} className="w-full h-14 bg-muted border-none rounded-2xl px-6 font-bold text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Status / Bio</label>
                      <textarea value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} className="w-full min-h-[100px] bg-muted border-none rounded-2xl p-6 font-bold text-sm resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Cig/Dia</label>
                        <input type="number" value={editData.cigarrosPorDia} onChange={e => setEditData({...editData, cigarrosPorDia: Number(e.target.value)})} className="w-full h-14 bg-muted border-none rounded-2xl px-6 font-bold text-sm" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Anos</label>
                        <input type="number" value={editData.anosFumando} onChange={e => setEditData({...editData, anosFumando: Number(e.target.value)})} className="w-full h-14 bg-muted border-none rounded-2xl px-6 font-bold text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Custo/Cig (R$)</label>
                      <input type="number" step="0.01" value={editData.custoPorCigarro} onChange={e => setEditData({...editData, custoPorCigarro: Number(e.target.value)})} className="w-full h-14 bg-muted border-none rounded-2xl px-6 font-bold text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-2 block">Gatilhos Ativos</label>
                      <div className="flex flex-wrap gap-2">
                         {ALL_GATILHOS.map(g => (
                           <button key={g} onClick={() => handleToggleGatilho(g)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                             editData.gatilhos.includes(g) ? "bg-primary border-primary text-white" : "border-border text-muted-foreground hover:bg-muted"
                           }`}>
                             {g}
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                     <Button variant="outline" className="flex-1 h-16 rounded-2xl font-black text-xs uppercase" onClick={() => setIsEditing(false)}>Cancelar</Button>
                     <Button className="flex-1 h-16 rounded-2xl font-black text-xs uppercase shadow-xl shadow-primary/20" onClick={handleSaveProfile} disabled={saving}>
                        {saving ? <Loader2 className="animate-spin" /> : "Salvar"}
                     </Button>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DELETE CONFIRM */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-6"
              onClick={() => setShowDeleteConfirm(false)}
            >
               <div className="bg-card w-full max-w-sm rounded-[40px] p-8 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto"><Trash2 size={40} /></div>
                  <h3 className="text-xl font-bold">Resete Total?</h3>
                  <p className="text-sm text-muted-foreground font-medium">Isso apagará seu progresso físico, mas não sua história. Deseja recomeçar a jornada?</p>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black text-xs uppercase" onClick={() => setShowDeleteConfirm(false)}>Agora não</Button>
                    <Button className="flex-1 h-14 rounded-2xl font-black text-xs uppercase bg-destructive hover:bg-destructive/90 text-white" onClick={() => navigate("/onboarding")}>Sim, Recomeçar</Button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Perfil;
