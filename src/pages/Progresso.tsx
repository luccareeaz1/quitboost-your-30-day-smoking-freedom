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

function MetricSmall({ label, value, icon: Icon }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-blue-600" />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</span>
      </div>
      <p className="text-lg font-bold text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}

function ComparisonCard({ title, desc, items }: any) {
  return (
    <div className="p-6 border border-slate-200 bg-white rounded-2xl shadow-sm flex flex-col justify-between">
      <div>
        <h4 className="font-bold text-sm text-slate-900 tracking-tight mb-1">{title}</h4>
        <p className="text-[10px] text-slate-400 font-medium mb-6 uppercase tracking-wider">{desc}</p>
        <div className="space-y-5">
          {items.map((item: any, i: number) => {
            const progress = Math.min(100, (item.current / item.cost) * 100);
            return (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span className="flex items-center gap-2"><span>{item.icon}</span> {item.label}</span>
                  <span className={cn(progress >= 100 ? "text-blue-600" : "text-slate-400")}>{Math.round(progress)}{"%"}</span>
                </div>
                <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-1000", progress >= 100 ? "bg-blue-600" : "bg-slate-200")} style={{ width: `${progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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

      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 p-8 border border-slate-200 bg-white rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Projeção de Economia</h2>
                <p className="text-xs text-slate-400 font-medium tracking-tight">Histórico e tendência de gastos evitados</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 self-start">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">+R$ {dailySaving.toFixed(2)} / dia</span>
              </div>
            </div>
          
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorEconomy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: '700', fontSize: '12px', color: '#1E293B' }}
                  />
                  <Area type="monotone" dataKey="economy" name="Economia" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorEconomy)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-slate-100">
               <MetricSmall label="Economia Total" value={`R$ ${Math.round(stats.moneySaved)}`} icon={Wallet} />
               <MetricSmall label="Projeção Anual" value={`R$ ${Math.round(stats.moneySaved * (365 / Math.max(1, stats.days)))}`} icon={Sparkles} />
               <MetricSmall label="Maços Evitados" value={Math.round(stats.avoidedCount / 20)} icon={Ban} />
               <MetricSmall label="Horas Ganhas" value={`${stats.hoursRecovered}h`} icon={Clock} />
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="p-8 border border-slate-200 bg-slate-900 text-white rounded-3xl relative overflow-hidden group flex-1">
                <div className="absolute top-0 right-0 p-6">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Score Regenerativo</span>
                </div>
                <div className="h-full flex flex-col justify-between">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10 mb-8">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-5xl font-black mb-3 tracking-tighter">{calculateOverallHealth(stats.totalSeconds)}{"%"}</h3>
                    <p className="text-white/50 text-[13px] font-medium leading-relaxed max-w-[200px]">
                      Imunidade {calculateOverallHealth(stats.totalSeconds) > 50 ? 'em alta' : 'em reconstrução'}. Metabolismo acelerado.
                    </p>
                  </div>
                  <Button className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 text-xs font-bold uppercase tracking-widest shadow-xl shadow-blue-900/40">
                    Ver Bio-Report
                  </Button>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 p-8 border border-slate-200 bg-white rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Droplets className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Milestone Provent</h4>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fase: 30 dias</span>
                  <span className="text-2xl font-black text-slate-900">{Math.round(Math.min(100, (stats.days / 30) * 100))}{"%"}</span>
                </div>
                <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (stats.days / 30) * 100)}%` }} className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
                </div>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {stats.days < 30 ? `Você está a ${30 - stats.days} dias de regenerar completamente o tecido pulmonar.` : 'Nível 1 de regeneração pulmonar completo!'}
                </p>
              </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <ComparisonCard 
              title="Poder de Compra" 
              desc="Transformação de gastos em ativos"
              items={[
                { label: "Novo Gadget", icon: "📱", cost: 1200, current: stats.moneySaved },
                { label: "Experiência Gastrô", icon: "🍱", cost: 350, current: stats.moneySaved },
                { label: "Travel Fund", icon: "✈️", cost: 2000, current: stats.moneySaved }
              ]}
            />
            <div className="p-8 border border-slate-200 bg-white rounded-3xl shadow-sm flex flex-col justify-between">
               <div>
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                     <Sparkles className="w-5 h-5" />
                   </div>
                   <h4 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Coach Insight</h4>
                 </div>
                 <p className="text-[13px] font-semibold text-slate-600 leading-relaxed italic bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                   "A cada hora de resiliência, seu cérebro reconecta circuitos de prazer genuíno. A ansiedade é apenas a descompressão do seu potencial."
                 </p>
               </div>
               <Button variant="ghost" className="w-full mt-10 rounded-2xl h-12 font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-[11px] uppercase tracking-widest border border-blue-100">
                  Consultar Mentor IA
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
