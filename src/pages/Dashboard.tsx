import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity, Wallet, Cigarette, Target, Trophy, Flame,
  Sparkles, TrendingUp, Calendar, Heart, Wind, Timer,
  Zap, Users, Bot, ChevronRight, Shield, Clock,
  Droplets, Brain, Eye, ArrowRight
} from "lucide-react";
import {
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { calculateQuitStats, calculateHealthProgress } from "@/lib/calculations";

import { Button } from "@/components/ui/button";
import { AppleCard } from "@/components/ui/apple-card";
import { useAuth } from "@/hooks/useAuth";
import { streakService, progressService, challengeService } from "@/lib/services";
import { toast } from "sonner";
import AppLayout from "@/components/app/AppLayout";

// ========== MEDICAL DATA (Fontes: OMS, CDC, INCA) ==========
const HEALTH_MILESTONES = [
  { minutes: 20, label: "20 min", benefit: "Pressão arterial normaliza", icon: Heart, color: "#ef4444", progress: 0 },
  { minutes: 480, label: "8 horas", benefit: "O₂ no sangue normaliza", icon: Wind, color: "#3b82f6", progress: 0 },
  { minutes: 1440, label: "24 horas", benefit: "Risco de infarto reduz", icon: Activity, color: "#f59e0b", progress: 0 },
  { minutes: 2880, label: "48 horas", benefit: "Paladar e olfato melhoram", icon: Droplets, color: "#8b5cf6", progress: 0 },
  { minutes: 4320, label: "72 horas", benefit: "Nicotina eliminada do corpo", icon: Zap, color: "#10b981", progress: 0 },
  { minutes: 10080, label: "1 semana", benefit: "Pulmões iniciam regeneração", icon: Shield, color: "#06b6d4", progress: 0 },
  { minutes: 20160, label: "2 semanas", benefit: "Circulação melhora 30%", icon: TrendingUp, color: "#ec4899", progress: 0 },
  { minutes: 43200, label: "1 mês", benefit: "Função pulmonar +30%", icon: Activity, color: "#22c55e", progress: 0 },
  { minutes: 129600, label: "3 meses", benefit: "Risco cardíaco reduz 50%", icon: Heart, color: "#f43f5e", progress: 0 },
  { minutes: 525600, label: "1 ano", benefit: "Risco coronariano metade", icon: Trophy, color: "#eab308", progress: 0 },
];

const DAILY_TIPS = [
  { tip: "Beba pelo menos 2 litros de água por dia. A hidratação ajuda a eliminar toxinas do tabaco mais rapidamente.", source: "OMS" },
  { tip: "A prática de atividade física moderada por 30 min/dia reduz a intensidade do craving em até 60%.", source: "CDC" },
  { tip: "Evite o álcool nas primeiras 4 semanas. Ele reduz o autocontrole e é um dos principais gatilhos de recaída.", source: "INCA" },
  { tip: "A fissura intensa dura em média 3-5 minutos. Use a técnica de respiração 4-7-8 para passar esse período.", source: "OMS" },
  { tip: "Mascar uma bala de gengibre ou hortelã pode ajudar a reduzir a compulsão oral associada ao cigarro.", source: "INCA" },
  { tip: "Após 20 minutos sem fumar, sua pressão arterial e frequência cardíaca já retornam ao normal.", source: "OMS" },
  { tip: "Identificar seus 3 principais gatilhos é fundamental. O mais comum no Brasil: café, estresse e álcool.", source: "INCA" },
];

const RISK_REDUCTION_DATA = [
  { name: "Cardíaco", baseline: 100, current: 55, color: "#ef4444" },
  { name: "Pulmonar", baseline: 100, current: 70, color: "#3b82f6" },
  { name: "AVC", baseline: 100, current: 62, color: "#8b5cf6" },
  { name: "Câncer", baseline: 100, current: 85, color: "#f59e0b" },
];

function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const ctrl = animate(0, value, { duration: 2.5, ease: "easeOut", onUpdate: (v) => setDisplay(v) });
    return () => ctrl.stop();
  }, [value]);
  return <span className="font-black italic">{prefix}{display.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  is_weekly: boolean;
}

interface Streak {
  current_streak: number;
  longest_streak: number;
  last_check_in: string;
  total_days_smoke_free: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, subscription, signOut } = useAuth();
  const [now, setNow] = useState(new Date());
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [streakData, setStreakData] = useState<Streak | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    if (!profile && !user) return;
    
    if (user) {
      streakService.checkIn(user.id).then(() => {
        streakService.get(user.id).then(setStreakData);
      });
    }

    const interval = setInterval(() => setNow(new Date()), 1000);
    
    const loadDaily = async () => {
      try {
        const all = await challengeService.getAll();
        const dailyOnes = all.filter(c => !c.is_weekly);
        if (dailyOnes.length > 0) {
          const seed = parseInt(new Date().toISOString().split('T')[0].replace(/-/g, ''));
          const index = seed % dailyOnes.length;
          setDailyChallenge(dailyOnes[index]);
          
          if (user) {
            const completed = await challengeService.getUserChallenges(user.id);
            if (completed.some(c => c.challenge_id === dailyOnes[index].id)) {
              setMissionCompleted(true);
            }
          }
        }
      } catch (err) { console.error(err); }
    };
    loadDaily();

    return () => clearInterval(interval);
  }, [profile, user]);

  const stats = useMemo(() => {
    if (!profile) return null;
    
    const quitStats = calculateQuitStats({
      quit_date: profile.quit_date || new Date().toISOString(),
      cigarettes_per_day: profile.cigarettes_per_day || 0,
      price_per_cigarette: Number(profile.price_per_cigarette) || 0,
    }, now);

    const milestonesWithProgress = calculateHealthProgress(quitStats.totalSeconds).map(m => ({
      ...m,
      icon: HEALTH_MILESTONES.find(hm => hm.label === m.label)?.icon || Heart,
      color: HEALTH_MILESTONES.find(hm => hm.label === m.label)?.color || "#ccc"
    }));

    const healthPercentage = Math.min(100, Math.round(
      milestonesWithProgress.filter((m) => m.achieved).length / milestonesWithProgress.length * 100
    ));

    return {
      ...quitStats,
      healthPercentage,
      milestonesWithProgress
    };
  }, [profile, now]);

  if (!profile || !stats) {
    return (
       <div className="flex items-center justify-center min-h-screen bg-black">
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 1.5 }} 
            className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full shadow-glow" 
          />
       </div>
    );
  }

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const quitDate = new Date(profile.quit_date || now);
    const dayDiff = Math.max(0, Math.floor((d.getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24)));
    return {
      name: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][d.getDay()],
      saude: Math.min(100, Math.round((dayDiff / 30) * 100)),
      economia: Math.round(dayDiff * (profile.cigarettes_per_day || 20) * Number(profile.price_per_cigarette || 1)),
      evitados: dayDiff * (profile.cigarettes_per_day || 20),
    };
  });

  const pieData = [
    { name: "Recuperado", value: stats.healthPercentage, color: "#10b981" },
    { name: "Em progresso", value: 100 - stats.healthPercentage, color: "rgba(255,255,255,0.1)" },
  ];

  const todayTip = DAILY_TIPS[stats.days % DAILY_TIPS.length];
  const greeting = now.getHours() < 12 ? "Bom dia" : now.getHours() < 18 ? "Boa tarde" : "Boa noite";

  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12 pb-32 relative z-10">

        {/* UPGRADE BANNER */}
        {subscription === "free" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 border border-primary/30 rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center justify-between gap-8 backdrop-blur-3xl shadow-glow overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <Sparkles size={32} />
              </div>
              <div>
                <p className="text-xl font-black text-white italic tracking-tighter uppercase">Coach Neural <span className="text-primary">Ativo.</span></p>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mt-1 opacity-60">Suporte 24/7 • Relatórios Avançados • Plano Personalizado</p>
              </div>
            </div>
            <Button
              size="lg"
              className="rounded-[1.2rem] bg-white text-black font-black uppercase tracking-[0.2em] px-10 shadow-glow hover:scale-105 active:scale-95 transition-all text-[11px] italic"
              onClick={() => navigate("/checkout")}
            >
              Fazer Upgrade
            </Button>
          </motion.div>
        )}

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left"
        >
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white italic leading-none">
              {greeting}, <span className="text-primary drop-shadow-glow">{profile.display_name?.split(" ")[0] || user?.email?.split("@")[0] || "Comandante"}</span>.
            </h1>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.5em] leading-relaxed italic mt-4">
              Status Operacional • Consciência em Expansão • Protokoll v3.0
            </p>
          </div>
          {user && (
            <button
              onClick={signOut}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-rose-500 transition-all italic border border-border/20 px-6 py-2 rounded-full hover:border-rose-500/40"
            >
              Finalizar Sessão
            </button>
          )}
        </motion.header>

        {/* STREAK COUNTER - CORE REACTOR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-primary/10 rounded-[3rem] blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <AppleCard className="p-10 sm:p-20 bg-card/40 backdrop-blur-3xl border border-border/40 text-center relative overflow-hidden rounded-[3rem] shadow-elevated">
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full animate-pulse duration-5000" />
            
            <div className="relative z-10 space-y-10">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/40" />
                <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-black/40 border border-primary/20 shadow-glow">
                  <Flame className="w-5 h-5 text-primary animate-pulse drop-shadow-glow" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">
                    {streakData ? `Streak: ${streakData.current_streak} dias` : "Reactor Ativo"}
                  </span>
                </div>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/40" />
              </div>

              <div className="relative inline-block">
                <div className="text-[8rem] sm:text-[14rem] font-black tracking-tighter text-white italic leading-none drop-shadow-glow select-none">
                  {stats.days}
                </div>
                <div className="absolute -top-4 -right-12 sm:-right-20">
                  <span className="text-2xl sm:text-4xl font-black text-primary italic drop-shadow-glow">DIAS</span>
                </div>
              </div>
              
              <p className="text-xl sm:text-2xl font-black text-white/60 italic uppercase tracking-[0.2em] select-none">
                sem contaminação <span className="text-primary italic">química.</span>
              </p>

              {/* Live timer hub */}
              <div className="flex items-center justify-center gap-6 sm:gap-12 py-10 border-y border-white/5 bg-white/2 max-w-2xl mx-auto rounded-[2rem]">
                {[
                  { val: String(stats.hours).padStart(2, "0"), label: "horas" },
                  { val: String(stats.minutes).padStart(2, "0"), label: "minutos" },
                  { val: String(stats.seconds).padStart(2, "0"), label: "segundos" },
                ].map((t, i) => (
                  <div key={t.label} className="text-center group/timer">
                    <div className="text-4xl sm:text-6xl font-black tracking-tighter text-white italic leading-none group-hover:text-primary transition-colors">
                      {t.val}
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-4 italic opacity-40 group-hover:opacity-100 transition-opacity">
                      {t.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-primary italic animate-pulse">
                <Zap size={14} className="fill-current shadow-glow" />
                Sincronizando Sinais Neurais em Tempo Real
                <Zap size={14} className="fill-current shadow-glow" />
              </div>
            </div>
          </AppleCard>
        </motion.div>

        {/* KEY METRICS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Sinais Evitados", value: stats.avoidedCount, icon: Cigarette, color: "text-rose-500", bg: "bg-rose-500/10", suffix: "" },
            { label: "Recurso Salvo", value: stats.moneySaved, icon: Wallet, color: "text-blue-500", bg: "bg-blue-500/10", prefix: "R$ ", decimals: 0 },
            { label: "Tempo de Órbita", value: stats.hoursRecovered, icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10", suffix: "h" },
            { label: "Integridade", value: stats.healthPercentage, icon: Activity, color: "text-primary", bg: "bg-primary/10", suffix: "%" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <AppleCard className="p-8 bg-card/40 backdrop-blur-3xl border border-border/40 hover:border-primary/40 transition-all duration-500 group rounded-[2rem] shadow-elevated">
                <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 ${stat.color} group-hover:scale-110 transition-transform shadow-inner border border-white/5`}>
                  <stat.icon size={28} />
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic mb-3">{stat.label}</p>
                <p className={`text-3xl sm:text-4xl font-black italic tracking-tighter ${stat.color} drop-shadow-sm`}>
                  <AnimatedNumber value={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} decimals={stat.decimals || 0} />
                </p>
              </AppleCard>
            </motion.div>
          ))}
        </div>

        {/* DAILY PROTOCOLS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence>
            {showTip && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <AppleCard className="p-10 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] backdrop-blur-3xl h-full relative group overflow-hidden">
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-[1rem] bg-emerald-500 text-white flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white italic tracking-tighter">Protocolo Neural</h3>
                      <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest italic">Base de Dados: {todayTip.source}</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold italic text-white/80 leading-relaxed mb-8">{todayTip.tip}</p>
                  <p className="text-[9px] font-black text-muted-foreground italic uppercase tracking-[0.2em] opacity-40">⚕️ Algoritmo de Suporte Baseado em Evidências Clínicas.</p>
                </AppleCard>
              </motion.div>
            )}
          </AnimatePresence>

          <AppleCard className="p-10 h-full bg-primary text-white border-transparent overflow-hidden relative group rounded-[2.5rem] shadow-glow flex flex-col justify-between">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 blur-[100px] rounded-full animate-pulse" />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-8 font-black uppercase tracking-[0.4em] text-[10px] italic text-white/60">
                  <Target size={16} className="text-white drop-shadow-glow" /> Missão Operacional
                </div>
                <h3 className="text-3xl font-black italic tracking-tighter mb-4 leading-none">
                  {dailyChallenge?.title || "Sincronização Hídrica"}
                </h3>
                <p className="text-white/70 font-bold italic text-base leading-relaxed mb-10 max-w-sm">
                  {dailyChallenge?.description || "Aumente a ingestão de H₂O para acelerar o processo de desintoxicação celular."}
                </p>
              </div>
              <Button
                onClick={async () => {
                  if (user && dailyChallenge) {
                    try {
                      await challengeService.completeChallenge(user.id, dailyChallenge.id);
                      setMissionCompleted(true);
                      toast.success("Missão concluída! +PX");
                    } catch (e) { toast.error("Erro no sinal."); }
                  }
                }}
                disabled={missionCompleted || !dailyChallenge}
                className={`w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[11px] transition-all italic border-none ${
                  missionCompleted ? "bg-white/10 text-white/50 backdrop-blur-md" : "bg-white text-black shadow-glow hover:scale-[1.02] active:scale-95"
                }`}
              >
                {missionCompleted ? "✅ Missão Sincronizada" : "Confirmar Protocolo"}
              </Button>
            </div>
          </AppleCard>
        </div>

        {/* ANALYTICS HUB */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <AppleCard className="p-10 bg-card/40 backdrop-blur-3xl border border-border/40 rounded-[2.5rem] shadow-elevated">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter text-white leading-none mb-2">Vetor de Progressão</h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Monitoramento Biométrico e Financeiro</p>
                </div>
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 shadow-glow">
                  <TrendingUp size={24} className="text-primary" />
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSaude" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.4} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                      <linearGradient id="colorEconomia" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 900 }} dy={15} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderRadius: "1.5rem", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", padding: "1.5rem" }}
                      itemStyle={{ fontStyle: "italic", fontWeight: "bold" }}
                    />
                    <Area type="monotone" dataKey="saude" name="Status Vital" stroke="#10b981" strokeWidth={5} fill="url(#colorSaude)" />
                    <Area type="monotone" dataKey="economia" name="Reservas Salvas" stroke="#3b82f6" strokeWidth={4} fill="url(#colorEconomia)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </AppleCard>
          </motion.div>

          <AppleCard className="p-10 bg-card/40 backdrop-blur-3xl border border-border/40 rounded-[2.5rem] shadow-elevated h-full flex flex-col items-center">
            <h3 className="text-2xl font-black italic tracking-tighter text-white leading-none mb-2 w-full text-left">Biofeedback</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground italic mb-12 w-full text-left">Recuperação Sistêmica OMS</p>
            <div className="relative w-64 h-64 group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={85} outerRadius={110} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="space-y-1">
                  <p className="text-6xl font-black text-white italic leading-none drop-shadow-glow">{stats.healthPercentage}%</p>
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.5em] italic">Integridade</p>
                </div>
              </div>
            </div>
            <div className="mt-12 w-full space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black italic text-white/40 uppercase tracking-[0.2em]">
                <span>Sinal Vital</span>
                <span className="text-emerald-500">Otimizado</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 shadow-glow w-[90%]" />
              </div>
            </div>
          </AppleCard>
        </div>

        {/* QUICK ACCESS HUB */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AppleCard onClick={() => navigate("/coach")} className="p-10 bg-card/40 backdrop-blur-3xl border border-border/40 border-l-primary/40 md:col-span-2 lg:col-span-2 cursor-pointer group rounded-[2.5rem] shadow-elevated relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
              <Bot size={80} className="text-primary drop-shadow-glow" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 text-primary font-black tracking-[0.4em] text-[10px] uppercase italic">
                <Sparkles size={16} /> Assistência Neural IA
              </div>
              <h4 className="text-4xl font-black italic tracking-tighter text-white mb-6">Expert Advisor.</h4>
              <p className="text-white/60 text-lg font-bold italic mb-10 max-w-md leading-relaxed whitespace-pre-line">
                 {stats.avoidedCount > 0 
                   ? `Você já repeliu ${stats.avoidedCount} sinais tóxicos hoje.\nEficiência financeira: R$ ${stats.moneySaved.toFixed(2)} acumulados.`
                   : "Reactor pronto para iniciar novo ciclo de limpeza celular. Iniciar?"}
              </p>
              <Button className="w-full sm:w-auto px-12 rounded-[1.2rem] h-14 font-black uppercase tracking-[0.3em] text-[11px] italic shadow-glow group-hover:scale-105 transition-all">
                 Estabelecer Conexão <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </div>
          </AppleCard>

          <AppleCard onClick={() => navigate("/comunidade")} className="p-10 bg-card/40 backdrop-blur-3xl border border-border/40 cursor-pointer flex flex-col items-center justify-center gap-6 group rounded-[2.5rem] shadow-elevated transition-all hover:border-primary/40">
            <div className="p-6 rounded-[2rem] bg-primary/10 border border-primary/20 shadow-glow group-hover:scale-110 transition-transform">
              <Users size={40} className="text-primary" />
            </div>
            <div className="text-center">
              <h4 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Comunidade</h4>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] italic opacity-40 group-hover:opacity-100 transition-opacity">Rede de Frota</p>
            </div>
          </AppleCard>

          <AppleCard onClick={() => navigate("/conquistas")} className="p-10 bg-card/40 backdrop-blur-3xl border border-border/40 cursor-pointer flex flex-col items-center justify-center gap-6 group rounded-[2.5rem] shadow-elevated transition-all hover:border-amber-500/40">
            <div className="p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 shadow-glow group-hover:scale-110 transition-transform">
              <Trophy size={40} className="text-amber-500" />
            </div>
            <div className="text-center">
              <h4 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Hangar</h4>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] italic opacity-40 group-hover:opacity-100 transition-opacity">{stats.milestonesWithProgress.filter(m => m.achieved).length} Medalhas</p>
            </div>
          </AppleCard>
        </div>

        {/* LEGAL DISCLAIMER */}
        <div className="rounded-[2.5rem] bg-card/20 backdrop-blur-md border border-border/20 p-10 text-center relative group overflow-hidden">
          <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <p className="text-[10px] text-muted-foreground leading-loose font-black uppercase tracking-[0.5em] italic max-w-3xl mx-auto relative z-10">
            ⚕️ <strong>Aviso de Protocolo:</strong> Dados sincronizados via Rede Neural Supabase. 
            Baseado em parâmetros globais OMS/CDC/INCA. 
            Em caso de falha sistêmica vital: 192 (SAMU) ou Conexão 188 (CVV).
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
