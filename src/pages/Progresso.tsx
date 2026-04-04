import { useState, useEffect, useMemo } from "react";
import { motion, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart, Wind, Activity, Target,
  Shield, CheckCircle2, Wallet,
  TrendingDown, Zap, Droplets, Clock, Loader2, Sparkles, Monitor
} from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
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
  { time: "20 min", minutes: 20, benefit: "Pressão arterial normaliza.", icon: Heart, source: "OMS" },
  { time: "8h", minutes: 480, benefit: "Monóxido de carbono cai pela metade.", icon: Wind, source: "CDC" },
  { time: "24h", minutes: 1440, benefit: "Risco cardíaco imediato reduz.", icon: Activity, source: "OMS" },
  { time: "48h", minutes: 2880, benefit: "Paladar e olfato começam a melhorar.", icon: Droplets, source: "INCA" },
  { time: "72h", minutes: 4320, benefit: "Brônquios relaxam e energia sobe.", icon: Zap, source: "INCA" },
  { time: "1 semana", minutes: 10080, benefit: "Cílios pulmonares em recuperação.", icon: Shield, source: "OMS" },
  { time: "1 mês", minutes: 43200, benefit: "Função pulmonar aumenta em até 30%.", icon: CheckCircle2, source: "OMS" },
  { time: "1 ano", minutes: 525600, benefit: "Risco coronariano cai pela metade.", icon: Target, source: "CDC" },
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
            <Loader2 className="w-8 h-8 text-[#528114] animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm animate-pulse">
              Calculando progresso...
            </p>
         </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-white min-h-screen pb-32">
        <div className="bg-[#528114] text-white pt-10 pb-12 px-4 flex flex-col items-center rounded-b-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Meu Progresso
            </h1>
            <p className="text-white/80 font-medium text-sm">
              Visão detalhada sobre finanças e saúde.
            </p>
        </div>

        <div className="px-4 py-8 max-w-4xl mx-auto space-y-8 -mt-8 relative z-10">
          
          {/* FINANCIAL HERO */}
          <section className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 sm:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-[#528114] pointer-events-none"><Wallet size={120} /></div>
            
            <div className="relative z-10 text-center space-y-6">
               <p className="text-sm font-bold uppercase tracking-widest text-[#528114]">Economia Total</p>
                <div className="text-6xl sm:text-8xl font-black tracking-tighter text-black">
                  <CountUp value={stats.moneySaved} prefix="R$ " />
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-500">
                  <div className="flex items-center gap-2 bg-[#F2F2F7] px-5 py-2.5 rounded-full border border-gray-200">
                    <TrendingDown className="w-4 h-4 text-gray-500" /> 
                    <span>-{stats.avoidedCount} cigarros não fumados</span>
                  </div>
                  <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <div className="flex items-center gap-2 bg-[#F2F2F7] px-5 py-2.5 rounded-full border border-gray-200">
                    <Clock className="w-4 h-4 text-[#528114]" /> 
                    <span>+{stats.hoursRecovered}h de vida recuperadas</span>
                  </div>
                </div>
            </div>
          </section>

          {/* GRAPHS BENTO */}
          <div className="grid md:grid-cols-3 gap-6">
             {/* Chart */}
             <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Projeção Monetária em 7 Dias</h3>
                </div>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={stats.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#528114" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#528114" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff',
                            borderRadius: '16px', 
                            border: '1px solid #f3f4f6', 
                            color: '#111827', 
                            fontWeight: 'bold', 
                            fontSize: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }}
                          itemStyle={{ color: '#528114', fontSize: '14px' }}
                          labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                        />
                        <Area type="monotone" dataKey="valor" stroke="#528114" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                     </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
             
             {/* Highlight Card */}
             <div className="p-6 sm:p-8 rounded-[24px] bg-[#528114] text-white flex flex-col justify-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/20">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-3">Perspectiva Anual</h3>
                  <p className="text-sm font-medium text-white/80 leading-relaxed mb-6">
                    Em um ano, você terá economizado um valor estimado de <span className="font-bold underline underline-offset-4 decoration-white/50 text-white">R${Math.round((profile.cigarettes_per_day || 0) * (Number(profile.price_per_cigarette) || 0) * 365)}</span>.
                  </p>
                </div>
                <button 
                  onClick={() => navigate("/checkout")}
                  className="mt-auto w-full h-12 rounded-xl bg-white text-[#528114] font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Ouvir Mentor
                </button>
             </div>
          </div>

          {/* TIMELINE */}
          <div className="bg-white rounded-[24px] p-8 sm:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-black pointer-events-none"><Monitor size={140} /></div>
             
             <div className="flex flex-col sm:flex-row items-center justify-between mb-16 relative z-10 gap-4 text-center sm:text-left">
                <h2 className="text-2xl font-bold tracking-tight text-black">Marcos de Saúde</h2>
                <div className="flex items-center gap-2 bg-[#F2F2F7] px-4 py-2 rounded-full border border-gray-200">
                   <div className="w-2 h-2 rounded-full bg-[#528114] animate-pulse" />
                   <span className="text-xs font-bold uppercase tracking-widest text-[#528114]">Acompanhamento ao Vivo</span>
                </div>
             </div>

             <div className="space-y-12 relative max-w-2xl mx-auto sm:mx-0">
                <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-[#F2F2F7] rounded-full" />
                {healthMilestones.map((m, i) => {
                  const achieved = stats.totalSeconds / 60 >= m.minutes;
                  const progress = Math.min(100, (stats.totalSeconds / 60 / m.minutes) * 100);

                  return (
                    <motion.div
                      key={m.time}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className={cn("flex gap-6 sm:gap-8 items-start relative z-10 transition-all", !achieved && "opacity-60")}
                    >
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all", 
                        achieved ? "bg-[#528114] text-white border-[#528114] shadow-md -translate-y-1" : "bg-white text-gray-400 border-gray-200"
                      )}>
                         {achieved ? <CheckCircle2 className="w-6 h-6 stroke-[2.5px]" /> : <m.icon className="w-6 h-6 stroke-[2px]" />}
                      </div>
                      <div className="flex-1 pt-2">
                         <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={cn("text-xs font-bold uppercase tracking-widest", achieved ? "text-[#528114]" : "text-gray-400")}>{m.time}</span>
                            {achieved && <span className="text-[10px] font-bold uppercase tracking-wide bg-[#F2F2F7] text-gray-500 px-2 py-0.5 rounded-md border border-gray-200">Alcançado</span>}
                         </div>
                         <h4 className="text-lg font-bold text-black mb-1">{m.benefit}</h4>
                         <p className="text-xs text-gray-500 font-medium tracking-wide">Fonte: {m.source}</p>
                         
                         {!achieved && progress > 2 && (
                           <div className="w-full h-2 bg-[#F2F2F7] rounded-full mt-4 overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 whileInView={{ width: `${progress}%` }}
                                 viewport={{ once: true }}
                                 transition={{ duration: 1, ease: "easeOut" }}
                                 className="h-full bg-[#528114] rounded-full"
                              />
                           </div>
                         )}
                      </div>
                    </motion.div>
                  );
                })}
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Progresso;
