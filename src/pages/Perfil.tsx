import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  User, Trophy, Flame, Calendar, Cigarette, Wallet, Settings,
  Shield, Bell, Moon, Sun, Globe, Trash2, ChevronRight,
  LogOut, Edit3, Camera, Eye, EyeOff, Lock, Heart,
  Award, Target, Users, Bot, Sparkles, Clock, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// ========== TYPES ==========
interface ProfileData {
  quitDate: string;
  cigarrosPorDia: number;
  anosFumando: number;
  custoPorCigarro: number;
  gatilhos: string[];
  nome?: string;
  bio?: string;
  privacidade?: "publico" | "amigos" | "privado";
  notificacoes?: boolean;
  tema?: "auto" | "claro" | "escuro";
  idioma?: string;
  featuredBadges?: string[];
}

// ========== ANIMATED COUNTER ==========
function AnimatedNum({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const ctrl = animate(0, value, { duration: 2, ease: "easeOut", onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => ctrl.stop();
  }, [value]);
  return <span>{prefix}{display.toLocaleString("pt-BR")}{suffix}</span>;
}

const SETTINGS_SECTIONS = [
  {
    title: "Conta",
    items: [
      { label: "Notificações", icon: Bell, type: "toggle" as const, key: "notificacoes" },
      { label: "Privacidade do Progresso", icon: Eye, type: "select" as const, key: "privacidade" },
      { label: "Tema", icon: Moon, type: "select" as const, key: "tema" },
      { label: "Idioma", icon: Globe, type: "text" as const, key: "idioma" },
    ],
  },
];

const FEATURED_BADGES = [
  { id: "b1", emoji: "🌱", label: "Primeiro Passo", daysNeeded: 0 },
  { id: "b2", emoji: "⭐", label: "24 Horas Livre", daysNeeded: 1 },
  { id: "b3", emoji: "💪", label: "72h Desintoxicado", daysNeeded: 3 },
  { id: "b4", emoji: "🔥", label: "1 Semana", daysNeeded: 7 },
  { id: "b5", emoji: "🚀", label: "2 Semanas", daysNeeded: 14 },
  { id: "b6", emoji: "🧠", label: "21 Dias", daysNeeded: 21 },
  { id: "b7", emoji: "🏆", label: "30 Dias", daysNeeded: 30 },
  { id: "b8", emoji: "👑", label: "90 Dias", daysNeeded: 90 },
  { id: "b9", emoji: "🌟", label: "1 Ano", daysNeeded: 365 },
];

const Perfil = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [profile, setProfile] = useState<ProfileData | null>(() => {
    const stored = localStorage.getItem("quitboost_profile");
    if (!stored) return null;
    return JSON.parse(stored);
  });

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
        nome: profile.nome || user?.email?.split("@")[0] || "Usuário",
        bio: profile.bio || "",
        cigarrosPorDia: profile.cigarrosPorDia,
        anosFumando: profile.anosFumando,
        custoPorCigarro: profile.custoPorCigarro,
        gatilhos: profile.gatilhos || [],
      });
    }
  }, [profile, user]);

  if (!profile) {
    navigate("/onboarding");
    return null;
  }

  const quitDate = new Date(profile.quitDate);
  const diffDays = Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60 * 60 * 24));
  const cigarrosEvitados = diffDays * profile.cigarrosPorDia;
  const economia = cigarrosEvitados * profile.custoPorCigarro;
  const minutesRecovered = cigarrosEvitados * 11;
  const hoursRecovered = Math.floor(minutesRecovered / 60);
  const unlockedBadges = FEATURED_BADGES.filter((b) => diffDays >= b.daysNeeded);

  const handleSaveProfile = () => {
    const updatedProfile = {
      ...profile,
      nome: editData.nome,
      bio: editData.bio,
      cigarrosPorDia: editData.cigarrosPorDia,
      anosFumando: editData.anosFumando,
      custoPorCigarro: editData.custoPorCigarro,
      gatilhos: editData.gatilhos,
    };
    localStorage.setItem("quitboost_profile", JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleReset = () => {
    localStorage.removeItem("quitboost_profile");
    localStorage.removeItem("quitboost_craving_count");
    localStorage.removeItem("ba_completed_challenges");
    navigate("/onboarding");
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

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 max-w-lg pb-24">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-xl bg-card border border-border hover:bg-accent transition-colors"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl bg-card border border-border p-6 mb-6"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20">
                <User className="w-8 h-8 text-primary" />
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold tracking-tight truncate">
                {profile.nome || user?.email?.split("@")[0] || "Usuário"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Membro desde {quitDate.toLocaleDateString("pt-BR")}
              </p>
              {profile.bio && (
                <p className="text-xs text-foreground/70 mt-1 line-clamp-2">{profile.bio}</p>
              )}
            </div>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => setIsEditing(true)}>
              <Edit3 className="w-3.5 h-3.5 mr-1" />
              Editar
            </Button>
          </div>

          {/* Featured Badges */}
          {unlockedBadges.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                Badges em destaque
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {unlockedBadges.slice(-5).map((badge) => (
                  <div
                    key={badge.id}
                    className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0 cursor-pointer hover:scale-110 transition-transform"
                    title={badge.label}
                    onClick={() => navigate("/conquistas")}
                  >
                    {badge.emoji}
                  </div>
                ))}
                <button
                  className="w-10 h-10 rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground shrink-0 hover:border-primary hover:text-primary transition-colors"
                  onClick={() => navigate("/conquistas")}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: Calendar, label: "Dias livres", value: diffDays, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { icon: Flame, label: "Streak", value: `${diffDays} dias`, color: "text-amber-500", bg: "bg-amber-500/10" },
            { icon: Cigarette, label: "Evitados", value: cigarrosEvitados.toLocaleString(), color: "text-rose-500", bg: "bg-rose-500/10" },
            { icon: Wallet, label: "Economizado", value: `R$${economia.toFixed(0)}`, color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: Clock, label: "Vida recuperada", value: `${hoursRecovered}h`, color: "text-violet-500", bg: "bg-violet-500/10" },
            { icon: Trophy, label: "Conquistas", value: `${unlockedBadges.length}/${FEATURED_BADGES.length}`, color: "text-primary", bg: "bg-primary/10" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.03 }}
              className="rounded-2xl bg-card border border-border p-4"
            >
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2 ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{s.label}</p>
              <p className="text-lg font-bold tracking-tight">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* YOUR DATA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-card border border-border p-5 mb-6"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Seus Dados de Saúde
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-border">
              <span className="text-muted-foreground">Cigarros por dia</span>
              <span className="font-semibold">{profile.cigarrosPorDia}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border">
              <span className="text-muted-foreground">Anos fumando</span>
              <span className="font-semibold">{profile.anosFumando}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border">
              <span className="text-muted-foreground">Custo por cigarro</span>
              <span className="font-semibold">R${profile.custoPorCigarro.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border">
              <span className="text-muted-foreground">Data de cessação</span>
              <span className="font-semibold">{quitDate.toLocaleDateString("pt-BR")}</span>
            </div>
            <div className="flex justify-between items-start py-1">
              <span className="text-muted-foreground">Gatilhos identificados</span>
              <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                {(profile.gatilhos || []).map((g: string) => (
                  <span key={g} className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-medium">
                    {g}
                  </span>
                ))}
                {(!profile.gatilhos || profile.gatilhos.length === 0) && (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* QUICK LINKS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2 mb-6"
        >
          {[
            { label: "Coach Neural IA", icon: Bot, path: "/coach", desc: "Suporte 24/7 baseado em evidências" },
            { label: "Comunidade", icon: Users, path: "/comunidade", desc: "Apoie e seja apoiado" },
            { label: "Conquistas", icon: Trophy, path: "/conquistas", desc: `${unlockedBadges.length} de ${FEATURED_BADGES.length} desbloqueadas` },
            { label: "Desafios", icon: Target, path: "/desafios", desc: "Desafios diários e semanais" },
          ].map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:bg-accent transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <link.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{link.label}</p>
                <p className="text-[10px] text-muted-foreground">{link.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </motion.div>

        {/* SETTINGS */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="rounded-2xl bg-card border border-border p-5">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Configurações
                </h3>

                <div className="space-y-3">
                  {/* Notifications */}
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Notificações</span>
                    </div>
                    <button
                      onClick={() => {
                        const updated = { ...profile, notificacoes: !profile.notificacoes };
                        localStorage.setItem("quitboost_profile", JSON.stringify(updated));
                        setProfile(updated);
                      }}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        profile.notificacoes !== false ? "bg-primary" : "bg-muted"
                      } relative`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                        profile.notificacoes !== false ? "right-1" : "left-1"
                      }`} />
                    </button>
                  </div>

                  {/* Privacy */}
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Privacidade</span>
                    </div>
                    <select
                      value={profile.privacidade || "publico"}
                      onChange={(e) => {
                        const updated = { ...profile, privacidade: e.target.value };
                        localStorage.setItem("quitboost_profile", JSON.stringify(updated));
                        setProfile(updated as ProfileData);
                      }}
                      className="text-xs bg-muted rounded-lg px-2 py-1 border-0 outline-none"
                    >
                      <option value="publico">Público</option>
                      <option value="amigos">Apenas amigos</option>
                      <option value="privado">Privado</option>
                    </select>
                  </div>

                  {/* Idioma */}
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Idioma</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">Português (BR)</span>
                  </div>

                  {/* Sign out */}
                  {user && (
                    <button
                      onClick={signOut}
                      className="w-full flex items-center gap-3 py-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sair da conta</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DANGER ZONE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-3"
        >
          <Button
            variant="outline"
            className="w-full rounded-full text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground transition-all"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Resetar todo o progresso
          </Button>
        </motion.div>

        {/* EDIT PROFILE MODAL */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-end sm:items-center justify-center"
              onClick={() => setIsEditing(false)}
            >
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="bg-card rounded-t-3xl sm:rounded-3xl border border-border p-6 w-full sm:max-w-md max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold mb-6">Editar Perfil</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome</label>
                    <input
                      type="text"
                      value={editData.nome}
                      onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                      className="w-full mt-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bio (opcional)</label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      placeholder="Conte um pouco sobre sua jornada..."
                      className="w-full mt-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none min-h-[60px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cigarros/dia</label>
                      <input
                        type="number"
                        value={editData.cigarrosPorDia}
                        onChange={(e) => setEditData({ ...editData, cigarrosPorDia: Number(e.target.value) })}
                        className="w-full mt-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Anos fumando</label>
                      <input
                        type="number"
                        value={editData.anosFumando}
                        onChange={(e) => setEditData({ ...editData, anosFumando: Number(e.target.value) })}
                        className="w-full mt-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Custo por cigarro (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editData.custoPorCigarro}
                      onChange={(e) => setEditData({ ...editData, custoPorCigarro: Number(e.target.value) })}
                      className="w-full mt-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Gatilhos
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_GATILHOS.map((g) => (
                        <button
                          key={g}
                          onClick={() => handleToggleGatilho(g)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                            editData.gatilhos.includes(g)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          {editData.gatilhos.includes(g) && <Check className="w-3 h-3 inline mr-1" />}
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button variant="outline" className="flex-1 rounded-full" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button className="flex-1 rounded-full" onClick={handleSaveProfile}>
                    Salvar
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DELETE CONFIRMATION */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-card rounded-3xl border border-border p-6 max-w-sm w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-destructive" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Resetar todo o progresso?</h3>
                  <p className="text-sm text-muted-foreground">
                    Esta ação é irreversível. Todos os seus dados, conquistas, desafios e histórico serão apagados permanentemente.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-full" onClick={() => setShowDeleteConfirm(false)}>
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleReset}
                  >
                    Confirmar Reset
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MEDICAL DISCLAIMER */}
        <div className="mt-8 rounded-2xl bg-muted/50 border border-border p-4 text-center">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            ⚕️ <strong>Aviso Legal:</strong> Este app não substitui consulta médica. Consulte seu médico antes de qualquer
            mudança no tratamento. Em caso de emergência, ligue 192 (SAMU) ou 188 (CVV).
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Perfil;
