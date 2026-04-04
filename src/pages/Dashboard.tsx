import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity, Wallet, Cigarette, Target, Trophy, Flame,
  Sparkles, TrendingUp, Heart, Wind, Timer,
  Zap, Users, Bot, Shield, Clock,
  Droplets, ArrowRight
} from "lucide-react";
import {
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import { calculateQuitStats, calculateHealthProgress } from "@/lib/calculations";

import { useAuth } from "@/hooks/useAuth";
import { streakService, challengeService } from "@/lib/services";
import { toast } from "sonner";
import AppLayout from "@/components/app/AppLayout";

function StatCard({ label, value, icon: Icon, suffix = "", prefix = "" }: any) {
  return (
    <div className="group relative overflow-hidden bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-8 transition-all hover:bg-white/[0.04]">
      <div className="absolute inset-0 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-3 text-white/30">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
             <Icon size={16} />
          </div>
          <span className="text-base font-medium font-bold tracking-widest uppercase">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-base font-medium font-bold text-white/40 mb-1">{prefix}</span>
          <span className="text-4xl font-extralight tracking-tight text-white mb-1">
            {value}
          </span>
          <span className="text-base font-medium font-bold text-white/40 mb-1">{suffix}</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [now, setNow] = useState(new Date());
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);

  useEffect(() => {
    if (!profile && !user) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    const loadDaily = async () => {
      try {
        const all = await challengeService.getAll();
        const dailyOnes = all.filter(c => !c.is_weekly);
        if (dailyOnes.length > 0) {
          const seed = parseInt(new Date().toISOString().split('T')[0].replace(/-/g, ''));
          setDailyChallenge(dailyOnes[seed % dailyOnes.length]);
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
    const milestones = calculateHealthProgress(quitStats.totalSeconds);
    const healthPercentage = Math.min(100, Math.round(milestones.filter(m => m.achieved).length / 8 * 100));
    return { ...quitStats, healthPercentage };
  }, [profile, now]);

  if (!profile || !stats) return <div className="min-h-screen bg-[#050a18] flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" /></div>;

  const chartData = Array.from({ length: 7 }, (_, i) => ({
    name: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][i],
    value: Math.min(100, (i + 1) * 12),
  }));

  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Minimal Hero Dashboard */}
        <section className="relative overflow-hidden bg-white/[0.02] border border-white/[0.05] rounded-[48px] py-20 px-8 text-center group">
          <div className="absolute inset-0 bg-indigo-500/[0.02] blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-[120px] md:text-[180px] font-extralight tracking-[-0.05em] text-white leading-none mb-6"
            >
              {stats.days}
            </motion.div>
            <div className="text-base font-medium font-bold tracking-widest text-white/20 uppercase mb-12">
              DIAS DE LIBERDADE
            </div>
            
            <div className="flex gap-12 font-bold tracking-widest text-base font-medium text-white/40">
               <div className="flex flex-col gap-1 items-center">
                 <span className="text-white text-base font-extralight tracking-normal">{String(stats.hours).padStart(2, '0')}</span>
                 <span className="text-sm font-medium">HORAS</span>
               </div>
               <div className="w-px h-8 bg-white/5" />
               <div className="flex flex-col gap-1 items-center">
                 <span className="text-white text-base font-extralight tracking-normal">{String(stats.minutes).padStart(2, '0')}</span>
                 <span className="text-sm font-medium">MINUTOS</span>
               </div>
               <div className="w-px h-8 bg-white/5" />
               <div className="flex flex-col gap-1 items-center">
                 <span className="text-white text-base font-extralight tracking-normal">{String(stats.seconds).padStart(2, '0')}</span>
                 <span className="text-sm font-medium">SEGUNDOS</span>
               </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Cigarros evitados" value={stats.avoidedCount} icon={Cigarette} />
          <StatCard label="Economia gerada" value={stats.moneySaved} icon={Wallet} prefix="R$" />
          <StatCard label="Vida recuperada" value={stats.hoursRecovered} icon={Clock} suffix="h" />
          <StatCard label="Nível de Saúde" value={stats.healthPercentage} icon={Activity} suffix="%" />
        </div>

        {/* Action Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-10 h-full">
                 <div className="flex items-center justify-between mb-12">
                    <h3 className="text-xl font-extralight tracking-[0.1em] text-white">EVOLUÇÃO DOS TECIDOS</h3>
                    <div className="text-sm font-medium font-bold text-white/20 tracking-widest">ÚLTIMOS 7 DIAS</div>
                 </div>
                 <div className="h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={chartData}>
                       <defs>
                         <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="rgb(99, 102, 241)" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="rgb(99, 102, 241)" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.1)', fontSize: 10}} dy={10} />
                       <Tooltip contentStyle={{background: '#050a18', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px'}} />
                       <Area type="monotone" dataKey="value" stroke="rgb(99, 102, 241)" strokeWidth={2} fill="url(#neonGradient)" />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-indigo-600 rounded-[32px] p-10 text-white relative overflow-hidden group">
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <h4 className="text-sm font-medium font-bold tracking-widest mb-4 opacity-70">DEEP MISSÃO</h4>
                 <p className="text-2xl font-light tracking-tight mb-8 leading-tight">
                   {dailyChallenge?.title || "Sessão Intensiva de Foco"}
                 </p>
                 <button className="flex items-center gap-3 text-sm font-bold tracking-tight">
                    ATUALIZAR STATUS <ArrowRight size={16} />
                 </button>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-10 flex flex-col justify-between">
                 <div>
                    <h4 className="text-sm font-medium font-bold tracking-widest mb-4 text-white/20">AI QUOTE</h4>
                    <p className="text-lg font-light italic text-white/60 leading-relaxed">
                      "A consistência supera a motivação em 99% das vezes."
                    </p>
                 </div>
                 <div className="mt-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                       <Bot size={14} className="text-indigo-400" />
                    </div>
                    <span className="text-base font-medium font-bold text-white/20 tracking-[0.1em]">ANALISTA IA</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </AppLayout>
  );
}
