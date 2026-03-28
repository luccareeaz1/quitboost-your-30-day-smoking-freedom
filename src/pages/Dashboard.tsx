import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity, Wallet, Cigarette, Target, Trophy, Flame,
  Sparkles, TrendingUp, Calendar, Heart, Wind, Timer,
  Zap, Users, Bot, ChevronRight, Shield, Clock,
  Droplets, Brain, Eye, LayoutDashboard, LogOut, CheckCircle2, Star
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
import SpaceBackground from "@/components/landing/SpaceBackground";

const HEALTH_MILESTONES = [
  { minutes: 20, label: "20 min", benefit: "Pressão normal", icon: Heart, color: "#10b981", progress: 0 },
  { minutes: 480, label: "8 h", benefit: "O₂ normalizado", icon: Wind, color: "#3b82f6", progress: 0 },
  { minutes: 1440, label: "24 h", benefit: "Menos risco infarto", icon: Activity, color: "#f59e0b", progress: 0 },
  { minutes: 10080, label: "1 sem", benefit: "Regeneração pulmonar", icon: Shield, color: "#06b6d4", progress: 0 },
];

const DAILY_TIPS = [
  { tip: "A hidratação acelera a eliminação de toxinas do tabaco (OMS). Beba água.", source: "NASA Command" },
  { tip: "3 minutos de fissura? Use a respiração 4-7-8 (CDC). Você é o piloto.", source: "Mission Protocol" },
  { tip: "O álcool é um gatilho crítico. Mantenha os sensores focados no objetivo.", source: "Control Center" },
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
  const [streakData, setStreakData] = useState<any>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    if (!profile && !user) return;
    if (user) {
      streakService.checkIn(user.id).then(() => {
        streakService.get(user.id).then(setStreakData);
      });
    }
    const interval = setInterval(() => setNow(new Date()), 1000);
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
      color: HEALTH_MILESTONES.find(hm => hm.label === m.label)?.color || "#10b981"
    }));

    const healthPercentage = Math.min(100, Math.round(
      milestonesWithProgress.filter((m) => m.achieved).length / milestonesWithProgress.length * 100
    ));

    return { ...quitStats, healthPercentage, milestonesWithProgress };
  }, [profile, now]);

  if (!profile || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <SpaceBackground />
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full" />
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
    };
  });

  const pieData = [
    { name: "Recuperado", value: stats.healthPercentage, color: "#10b981" },
    { name: "Progresso", value: 100 - stats.healthPercentage, color: "rgba(255,255,255,0.05)" },
  ];

  const todayTip = DAILY_TIPS[stats.days % DAILY_TIPS.length];
  const greeting = now.getHours() < 12 ? "Bom dia" : now.getHours() < 18 ? "Boa tarde" : "Boa noite";


  const handleManageSubscription = async () => {
    try {
      setLoadingPortal(true);
      const { data, error } = await (await import("@/integrations/supabase/client")).supabase.functions.invoke("create-portal-link");
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Portal error:", err);
      alert("Erro ao acessar o portal. Tente novamente mais tarde.");
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <SpaceBackground />
      
      <div className="container max-w-6xl mx-auto px-6 py-12 relative z-10 animate-in fade-in duration-1000">
        
        {/* UPGRADE NOTIFICATION */}
        {subscription === "free" && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-emerald-500/20 rounded-[2.5rem]"
          >
            <div className="bg-black/40 backdrop-blur-3xl rounded-[2.4rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/5">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Bot size={28} />
                </div>
                <div>
                  <h4 className="font-black text-lg tracking-tight">IA Coach Neural Ilimitada</h4>
                  <p className="text-gray-400 text-sm font-medium">Protocolos exclusivos, suporte 24/7 e análise biométrica.</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate("/checkout")}
                className="bg-emerald-500 text-black font-black uppercase tracking-widest px-10 h-14 rounded-[1.5rem] hover:bg-emerald-400 transition-all"
              >
                Ativar Elite
              </Button>
            </div>
          </motion.div>
        )}

        {/* TOP BAR */}
        <header className="flex justify-between items-center mb-14">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Status: Operacional</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic italic">
              {greeting}, <span className="text-emerald-400 drop-shadow-glow">{profile.display_name?.split(" ")[0] || "Comandante"}</span>.
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 italic shadow-text">Sua órbita de liberdade está estável.</p>
          </div>
          <div className="flex items-center gap-4">
            {subscription !== "free" && (
              <button 
                onClick={handleManageSubscription} 
                disabled={loadingPortal}
                className="px-6 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 hover:bg-emerald-500/20 transition-all font-black text-[10px] uppercase tracking-widest text-emerald-400 disabled:opacity-50"
              >
                <Shield size={16} />
                {loadingPortal ? "Carregando..." : "Assinatura"}
              </button>
            )}
            <button onClick={signOut} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-all group">
              <LogOut size={20} className="text-gray-500 group-hover:text-red-500" />
            </button>
          </div>
        </header>

        {/* MAIN STREAK - HERO */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mb-12">
          <AppleCard variant="glass-dark" className="p-12 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-gray-800" />
                <div className="flex items-center gap-2 text-emerald-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-xs font-black uppercase tracking-[0.4em]">Tempo de Voo Livre</span>
                  <Star size={16} fill="currentColor" />
                </div>
                <div className="h-[1px] w-12 bg-gray-800" />
              </div>

              <div className="text-8xl md:text-[11rem] font-black tracking-tighter leading-none italic mb-4 drop-shadow-2xl">
                {stats.days}
              </div>
              <p className="text-xl font-bold uppercase tracking-[0.3em] text-gray-500 mb-10">Dias de Autonomia</p>

              <div className="flex items-center justify-center gap-8 md:gap-14 font-mono text-gray-200">
                {[
                  { val: stats.hours, label: "HORAS" },
                  { val: stats.minutes, label: "MINUTOS" },
                  { val: stats.seconds, label: "SEGUNDOS" },
                ].map((t) => (
                  <div key={t.label} className="text-center group-hover:scale-110 transition-transform duration-500">
                    <div className="text-4xl md:text-5xl font-black tracking-tighter italic border-b-2 border-emerald-500/20 pb-2">
                       {String(t.val).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] font-black tracking-[0.3em] mt-3 text-gray-600">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AppleCard>
        </motion.div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Cigarros Vencidos", value: stats.avoidedCount, icon: Target, color: "text-emerald-400" },
            { label: "Capital Salvo", value: stats.moneySaved, icon: Wallet, color: "text-blue-400", prefix: "R$ " },
            { label: "Vida Expandida", value: stats.hoursRecovered, icon: Heart, color: "text-rose-400", suffix: "h" },
            { label: "Bio-Recuperação", value: stats.healthPercentage, icon: Zap, color: "text-amber-400", suffix: "%" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
              <AppleCard variant="glass-dark" className="p-8 hover:translate-y-[-5px] transition-all group">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 ${stat.color} group-hover:border-white/20 transition-all`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
                <p className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
              </AppleCard>
            </motion.div>
          ))}
        </div>

        {/* CENTER COLUMN: CHART + PIE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <AppleCard variant="glass-dark" className="lg:col-span-2 p-10">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-black tracking-tight italic">Biometria de Progresso</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-1">Sincronização Neural em Tempo Real</p>
              </div>
              <TrendingUp size={24} className="text-emerald-400 opacity-20" />
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 900 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", color: "#fff" }}
                    itemStyle={{ color: "#10b981", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="saude" stroke="#10b981" strokeWidth={5} fill="url(#chartGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </AppleCard>

          <AppleCard variant="glass-dark" className="p-10 flex flex-col items-center justify-center">
            <div className="w-full mb-8">
              <h3 className="text-lg font-black tracking-tight italic">Status Vital</h3>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Recuperação Sistêmica</p>
            </div>
            <div className="relative w-52 h-52">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} innerRadius={70} outerRadius={95} dataKey="value" startAngle={90} endAngle={-270} stroke="none">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-5xl font-black italic tracking-tighter text-emerald-400">{stats.healthPercentage}%</span>
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Integridade</span>
              </div>
            </div>
          </AppleCard>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AppleCard variant="glass-dark" onClick={() => navigate("/coach")} className="md:col-span-2 lg:col-span-2 p-10 cursor-pointer group hover:border-emerald-500/30 transition-all overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 text-emerald-400 font-extrabold tracking-widest text-[10px] uppercase mb-6">
                <Bot size={18} /> Protocolo de Apoio Ativo
              </div>
              <h4 className="text-3xl font-black mb-4 italic tracking-tight italic">Especialista Neural IA</h4>
              <p className="text-gray-400 text-sm font-medium mb-10 leading-relaxed max-w-sm">
                Sua IA está online e pronta para conter qualquer pico de ansiedade ou desejo. Ative o protocolo de defesa agora.
              </p>
              <div className="mt-auto">
                <Button className="w-full h-16 rounded-[1.5rem] bg-emerald-500 text-black font-black uppercase tracking-widest group-hover:bg-emerald-400 transition-all">
                  Iniciar Protocolo <ChevronRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          </AppleCard>

          <AppleCard variant="glass-dark" onClick={() => navigate("/comunidade")} className="p-10 cursor-pointer group hover:border-white/20 transition-all flex flex-col items-center justify-center gap-4">
             <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-emerald-500/10 transition-all border border-white/5">
                <Users size={32} />
             </div>
             <h4 className="font-black italic text-lg tracking-tight">Comunidade</h4>
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-4 py-1.5 rounded-full">Rede de Apoio</p>
          </AppleCard>

          <AppleCard variant="glass-dark" onClick={() => navigate("/conquistas")} className="p-10 cursor-pointer group hover:border-white/20 transition-all flex flex-col items-center justify-center gap-4">
             <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-amber-500 group-hover:bg-amber-500/10 transition-all border border-white/5">
                <Trophy size={32} />
             </div>
             <h4 className="font-black italic text-lg tracking-tight">Arsenal</h4>
             <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-4 py-1.5 rounded-full">{stats.milestonesWithProgress.filter(m => m.achieved).length} Recompensas</p>
          </AppleCard>
        </div>

        <footer className="mt-16 text-center border-t border-white/5 pt-10">
           <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
             © 2026 QUITBOOST • SISTEMA DE CONTROLE DE VITALIDADE • PROTOCOLO CRIPTOGRÁFICO DE ALTA SEGURANÇA • INTEGRALIDADE DE DADOS VIA SUPABASE • EM CASO DE CRISE: LIGUE 188.
           </p>
        </footer>

      </div>
    </div>
  );
}
