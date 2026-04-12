import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Trophy, Heart, Settings, Target, Shield, Users, Bot,
  Sparkles, Crown, Loader2, LogOut, Trash2, Edit3, ChevronRight,
  CreditCard, Bell, Key, ShieldCheck, Mail, MapPin, ExternalLink,
  ChevronLeft, Flame, Clock
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
    <div className="min-h-screen bg-white">
      {/* Header Minimalista */}
      <header className="pt-20 pb-16 px-6 lg:px-12 border-b border-slate-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-white p-1 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="w-full h-full rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User className="w-12 h-12 text-slate-200" />
                )}
              </div>
            </div>
            {subscription === 'elite' && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-slate-400 rounded-xl flex items-center justify-center shadow-md border border-slate-200 hover:text-blue-600 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">
              {profile.display_name || "Guerreiro"}
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-6 flex items-center justify-center md:justify-start gap-2">
              <Clock className="w-3 h-3" /> Iniciado em {stats.quitDate.toLocaleDateString("pt-BR")}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <BadgeBox label="Nível 04" color="bg-blue-50 text-blue-600 border-blue-100" />
              <BadgeBox label={subscription?.toUpperCase() || 'FREE'} color="bg-amber-50 text-amber-600 border-amber-100" icon={Crown} />
              <BadgeBox label="Brasil" color="bg-slate-50 text-slate-500 border-slate-200" icon={MapPin} />
            </div>
          </div>

          <div className="flex gap-4">
             <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center min-w-[120px] shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dias Livres</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{stats.diffDays}</p>
             </div>
             <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center min-w-[120px] shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Economia</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">R${Math.round(stats.economia)}</p>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <div className="max-w-5xl mx-auto px-6 py-12 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Conquistas Bar */}
          <div className="border border-slate-200 bg-white rounded-2xl p-8">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-slate-900">Galeria de Troféus</h3>
                <Button variant="ghost" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:bg-blue-50" onClick={() => navigate("/conquistas")}>Ver Galeria</Button>
             </div>
             <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {userAchievements.map((badge, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center text-3xl shrink-0 group border border-slate-100"
                  >
                    <span>{badge.emoji || "🏅"}</span>
                  </motion.div>
                ))}
                {userAchievements.length === 0 && (
                  <div className="py-8 text-center w-full bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs font-bold text-slate-400">Suas vitórias aparecerão aqui.</p>
                  </div>
                )}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsCard icon={ShieldCheck} title="Privacidade" desc="Visibilidade de dados." color="text-slate-600" />
            <SettingsCard icon={CreditCard} title="Assinatura" desc="Upgrade para Elite." color="text-blue-600" />
            <SettingsCard icon={Bell} title="Notificações" desc="Alertas e gatilhos." color="text-slate-600" />
            <SettingsCard icon={LogOut} title="Desconectar" desc="Sair da conta." color="text-rose-500" onClick={signOut} />
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full h-12 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-slate-200 font-bold uppercase tracking-widest text-[9px] gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" /> Resetar Histórico de Saúde
          </Button>
        </div>

        <aside className="lg:col-span-4 space-y-6">
           <div className="border border-slate-200 bg-white rounded-2xl p-8 shadow-sm">
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Bio Médica</h3>
             <div className="space-y-5">
               <InfoRow label="Cigarros Diários" value={profile.cigarettes_per_day} icon={Flame} />
               <InfoRow label="Tempo de Hábito" value={`${profile.years_smoking} Anos`} icon={Clock} />
               <InfoRow label="Status Biota" value="Regenerando..." icon={Heart} />
             </div>
             
             <div className="mt-8 pt-8 border-t border-slate-100">
               <p className="text-[11px] font-semibold text-slate-400 leading-relaxed italic">
                 Sua capacidade pulmonar aumentou consideravelmente nos últimos dias.
               </p>
             </div>
           </div>

           <div className="bg-blue-600 text-white rounded-2xl p-8 shadow-lg shadow-blue-100">
             <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
               <Bot className="w-5 h-5" /> Apoio do Coach
             </h4>
             <p className="text-white/80 font-medium text-xs leading-relaxed mb-8">
               Personalização completa da sua IA de cessação inclusa no seu plano atual.
             </p>
             <Button className="w-full bg-white text-blue-600 hover:bg-slate-50 rounded-xl h-11 font-bold uppercase tracking-widest text-[10px]" onClick={() => navigate('/coach')}>
               Abrir Chat IA
             </Button>
           </div>
        </aside>
      </div>

      {/* EDIT OVERLAY */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsEditing(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-white w-full max-w-lg rounded-2xl p-8 md:p-10 shadow-xl relative z-10 border border-slate-200">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-bold text-slate-900">Editar Perfil</h3>
                 <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><ChevronLeft className="w-6 h-6" /></button>
               </div>
               
               <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                  <InputGroup label="Seu Nome" value={editData.nome} onChange={v => setEditData({...editData, nome: v})} />
                  <InputGroup label="Sua Bio" value={editData.bio} onChange={v => setEditData({...editData, bio: v})} isTextArea />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Cigs/Dia" value={editData.cigarrosPorDia} onChange={v => setEditData({...editData, cigarrosPorDia: Number(v)})} type="number" />
                    <InputGroup label="Anos Fumando" value={editData.anosFumando} onChange={v => setEditData({...editData, anosFumando: Number(v)})} type="number" />
                  </div>
               </div>

               <div className="flex gap-3 mt-10">
                  <Button variant="ghost" className="flex-1 rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]" onClick={() => setIsEditing(false)}>Cancelar</Button>
                  <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 rounded-xl h-12 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-blue-100" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? <Loader2 className="animate-spin w-4 h-4" /> : "Salvar"}
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
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-sm rounded-2xl p-10 text-center relative z-10 border border-slate-100 shadow-xl">
               <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Trash2 className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">Resetar Progresso?</h3>
               <p className="text-slate-500 font-medium mb-8 text-sm leading-relaxed">
                 Isso apagará seu histórico de saúde atual. Tem certeza que deseja recomeçar?
               </p>
               <div className="flex flex-col gap-2">
                 <Button className="bg-rose-500 text-white hover:bg-rose-600 rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">Sim, Reiniciar</Button>
                 <Button variant="ghost" className="h-12 font-bold uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900" onClick={() => setShowDeleteConfirm(false)}>Agora não</Button>
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
    <div className={cn("px-3 py-1.5 rounded-lg border font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5 shadow-sm", color)}>
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </div>
  );
}

function SettingsCard({ icon: Icon, title, desc, color, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="p-6 border border-slate-200 bg-white rounded-2xl flex items-center gap-5 cursor-pointer hover:border-blue-300 transition-all group"
    >
      <div className={cn("w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-110", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-900 text-sm tracking-tight">{title}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-blue-50/50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-50">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-[13px] font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, type = "text", isTextArea = false }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      {isTextArea ? (
        <textarea 
          value={value} 
          onChange={e => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl p-4 text-[13px] font-bold min-h-[100px] outline-none transition-all placeholder:text-slate-300"
        />
      ) : (
        <input 
          type={type}
          value={value} 
          onChange={e => onChange(e.target.value)}
          className="w-full h-12 bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-4 text-[13px] font-bold outline-none transition-all placeholder:text-slate-300"
        />
      )}
    </div>
  );
}
