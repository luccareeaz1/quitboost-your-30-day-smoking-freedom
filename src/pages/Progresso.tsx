import { useState, useEffect, useMemo } from "react";
import { motion, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppleCard } from "@/components/ui/apple-card";
import {
  Heart, Wind, Activity, Flame, Target,
  Timer, Shield, CheckCircle2, Wallet, Cigarette,
  TrendingUp, Clock, Zap, Brain, Droplets, Eye, BarChart3, Loader2, Sparkles, TrendingDown
} from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { calculateQuitStats, calculateHealthProgress } from "@/lib/calculations";
import { cn } from "@/lib/utils";


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

const healthMilestones = [
  { time: "20 min", minutes: 20, benefit: "Pressão arterial normaliza.", icon: Heart, color: "#f43f5e", source: "OMS" },
  { time: "8h", minutes: 480, benefit: "CO₂ no sangue cai pela metade.", icon: Wind, color: "#3b82f6", source: "CDC" },
  { time: "24h", minutes: 1440, benefit: "Risco cardíaco reduz.", icon: Activity, color: "#f59e0b", source: "OMS" },
  { time: "48h", minutes: 2880, benefit: "Paladar e olfato melhoram.", icon: Droplets, color: "#8b5cf6", source: "INCA" },
  { time: "72h", minutes: 4320, benefit: "Brônquios relaxam e O₂ sobe.", icon: Zap, color: "#10b981", source: "INCA" },
  { time: "1 semana", minutes: 10080, benefit: "Cílios pulmonares regeneram.", icon: Shield, color: "#06b6d4", source: "OMS" },
  { time: "1 mês", minutes: 43200, benefit: "Função pulmonar +30%.", icon: CheckCircle2, color: "#22c55e", source: "OMS" },
  { time: "1 ano", minutes: 525600, benefit: "Risco coronariano cai 50%.", icon: Target, color: "#eab308", source: "CDC" },
];

const Progresso = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    if (!profile) return null;

    const quitStats = calculateQuitStats({
      quit_date: profile.quit_date || new Date().toISOString(),
      cigarettes_per_day: profile.cigarettes_per_day || 0,
      price_per_cigarette: Number(profile.price_per_cigarette) || 0,
    }, now);

    const achievedMilestones = calculateHealthProgress(quitStats.totalSeconds).filter(m => m.achieved);
    const nextMilestone = calculateHealthProgress(quitStats.totalSeconds).find(m => !m.achieved);

    const chartData = Array.from({ length: 7 }, (_, i) => ({
      name: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][i],
      valor: Math.round((profile.cigarettes_per_day || 0) * (Number(profile.price_per_cigarette) || 0) * (i + 1))
    }));

    return { ...quitStats, achievedMilestones, nextMilestone, chartData };
  }, [profile, now]);


  if (loading || !profile || !stats) {
    return (
      <AppLayout>
         <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
           <Loader2 className="w-10 h-10 text-primary animate-spin" />
           <p className="text-muted-foreground font-medium">Processando métricas vitais...</p>
         </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl pb-32 pt-10 animate-fade-in space-y-10">
        <header className="text-center mb-12">
            <h1 className="text-5xl font-black tracking-tight mb-4">Progresso.</h1>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-[0.3em]">Auditoria Biográfica & Financeira</p>
        </header>

        {/* FINANCIAL HERO */}
        <section className="relative">
           <AppleCard className="p-10 sm:p-16 bg-foreground text-background rounded-[48px] overflow-hidden shadow-elevated">
              <div className="absolute top-0 right-0 p-10 opacity-10"><Wallet size={120} /></div>
              <div className="relative z-10 text-center space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Capital de Saúde Recuperado</p>
                  <div className="text-6xl sm:text-8xl font-black tracking-tighter italic">
                    <CountUp value={stats.moneySaved} prefix="R$" />
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs font-bold opacity-60">
                    <div className="flex items-center gap-2"><TrendingDown className="w-4 h-4" /> <span>-{stats.avoidedCount} cigarros</span></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> <span>+{stats.hoursRecovered}h de vida</span></div>
                  </div>

              </div>
           </AppleCard>
        </section>

        {/* GRAPHS BENTO */}
        <div className="grid md:grid-cols-3 gap-6">
           <div className="md:col-span-2 p-8 rounded-[40px] bg-card border-none shadow-soft flex flex-col">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-8">Fluxo de Economia Estendida</h3>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={stats.chartData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '24px', border: '1px solid hsl(var(--border))', fontWeight: 'bold' }}
                        itemStyle={{ color: 'hsl(var(--primary))' }}
                      />
                      <Area type="monotone" dataKey="valor" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                   </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
           <div className="p-8 rounded-[40px] bg-primary text-white shadow-lg space-y-6 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner"><Sparkles size={24} /></div>
              <h3 className="text-2xl font-black tracking-tighter leading-tight">Você é 30% mais rico hoje.</h3>
              <p className="text-xs font-medium opacity-80 leading-relaxed">Em 1 ano, você terá R${Math.round((profile.cigarettes_per_day || 0) * (Number(profile.price_per_cigarette) || 0) * 365)} extras na sua conta.</p>
              <Button variant="outline" className="w-full h-12 rounded-xl bg-white/10 border-white/20 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/20">Ver Projeção</Button>

           </div>
        </div>

        {/* TIMELINE */}
        <section className="bg-card rounded-[48px] p-8 sm:p-12 border-none shadow-soft">
           <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-black tracking-tight">Evolução Sistêmica</h2>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Realtime</span>
              </div>
           </div>

           <div className="space-y-12 relative">
              <div className="absolute left-[21px] top-4 bottom-4 w-1 bg-muted rounded-full" />
              {healthMilestones.map((m, i) => {
                const achieved = stats.totalSeconds / 60 >= m.minutes;
                const progress = Math.min(100, (stats.totalSeconds / 60 / m.minutes) * 100);

                
                return (
                  <motion.div
                    key={m.time}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn("flex gap-8 items-start relative z-10", !achieved && "opacity-40 grayscale")}
                  >
                    <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all", achieved ? "bg-white dark:bg-black scale-110" : "bg-muted")}>
                       {achieved ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <m.icon className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 pt-1">
                       <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{m.time}</span>
                          {achieved && <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">Biological Victory</span>}
                       </div>
                       <h4 className="text-lg font-black tracking-tight mb-2">{m.benefit}</h4>
                       {!achieved && progress > 0 && (
                         <div className="w-full h-1.5 bg-muted rounded-full mt-4 overflow-hidden border border-border">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${progress}%` }}
                               className="h-full bg-primary"
                            />
                         </div>
                       )}
                    </div>
                  </motion.div>
                );
              })}
           </div>
        </section>

        {/* DISCLAIMER */}
        <footer className="p-8 rounded-[32px] bg-muted/30 border border-border/50 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground leading-relaxed">
             PROTOCOLOS CLÍNICOS: OMS / CDC / INCA 2026<br />
             Acompanhamento científico exclusivo para usuários Elite.
           </p>
        </footer>
      </div>
    </AppLayout>
  );
};

export default Progresso;
