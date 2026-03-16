import { useState, useEffect, useMemo } from "react";
import { motion, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppleCard } from "@/components/ui/apple-card";
import { 
  Heart, Wind, Activity, Flame, Target, 
  Timer, Shield, CheckCircle2, Wallet, Cigarette 
} from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import { 
  BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis 
} from 'recharts';

function CountUp({ value, prefix = "" }: { value: number, prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{prefix}{displayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
}

const Progresso = () => {
  const navigate = useNavigate();

  const profile = useMemo(() => {
    const stored = localStorage.getItem("quitboost_profile");
    if (!stored) return null;
    return JSON.parse(stored);
  }, []);

  useEffect(() => {
    if (!profile) {
      navigate("/onboarding");
    }
  }, [profile, navigate]);

  if (!profile) return null;

  const quitDate = new Date(profile.quitDate);
  const now = new Date();
  const diffMs = now.getTime() - quitDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  const avoidedCount = diffDays * profile.cigarrosPorDia;
  const totalSaved = avoidedCount * profile.custoPorCigarro;

  const healthMilestones = [
    { time: "20 minutos", benefit: "Pressão arterial e pulso voltam ao normal.", icon: Heart },
    { time: "8 horas", benefit: "Nível de oxigênio no sangue normaliza.", icon: Wind },
    { time: "24 horas", benefit: "Risco de ataque cardíaco diminui.", icon: Activity },
    { time: "48 horas", benefit: "Sentidos de paladar e olfato melhoram.", icon: Flame },
    { time: "1 semana", benefit: "Pulmões começam a se limpar.", icon: Shield },
    { time: "1 mês", benefit: "Circulação e função pulmonar melhoram.", icon: CheckCircle2 },
    { time: "3 meses", benefit: "Tosse e falta de ar diminuem drasticamente.", icon: Timer },
    { time: "1 ano", benefit: "Risco de doença cardíaca cai pela metade.", icon: Target },
  ];

  const weeklyData = Array.from({ length: 7 }, (_, i) => ({
    day: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][i],
    count: Math.max(0, profile.cigarrosPorDia - (diffDays * 2) - i), // Mock decrement
  }));

  return (
    <AppLayout>
      <div className="container mx-auto px-6 space-y-12 animate-fade-in pb-20 pt-10">
        <header className="mb-4 text-center">
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tighter">Progresso</h1>
          <p className="text-muted-foreground mt-4 text-lg">Acompanhe sua evolução e vitórias reais.</p>
        </header>

        {/* SEÇÃO 1 – VALOR TOTAL ECONOMIZADO */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AppleCard className="p-10 sm:p-14 text-center bg-foreground text-background shadow-elevated">
            <p className="text-xl sm:text-2xl opacity-70 mb-6 font-medium">Você já economizou</p>
            <div className="text-6xl sm:text-8xl font-bold tracking-tighter mb-4">
              <CountUp value={totalSaved} prefix="R$ " />
            </div>
            <p className="text-lg opacity-80 font-medium tracking-tight">desde que começou sua jornada.</p>
          </AppleCard>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* SEÇÃO 2 – CIGARROS EVITADOS */}
          <AppleCard className="p-8 flex flex-col justify-between shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-secondary">
                <Cigarette className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">Cigarros Evitados</h2>
            </div>
            <div>
              <span className="text-7xl font-bold tracking-tighter">{avoidedCount}</span>
              <p className="text-muted-foreground mt-2 font-medium">Unidades que você deixou de fumar.</p>
            </div>
          </AppleCard>

          {/* SEÇÃO 4 – GRÁFICO DE REDUÇÃO (Claro e detalhado) */}
          <AppleCard className="p-8 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">Redução Diária</h2>
              <span className="text-xs font-bold text-apple-green bg-apple-green/10 px-2 py-1 rounded-full uppercase">Melhoria de 12%</span>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.03)' }} 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: 'var(--shadow-md)',
                      fontSize: '12px'
                    }} 
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))" 
                    radius={[6, 6, 6, 6]} 
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-muted-foreground font-medium">Sua evolução semanal.</p>
              <p className="text-xs font-bold text-primary">Cigarros/dia</p>
            </div>
          </AppleCard>
        </div>

        {/* SEÇÃO 3 – LINHA DO TEMPO DE SAÚDE */}
        <AppleCard className="p-8 sm:p-12 shadow-soft">
          <h2 className="text-3xl font-semibold tracking-tight mb-12">Evolução da Saúde</h2>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
            {healthMilestones.map((ms, idx) => (
              <div key={idx} className="flex gap-5">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <ms.icon className="h-6 w-6 text-foreground" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{ms.time}</p>
                  <p className="text-lg font-medium leading-snug tracking-tight">{ms.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </AppleCard>
      </div>
    </AppLayout>
  );
};

export default Progresso;
