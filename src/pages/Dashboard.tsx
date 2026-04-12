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

const SimpleMetricCard = ({ label, value, subValue, icon: Icon, isProgress, progress }: any) => (
  <div className="bg-white rounded-[24px] border border-slate-200 p-8 flex flex-col justify-between group hover:border-blue-200 transition-all duration-300">
    <div className="flex justify-between items-start mb-6">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <ArrowUpRight className="w-4 h-4 text-slate-200 group-hover:text-blue-400" />
    </div>
    <div>
      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <h3 className="text-[28px] font-black text-slate-900 tracking-tighter leading-none mb-2">{value}</h3>
      {isProgress ? (
        <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      ) : (
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{subValue}</p>
      )}
    </div>
  </div>
);

const CircularProgress = ({ label, value, color }: any) => (
  <div className="flex flex-col items-center gap-3">
    <div className="relative w-20 h-20">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="34"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-slate-50"
        />
        <motion.circle
          cx="40"
          cy="40"
          r="34"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray="213.6"
          initial={{ strokeDashoffset: 213.6 }}
          animate={{ strokeDashoffset: 213.6 - (213.6 * value) / 100 }}
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[14px] font-black text-slate-800">{value}%</span>
      </div>
    </div>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);

const MilestoneCalendar = ({ currentDay }: { currentDay: number }) => (
  <div className="grid grid-cols-5 gap-3">
    {Array.from({ length: 30 }).map((_, i) => (
      <div 
        key={i} 
        className={cn(
          "aspect-square rounded-full flex items-center justify-center text-[10px] font-black border transition-all",
          i + 1 <= currentDay 
            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
            : i + 1 === currentDay + 1 
              ? "border-blue-600 text-blue-600 animate-pulse" 
              : "border-slate-100 text-slate-300"
        )}
      >
        {i + 1}
      </div>
    ))}
  </div>
);

  if (!profile) return <div className="p-20 text-center font-black animate-pulse">{t('common.loading')}</div>;

  return (
    <div className="min-h-screen bg-white pb-24">
      <SEO 
        title="Painel de Controle | QuitBoost" 
        description="Acompanhe sua jornada para parar de fumar em tempo real."
      />
         <main className="max-w-[1280px] mx-auto px-6 pt-12">
        {/* TOP STATUS SECTION */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-start justify-between gap-8"
          >
            <div>
              <p className="text-[14px] font-medium text-slate-500 mb-2">Você está respirando limpo há:</p>
              <div className="flex items-baseline gap-3 mb-2">
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-none">
                  {stats?.days || 0}
                </h1>
                <span className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">dias sem fumar</span>
              </div>
              <p className="text-[14px] text-slate-500 max-w-lg leading-relaxed">
                Cada respiração é uma vitória. Seu corpo está se recuperando e seu futuro fica mais brilhante a cada segundo.
              </p>
            </div>

            <div className="flex flex-col items-end gap-10">
               <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100" />
                    ))}
                  </div>
                  <span className="text-[12px] font-bold text-slate-900">+14k usuários livres</span>
               </div>
               
               <Button 
                onClick={() => setIsSOSOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-14 px-10 font-bold gap-3 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] transition-all hover:scale-105 active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-[14px] tracking-tight uppercase">SOS: EU PRECISO DE AJUDA</span>
                </div>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* STATS STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <SimpleMetricCard 
            label="Dinheiro Economizado" 
            value={`R$ ${stats?.moneySaved.toFixed(2)}`} 
            subValue={`+R$${(profile.price_per_cigarette * profile.cigarettes_per_day).toFixed(2)} / dia`}
            icon={Coins} 
          />
          <SimpleMetricCard 
            label="Cigarros Evitados" 
            value={stats?.cigarrosNaoFumados || 0} 
            subValue={`${Math.floor(stats?.cigarrosNaoFumados / 20)} maços não comprados`}
            icon={Zap} 
          />
          <SimpleMetricCard 
            label="Vida Ganha" 
            value={`+${(stats?.totalSeconds / 3600 * 0.3).toFixed(1)}h`} 
            subValue="Tempo extra de vida"
            icon={Clock} 
          />
          <SimpleMetricCard 
            label="Progresso" 
            value="Nível 4" 
            subValue="380 / 500 XP"
            icon={TrendingUp} 
            isProgress
            progress={76}
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* BODY RECOVERY */}
          <div className="lg:col-span-8 bg-white rounded-[24px] border border-slate-200 p-10 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-[20px] font-bold text-slate-900 mb-1">Recuperação Corporal</h2>
                  <p className="text-[14px] text-slate-500">Progresso biológico da sua cura</p>
                </div>
                <Users className="w-5 h-5 text-slate-300" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 mb-12">
                <CircularProgress label="Pulmões" value={72} color="text-blue-500" />
                <CircularProgress label="Circulação" value={88} color="text-emerald-500" />
                <CircularProgress label="Pressão" value={54} color="text-orange-500" />
                <CircularProgress label="Paladar" value={65} color="text-indigo-500" />
                <CircularProgress label="Frequência" value={92} color="text-rose-500" />
                <CircularProgress label="Imunidade" value={41} color="text-amber-500" />
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
               <button 
                 onClick={() => setIsRecoveryExpanded(!isRecoveryExpanded)}
                 className="text-[13px] font-semibold text-blue-600 flex items-center gap-2 hover:translate-x-1 transition-transform"
               >
                 Ver detalhes do impacto bio-celular
                 <ChevronDown className={cn("w-4 h-4", isRecoveryExpanded && "rotate-180")} />
               </button>
            </div>
            
            <AnimatePresence>
              {isRecoveryExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-8 pt-8 border-t border-slate-50 overflow-hidden"
                >
                  <RecoveryTimeline totalSeconds={stats?.totalSeconds || 0} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MILSTONE CALENDAR */}
          <div className="lg:col-span-4 bg-white rounded-[24px] border border-slate-200 p-10">
            <h2 className="text-[20px] font-bold text-slate-900 mb-1">Meta de 30 Dias</h2>
            <p className="text-[14px] text-slate-500 mb-8">Marcos da sua jornada</p>
            
            <MilestoneCalendar currentDay={stats?.days || 0} />
            
            <div className="mt-10 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-center">
               <p className="text-[12px] font-bold text-blue-600">Faltam {30 - (stats?.days || 0)} dias para o selo de Prata!</p>
            </div>
          </div>

          {/* CRAVING TRIGGERS */}
          <div className="lg:col-span-7 bg-white rounded-[24px] border border-slate-200 p-10">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-[20px] font-bold text-slate-900">Gatilhos de Fissura</h2>
              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Esta Semana</span>
            </div>
            
            <div className="flex items-end justify-between h-48 gap-4">
               {['Stress', 'Coffee', 'Social', 'Boredom', 'Alcohol'].map((trigger, i) => (
                 <div key={trigger} className="flex-1 flex flex-col items-center gap-4">
                    <div className="w-full bg-slate-50 rounded-lg relative overflow-hidden" style={{ height: `${[60, 40, 85, 30, 70][i]}%` }}>
                       <div className="absolute inset-0 bg-blue-500/20" />
                       <div className="absolute bottom-0 left-0 right-0 bg-blue-500 h-1/2 rounded-t-lg" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{trigger}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* RECENT BADGES */}
          <div className="lg:col-span-5 bg-white rounded-[24px] border border-slate-200 p-10">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-[20px] font-bold text-slate-900">Medalhas Recentes</h2>
               <button className="text-[12px] font-bold text-blue-600">Ver Tudo</button>
            </div>

            <div className="grid grid-cols-3 gap-6">
               {[
                 { name: "Primeiro Dia", icon: Zap, unlocked: true },
                 { name: "24h Limpo", icon: ShieldCheck, unlocked: true },
                 { name: "Uma Semana", icon: Trophy, unlocked: true },
                 { name: "Poupador", icon: Coins, unlocked: false },
                 { name: "Atleta", icon: Activity, unlocked: false },
                 { name: "Mestre", icon: Brain, unlocked: false },
               ].map((badge, i) => (
                 <div key={i} className={cn("flex flex-col items-center gap-3 p-4 rounded-3xl border border-slate-50 transition-all hover:bg-slate-50", !badge.unlocked && "opacity-30 grayscale")}>
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 mb-1">
                       <badge.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 text-center uppercase tracking-tight leading-tight">{badge.name}</span>
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
