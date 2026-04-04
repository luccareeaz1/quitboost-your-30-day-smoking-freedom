import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Trophy, Heart, Settings, Target, Shield, Users, Bot,
  Sparkles, Crown, Loader2, LogOut, Trash2, Edit3, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService, achievementService } from "@/lib/services";
import { toast } from "sonner";

interface UserAchievement {
  id: string;
  title: string;
  icon: string | null;
  emoji: string | null;
}

const Perfil = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, subscription } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);

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
      
      achievementService.getUserAchievements(user!.id).then(ua => {
        const mapped = ua.map(item => {
          const ach = item.achievements as unknown as { id: string; title: string; icon: string; emoji: string };
          return {
            id: ach.id,
            title: ach.title,
            icon: ach.icon,
            emoji: ach.emoji
          };
        });
        setUserAchievements(mapped);
      });
    }
  }, [profile, user]);

  const stats = useMemo(() => {
    if (!profile) return null;
    const quitDate = new Date(profile.quit_date || new Date().toISOString());
    const diffDays = Math.max(0, Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60 * 60 * 24)));
    const cigarrosEvitados = diffDays * (profile.cigarettes_per_day || 0);
    const economia = cigarrosEvitados * (Number(profile.price_per_cigarette) || 0);

    return { diffDays, cigarrosEvitados, economia, quitDate };
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await profileService.update(user.id, {
        display_name: editData.nome,
        bio: editData.bio,
        cigarettes_per_day: editData.cigarrosPorDia,
        years_smoking: editData.anosFumando,
        price_per_cigarette: editData.custoPorCigarro,
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
          <Loader2 className="w-10 h-10 text-[#528114] animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-white min-h-screen pb-32">
        <header className="bg-[#528114] text-white pt-10 pb-8 px-4 flex flex-col rounded-b-[40px] relative">
           <div className="absolute top-4 right-4">
              <button onClick={() => setShowSettings(!showSettings)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-transform active:scale-95">
                 <Settings className="w-5 h-5 text-white" />
              </button>
           </div>
           
           <div className="flex flex-col items-center mt-4">
              <div className="relative mb-4">
                 <div className="w-24 h-24 rounded-full bg-white border-4 border-white flex items-center justify-center overflow-hidden shadow-lg">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-[#528114]" />
                    )}
                 </div>
                 <button onClick={() => setIsEditing(true)} className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-105 active:scale-95 transition-all">
                    <Edit3 className="w-4 h-4" />
                 </button>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{profile.display_name || "Guerreiro"}</h2>
              <p className="text-sm font-medium text-white/80 mt-1">
                Livre desde {stats.quitDate.toLocaleDateString("pt-BR")}
              </p>
              
              <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30 shadow-sm">
                 {subscription === 'elite' ? <Crown className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                 Plano {subscription?.toUpperCase() || 'FREE'}
              </div>
           </div>
        </header>

        <div className="px-4 py-8 max-w-lg mx-auto space-y-6 -mt-6">
          {/* STATS CARDS */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Dias Livres</p>
                <p className="text-3xl font-light text-[#528114]">{stats.diffDays}</p>
             </div>
             <div className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Economia</p>
                <p className="text-3xl font-light text-[#528114]">
                   <span className="text-lg">R$</span>{Math.round(stats.economia)}
                </p>
             </div>
          </div>

          {/* BADGE BAR */}
          <section className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#528114]">Suas Conquistas</h3>
                <button onClick={() => navigate("/conquistas")} className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black">Ver Todas</button>
             </div>
             <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {userAchievements.length > 0 ? userAchievements.map((badge, i) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-14 h-14 rounded-[14px] bg-[#F2F2F7] shrink-0 flex items-center justify-center text-2xl border border-gray-100 shadow-sm"
                  >
                    {badge.emoji || "🏅"}
                  </motion.div>
                )) : (
                  <div className="py-4 text-center w-full">
                     <p className="text-sm font-medium text-gray-400">Nenhuma conquista ainda.</p>
                  </div>
                )}
             </div>
          </section>

          {/* MENU */}
          <section className="space-y-2">
             {[
               { label: "Coach da Saúde AI", icon: Bot, path: "/coach" },
               { label: "Comunidade", icon: Users, path: "/comunidade" },
               { label: "Desafios Diários", icon: Target, path: "/desafios" },
             ].map((item) => (
               <button
                 key={item.label}
                 onClick={() => navigate(item.path)}
                 className="w-full h-16 rounded-[20px] bg-[#F2F2F7] flex items-center gap-4 px-5 active:scale-95 transition-transform"
               >
                  <div className="w-10 h-10 rounded-[12px] bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                     <item.icon className="w-5 h-5 text-black" />
                  </div>
                  <span className="flex-1 text-left font-bold text-sm text-black">{item.label}</span>
                  <ChevronRight size={18} className="text-gray-400" />
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
                className="overflow-hidden"
              >
                 <div className="bg-white rounded-[24px] p-2 space-y-2 border border-gray-100 shadow-sm mt-4">
                    <button onClick={signOut} className="w-full flex items-center justify-between p-4 rounded-[16px] bg-[#F2F2F7] text-gray-500 font-bold text-sm">
                      Sair da Conta <LogOut size={16} />
                    </button>
                    <button onClick={() => setShowDeleteConfirm(true)} className="w-full flex items-center justify-between p-4 rounded-[16px] bg-red-50 text-red-600 font-bold text-sm">
                      Apagar Dados <Trash2 size={16} />
                    </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => !saving && setIsEditing(false)}
          >
             <motion.div
               initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar"
               onClick={e => e.stopPropagation()}
             >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2 sm:hidden" />
                <h3 className="text-xl font-bold tracking-tight mb-2 text-center">Editar Perfil</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#528114] ml-2 block mb-1">Nome de Exibição</label>
                    <input value={editData.nome} onChange={e => setEditData({...editData, nome: e.target.value})} className="w-full h-14 bg-[#F2F2F7] focus:bg-white focus:border-[#528114] border-2 border-transparent outline-none rounded-[16px] px-4 font-bold text-sm transition-colors text-black" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#528114] ml-2 block mb-1">Bio</label>
                    <textarea value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} className="w-full min-h-[100px] bg-[#F2F2F7] focus:bg-white focus:border-[#528114] border-2 border-transparent outline-none rounded-[16px] p-4 font-bold text-sm resize-none transition-colors text-black" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-widest text-[#528114] ml-2 block mb-1">Cigarros/Dia</label>
                      <input type="number" value={editData.cigarrosPorDia} onChange={e => setEditData({...editData, cigarrosPorDia: Number(e.target.value)})} className="w-full h-14 bg-[#F2F2F7] focus:bg-white focus:border-[#528114] border-2 border-transparent outline-none rounded-[16px] px-4 font-bold text-sm transition-colors text-black" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-widest text-[#528114] ml-2 block mb-1">Anos</label>
                      <input type="number" value={editData.anosFumando} onChange={e => setEditData({...editData, anosFumando: Number(e.target.value)})} className="w-full h-14 bg-[#F2F2F7] focus:bg-white focus:border-[#528114] border-2 border-transparent outline-none rounded-[16px] px-4 font-bold text-sm transition-colors text-black" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#528114] ml-2 block mb-1">Custo/Cigarro (R$)</label>
                    <input type="number" step="0.01" value={editData.custoPorCigarro} onChange={e => setEditData({...editData, custoPorCigarro: Number(e.target.value)})} className="w-full h-14 bg-[#F2F2F7] focus:bg-white focus:border-[#528114] border-2 border-transparent outline-none rounded-[16px] px-4 font-bold text-sm transition-colors text-black" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#528114] ml-2 block mb-2">Gatilhos</label>
                    <div className="flex flex-wrap gap-2">
                       {ALL_GATILHOS.map(g => (
                         <button key={g} onClick={() => handleToggleGatilho(g)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                           editData.gatilhos.includes(g) ? "bg-[#528114] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                         }`}>
                           {g}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 pb-4">
                   <button className="flex-1 h-14 rounded-[14px] font-bold text-sm bg-gray-100 text-gray-600" onClick={() => setIsEditing(false)}>Cancelar</button>
                   <button className="flex-1 h-14 rounded-[14px] font-bold text-sm bg-[#528114] text-white flex items-center justify-center" onClick={handleSaveProfile} disabled={saving}>
                      {saving ? <Loader2 className="animate-spin w-5 h-5" /> : "Salvar"}
                   </button>
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
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
             <div className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-[20px] bg-red-50 text-red-500 flex items-center justify-center mx-auto"><Trash2 size={32} /></div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Reiniciar Jornada?</h3>
                  <p className="text-sm text-gray-500 font-medium">Os dados físicos serão reiniciados e isso afetará seu painel.</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 h-12 rounded-[12px] font-bold text-sm bg-gray-100 text-gray-600" onClick={() => setShowDeleteConfirm(false)}>Agora não</button>
                  <button className="flex-1 h-12 rounded-[12px] font-bold text-sm bg-red-500 text-white" onClick={() => navigate("/onboarding")}>Sim, Recomeçar</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default Perfil;
