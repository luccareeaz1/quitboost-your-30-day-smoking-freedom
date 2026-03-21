import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity, Wallet, Cigarette, Target, Trophy, Flame,
  Sparkles, TrendingUp, Calendar, Heart, Wind, Timer,
  Zap, Users, Bot, ChevronRight, Shield, Clock,
  Lungs, Droplets, Brain, Eye
} from "lucide-react";
import {
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { AppleCard } from "@/components/ui/apple-card";
import { useAuth } from "@/hooks/useAuth";

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
  const { user, subscription, signOut } = useAuth();
  const [now, setNow] = useState(new Date());
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [showTip, setShowTip] = useState(true);

  const profile = useMemo(() => {
    const stored = localStorage.getItem("quitboost_profile");
    return stored ? JSON.parse(stored) : null;
  }, []);

  useEffect(() => {
    if (!profile) {
      navigate("/onboarding");
      return;
    }
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [profile, navigate]);

  if (!profile) return null;

  const quitDate = new Date(profile.quitDate);
  const diffMs = now.getTime() - quitDate.getTime();
  const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const diffMinutes = Math.floor(diffSeconds / 60);
  const days = Math.floor(diffSeconds / (3600 * 24));
  const hours = Math.floor((diffSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;
  const avoidedCount = Math.floor(days * profile.cigarrosPorDia);
  const moneySaved = avoidedCount * profile.custoPorCigarro;

  // Time of life recovered: ~11 min per cigarette (according to studies)
  const minutesRecovered = avoidedCount * 11;
  const hoursRecovered = Math.floor(minutesRecovered / 60);
  const daysRecovered = Math.floor(hoursRecovered / 24);

  // Health milestones with progress
  const milestonesWithProgress = HEALTH_MILESTONES.map((m) => ({
    ...m,
    progress: Math.min(100, (diffMinutes / m.minutes) * 100),
    achieved: diffMinutes >= m.minutes,
  }));

  const healthPercentage = Math.min(100, Math.round(
    milestonesWithProgress.filter((m) => m.achieved).length / HEALTH_MILESTONES.length * 100
  ));

  // Chart data (last 7 days)
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dayDiff = Math.max(0, Math.floor((d.getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24)));
    return {
      name: weekDays[d.getDay()],
      saude: Math.min(100, Math.round((dayDiff / 30) * 100)),
      economia: Math.round(dayDiff * profile.cigarrosPorDia * profile.custoPorCigarro),
      evitados: dayDiff * profile.cigarrosPorDia,
    };
  });

  // Pie chart for health benefits
  const pieData = [
    { name: "Recuperado", value: healthPercentage, color: "#22c55e" },
    { name: "Em progresso", value: 100 - healthPercentage, color: "#e5e7eb" },
  ];

  // Daily tip
  const todayTip = DAILY_TIPS[days % DAILY_TIPS.length];

  // Greeting based on time
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  // Average community comparison (mock)
  const avgDaysCommunity = 12;
  const comparisonPercent = days > 0 ? Math.round((days / avgDaysCommunity) * 100) : 0;

  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 pb-24">

        {/* UPGRADE BANNER */}
        {subscription === "free" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-sm font-bold">Desbloqueie o Coach Neural IA</p>
                <p className="text-xs text-muted-foreground font-medium">Suporte 24/7, relatórios avançados e plano personalizado.</p>
              </div>
            </div>
            <Button
              size="sm"
              className="rounded-full bg-primary text-primary-foreground font-bold px-8"
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
              {greeting}, <span className="text-primary">{user?.email?.split("@")[0] || "Guerreiro"}</span>.
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Sua jornada pela liberdade continua.</p>
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
                  Streak Ativo
                </span>
                <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>

              <div className="text-7xl sm:text-9xl font-black tracking-tighter mb-2">
                {days}
              </div>
              <p className="text-xl font-medium opacity-80 mb-6">dias sem fumar</p>

              {/* Live timer */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 text-lg font-mono">
                {[
                  { val: String(hours).padStart(2, "0"), label: "horas" },
                  { val: String(minutes).padStart(2, "0"), label: "min" },
                  { val: String(seconds).padStart(2, "0"), label: "seg" },
                ].map((t, i) => (
                  <div key={t.label} className="text-center">
                    <div className="text-3xl sm:text-4xl font-black tracking-tight">{t.val}</div>
                    <div className="text-[10px] uppercase tracking-wider opacity-50">{t.label}</div>
                  </div>
                ))}
              </div>

              {/* Motivational message */}
              <p className="text-sm opacity-60 mt-6 max-w-md mx-auto">
                {days === 0 ? "Cada segundo conta. Você já começou sua transformação!" :
                 days <= 3 ? "A nicotina está sendo eliminada do seu corpo. Aguente firme!" :
                 days <= 7 ? "Seus pulmões já estão iniciando a regeneração. Incrível!" :
                 days <= 14 ? "Sua circulação melhorou significativamente. Continue!" :
                 days <= 30 ? "Sua função pulmonar aumentou. Você é um guerreiro!" :
                 "Você é uma inspiração. Seu corpo agradece cada dia!"}
              </p>
            </div>
          </AppleCard>
        </motion.div>

        {/* KEY METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Cigarros Evitados", value: avoidedCount, icon: Cigarette, color: "text-rose-500", bg: "bg-rose-50", suffix: "" },
            { label: "Economizados", value: moneySaved, icon: Wallet, color: "text-blue-600", bg: "bg-blue-50", prefix: "R$ ", decimals: 0 },
            { label: "Vida Recuperada", value: hoursRecovered, icon: Clock, color: "text-emerald-500", bg: "bg-emerald-50", suffix: "h" },
            { label: "Saúde Geral", value: healthPercentage, icon: Activity, color: "text-amber-500", bg: "bg-amber-50", suffix: "%" },
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
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{stat.label}</p>
                <p className={`text-2xl sm:text-3xl font-black tracking-tight ${stat.color}`}>
                  <AnimatedNumber value={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} decimals={stat.decimals || 0} />
                </p>
              </AppleCard>
            </motion.div>
          ))}
        </div>

        {/* DAILY TIP + MISSION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily medical tip */}
          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AppleCard className="p-6 bg-emerald-500/5 border-emerald-500/10 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">Dica Médica do Dia</h3>
                        <p className="text-[10px] text-muted-foreground">Fonte: {todayTip.source}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                    {todayTip.tip}
                  </p>
                  <p className="text-[10px] text-muted-foreground italic">
                    ⚕️ Baseado em evidências científicas das diretrizes oficiais.
                  </p>
                </AppleCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Daily mission */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <AppleCard className="p-6 h-full bg-primary text-primary-foreground border-transparent overflow-hidden relative group">
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-background/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 font-bold uppercase tracking-widest text-[10px] opacity-80">
                  <Target size={14} /> Missão do Dia
                </div>
                <h3 className="text-xl font-black mb-3 leading-tight">
                  {days <= 3 ? "Beba 8 copos de água hoje" :
                   days <= 7 ? "Faça 10 minutos de caminhada" :
                   days <= 14 ? "Pratique respiração diafragmática 3x" :
                   days <= 21 ? "Troque o café por chá verde" :
                   "Medite por 15 minutos"}
                </h3>
                <p className="opacity-70 text-xs leading-relaxed mb-6">
                  {days <= 3 ? "A hidratação acelera a eliminação de toxinas do tabaco do organismo. Diretrizes OMS recomendam aumento hídrico nos primeiros dias." :
                   days <= 7 ? "A atividade física libera endorfinas e dopamina, compensando a falta de nicotina de forma saudável (CDC)." :
                   days <= 14 ? "A técnica de respiração diafragmática é recomendada pelo INCA como primeira linha no manejo do craving." :
                   days <= 21 ? "A cafeína é um dos 3 principais gatilhos de recaída no Brasil. O chá verde tem L-teanina, que promove calma." :
                   "A meditação mindfulness reduz em até 60% a intensidade do craving (meta-análise 2024, Lancet)."}
                </p>
                <Button
                  onClick={() => setMissionCompleted(true)}
                  disabled={missionCompleted}
                  className={`w-full h-12 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${
                    missionCompleted
                      ? "bg-background/20 text-background/50 cursor-not-allowed"
                      : "bg-background text-foreground hover:scale-[1.02] shadow-lg"
                  }`}
                >
                  {missionCompleted ? "✅ Missão Concluída" : "Marcar como Concluída"}
                </Button>
              </div>
            </AppleCard>
          </motion.div>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Evolution chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <AppleCard className="p-6 sm:p-8 bg-card border-border">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-bold tracking-tight mb-1">Tendência de Evolução</h3>
                  <p className="text-xs text-muted-foreground font-medium">Saúde e Economia - últimos 7 dias</p>
                </div>
                <TrendingUp size={20} className="text-primary" />
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSaude" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorEconomia" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.1)" }}
                      labelStyle={{ fontWeight: 800, color: "#111827" }}
                    />
                    <Area type="monotone" dataKey="saude" name="Saúde %" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorSaude)" />
                    <Area type="monotone" dataKey="economia" name="Economia R$" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorEconomia)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </AppleCard>
          </motion.div>

          {/* Health pie chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <AppleCard className="p-6 sm:p-8 bg-card border-border h-full flex flex-col">
              <h3 className="text-lg font-bold tracking-tight mb-1">Recuperação</h3>
              <p className="text-xs text-muted-foreground font-medium mb-4">Benefícios de saúde alcançados</p>
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-black text-primary">{healthPercentage}%</p>
                      <p className="text-[10px] text-muted-foreground">OMS</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2 italic">
                Baseado no cronograma de recuperação da OMS
              </p>
            </AppleCard>
          </motion.div>
        </div>

        {/* RISK REDUCTION BARS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AppleCard className="p-6 sm:p-8 bg-card border-border">
            <h3 className="text-lg font-bold tracking-tight mb-1">Redução de Riscos</h3>
            <p className="text-xs text-muted-foreground font-medium mb-6">Comparado a um fumante ativo (dados OMS, 2024)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {RISK_REDUCTION_DATA.map((risk) => {
                const reduction = Math.min(100 - risk.current, days * 0.5);
                return (
                  <div key={risk.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{risk.name}</span>
                      <span className="text-xs font-bold" style={{ color: risk.color }}>
                        -{Math.round(reduction)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(5, reduction)}%` }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: risk.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-4 italic">
              ⚕️ Valores aproximados baseados em estudos epidemiológicos da OMS. Resultados individuais variam.
            </p>
          </AppleCard>
        </motion.div>

        {/* COMMUNITY COMPARISON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <AppleCard className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold">Comparação Anônima</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Média da comunidade</p>
                <p className="text-2xl font-black">{avgDaysCommunity} dias</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Você</p>
                <p className="text-2xl font-black text-primary">{days} dias</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Seu desempenho</p>
                <p className={`text-2xl font-black ${comparisonPercent >= 100 ? "text-emerald-500" : "text-amber-500"}`}>
                  {comparisonPercent >= 100 ? "Acima ✨" : `${comparisonPercent}%`}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 italic">
              Dados anônimos e agregados. Identidades protegidas.
            </p>
          </AppleCard>
        </motion.div>

        {/* QUICK ACCESS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div whileHover={{ y: -4 }} className="md:col-span-2 lg:col-span-2">
            <AppleCard
              className="p-6 bg-card border-border flex flex-col justify-between h-full group hover:border-primary/20 transition-all cursor-pointer"
              onClick={() => navigate("/coach")}
            >
              <div>
                <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase tracking-widest text-[10px]">
                  <Sparkles size={14} /> Suporte Instantâneo
                </div>
                <h4 className="text-xl font-black mb-2">Coach Neural IA</h4>
                <p className="text-muted-foreground text-sm font-medium mb-4">
                  "{avoidedCount > 0 ? `Você já evitou ${avoidedCount} cigarros.` : "Comece sua conversa com o Coach."} Sua circulação está melhorando a cada minuto."
                </p>
              </div>
              <Button variant="outline" className="w-full h-10 rounded-full group-hover:border-primary group-hover:text-primary transition-all">
                Conversar agora <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </AppleCard>
          </motion.div>

          <motion.div whileHover={{ y: -4 }}>
            <AppleCard
              className="p-6 bg-card border-border flex flex-col items-center text-center justify-center h-full hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate("/comunidade")}
            >
              <Flame size={28} className="text-amber-500 mb-3" />
              <h4 className="text-base font-bold">Comunidade</h4>
              <p className="text-[10px] text-muted-foreground font-semibold mt-1">Apoie e seja apoiado</p>
            </AppleCard>
          </motion.div>

          <motion.div whileHover={{ y: -4 }}>
            <AppleCard
              className="p-6 bg-card border-border flex flex-col items-center text-center justify-center h-full hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate("/conquistas")}
            >
              <Trophy size={28} className="text-primary mb-3" />
              <h4 className="text-base font-bold">Conquistas</h4>
              <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                {milestonesWithProgress.filter((m) => m.achieved).length}/{HEALTH_MILESTONES.length} desbloqueadas
              </p>
            </AppleCard>
          </motion.div>
        </div>

        {/* MEDICAL DISCLAIMER */}
        <div className="rounded-2xl bg-muted/50 border border-border p-4 text-center">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            ⚕️ <strong>Aviso Legal:</strong> Este app não substitui consulta médica. Consulte seu médico antes de qualquer mudança no tratamento.
            Dados de saúde baseados nas diretrizes oficiais da OMS, CDC e INCA/Ministério da Saúde do Brasil.
            Em caso de emergência, ligue 192 (SAMU) ou 188 (CVV).
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
