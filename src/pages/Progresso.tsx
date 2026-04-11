import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Heart, Wind, Activity, Target,
  Shield, CheckCircle2, Wallet,
  TrendingDown, Zap, Droplets, Clock, Loader2, Sparkles, Monitor,
  TrendingUp, ArrowUpRight, ArrowDownRight, Info
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { calculateQuitStats, calculateOverallHealth } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Progresso() {
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
      pack_price: profile.pack_price || profile.price_per_cigarette * (profile.cigarettes_per_pack || 20) || 20,
    }, now);

    const chartData = Array.from({ length: 14 }, (_, i) => ({
      day: i + 1,
      economy: Math.round(quitStats.moneySaved * ((i + 1) / 14)),
      health: Math.min(100, Math.round(calculateOverallHealth(quitStats.totalSeconds) * ((i + 1) / 14)))
    }));

    return { ...quitStats, chartData };
  }, [profile, now]);

  if (loading || !profile || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">
          Sincronizando dados...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:p-12 p-6">
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Relatório Detalhado</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Evolução do <span className="text-primary italic">Corpo e Bolso</span></h1>
        <p className="text-slate-500 mt-2 font-medium">Veja o impacto real da sua decisão a cada minuto.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Main Stats Bento */}
        <Card className="lg:col-span-8 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10 overflow-hidden relative">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-900">Projeção Monetária</h2>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">+R$ {((profile.pack_price || 20) / (profile.cigarettes_per_pack || 20) * profile.cigarettes_per_day).toFixed(2)} / dia</span>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorEconomy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ fontWeight: '900', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="economy" 
                  stroke="#22C55E" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorEconomy)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
             <MetricSmall label="Este Mês" value={`R$ ${Math.round(stats.moneySaved)}`} icon={Wallet} color="text-primary" />
             <MetricSmall label="Projeção Ano" value={`R$ ${Math.round(stats.moneySaved * (365 / Math.max(1, stats.days)))}`} icon={Sparkles} color="text-amber-500" />
             <MetricSmall label="Evitados" value={stats.avoidedCount} icon={Ban} color="text-sky-500" />
             <MetricSmall label="Tempo Ganho" value={`${stats.hoursRecovered}h`} icon={Clock} color="text-rose-500" />
          </div>
        </Card>

        {/* Sidebar Mini-Cards */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="border-none shadow-xl shadow-slate-200/50 bg-slate-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
              <div className="flex justify-between items-start mb-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Saúde Geral</span>
              </div>
              <h3 className="text-5xl font-black mb-4">{calculateOverallHealth(stats.totalSeconds)}%</h3>
              <p className="text-white/60 text-sm font-medium leading-relaxed">
                Sua regeneração celular está acelerada. Você removeu mais de 4,000 substâncias tóxicas do seu organismo.
              </p>
              <Button className="w-full mt-10 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-14 font-black uppercase tracking-widest text-xs">
                Ver Exames IA
              </Button>
           </Card>

           <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
                  <Droplets className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 tracking-tight">Próximo Marco</h4>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alcançar 1 Mês</span>
                  <span className="text-xl font-black text-slate-900">{Math.round((stats.days / 30) * 100)}%</span>
                </div>
                <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.days / 30) * 100}%` }}
                    className="h-full bg-sky-400 rounded-full"
                  />
                </div>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  Faltam apenas {30 - stats.days} dias para uma melhora de 30% na sua capacidade respiratória.
                </p>
              </div>
           </Card>
        </div>
      </div>

      {/* Comparisons Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ComparisonCard 
          title="Equivalência em Compras" 
          desc="O que você poderia comprar com o que economizou:"
          items={[
            { label: "10 Livros novos", icon: "📚", cost: 500, current: stats.moneySaved },
            { label: "Jantar Especial", icon: "🍱", cost: 200, current: stats.moneySaved },
            { label: "Viagem Curta", icon: "✈️", cost: 1500, current: stats.moneySaved }
          ]}
        />
        <ComparisonCard 
          title="Impacto Físico" 
          desc="Benefícios invisíveis que já ocorreram:"
          items={[
            { label: "Oxigenação cerebral normal", icon: "🧠", cost: 1, current: 1 },
            { label: "Paladar 100% restaurado", icon: "👅", cost: 1, current: stats.days >= 2 ? 1 : 0 },
            { label: "Coração batendo calmo", icon: "💖", cost: 1, current: 1 }
          ]}
        />
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10 flex flex-col justify-between">
           <div>
             <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                <Info className="w-5 h-5" />
              </div>
              <h4 className="font-black text-slate-900 tracking-tight">Dica de Especialista</h4>
            </div>
            <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
              "A economia financeira é satisfatória, mas a liberdade mental de não ser escravo de uma substância é o maior lucro que você terá hoje."
            </p>
           </div>
           <Button variant="ghost" className="w-full mt-10 rounded-2xl h-12 font-black text-primary uppercase tracking-widest text-[10px]">
              Falar com Consultor
           </Button>
        </Card>
      </div>
    </div>
  );
}

function MetricSmall({ label, value, icon: Icon, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={cn("w-3 h-3", color)} />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function ComparisonCard({ title, desc, items }: any) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
      <h4 className="font-black text-slate-900 tracking-tight mb-2">{title}</h4>
      <p className="text-xs text-slate-400 font-medium mb-8">{desc}</p>
      <div className="space-y-6">
        {items.map((item: any, i: number) => {
          const progress = Math.min(100, (item.current / item.cost) * 100);
          return (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span className="flex items-center gap-2"><span>{item.icon}</span> {item.label}</span>
                <span className={cn(progress >= 100 ? "text-primary" : "text-slate-400")}>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-1000", progress >= 100 ? "bg-primary" : "bg-slate-200")} 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
