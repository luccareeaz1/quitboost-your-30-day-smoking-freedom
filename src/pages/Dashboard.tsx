import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity, Wallet, Cigarette, Target, Trophy, Flame,
  Sparkles, TrendingUp, Heart, Wind, Timer,
  Zap, Users, Bot, Shield, Clock,
  Droplets, Brain, ArrowRight
} from "lucide-react";
import {
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import { calculateQuitStats, calculateHealthProgress } from "@/lib/calculations";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { streakService, progressService, challengeService } from "@/lib/services";
import { toast } from "sonner";
import AppLayout from "@/components/app/AppLayout";

const HEALTH_MILESTONES = [
  { minutes: 20, label: "20 min", benefit: "Pressão arterial normaliza", icon: Heart, color: "#FFFFFF", progress: 0 },
  { minutes: 480, label: "8 horas", benefit: "O₂ no sangue normaliza", icon: Wind, color: "#FFFFFF", progress: 0 },
  { minutes: 1440, label: "24 horas", benefit: "Risco de infarto reduz", icon: Activity, color: "#FFFFFF", progress: 0 },
  { minutes: 2880, label: "48 horas", benefit: "Paladar e olfato melhoram", icon: Droplets, color: "#FFFFFF", progress: 0 },
  { minutes: 4320, label: "72 horas", benefit: "Nicotina eliminada", icon: Zap, color: "#FFFFFF", progress: 0 },
  { minutes: 10080, label: "1 semana", benefit: "Pulmões em regeneração", icon: Shield, color: "#FFFFFF", progress: 0 },
  { minutes: 20160, label: "2 semanas", benefit: "Circulação melhora 30%", icon: TrendingUp, color: "#FFFFFF", progress: 0 },
  { minutes: 43200, label: "1 mês", benefit: "Função pulmonar +30%", icon: Activity, color: "#FFFFFF", progress: 0 },
];

const DAILY_TIPS = [
  { tip: "Beba pelo menos 2 litros de água hoje. A hidratação acelera a desintoxicação.", source: "OMS" },
  { tip: "30 min de caminhada reduzem a vontade de fumar em até 60%.", source: "CDC" },
  { tip: "Evite gatilhos como café ou álcool nestas primeiras semanas.", source: "INCA" },
];

function StatCard({ label, value, icon: Icon, suffix = "", prefix = "" }: any) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.4)" }}>
        <Icon size={16} />
        <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.02em" }}>{label}</span>
      </div>
      <div style={{ fontSize: "32px", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.04em" }}>
        {prefix}{value}{suffix}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, subscription, signOut } = useAuth();
  const [now, setNow] = useState(new Date());
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [streakData, setStreakData] = useState<any>(null);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);

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
          setDailyChallenge(dailyOnes[seed % dailyOnes.length]);
          if (user) {
            const completed = await challengeService.getUserChallenges(user.id);
            if (completed.some(c => c.challenge_id === dailyOnes[seed % dailyOnes.length].id)) {
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
    const milestones = calculateHealthProgress(quitStats.totalSeconds);
    const healthPercentage = Math.min(100, Math.round(milestones.filter(m => m.achieved).length / HEALTH_MILESTONES.length * 100));
    return { ...quitStats, healthPercentage };
  }, [profile, now]);

  if (!profile || !stats) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return {
      name: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][d.getDay()],
      saude: Math.min(100, (i + 1) * 12),
      economia: Math.round((i + 1) * profile.cigarettes_per_day * Number(profile.price_per_cigarette))
    };
  });

  return (
    <AppLayout>
      <div className="container max-w-5xl mx-auto px-6 py-10 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-0.05em", color: "#FFFFFF" }}>
              Olá, {profile.display_name?.split(" ")[0] || "User"}.
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 500 }}>
              Você está no caminho certo. Continue firme.
            </p>
          </div>
          <button onClick={signOut} style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.3)", background: "none", border: "1px solid rgba(255,255,255,0.08)", padding: "8px 16px", borderRadius: "10px", cursor: "pointer" }}>
            Sair
          </button>
        </header>

        {/* Hero Stats */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "32px",
          padding: "60px 20px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ fontSize: "140px", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.08em", lineHeight: 0.8 }}>
            {stats.days}
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.2em", marginTop: "20px" }}>
            Dias sem fumar
          </div>
          
          <div className="flex justify-center gap-8 mt-12 pt-8 border-t border-white/5">
            <div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF" }}>{String(stats.hours).padStart(2, '0')}h</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>HORAS</div>
            </div>
            <div style={{ width: "1px", background: "rgba(255,255,255,0.05)" }} />
            <div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF" }}>{String(stats.minutes).padStart(2, '0')}m</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>MINUTOS</div>
            </div>
            <div style={{ width: "1px", background: "rgba(255,255,255,0.05)" }} />
            <div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF" }}>{String(stats.seconds).padStart(2, '0')}s</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>SEGUNDOS</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Cigarros evitados" value={stats.avoidedCount} icon={Cigarette} />
          <StatCard label="Economia" value={stats.moneySaved} icon={Wallet} prefix="R$" />
          <StatCard label="Tempo recuperado" value={stats.hoursRecovered} icon={Clock} suffix="h" />
          <StatCard label="Saúde" value={stats.healthPercentage} icon={Activity} suffix="%" />
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Chart */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "24px" }}>Sua Evolução</h3>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: "12px" }} />
                    <Area type="monotone" dataKey="saude" stroke="#FFFFFF" strokeWidth={2} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Challenge */}
            <div style={{ background: "#FFFFFF", color: "#050505", borderRadius: "24px", padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="space-y-2">
                <div style={{ fontSize: "12px", fontWeight: 700, opacity: 0.5, textTransform: "uppercase" }}>Desafio de hoje</div>
                <h4 style={{ fontSize: "22px", fontWeight: 800 }}>{dailyChallenge?.title || "Hidratação"}</h4>
                <p style={{ fontSize: "14px", fontWeight: 500, opacity: 0.7 }}>Beba 2L de água para desintoxicar.</p>
              </div>
              <button 
                disabled={missionCompleted}
                style={{
                  background: missionCompleted ? "rgba(0,0,0,0.1)" : "#050505",
                  color: "#FFFFFF",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "14px",
                  border: "none",
                  cursor: missionCompleted ? "default" : "pointer"
                }}
              >
                {missionCompleted ? "Concluído" : "Concluir"}
              </button>
            </div>
          </div>

          {/* Sidebar / Tips */}
          <div className="space-y-6">
             <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "24px", height: "100%" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "20px" }}>Dica Útil</h3>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                  {DAILY_TIPS[stats.days % DAILY_TIPS.length].tip}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "24px" }}>
                   <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Bot size={16} />
                   </div>
                   <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Dica da IA Coach</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
