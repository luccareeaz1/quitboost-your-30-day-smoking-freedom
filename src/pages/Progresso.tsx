import { useState, useEffect, useMemo } from "react";
import { motion, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppleCard } from "@/components/ui/apple-card";
import {
  Heart, Wind, Activity, Flame, Target,
  Timer, Shield, CheckCircle2, Wallet, Cigarette,
  TrendingUp, Clock, Zap, Brain, Droplets, Eye, BarChart3, Loader2, Sparkles, TrendingDown,
  Navigation, Monitor
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
  { time: "20 min", minutes: 20, benefit: "Pressão arterial normaliza.", icon: Heart, color: "#10b981", source: "OMS" },
  { time: "8h", minutes: 480, benefit: "CO₂ no sangue cai pela metade.", icon: Wind, color: "#10b981", source: "CDC" },
  { time: "24h", minutes: 1440, benefit: "Risco cardíaco reduz.", icon: Activity, color: "#10b981", source: "OMS" },
  { time: "48h", minutes: 2880, benefit: "Paladar e olfato melhoram.", icon: Droplets, color: "#10b981", source: "INCA" },
  { time: "72h", minutes: 4320, benefit: "Brônquios relaxam e O₂ sobe.", icon: Zap, color: "#10b981", source: "INCA" },
  { time: "1 semana", minutes: 10080, benefit: "Cílios pulmonares regeneram.", icon: Shield, color: "#10b981", source: "OMS" },
  { time: "1 mês", minutes: 43200, benefit: "Função pulmonar +30%.", icon: CheckCircle2, color: "#10b981", source: "OMS" },
  { time: "1 ano", minutes: 525600, benefit: "Risco coronariano cai 50%.", icon: Target, color: "#10b981", source: "CDC" },
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
         <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-pulse shadow-glow">
              <Zap size={40} fill="currentColor" />
            </div>
            <p className="text-muted-foreground font-black uppercase tracking-[0.5em] text-[10px] animate-pulse italic">
              Sincronizando Métricas Neurais...
            </p>
         </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl pb-32 pt-10 animate-fade-in space-y-12">
        <header className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-white italic leading-none">
              Mission <span className="text-primary drop-shadow-glow">Metrics.</span>
            </h1>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.5em] mt-4 italic">
              Relatório de Desempenho Biológico • ID: {user?.id.slice(0, 8)}
            </p>
        </header>

        {/* FINANCIAL HERO */}
        <section className="relative">
           <AppleCard className="p-10 sm:p-20 border-primary/20 rounded-[48px] overflow-hidden shadow-elevated relative group bg-card/40 backdrop-blur-3xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-[1.6] transition-transform duration-1000 text-primary"><Wallet size={160} /></div>
              <div className="relative z-10 text-center space-y-8">
                 <p className="text-[10px] font-black uppercase tracking-[0.6em] text-primary italic leading-none">Créditos de Saúde Recuperados</p>
                  <div className="text-7xl sm:text-9xl font-black tracking-tighter italic text-white drop-shadow-elevated leading-none">
                    <CountUp value={stats.moneySaved} prefix="R$" />
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
                    <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-full border border-border/40 backdrop-blur-md group-hover:border-rose-500/30 transition-colors">
                      <TrendingDown className="w-4 h-4 text-rose-500 animate-pulse" /> 
                      <span className="text-white">-{stats.avoidedCount} cigarros</span>
                    </div>
                    <div className="hidden sm:block w-2 h-2 rounded-full bg-primary/20" />
                    <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-full border border-border/40 backdrop-blur-md group-hover:border-primary/30 transition-colors">
                      <Clock className="w-4 h-4 text-primary animate-pulse" /> 
                      <span className="text-white">+{stats.hoursRecovered}h de vida</span>
                    </div>
                  </div>
              </div>
              
              {/* Internal nebula glow */}
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
           </AppleCard>
        </section>

        {/* GRAPHS BENTO */}
        <div className="grid md:grid-cols-3 gap-8">
           <AppleCard className="md:col-span-2 p-10 rounded-[40px] border-border/40 shadow-elevated flex flex-col bg-card/40 backdrop-blur-3xl group">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Projeção Monetária Estelar</h3>
                 <BarChart3 size={18} className="text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={stats.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          backdropFilter: 'blur(30px)', 
                          borderRadius: '24px', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          color: '#fff', 
                          fontWeight: '900', 
                          fontSize: '12px',
                          padding: '12px 20px',
                          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                        }}
                        itemStyle={{ color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                      />
                      <Area type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorVal)" />
                   </AreaChart>
                </ResponsiveContainer>
              </div>
           </AppleCard>
           
           <AppleCard className="p-10 rounded-[40px] bg-primary/10 border-primary/20 shadow-glow space-y-8 flex flex-col justify-center relative overflow-hidden group backdrop-blur-xl">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] group-hover:bg-primary/30 transition-colors" />
              <div className="w-16 h-16 rounded-[2rem] bg-primary/20 flex items-center justify-center shadow-glow border border-primary/30 group-hover:scale-110 transition-transform duration-500">
                <Sparkles size={32} className="text-primary" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tighter leading-tight text-white mb-4 italic">Liberdade Financeira.</h3>
                <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest italic leading-relaxed">
                  Em 1 ano, sua economia projetada é de <span className="text-primary font-black underline decoration-primary/30 underline-offset-4">R${Math.round((profile.cigarettes_per_day || 0) * (Number(profile.price_per_cigarette) || 0) * 365)}</span> extras.
                </p>
              </div>
              <button 
                onClick={() => navigate("/checkout")}
                className="w-full h-14 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white hover:scale-105 transition-all shadow-glow italic"
              >
                Simular Futuro
              </button>
           </AppleCard>
        </div>

        {/* TIMELINE */}
        <AppleCard className="rounded-[48px] p-10 sm:p-16 border-border/40 shadow-elevated overflow-hidden relative bg-card/40 backdrop-blur-3xl">
           <div className="absolute top-0 right-0 p-10 opacity-5 text-primary"><Monitor size={140} /></div>
           <div className="flex flex-col sm:flex-row items-center justify-between mb-20 relative z-10 gap-6 text-center sm:text-left">
              <h2 className="text-4xl font-black tracking-tighter text-white italic leading-none">Status Biológico</h2>
              <div className="flex items-center gap-4 bg-primary/10 px-6 py-3 rounded-full border border-primary/20 backdrop-blur-md">
                 <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-glow" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic leading-none">Neural Sync: Live Data</span>
              </div>
           </div>

           <div className="space-y-20 relative">
              <div className="absolute left-[31px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-primary/50 via-border/20 to-transparent rounded-full shadow-[0_0_15px_hsla(152,58%,48%,0.2)]" />
              {healthMilestones.map((m, i) => {
                const achieved = stats.totalSeconds / 60 >= m.minutes;
                const progress = Math.min(100, (stats.totalSeconds / 60 / m.minutes) * 100);

                return (
                  <motion.div
                    key={m.time}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className={cn("flex gap-10 items-start relative z-10 transition-all duration-700", !achieved && "opacity-30 grayscale blur-[1px]")}
                  >
                    <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-glow transition-all border duration-700", 
                      achieved ? "bg-white text-black border-white scale-110 rotate-3 shadow-[0_0_40px_rgba(255,255,255,0.3)]" : "bg-black/40 text-muted-foreground border-border/40"
                    )}>
                       {achieved ? <CheckCircle2 className="w-8 h-8 font-black" /> : <m.icon className="w-7 h-7" />}
                    </div>
                    <div className="flex-1 pt-3">
                       <div className="flex items-center gap-4 mb-4">
                          <span className={cn("text-[10px] font-black uppercase tracking-[0.4em] italic", achieved ? "text-primary" : "text-muted-foreground")}>{m.time}</span>
                          {achieved && <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-primary text-primary-foreground px-4 py-1.5 rounded-full italic shadow-glow">Vitoria Bio-Digital</span>}
                       </div>
                       <h4 className="text-2xl font-black tracking-tighter mb-4 text-white leading-tight italic group-hover:text-primary transition-colors">{m.benefit}</h4>
                       
                       {!achieved && progress > 2 && (
                         <div className="w-full h-3 bg-black/60 rounded-full mt-8 overflow-hidden border border-border/20 p-[2px] shadow-inner">
                            <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${progress}%` }}
                               viewport={{ once: true }}
                               transition={{ duration: 1.5, ease: "easeOut" }}
                               className="h-full bg-primary rounded-full shadow-glow"
                            />
                         </div>
                       )}
                    </div>
                  </motion.div>
                );
              })}
           </div>
        </AppleCard>

        {/* DISCLAIMER */}
        <AppleCard className="p-10 rounded-[40px] border-border/20 text-center bg-transparent backdrop-blur-sm group hover:border-primary/20 transition-all">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground leading-relaxed italic group-hover:text-white transition-colors duration-500">
             Protocolo de Monitoramento Elite 3.0 • Sincronizado com Redes Globais de Saúde 2026
           </p>
        </AppleCard>
      </div>
    </AppLayout>
  );
};

export default Progresso;
