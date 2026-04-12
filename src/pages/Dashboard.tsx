import { useState, useEffect } from "react";
import { 
  Zap,
  Wind, 
  Activity, 
  Brain, 
  ShieldCheck, 
  Droplets,
  Coins,
  ArrowUpRight,
  ChevronDown,
  Clock,
  AlertCircle,
  TrendingUp,
  Heart,
  Trophy
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SOSMode } from "@/components/dashboard/SOSMode";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { RecoveryTimeline } from "@/components/dashboard/RecoveryTimeline";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/common/SEO";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isRecoveryExpanded, setIsRecoveryExpanded] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (!profile) return;

    const calculateStats = () => {
      const quitDate = new Date(profile.quit_date || new Date());
      const now = new Date();
      const diff = now.getTime() - quitDate.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const cigarrosNaoFumados = days * (profile.cigarettes_per_day || 20);
      const dinheiroEconomizado = cigarrosNaoFumados * (Number(profile.price_per_cigarette) || 1.25);

      setStats({
        days,
        hours,
        minutes,
        seconds,
        totalSeconds: diff / 1000,
        cigarrosNaoFumados,
        moneySaved: dinheiroEconomizado
      });
    };

    calculateStats();
    const timer = setInterval(calculateStats, 1000);
    return () => clearInterval(timer);
  }, [profile]);

  const handleRegisterCrave = async () => {
    try {
      const { error } = await supabase
        .from('cravings')
        .insert([{ 
          user_id: user?.id, 
          trigger_type: 'manual',
          resisted: true,
          duration_minutes: 5,
          notes: 'Registrado pelo botão Venci Fissura'
        }]);

      if (error) throw error;
      toast({ title: "Fissura registrada!", description: "Mais um passo rumo à liberdade.", variant: "default" });
    } catch (err) {
      toast({ title: "Erro", description: "Não foi possível registrar.", variant: "destructive" });
    }
  };

  const HealthMetric = ({ label, value, icon: Icon, color, delay }: any) => (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4 group cursor-help"
    >
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-slate-50 transition-all group-hover:scale-110", color.replace('stroke-', 'text-'))}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-end mb-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
          <span className="text-sm font-black text-slate-800">{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: "easeOut", delay }}
            className={cn("h-full rounded-full bg-current", color.replace('stroke-', 'bg-'))}
          />
        </div>
      </div>
    </motion.div>
  );

  if (!profile) return <div className="p-20 text-center font-black animate-pulse">{t('common.loading')}</div>;

  return (
    <div className="min-h-screen bg-white pb-24">
      <SEO 
        title="Painel de Controle | QuitBoost" 
        description="Acompanhe sua jornada para parar de fumar em tempo real."
      />
      
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 mb-6 border border-blue-100 shadow-sm">
              <ShieldCheck className="w-3 h-3 fill-blue-600/10" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Seus dados estão protegidos</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[0.9] mb-4">
              OLÁ, <span className="text-blue-600 uppercase">{profile.display_name?.split(' ')[0] || "GUERREIRO"}!</span>
            </h1>
            <p className="text-slate-400 font-bold max-w-lg">{t('dashboard.motivation')}</p>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => setIsSOSOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 px-8 font-bold gap-3 shadow-lg shadow-blue-200 uppercase tracking-widest text-[11px] border-none"
            >
              <AlertCircle className="w-5 h-5" />
              {t('dashboard.sos')}
            </Button>
            <Button 
              onClick={handleRegisterCrave}
              variant="outline"
              className="bg-white border-slate-200 text-slate-900 rounded-2xl h-14 px-8 font-bold gap-3 shadow-sm uppercase tracking-widest text-[11px] hover:bg-slate-50"
            >
              <Heart className="w-5 h-5 text-blue-500" />
              Venci Fissura
            </Button>
          </div>
        </header>

        {/* Dynamic Counter Hero */}
        <div className="mb-12">
          <Card className="border border-blue-100 shadow-xl shadow-blue-50/50 bg-blue-50/30 rounded-[2.5rem] p-10 lg:p-16 relative overflow-hidden group">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {[
                { label: t('common.days'), value: stats?.days || 0 },
                { label: t('common.hours'), value: stats?.hours || 0 },
                { label: t('common.minutes'), value: stats?.minutes || 0 },
                { label: t('common.seconds'), value: stats?.seconds || 0 },
              ].map((item, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] mb-4">{item.label}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl lg:text-8xl font-black text-slate-800 tracking-tighter tabular-nums leading-none">
                      {String(item.value).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute bottom-6 left-10 flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest opacity-60">
               <ShieldCheck className="w-3 h-3" />
               Privacidade garantida • Conexão protegida
            </div>
          </Card>
        </div>

        {/* Major Bento Grid */}
        <div className="bento-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {/* Life Quality Timeline - Large Item */}
          <div 
            className="md:col-span-2 lg:col-span-4 bento-item bg-white p-10 flex flex-col justify-between group overflow-hidden relative min-h-[500px] rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-700">
              <Heart className="w-64 h-64 text-blue-600" />
            </div>
            
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-none mb-4 uppercase">Recuperação</h2>
                  <p className="text-slate-400 font-medium max-w-xs uppercase text-[10px] tracking-widest">Acompanhamento Biológico Seguro</p>
                </div>
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                  <Activity className="w-8 h-8" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <HealthMetric label="Oxigenação" value={100} icon={Wind} color="stroke-blue-500" delay={0.2} />
                <HealthMetric label="Circulação" value={Math.min(100, Math.round((stats?.totalSeconds / (3 * 7 * 24 * 3600)) * 100))} icon={Activity} color="stroke-sky-500" delay={0.3} />
                <HealthMetric label="Cérebro" value={Math.min(100, Math.round((stats?.totalSeconds / (5 * 365 * 24 * 3600)) * 100))} icon={Brain} color="stroke-amber-500" delay={0.4} />
                <HealthMetric label="Imunidade" value={Math.min(100, Math.round((stats?.totalSeconds / (30 * 24 * 3600)) * 100))} icon={ShieldCheck} color="stroke-indigo-500" delay={0.5} />
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-slate-50 flex flex-col gap-6 relative z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 leading-none mb-1 uppercase text-xs">Linha do Tempo</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Impacto Bio-Celular</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsRecoveryExpanded(!isRecoveryExpanded)}
                  className="rounded-full h-8 gap-2 text-slate-500 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest px-4 border border-slate-100 hover:bg-slate-50"
                >
                  {isRecoveryExpanded ? "Ocultar" : "Expandir"}
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isRecoveryExpanded && "rotate-180")} />
                </Button>
              </div>

              <AnimatePresence>
                {isRecoveryExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <RecoveryTimeline totalSeconds={stats?.totalSeconds || 0} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Money Saved - Small Item */}
          <div 
            className="bento-item bg-white p-8 flex flex-col justify-between group h-full rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:rotate-6 transition-transform shadow-sm border border-blue-100">
                <Coins className="w-7 h-7" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-blue-600 transition-colors" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ECONOMIA TOTAL</p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-black text-slate-400 uppercase tracking-tighter">R$</span>
                <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none tabular-nums">
                  {stats?.moneySaved.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0,00"}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold uppercase tracking-widest">+12% vs última semana</div>
              </div>
            </div>
          </div>

          {/* Cigarettes Avoided - Small Item */}
          <div 
            className="bento-item bg-white p-8 flex flex-col justify-between group h-full rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:-rotate-6 transition-transform shadow-sm border border-blue-100">
                <Zap className="w-7 h-7 fill-blue-600/10" />
              </div>
              <Activity className="w-5 h-5 text-slate-200" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CIGARROS EVITADOS</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none tabular-nums">
                  {stats?.cigarrosNaoFumados || 0}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">unid.</span>
              </div>
              <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-3/4 rounded-full" />
              </div>
            </div>
          </div>

          {/* Achievement Box - Medium Item */}
          <div 
            className="md:col-span-2 bento-item p-8 bg-blue-600 !text-white border-none group relative overflow-hidden h-full flex flex-col justify-between shadow-xl shadow-blue-200/50 rounded-[3rem]"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Trophy className="w-48 h-48" />
            </div>
            
            <div className="relative z-10 flex justify-between items-start mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">CONQUISTAS</h2>
              <Button variant="ghost" size="sm" className="h-8 text-[9px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/10 px-4 rounded-xl border border-white/20">Ver Perfil</Button>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-6">
              {[
                { name: "1 Hora", icon: Zap, color: "text-blue-500", bg: "bg-blue-50", unlocked: stats?.totalSeconds >= 3600 },
                { name: "24 h", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50", unlocked: stats?.totalSeconds >= 86400 },
                { name: "7 Dias", icon: Activity, color: "text-blue-400", bg: "bg-blue-50", unlocked: stats?.totalSeconds >= 86400 * 7 },
              ].map((badge, i) => (
                <div key={i} className={cn("flex flex-col items-center gap-3", !badge.unlocked && "opacity-20 grayscale")}>
                  <div className={cn("w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform", badge.bg)}>
                    <badge.icon className={cn("w-7 h-7", badge.color)} />
                  </div>
                  <span className="text-[9px] font-black text-white/60 uppercase tracking-tighter text-center">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SOSMode 
        isOpen={isSOSOpen} 
        onClose={(outcome) => {
          setIsSOSOpen(false);
          if (outcome === 'resisted') {
            handleRegisterCrave();
          }
        }} 
        supportContact={{
          name: profile.support_contact_name || "Amigo de Apoio",
          phone: profile.support_contact_phone || ""
        }}
      />
    </div>
  );
}
