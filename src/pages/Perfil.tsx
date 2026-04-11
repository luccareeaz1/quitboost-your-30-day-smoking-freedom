import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Trophy, Heart, Settings, Target, Shield, Users, Bot,
  Sparkles, Crown, Loader2, LogOut, Trash2, Edit3, ChevronRight,
  CreditCard, Bell, Key, ShieldCheck, Mail, MapPin, ExternalLink,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService, achievementService } from "@/lib/services";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface UserAchievement {
  id: string;
  title: string;
  icon: string | null;
  emoji: string | null;
}

export default function Perfil() {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, subscription } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
        nome: profile.display_name || user?.email?.split("@")[0] || "Guerreiro",
        bio: profile.bio || "",
        cigarrosPorDia: profile.cigarettes_per_day || 0,
        anosFumando: profile.years_smoking || 0,
        custoPorCigarro: Number(profile.price_per_cigarette) || 0,
        gatilhos: profile.triggers || [],
      });
      
      if (user) {
        achievementService.getUserAchievements(user.id).then(ua => {
          const mapped = ua.map(item => {
            const ach = item.achievements as any;
            return { id: ach.id, title: ach.title, icon: ach.icon, emoji: ach.emoji };
          });
          setUserAchievements(mapped);
        });
      }
    }
  }, [profile, user]);

  const stats = useMemo(() => {
    if (!profile) return null;
    const quitDate = new Date(profile.quit_date || new Date().toISOString());
    const diffDays = Math.max(0, Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60 * 60 * 24)));
    const economia = diffDays * (profile.cigarettes_per_day || 0) * (Number(profile.price_per_cigarette) || 0);
    return { diffDays, economia, quitDate };
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

  if (loading || !profile || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Premium Hero Header */}
      <header className="bg-slate-900 pt-20 pb-40 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-400/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[3rem] bg-white p-1.5 shadow-2xl relative">
              <div className="w-full h-full rounded-[2.5rem] bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User className="w-16 h-16 text-slate-200" />
                )}
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-slate-900 group-hover:scale-110 transition-transform"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
            {subscription === 'elite' && (
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-900">
                <Crown className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
              {profile.display_name || "Guerreiro"}
            </h1>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs mb-6">
              Iniciado em {stats.quitDate.toLocaleDateString("pt-BR")}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <BadgeBox label="Nível 04" color="bg-primary/20 text-primary border-primary/20" />
              <BadgeBox label={subscription?.toUpperCase() || 'FREE'} color="bg-amber-400/20 text-amber-400 border-amber-400/20" />
              <BadgeBox label="São Paulo, BR" color="bg-white/5 text-white/40 border-white/10" icon={MapPin} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] text-center min-w-[140px]">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Dias Livres</p>
                <p className="text-4xl font-black text-white">{stats.diffDays}</p>
             </div>
             <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] text-center min-w-[140px]">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Economia</p>
                <p className="text-4xl font-black text-white">R${Math.round(stats.economia)}</p>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <div className="max-w-5xl mx-auto px-6 -mt-24 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Conquistas Bar */}
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Galeria de Troféus</h3>
                <Button variant="ghost" className="text-xs font-black text-primary uppercase tracking-widest" onClick={() => navigate("/conquistas")}>Ver Galeria</Button>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {userAchievements.map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-4xl shrink-0 group hover:bg-primary/5 transition-colors border border-slate-100"
                  >
                    <span className="group-hover:scale-125 transition-transform">{badge.emoji || "🏅"}</span>
                  </motion.div>
                ))}
                {userAchievements.length === 0 && (
                  <div className="py-10 text-center w-full bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                    <p className="text-sm font-bold text-slate-400">Suas vitórias aparecerão aqui em breve.</p>
                  </div>
                )}
             </div>
          </Card>

          {/* Account Settings Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SettingsCard icon={ShieldCheck} title="Privacidade" desc="Gerencie visibilidade e dados." color="text-sky-500" />
            <SettingsCard icon={CreditCard} title="Assinatura" desc="Upgrade para Elite Pro." color="text-amber-500" />
            <SettingsCard icon={Bell} title="Notificações" desc="Alertas de fissura e saúde." color="text-primary" />
            <SettingsCard icon={LogOut} title="Desconectar" desc="Sair da conta atual." color="text-slate-400" onClick={signOut} />
          </div>
          
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full h-16 rounded-[2rem] bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 font-black uppercase tracking-widest text-[11px] gap-3"
          >
            <Trash2 className="w-4 h-4" /> Resetar Histórico Físico
          </Button>
        </div>

        {/* Sidebar Mini Profile Info */}
        <aside className="lg:col-span-4 space-y-10">
           <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10">
             <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Bio Médica</h3>
             <div className="space-y-6">
               <InfoRow label="Cigarros/Dia" value={profile.cigarettes_per_day} icon={Flame} />
               <InfoRow label="Fuma há" value={`${profile.years_smoking} Anos`} icon={Clock} />
               <InfoRow label="Status" value="Regenerando" icon={Heart} />
             </div>
             
             <div className="mt-10 pt-10 border-t border-slate-50">
               <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                 "Sua capacidade pulmonar aumentou 22% desde o início desta jornada."
               </p>
             </div>
           </Card>

           <Card className="border-none shadow-xl shadow-slate-100 bg-primary/5 rounded-[3rem] p-10 border border-primary/10">
             <h4 className="text-lg font-black text-primary mb-4 flex items-center gap-2">
               <Sparkles className="w-5 h-5" /> Apoio do Coach
             </h4>
             <p className="text-sm font-bold text-primary/70 leading-relaxed mb-8">
               O seu plano atual cobre mensagens ilimitadas de texto com o Coach IA especializado em cessação do tabagismo.
             </p>
             <Button className="w-full bg-primary text-white hover:bg-emerald-600 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]" onClick={() => navigate('/coach')}>
               Falar com Coach
             </Button>
           </Card>
        </aside>
      </div>

      {/* EDIT OVERLAY */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setIsEditing(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl relative z-10">
               <div className="flex justify-between items-center mb-10">
                 <h3 className="text-3xl font-black text-slate-900">Editar Perfil</h3>
                 <button onClick={() => setIsEditing(false)} className="text-slate-300 hover:text-slate-900"><ChevronLeft className="w-8 h-8" /></button>
               </div>
               
               <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 no-scrollbar">
                  <InputGroup label="Nome de Exibição" value={editData.nome} onChange={v => setEditData({...editData, nome: v})} />
                  <InputGroup label="Bio / Motivação" value={editData.bio} onChange={v => setEditData({...editData, bio: v})} isTextArea />
                  <div className="grid grid-cols-2 gap-8">
                    <InputGroup label="Cigarros Diários" value={editData.cigarrosPorDia} onChange={v => setEditData({...editData, cigarrosPorDia: Number(v)})} type="number" />
                    <InputGroup label="Anos de Hábito" value={editData.anosFumando} onChange={v => setEditData({...editData, anosFumando: Number(v)})} type="number" />
                  </div>
                  <InputGroup label="Preço Médio do Maço" value={editData.custoPorCigarro} onChange={v => setEditData({...editData, custoPorCigarro: Number(v)})} type="number" />
               </div>

               <div className="flex gap-4 mt-12">
                  <Button variant="ghost" className="flex-1 rounded-2xl h-16 font-black uppercase tracking-widest text-xs" onClick={() => setIsEditing(false)}>Cancelar</Button>
                  <Button className="flex-1 bg-slate-900 text-white hover:bg-black rounded-2xl h-16 font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? <Loader2 className="animate-spin w-5 h-5" /> : "Salvar Alterações"}
                  </Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center relative z-10 shadow-2xl">
               <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <Trash2 className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-4">Resetar Progresso?</h3>
               <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                 Isso apagará seu histórico de saúde atual, mas manterá suas conquistas ganhas. Tem certeza que deseja recomeçar?
               </p>
               <div className="flex flex-col gap-3">
                 <Button className="bg-rose-500 text-white rounded-2xl h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-200">Sim, Reiniciar</Button>
                 <Button variant="ghost" className="h-14 font-black uppercase tracking-widest text-slate-400" onClick={() => setShowDeleteConfirm(false)}>Agora não</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BadgeBox({ label, color, icon: Icon }: any) {
  return (
    <div className={cn("px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest flex items-center gap-2", color)}>
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </div>
  );
}

function SettingsCard({ icon: Icon, title, desc, color, onClick }: any) {
  return (
    <Card 
      onClick={onClick}
      className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8 flex items-center gap-6 cursor-pointer hover:-translate-y-1 transition-all group"
    >
      <div className={cn("w-14 h-14 rounded-2xl bg-white shadow-inner flex items-center justify-center scale-100 group-hover:scale-110 transition-transform", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h4 className="font-black text-slate-900 tracking-tight">{title}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{desc}</p>
      </div>
    </Card>
  );
}

function InfoRow({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, type = "text", isTextArea = false }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-2">{label}</label>
      {isTextArea ? (
        <textarea 
          value={value} 
          onChange={e => onChange(e.target.value)}
          className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[1.5rem] p-6 text-sm font-bold min-h-[120px] outline-none transition-all placeholder:text-slate-200"
        />
      ) : (
        <input 
          type={type}
          value={value} 
          onChange={e => onChange(e.target.value)}
          className="w-full h-14 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 text-sm font-bold outline-none transition-all placeholder:text-slate-200"
        />
      )}
    </div>
  );
}
