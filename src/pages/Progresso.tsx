import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Heart, Wind, Activity, Target,
  Shield, CheckCircle2, Wallet,
  TrendingDown, Zap, Droplets, Clock, Loader2, Sparkles, Monitor,
  TrendingUp, ArrowUpRight, ArrowDownRight, Info, Ban
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

    const cigarettesPerDay = profile.cigarettes_per_day || 0;
    const pricePerCig = Number(profile.price_per_cigarette) || 1;
    const cigarettesPerPack = 20;
    const packPrice = pricePerCig * cigarettesPerPack;

    const quitStats = calculateQuitStats({
      quit_date: profile.quit_date || new Date().toISOString(),
      cigarettes_per_day: cigarettesPerDay,
      pack_price: packPrice,
      cigarettes_per_pack: cigarettesPerPack,
    }, now);

    const chartData = Array.from({ length: 14 }, (_, i) => ({
      day: i + 1,
      economy: Math.round(quitStats.moneySaved * ((i + 1) / 14)),
      health: Math.min(100, Math.round(calculateOverallHealth(quitStats.totalSeconds) * ((i + 1) / 14)))
    }));

    return { ...quitStats, chartData, packPrice, cigarettesPerPack };
  }, [profile, now]);

  if (loading || !profile || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">
          Sincronizando dados...
        </p>
      </div>
    );
  }

  const dailySaving = (stats.packPrice / stats.cigarettesPerPack) * (profile.cigarettes_per_day || 0);

  return (
    <div className="min-h-screen bg-white">
      <header className="px-6 py-8 md:px-10 md:py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Análise de Impacto</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Evolução da <span className="text-blue-600">Saúde e Economia</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm">Acompanhe detalhadamente o progresso real da sua nova vida.</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 md:p-8 border border-slate-200 bg-white rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Projeção de Economia</h2>
                <p className="text-xs text-slate-400 font-medium">Histórico e tendência de gastos evitados</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 self-start">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">+R$ {dailySaving.toFixed(2)} / dia</span>
              </div>
            </div>
          
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorEconomy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none' }}
                    itemStyle={{ fontWeight: '600', fontSize: '11px', color: '#1E293B' }}
                  />
                  <Area type="monotone" dataKey="economy" name="Economia" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEconomy)" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
               <MetricSmall label="Economia Total" value={`R$ ${Math.round(stats.moneySaved)}`} icon={Wallet} />
               <MetricSmall label="Projeção Anual" value={`R$ ${Math.round(stats.moneySaved * (365 / Math.max(1, stats.days)))}`} icon={Sparkles} />
               <MetricSmall label="Maços Evitados" value={Math.round(stats.avoidedCount / 20)} icon={Ban} />
               <MetricSmall label="Horas Ganhas" value={`${stats.hoursRecovered}h`} icon={Clock} />
            </div>
          </div>
        </Card>

          <div className="lg:col-span-4 space-y-6">
             <div className="p-8 border border-slate-200 bg-slate-900 text-white rounded-2xl relative overflow-hidden group h-full flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-4">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Score de Regeneração</span>
                </div>
                <div>
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/10 mb-6">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-4xl font-bold mb-2">{calculateOverallHealth(stats.totalSeconds)}%</h3>
                  <p className="text-white/60 text-xs font-medium leading-relaxed">
                    Sua imunidade está {calculateOverallHealth(stats.totalSeconds) > 50 ? 'excelente' : 'em recuperação'}. Milhares de toxinas removidas.
                  </p>
                </div>
                <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 text-xs font-bold uppercase tracking-widest">
                  Relatório Detalhado
                </Button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 p-6 border border-slate-200 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <Droplets className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 tracking-tight">Próximo Marco</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Meta: 30 dias</span>
                  <span className="text-lg font-bold text-slate-900">{Math.round(Math.min(100, (stats.days / 30) * 100))}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (stats.days / 30) * 100)}%` }} className="h-full bg-blue-600 rounded-full" />
                </div>
                <p className="text-[11px] text-slate-500 font-medium pt-2">
                  {stats.days < 30 ? `Faltam ${30 - stats.days} dias para regeneração pulmonar nível 2.` : 'Marco de 30 dias alcançado!'}
                </p>
              </div>
          </div>

        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ComparisonCard 
          title="Consumo de Valor" 
          desc="Equivalência em poder de compra"
          items={[
            { label: "Novo Gadget/Eletrônico", icon: "📱", cost: 1200, current: stats.moneySaved },
            { label: "Jantar Premium", icon: "🍱", cost: 350, current: stats.moneySaved },
            { label: "Fim de Semana Fora", icon: "✈️", cost: 2000, current: stats.moneySaved }
          ]}
        />
        <Card className="p-6 border border-slate-200 bg-white rounded-2xl shadow-sm flex flex-col justify-between">
           <div>
             <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Info className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 tracking-tight">Dica do Coach</h4>
            </div>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed italic">
              "A cada hora sem fumar, seu corpo inicia um processo de limpeza celular profunda. O que você sente como ansiedade é, na verdade, sua saúde voltando."
            </p>
           </div>
           <Button variant="ghost" className="w-full mt-6 rounded-lg h-10 font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-[10px] uppercase tracking-widest">
              Conversar com IA
           </Button>
        </Card>
        </div>
      </div>
    </div>
  );
}

function MetricSmall({ label, value, icon: Icon }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-blue-600" />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ComparisonCard({ title, desc, items }: any) {
  return (
    <div className="p-6 border border-slate-200 bg-white rounded-2xl shadow-sm">
      <h4 className="font-bold text-sm text-slate-900 tracking-tight mb-1">{title}</h4>
      <p className="text-[10px] text-slate-400 font-medium mb-6 uppercase tracking-wider">{desc}</p>
      <div className="space-y-5">
        {items.map((item: any, i: number) => {
          const progress = Math.min(100, (item.current / item.cost) * 100);
          return (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold text-slate-600">
                <span className="flex items-center gap-2"><span>{item.icon}</span> {item.label}</span>
                <span className={cn(progress >= 100 ? "text-blue-600" : "text-slate-400")}>{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-1000", progress >= 100 ? "bg-blue-600" : "bg-slate-200")} style={{ width: `${progress}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
