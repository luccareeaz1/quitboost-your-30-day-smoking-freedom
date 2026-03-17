import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Activity, Wallet, Cigarette, 
  Target, Trophy, Flame,
  AlertTriangle, Sparkles, TrendingUp, Calendar
} from "lucide-react";
import { 
  CartesianGrid, 
  XAxis, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { AppleCard } from "@/components/ui/apple-card";
import { useAuth } from "@/hooks/useAuth";

const chartData = [
  { name: 'Seg', saude: 40, economia: 20 },
  { name: 'Ter', saude: 50, economia: 40 },
  { name: 'Qua', saude: 45, economia: 60 },
  { name: 'Qui', saude: 60, economy: 80 },
  { name: 'Sex', saude: 75, economy: 100 },
  { name: 'Sab', saude: 85, economy: 120 },
  { name: 'Dom', saude: 95, economy: 140 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, subscription, signOut } = useAuth();
  const [now, setNow] = useState(new Date());
  const [missionCompleted, setMissionCompleted] = useState(false);

  const profile = useMemo(() => {
    const stored = localStorage.getItem("quitboost_profile");
    return stored ? JSON.parse(stored) : null;
  }, []);

  useEffect(() => {
    if (!profile) {
      navigate("/onboarding");
      return;
    }
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [profile, navigate]);

  if (!profile) return null;

  const quitDate = new Date(profile.quitDate);
  const diffMs = now.getTime() - quitDate.getTime();
  const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(diffSeconds / (3600 * 24));
  const avoidedCount = Math.floor(days * profile.cigarrosPorDia);
  const moneySaved = avoidedCount * profile.custoPorCigarro;

  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto px-6 py-10 space-y-10">
        
        {subscription === 'free' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Você está no plano Gratuito</p>
                <p className="text-xs text-gray-500 font-medium">Libere o Coach Neural IA e relatórios avançados com o plano Elite.</p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="rounded-full bg-primary text-white font-bold px-8"
              onClick={() => navigate("/checkout")}
            >
              Fazer Upgrade
            </Button>
          </motion.div>
        )}

        {/* A) HEADER - HIGH IMPACT STATS */}
        <header className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="md:col-span-3 mb-4 flex justify-between items-end"
          >
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bom dia, <span className="text-primary italic">{user?.email?.split('@')[0] || "Vencedor"}</span>.</h1>
              <p className="text-gray-400 font-medium">Sua jornada pela liberdade continua.</p>
            </div>
            {user && (
              <button 
                onClick={signOut}
                className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors"
              >
                Sair da conta
              </button>
            )}
          </motion.div>

          {[
            { label: "Dias sem fumar", value: days, icon: Calendar, color: "text-primary", bg: "bg-green-50" },
            { label: "Economizados", value: `R$ ${moneySaved.toFixed(0)}`, icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Saúde Recuperada", value: "85%", icon: Activity, color: "text-orange-500", bg: "bg-orange-50" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 border border-transparent group-hover:border-current transition-all ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-4xl font-black tracking-tight ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* B) MISSÃO DO DIA */}
          <motion.div 
             initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
             className="lg:col-span-1"
          >
            <AppleCard className="p-8 h-full flex flex-col justify-between bg-primary text-white border-transparent overflow-hidden relative group">
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6 text-white/80 font-bold uppercase tracking-widest text-[10px]">
                  <Target size={14} /> Missão Prioritária
                </div>
                <h3 className="text-2xl font-black mb-4 leading-tight">Troque o café por um chá de hortelã hoje.</h3>
                <p className="text-white/70 text-sm font-medium leading-relaxed mb-8">
                  Estimulantes como o café podem despertar o gatilho neural do cigarro. Experimente algo refrescante.
                </p>
              </div>
              
              <Button 
                onClick={() => setMissionCompleted(true)}
                disabled={missionCompleted}
                className={`w-full h-14 rounded-full font-black uppercase tracking-widest transition-all ${
                  missionCompleted ? 'bg-white/20 text-white/50 cursor-not-allowed' : 'bg-white text-primary hover:scale-105 shadow-xl'
                }`}
              >
                {missionCompleted ? 'Missão Concluída' : 'Marcar como Concluída'}
              </Button>
            </AppleCard>
          </motion.div>

          {/* C) PROGRESSO - CHARTS */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <AppleCard className="p-8 h-full bg-white border-gray-100">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-xl font-bold tracking-tight mb-1">Tendência de Evolução</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Saúde vs Economia</p>
                </div>
                <TrendingUp size={20} className="text-primary" />
              </div>
              
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSaude" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 600}} 
                      dy={10}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
                      labelStyle={{ fontWeight: 800, color: '#111827' }}
                    />
                    <Area type="monotone" dataKey="saude" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorSaude)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </AppleCard>
          </motion.div>
        </div>

        {/* EXTRA SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {/* IA COACH CARD */}
           <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 lg:col-span-2 pointer-events-auto"
           >
             <AppleCard className="p-8 bg-gray-50 border-gray-100 flex flex-col justify-between h-full group hover:bg-white hover:border-primary/20 transition-all cursor-pointer" onClick={() => navigate("/coach")}>
                <div>
                  <div className="flex items-center gap-2 mb-6 text-primary font-bold uppercase tracking-widest text-[10px]">
                    <Sparkles size={14} /> Suporte Instantâneo
                  </div>
                  <h4 className="text-2xl font-black mb-3">Coach Neural IA</h4>
                  <p className="text-gray-500 text-sm font-medium mb-6">"Você já evitou {avoidedCount} cigarros. Sua circulação está melhorando a cada minuto."</p>
                </div>
                <Button variant="outline" className="w-full h-12 rounded-full border-gray-200 group-hover:border-primary group-hover:text-primary transition-all">
                  Conversar agora
                </Button>
             </AppleCard>
           </motion.div>

           {/* COMMUNITY & ACHIEVEMENTS */}
           <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-1 lg:col-span-1"
           >
             <AppleCard className="p-8 bg-white border-gray-100 flex flex-col items-center text-center justify-center h-full hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/comunidade")}>
                <Flame size={32} className="text-orange-500 mb-4" />
                <h4 className="text-lg font-bold">Comunidade</h4>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">12 pessoas subiram de nível</p>
             </AppleCard>
           </motion.div>

           <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-1 lg:col-span-1"
           >
             <AppleCard className="p-8 bg-white border-gray-100 flex flex-col items-center text-center justify-center h-full hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/conquistas")}>
                <Trophy size={32} className="text-primary mb-4" />
                <h4 className="text-lg font-bold">Conquistas</h4>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{days}/30 dias concluídos</p>
             </AppleCard>
           </motion.div>
        </div>

      </div>
    </AppLayout>
  );
}
