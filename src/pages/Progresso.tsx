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
         <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
            <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Sincronizando Métricas Vitais...</p>
         </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl pb-32 pt-10 animate-fade-in space-y-12">
        <header className="text-center mb-16">
            <h1 className="text-6xl font-black tracking-tighter mb-4 text-white italic">Mission <span className="text-emerald-400 drop-shadow-glow">Metrics.</span></h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em] mt-2">Relatório de Desempenho Biológico • ID: {user?.id.slice(0, 8)}</p>
        </header>

        {/* FINANCIAL HERO */}
        <section className="relative">
           <AppleCard variant="glass-dark" className="p-10 sm:p-20 border-emerald-500/20 rounded-[48px] overflow-hidden shadow-2xl relative group">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-[1.6] transition-transform duration-1000"><Wallet size={160} /></div>
              <div className="relative z-10 text-center space-y-6">
                 <p className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-400 glow-sm">Créditos de Saúde Recuperados</p>
                  <div className="text-7xl sm:text-9xl font-black tracking-tighter italic text-white drop-shadow-2xl">
                    <CountUp value={stats.moneySaved} prefix="R$" />
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5"><TrendingDown className="w-4 h-4 text-rose-500" /> <span>-{stats.avoidedCount} cigarros</span></div>
                    <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5"><Clock className="w-4 h-4 text-emerald-400" /> <span>+{stats.hoursRecovered}h de vida</span></div>
                  </div>
              </div>
           </AppleCard>
        </section>

        {/* GRAPHS BENTO */}
        <div className="grid md:grid-cols-3 gap-8">
           <AppleCard variant="glass-dark" className="md:col-span-2 p-10 rounded-[40px] border-white/5 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Projeção Monetária Estelar</h3>
                 <BarChart3 size={18} className="text-emerald-500 opacity-40" />
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
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: '900', fontSize: '12px' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Area type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorVal)" />
                   </AreaChart>
                </ResponsiveContainer>
              </div>
           </AppleCard>
           
           <AppleCard variant="glass-dark" className="p-10 rounded-[40px] bg-emerald-500/10 border-emerald-500/20 shadow-2xl space-y-8 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-[80px] group-hover:bg-emerald-500/30 transition-colors" />
              <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/20 flex items-center justify-center shadow-2xl border border-emerald-500/30 group-hover:scale-110 transition-transform"><Sparkles size={32} className="text-emerald-400" /></div>
              <div>
                <h3 className="text-3xl font-black tracking-tighter leading-tight text-white mb-4 italic">Liberdade Financeira.</h3>
                <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-wider">Em 1 ano, sua economia projetada é de <span className="text-emerald-400">R${Math.round((profile.cigarettes_per_day || 0) * (Number(profile.price_per_cigarette) || 0) * 365)}</span> extras.</p>
              </div>
              <button 
                onClick={() => navigate("/checkout")}
                className="w-full h-14 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 hover:scale-105 transition-all shadow-2xl"
              >
                Simular Futuro
              </button>
           </AppleCard>
        </div>

        {/* TIMELINE */}
        <AppleCard variant="glass-dark" className="rounded-[48px] p-10 sm:p-16 border-white/5 shadow-2xl overflow-hidden relative">
           <div className="absolute top-0 right-0 p-10 opacity-5"><Monitor size={140} /></div>
           <div className="flex items-center justify-between mb-16 relative z-10">
              <h2 className="text-3xl font-black tracking-tighter text-white italic">Status Biológico</h2>
              <div className="flex items-center gap-3 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Neural Sync: Live</span>
              </div>
           </div>

           <div className="space-y-16 relative">
              <div className="absolute left-[25px] top-6 bottom-6 w-[2px] bg-white/5 rounded-full" />
              {healthMilestones.map((m, i) => {
                const achieved = stats.totalSeconds / 60 >= m.minutes;
                const progress = Math.min(100, (stats.totalSeconds / 60 / m.minutes) * 100);

                return (
                  <motion.div
                    key={m.time}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn("flex gap-10 items-start relative z-10 transition-all duration-700", !achieved && "opacity-20 grayscale brightness-50")}
                  >
                    <div className={cn("w-14 h-14 rounded-[1.2rem] flex items-center justify-center shrink-0 shadow-2xl transition-all border duration-500", 
                      achieved ? "bg-white text-black border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-white/5 text-gray-600 border-white/10"
                    )}>
                       {achieved ? <CheckCircle2 className="w-7 h-7" /> : <m.icon className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 pt-2">
                       <div className="flex items-center gap-4 mb-3">
                          <span className={cn("text-[10px] font-black uppercase tracking-[0.3em]", achieved ? "text-emerald-400" : "text-gray-600")}>{m.time}</span>
                          {achieved && <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-black px-3 py-1 rounded-sm italic">Vitória Bio</span>}
                       </div>
                       <h4 className="text-2xl font-black tracking-tight mb-4 text-white leading-tight">{m.benefit}</h4>
                       
                       {!achieved && progress > 5 && (
                         <div className="w-full h-2 bg-white/5 rounded-full mt-6 overflow-hidden border border-white/5 p-[1px]">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${progress}%` }}
                               className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_#10b981]"
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
        <AppleCard variant="glass-dark" className="p-10 rounded-[40px] border-white/5 text-center bg-transparent">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 leading-relaxed italic">
             Protocolo de Monitoramento Elite 2.0 • Sincronizado com Bases OMS 2026
           </p>
        </AppleCard>
      </div>
    </AppLayout>
  );
};

export default Progresso;
