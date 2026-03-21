import { useState, useEffect, useMemo } from "react";
import { motion, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppleCard } from "@/components/ui/apple-card";
import {
  Heart, Wind, Activity, Flame, Target,
  Timer, Shield, CheckCircle2, Wallet, Cigarette,
  TrendingUp, Clock, Zap, Brain, Droplets, Eye
} from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import {
  BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell
} from "recharts";

// ========== ANIMATED COUNTER ==========
function CountUp({ value, prefix = "", suffix = "", decimals = 2 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [value]);
  return <span>{prefix}{displayValue.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

// ========== HEALTH MILESTONES (Fontes: OMS, CDC, INCA) ==========
const healthMilestones = [
  { time: "20 minutos", minutes: 20, benefit: "Pressão arterial e frequência cardíaca voltam ao normal.", icon: Heart, color: "#ef4444", source: "OMS" },
  { time: "8 horas", minutes: 480, benefit: "Nível de CO₂ no sangue cai pela metade. O₂ normaliza.", icon: Wind, color: "#3b82f6", source: "CDC" },
  { time: "24 horas", minutes: 1440, benefit: "Risco de ataque cardíaco começa a diminuir.", icon: Activity, color: "#f59e0b", source: "OMS" },
  { time: "48 horas", minutes: 2880, benefit: "Terminações nervosas se regeneram. Paladar e olfato melhoram.", icon: Droplets, color: "#8b5cf6", source: "INCA" },
  { time: "72 horas", minutes: 4320, benefit: "Nicotina totalmente eliminada. Brônquios relaxam. Respiração facilita.", icon: Zap, color: "#10b981", source: "INCA" },
  { time: "1 semana", minutes: 10080, benefit: "Cílios pulmonares começam a se regenerar. Limpeza natural melhora.", icon: Shield, color: "#06b6d4", source: "OMS" },
  { time: "2 semanas", minutes: 20160, benefit: "Circulação melhora até 30%. Caminhar fica mais fácil.", icon: TrendingUp, color: "#ec4899", source: "CDC" },
  { time: "1 mês", minutes: 43200, benefit: "Função pulmonar melhora 30%. Tosse e cansaço diminuem.", icon: CheckCircle2, color: "#22c55e", source: "OMS" },
  { time: "3 meses", minutes: 129600, benefit: "Risco de ataque cardíaco reduz em 50%.", icon: Heart, color: "#f43f5e", source: "OMS" },
  { time: "1 ano", minutes: 525600, benefit: "Risco de doença coronariana cai pela metade.", icon: Target, color: "#eab308", source: "CDC" },
  { time: "5 anos", minutes: 2628000, benefit: "Risco de AVC igual ao de não-fumantes.", icon: Brain, color: "#6366f1", source: "OMS" },
  { time: "10 anos", minutes: 5256000, benefit: "Risco de câncer de pulmão cai pela metade.", icon: Shield, color: "#14b8a6", source: "OMS" },
];

const Progresso = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  const profile = useMemo(() => {
    const stored = localStorage.getItem("quitboost_profile");
    if (!stored) return null;
    return JSON.parse(stored);
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
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const avoidedCount = diffDays * profile.cigarrosPorDia;
  const totalSaved = avoidedCount * profile.custoPorCigarro;
  const minutesRecovered = avoidedCount * 11; // ~11 min per cigarette
  const hoursRecovered = Math.floor(minutesRecovered / 60);
  const daysRecovered = Math.floor(hoursRecovered / 24);

  // Annual projection
  const dailySaving = profile.cigarrosPorDia * profile.custoPorCigarro;
  const annualProjection = dailySaving * 365;

  // Milestones with progress
  const milestonesWithProgress = healthMilestones.map((m) => ({
    ...m,
    progress: Math.min(100, (diffMinutes / m.minutes) * 100),
    achieved: diffMinutes >= m.minutes,
  }));

  const achievedCount = milestonesWithProgress.filter((m) => m.achieved).length;

  // Weekly reduction data
  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const weeklyData = weekDays.map((day, i) => ({
    day,
    evitados: Math.max(0, profile.cigarrosPorDia),
    economia: profile.cigarrosPorDia * profile.custoPorCigarro,
  }));

  // Monthly trend data
  const monthlyTrend = Array.from({ length: Math.min(12, diffDays > 0 ? Math.ceil(diffDays / 30) + 1 : 1) }, (_, i) => ({
    mes: `Mês ${i + 1}`,
    saude: Math.min(100, Math.round(((i + 1) * 30 / 365) * 100)),
    economia: Math.round((i + 1) * 30 * dailySaving),
  }));

  // Body systems recovery pie
  const bodyRecovery = [
    { name: "Cardiovascular", value: Math.min(100, diffDays * 0.5), color: "#ef4444" },
    { name: "Pulmonar", value: Math.min(100, diffDays * 0.3), color: "#3b82f6" },
    { name: "Circulatório", value: Math.min(100, diffDays * 0.7), color: "#8b5cf6" },
    { name: "Nervoso", value: Math.min(100, diffDays * 1.0), color: "#f59e0b" },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 space-y-10 animate-fade-in pb-20 pt-8">
        <header className="mb-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">Progresso</h1>
          <p className="text-muted-foreground mt-3 text-base">
            Sua evolução com dados médicos reais (OMS, CDC, INCA).
          </p>
        </header>

        {/* HERO - MONEY SAVED */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <AppleCard className="p-8 sm:p-14 text-center bg-foreground text-background shadow-elevated relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
            <div className="relative z-10">
              <p className="text-lg sm:text-xl opacity-70 mb-4 font-medium">Você já economizou</p>
              <div className="text-5xl sm:text-8xl font-bold tracking-tighter mb-4">
                <CountUp value={totalSaved} prefix="R$ " />
              </div>
              <p className="text-sm opacity-70 font-medium mb-6">desde que começou sua jornada.</p>
              <div className="flex items-center justify-center gap-6 text-sm opacity-60">
                <span>Projeção anual: <strong>R$ {annualProjection.toFixed(0)}</strong></span>
                <span>•</span>
                <span>{dailySaving.toFixed(2)}/dia</span>
              </div>
            </div>
          </AppleCard>
        </motion.section>

        {/* KEY METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Cigarette, label: "Cigarros evitados", value: avoidedCount, color: "text-rose-500" },
            { icon: Clock, label: "Vida recuperada", value: `${daysRecovered > 0 ? `${daysRecovered}d ` : ""}${hoursRecovered % 24}h`, color: "text-emerald-500" },
            { icon: TrendingUp, label: "Marcos de saúde", value: `${achievedCount}/${healthMilestones.length}`, color: "text-blue-500" },
            { icon: Flame, label: "Streak ativo", value: `${diffDays} dias`, color: "text-amber-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <AppleCard className="p-5 shadow-soft">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</p>
                <p className={`text-xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
              </AppleCard>
            </motion.div>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* CHART - DAILY SAVINGS */}
          <AppleCard className="p-6 sm:p-8 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Economia Semanal</h2>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase">
                R$ {(dailySaving * 7).toFixed(0)}/sem
              </span>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "var(--shadow-md)", fontSize: "12px" }}
                  />
                  <Bar dataKey="economia" name="Economia (R$)" fill="hsl(var(--primary))" radius={[6, 6, 6, 6]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AppleCard>

          {/* CHART - BODY RECOVERY */}
          <AppleCard className="p-6 sm:p-8 shadow-soft">
            <h2 className="text-xl font-semibold tracking-tight mb-6">Recuperação por Sistema</h2>
            <div className="space-y-4">
              {bodyRecovery.map((system) => (
                <div key={system.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{system.name}</span>
                    <span className="text-xs font-bold" style={{ color: system.color }}>
                      {Math.round(system.value)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${system.value}%` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: system.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-4 italic">
              Aproximações baseadas em estudos epidemiológicos OMS. Resultados individuais variam.
            </p>
          </AppleCard>
        </div>

        {/* HEALTH TIMELINE */}
        <AppleCard className="p-6 sm:p-10 shadow-soft">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
            Linha do Tempo de Saúde
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Benefícios comprovados da cessação ao longo do tempo (fontes: OMS, CDC, INCA).
          </p>

          <div className="space-y-6">
            {milestonesWithProgress.map((ms, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex gap-4 sm:gap-6 ${ms.achieved ? "" : "opacity-50"}`}
              >
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${
                      ms.achieved ? "shadow-md" : ""
                    }`}
                    style={{
                      backgroundColor: ms.achieved ? `${ms.color}15` : "hsl(var(--muted))",
                      color: ms.achieved ? ms.color : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {ms.achieved ? <CheckCircle2 className="h-5 w-5" /> : <ms.icon className="h-5 w-5" />}
                  </div>
                  {idx < milestonesWithProgress.length - 1 && (
                    <div className="w-[2px] flex-1 min-h-[20px] bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ms.achieved ? ms.color : "hsl(var(--muted-foreground))" }}>
                      {ms.time}
                    </p>
                    {ms.achieved && (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full font-bold">
                        ✓ Alcançado
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium leading-snug tracking-tight">{ms.benefit}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Fonte: {ms.source}</p>

                  {/* Progress bar for milestones in progress */}
                  {!ms.achieved && ms.progress > 0 && (
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${ms.progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: ms.color }}
                        />
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{Math.round(ms.progress)}% concluído</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </AppleCard>

        {/* MEDICAL DISCLAIMER */}
        <div className="rounded-2xl bg-muted/50 border border-border p-4 text-center">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            ⚕️ <strong>Aviso Legal:</strong> Dados de saúde baseados em estudos epidemiológicos da OMS (WHO Report on Global Tobacco Epidemic),
            CDC (Treating Tobacco Use and Dependence) e INCA (Protocolo Clínico do Tabagismo). Resultados individuais podem variar.
            Este app não substitui consulta médica.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Progresso;
