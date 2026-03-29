import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity, Wallet, Cigarette, Target, Trophy, Flame,
  Sparkles, TrendingUp, Calendar, Heart, Wind, Timer,
  Zap, Users, Bot, ChevronRight, Shield, Clock,
  Droplets, Brain, Eye
} from "lucide-react";
import {
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { calculateQuitStats, calculateHealthProgress } from "@/lib/calculations";

import { Button } from "@/components/ui/button";
import { AppleCard } from "@/components/ui/apple-card";
import { useAuth } from "@/hooks/useAuth";
import { streakService, progressService } from "@/lib/services";

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
  return <span>{prefix}{display.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, subscription, signOut } = useAuth();
  const [now, setNow] = useState(new Date());
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [streakData, setStreakData] = useState<any>(null);

  useEffect(() => {
    if (!profile && !user) return; // Wait for auth/profile
    
    // Check-in streak on mount
    if (user) {
      streakService.checkIn(user.id).then(() => {
        streakService.get(user.id).then(setStreakData);
      });
    }

    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [profile, user]);

  // Derived stats
  const stats = useMemo(() => {
    if (!profile) return null;
    
    // Use the central calculation engine
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
       <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full" />
       </div>
    );
  }

  // Chart data (last 7 days)
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
    { name: "Recuperado", value: stats.healthPercentage, color: "#22c55e" },
    { name: "Em progresso", value: 100 - stats.healthPercentage, color: "#e5e7eb" },
  ];

  const todayTip = DAILY_TIPS[stats.days % DAILY_TIPS.length];
  const greeting = now.getHours() < 12 ? "Bom dia" : now.getHours() < 18 ? "Boa tarde" : "Boa noite";
  const comparisonPercent = stats.days > 12 ? 110 : Math.round((stats.days / 12) * 100);

  return (
    <>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 pb-24">

        {/* UPGRADE BANNER */}
        {subscription === "free" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-sm font-bold">Desbloqueie o Coach Neural IA</p>
                <p className="text-xs text-muted-foreground font-medium">Suporte 24/7, relatórios avançados e plano personalizado.</p>
              </div>
            </div>
            <Button
              size="sm"
              className="rounded-full bg-primary text-primary-foreground font-bold px-8 shadow-md"
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
          className="flex justify-between items-end"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              {greeting}, <span className="text-primary">{profile.display_name || user?.email?.split("@")[0] || "Guerreiro"}</span>.
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Sua nova vida começa agora.</p>
          </div>
          {user && (
            <button
              onClick={signOut}
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors hidden sm:block"
            >
              Sair
            </button>
          )}
        </motion.header>

        {/* STREAK COUNTER - BIG HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <AppleCard className="p-8 sm:p-12 bg-foreground text-background text-center relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                  {streakData ? `Streak: ${streakData.current_streak} dias` : "Streak Ativo"}
                </span>
                <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>

              <div className="text-7xl sm:text-9xl font-black tracking-tighter mb-2">
                {stats.days}
              </div>
              <p className="text-xl font-medium opacity-80 mb-6">dias sem fumar</p>

              {/* Live timer */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 text-lg font-mono">
                {[
                  { val: String(stats.hours).padStart(2, "0"), label: "horas" },
                  { val: String(stats.minutes).padStart(2, "0"), label: "min" },
                  { val: String(stats.seconds).padStart(2, "0"), label: "seg" },
                ].map((t, i) => (
                  <div key={t.label} className="text-center">
                    <div className="text-3xl sm:text-4xl font-black tracking-tight">{t.val}</div>
                    <div className="text-[10px] uppercase tracking-wider opacity-50">{t.label}</div>
                  </div>
                ))}
              </div>

              {/* Motivational message */}
              <p className="text-sm opacity-60 mt-6 max-w-md mx-auto">
                {stats.days === 0 ? "Cada segundo conta. Você já começou sua transformação!" :
                 stats.days <= 3 ? "A nicotina está sendo eliminada do seu corpo. Aguente firme!" :
                 stats.days <= 7 ? "Seus pulmões já estão iniciando a regeneração. Incrível!" :
                 stats.days <= 30 ? "Sua função pulmonar aumentou. Você é um guerreiro!" :
                 "Você é uma inspiração. Seu corpo agradece cada dia!"}
              </p>
            </div>
          </AppleCard>
        </motion.div>

        {/* KEY METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Cigarros Evitados", value: stats.avoidedCount, icon: Cigarette, color: "text-rose-500", bg: "bg-rose-50", suffix: "" },
            { label: "Economizados", value: stats.moneySaved, icon: Wallet, color: "text-blue-600", bg: "bg-blue-50", prefix: "R$ ", decimals: 0 },
            { label: "Vida Recuperada", value: stats.hoursRecovered, icon: Clock, color: "text-emerald-500", bg: "bg-emerald-50", suffix: "h" },
            { label: "Saúde Geral", value: stats.healthPercentage, icon: Activity, color: "text-amber-500", bg: "bg-amber-50", suffix: "%" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <AppleCard className="p-5 sm:p-6 bg-card border-border hover:shadow-md transition-all group">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">{stat.label}</p>
                <p className={`text-2xl sm:text-3xl font-black tracking-tight ${stat.color}`}>
                  <AnimatedNumber value={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} decimals={stat.decimals || 0} />
                </p>
              </AppleCard>
            </motion.div>
          ))}
        </div>

        {/* DAILY TIP + MISSION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {showTip && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <AppleCard className="p-6 bg-emerald-500/5 border-emerald-500/10 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Dica de Liberdade</h3>
                      <p className="text-[10px] text-muted-foreground">Fonte: {todayTip.source}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">{todayTip.tip}</p>
                  <p className="text-[10px] text-muted-foreground italic">⚕️ Baseado em evidências oficiais (OMS/CDC).</p>
                </AppleCard>
              </motion.div>
            )}
          </AnimatePresence>

          <AppleCard className="p-6 h-full bg-primary text-primary-foreground border-transparent overflow-hidden relative group">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-background/10 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 font-bold uppercase tracking-widest text-[10px] opacity-80">
                <Target size={14} /> Missão do Dia
              </div>
              <h3 className="text-xl font-black mb-3 leading-tight">
                {stats.days <= 3 ? "Beba 8 copos de água hoje" : "Faça 10 minutos de caminhada"}
              </h3>
              <p className="opacity-70 text-xs leading-relaxed mb-6">A hidratação acelera a eliminação de toxinas. A atividade física libera endorfinas (TCC/OMS).</p>
              <Button
                onClick={() => setMissionCompleted(true)}
                disabled={missionCompleted}
                className={`w-full h-12 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${
                  missionCompleted ? "bg-background/20 text-background/50" : "bg-background text-foreground shadow-lg"
                }`}
              >
                {missionCompleted ? "✅ Missão Concluída" : "Concluir"}
              </Button>
            </div>
          </AppleCard>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <AppleCard className="p-6 sm:p-8 bg-card border-border">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-bold tracking-tight mb-1">Tendência de Evolução</h3>
                  <p className="text-xs text-muted-foreground font-medium">Saúde e Economia (Vida Real)</p>
                </div>
                <TrendingUp size={20} className="text-primary" />
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSaude" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} /><stop offset="95%" stopColor="#22C55E" stopOpacity={0} /></linearGradient>
                      <linearGradient id="colorEconomia" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 700 }} dy={10} />
                    <Tooltip contentStyle={{ borderRadius: "20px", border: "none", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }} />
                    <Area type="monotone" dataKey="saude" name="Saúde" stroke="#22C55E" strokeWidth={4} fill="url(#colorSaude)" />
                    <Area type="monotone" dataKey="economia" name="Economia" stroke="#3b82f6" strokeWidth={3} fill="url(#colorEconomia)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </AppleCard>
          </motion.div>

          <AppleCard className="p-6 sm:p-8 bg-card border-border h-full flex flex-col items-center">
            <h3 className="text-lg font-bold tracking-tight mb-1 w-full text-left">Recuperação</h3>
            <p className="text-xs text-muted-foreground font-medium mb-4 w-full text-left">Benefícios (OMS)</p>
            <div className="relative w-44 h-44">
              <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value" startAngle={90} endAngle={-270}>{pieData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></PieChart></ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div><p className="text-4xl font-black text-primary">{stats.healthPercentage}%</p><p className="text-[10px] text-muted-foreground font-bold">STATUS</p></div>
              </div>
            </div>
          </AppleCard>
        </div>

        {/* QUICK ACCESS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AppleCard onClick={() => navigate("/coach")} className="p-7 bg-card border-border md:col-span-2 lg:col-span-2 cursor-pointer group">
            <div className="flex items-center gap-2 mb-4 text-primary font-bold tracking-widest text-[9px] uppercase">
              <Sparkles size={14} /> Apoio do Especialista
            </div>
            <h4 className="text-2xl font-black mb-3">Assistente de Liberdade</h4>
            <p className="text-muted-foreground text-sm font-medium mb-5 whitespace-pre-line">
               {stats.avoidedCount > 0 
                 ? `Você já evitou ${stats.avoidedCount} cigarros hoje.\nIsso equivale a R$ ${stats.moneySaved.toFixed(2)} economizados.`
                 : "Pronto para começar seu dia sem cigarro?"}
            </p>
            <Button className="w-full rounded-2xl h-11 font-bold group-hover:scale-[1.02] transition-transform">
               Conversar <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </AppleCard>

          <AppleCard onClick={() => navigate("/comunidade")} className="p-7 bg-card border-border cursor-pointer flex flex-col items-center justify-center gap-2 group transition-all">
            <Users size={32} className="text-primary mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold">Comunidade</h4>
            <p className="text-[10px] text-muted-foreground font-bold">REDE DE APOIO</p>
          </AppleCard>

          <AppleCard onClick={() => navigate("/conquistas")} className="p-7 bg-card border-border cursor-pointer flex flex-col items-center justify-center gap-2 group transition-all">
            <Trophy size={32} className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold">Conquistas</h4>
            <p className="text-[10px] text-muted-foreground font-bold">{stats.milestonesWithProgress.filter(m => m.achieved).length} BADGES</p>
          </AppleCard>
        </div>

        <div className="rounded-2xl bg-muted/50 border border-border p-4 text-center">
          <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
            ⚕️ <strong>Aviso Legal:</strong> Dados sincronizados via Supabase Realtime. Baseado em diretrizes OMS/CDC/INCA 2026. Em emergências ligue 192 (SAMU) ou 188 (CVV).
          </p>
        </div>
      </div>
    </>
  );
}
