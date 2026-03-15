import { useState, useEffect } from "react";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { AppleCard } from "@/components/ui/apple-card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { 
  Heart, Wind, Activity, Flame, Target, 
  Timer, Shield, CheckCircle2, Wallet, Cigarette 
} from "lucide-react";

const weeklyData = [
  { day: 'Mon', count: 15 },
  { day: 'Tue', count: 12 },
  { day: 'Wed', count: 10 },
  { day: 'Thu', count: 8 },
  { day: 'Fri', count: 5 },
  { day: 'Sat', count: 3 },
  { day: 'Sun', count: 0 },
];

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

export default function Progress() {
  // Mock calculations
  const totalSaved = 327.50;
  const avoidedCount = 655;

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

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 max-w-4xl mx-auto space-y-12 animate-fade-in">
      <header className="mb-4 text-center">
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tighter">Progresso</h1>
        <p className="text-muted-foreground mt-4 text-lg">Acompanhe sua evolução e vitórias reais.</p>
      </header>

      {/* SEÇÃO 1 – VALOR TOTAL ECONOMIZADO (Priority 1) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AppleCard className="p-10 sm:p-14 text-center bg-foreground text-background">
          <p className="text-xl sm:text-2xl opacity-70 mb-6 font-medium">Você já economizou</p>
          <div className="text-6xl sm:text-8xl font-bold tracking-tighter mb-4">
            <CountUp value={totalSaved} prefix="R$ " />
          </div>
          <p className="text-lg opacity-80 font-medium tracking-tight">desde que começou sua jornada.</p>
        </AppleCard>
      </motion.section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* SEÇÃO 2 – CIGARROS EVITADOS */}
        <AppleCard className="p-8 flex flex-col justify-between">
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

        {/* SEÇÃO 4 – GRÁFICO DE REDUÇÃO (Simplified) */}
        <AppleCard className="p-8">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Redução Diária</h2>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <Bar dataKey="count" fill="hsl(var(--foreground))" radius={[4, 4, 4, 4]} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{display: 'none'}} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Sua média de consumo caiu 85% esta semana.</p>
        </AppleCard>
      </div>

      {/* SEÇÃO 3 – LINHA DO TEMPO DE SAÚDE */}
      <AppleCard className="p-8 sm:p-12">
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
  );
}
