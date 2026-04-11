import { useState, useEffect } from "react";
import { FreeshNavbar } from "@/components/layout/FreeshNavbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  Wallet, 
  Ban, 
  HeartPulse, 
  Zap,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Brain,
  Lungs,
  Trophy,
  Activity,
  Droplets,
  Timer,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { profileService, progressService } from "@/lib/services";
import { calculateQuitStats, calculateOverallHealth } from "@/lib/calculations";
import { SOSMode } from "@/components/dashboard/SOSMode";
import { RecoveryTimeline } from "@/components/dashboard/RecoveryTimeline";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [now, setNow] = useState(new Date());
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isRecoveryExpanded, setIsRecoveryExpanded] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Fetch profile and stats
  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      try {
        const data = await profileService.get(user.id);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  // Real-time counter
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update stats based on time
  useEffect(() => {
    if (!profile?.quit_date) return;
    
    const quit_date = profile.quit_date;
    const cigarettes_per_day = profile.cigarettes_per_day || 20;
    const pack_price = profile.pack_price || profile.price_per_cigarette * (profile.cigarettes_per_pack || 20) || 20;
    const cigarettes_per_pack = profile.cigarettes_per_pack || 20;

    const currentStats = calculateQuitStats({
      quit_date,
      cigarettes_per_day,
      pack_price,
      cigarettes_per_pack
    }, now);

    setStats(currentStats);
  }, [profile, now]);

  const handleRegisterCrave = async () => {
    if (!user) return;
    try {
      await progressService.logDaily(user.id, {
        cigarettes_avoided: stats?.avoidedCount || 0,
        money_saved: stats?.moneySaved || 0,
        health_score: calculateOverallHealth(stats?.totalSeconds || 0),
        craving_count: 1 
      });
      toast({
        title: "Fissura Superada! 💪",
        description: "Você é mais forte que o vício. Orgulhe-se!",
        style: { backgroundColor: '#22C55E', color: 'white' }
      });
    } catch (error) {
      toast({ title: "Erro ao registrar", description: "Tente novamente mais tarde.", variant: "destructive" });
    }
  };

  const handleRegisterRelapse = () => {
    toast({
      title: "Recomeçar é Vencer",
      description: "Uma recaída não define sua jornada. Estamos aqui para você.",
      variant: "destructive",
      action: <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="bg-white text-rose-500 hover:bg-rose-50">Reiniciar Agora</Button>
    });
  };

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="w-10 h-10 text-primary animate-spin" />
        <p className="font-bold text-slate-400 animate-pulse">CARREGANDO SUA JORNADA...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Real-time Hero Section */}
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4 group cursor-help">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Você está no caminho certo</p>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
              {stats?.days} <span className="text-4xl text-slate-300">dias</span> {stats?.hours}h {stats?.minutes}m {stats?.seconds}s
            </h1>
            <p className="text-slate-500 text-lg max-w-xl leading-relaxed font-medium">
              Cada segundo sem fumar é um presente que você dá a si mesmo. 
              Sua jornada de <span className="text-primary font-black">liberdade</span> continua hoje.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <Button 
              onClick={() => setIsSOSOpen(true)}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 gap-3 h-20 text-lg font-black shadow-2xl shadow-primary/30 active:scale-95 transition-all group"
            >
              <AlertCircle className="w-6 h-6 fill-white/20 group-hover:rotate-12 transition-transform" />
              SOS: MODO EMERGÊNCIA
            </Button>
            <div className="flex gap-4">
              <Button 
                onClick={handleRegisterCrave}
                variant="outline"
                className="flex-1 rounded-full h-12 border-emerald-100 hover:bg-emerald-50 text-emerald-600 font-bold gap-2"
              >
                <Zap className="w-4 h-4 fill-emerald-500" />
                Venci uma Fissura
              </Button>
              <Button 
                onClick={handleRegisterRelapse}
                variant="outline"
                className="flex-1 rounded-full h-12 border-rose-100 hover:bg-rose-50 text-rose-500 font-bold gap-2"
              >
                <Ban className="w-4 h-4" />
                Registrar Recaída
              </Button>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatCard 
            label="DIAS SEM FUMAR" 
            value={stats?.days} 
            sub="Meta: 30 dias" 
            icon={Timer} 
            color="text-primary" 
            bg="bg-emerald-50" 
          />
          <StatCard 
            label="CIGARROS EVITADOS" 
            value={stats?.avoidedCount} 
            sub={`${stats?.packsSaved} maços não comprados`} 
            icon={Ban} 
            color="text-secondary" 
            bg="bg-sky-50" 
          />
          <StatCard 
            label="DINHEIRO ECONOMIZADO" 
            value={`R$${stats?.moneySaved.toFixed(2)}`} 
            sub="Acumulado este mês" 
            icon={Wallet} 
            color="text-amber-500" 
            bg="bg-amber-50" 
          />
          <StatCard 
            label="VIDA RECUPERADA" 
            value={`+${stats?.hoursRecovered}h`} 
            sub="Tempo extra de saúde" 
            icon={HeartPulse} 
            color="text-rose-500" 
            bg="bg-rose-50" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Biological Healing Progress */}
          <Card className="lg:col-span-8 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Lungs className="w-64 h-64 text-primary" />
            </div>
            
            <div className="flex justify-between items-end mb-12 relative z-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Status de Cura</h2>
                <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Sua biologia está se regenerando</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-primary">{Math.min(100, calculateOverallHealth(stats?.totalSeconds || 0))}%</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Recuperação Total</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-12 relative z-10">
              <HealthMetric 
                label="Pulmões" 
                value={Math.min(100, Math.round((stats?.totalSeconds / (15 * 365 * 24 * 3600)) * 100 * 50))} 
                icon={Lungs} 
                color="stroke-primary" 
              />
              <HealthMetric 
                label="Circulação" 
                value={Math.min(100, Math.round((stats?.totalSeconds / (3 * 7 * 24 * 3600)) * 100))} 
                icon={Activity} 
                color="stroke-sky-500" 
              />
              <HealthMetric 
                label="Cérebro" 
                value={Math.min(100, Math.round((stats?.totalSeconds / (5 * 365 * 24 * 3600)) * 100))} 
                icon={Brain} 
                color="stroke-amber-500" 
              />
              <HealthMetric 
                label="Imunidade" 
                value={Math.min(100, Math.round((stats?.totalSeconds / (30 * 24 * 3600)) * 100))} 
                icon={ShieldCheck} 
                color="stroke-indigo-500" 
              />
              <HealthMetric 
                label="Energia" 
                value={Math.min(100, Math.round((stats?.totalSeconds / (48 * 3600)) * 100))} 
                icon={Zap} 
                color="stroke-emerald-400" 
              />
              <HealthMetric 
                label="Hidratação" 
                value={Math.min(100, Math.round((stats?.totalSeconds / (24 * 3600)) * 100))} 
                icon={Droplets} 
                color="stroke-blue-400" 
              />
            </div>

            <div className="mt-16 pt-10 border-t border-slate-50 flex flex-col gap-8 relative z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Linha do Tempo Científica</h3>
                    <p className="text-xs text-slate-400 font-bold">O que está acontecendo no seu corpo agora</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsRecoveryExpanded(!isRecoveryExpanded)}
                  className="rounded-full gap-2 text-slate-500 hover:text-primary font-black text-[10px] uppercase tracking-widest"
                >
                  {isRecoveryExpanded ? "Ocultar Detalhes" : "Ver Detalhes"}
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isRecoveryExpanded && "rotate-180")} />
                </Button>
              </div>

              <AnimatePresence>
                {isRecoveryExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <RecoveryTimeline totalSeconds={stats?.totalSeconds || 0} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            {/* 30 Day Check-in Grid */}
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Primeiro Mês</h2>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selo de Prata</div>
              </div>
              <div className="grid grid-cols-6 gap-3">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "aspect-square rounded-2xl flex items-center justify-center text-[11px] font-black transition-all",
                      i < (stats?.days || 0) 
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                        : i === (stats?.days || 0) 
                          ? "bg-white border-2 border-primary text-primary animate-pulse" 
                          : "bg-slate-50 text-slate-200"
                    )}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] flex items-center gap-4 group cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-amber-500">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Próxima Conquista</p>
                  <p className="text-sm font-bold text-slate-900 leading-none">
                    Mais {Math.max(0, 30 - (stats?.days || 0))} dias para o Bronze
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>

            {/* Badges Quick Overview */}
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10 flex-1">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Conquistas</h2>
                <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-primary">Ver Tudo</Button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { name: "1 Hora", icon: Zap, color: "text-amber-500", bg: "bg-amber-50", unlocked: stats?.totalSeconds >= 3600 },
                  { name: "24 Horas", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50", unlocked: stats?.totalSeconds >= 86400 },
                  { name: "S. Livre", icon: Activity, color: "text-sky-500", bg: "bg-sky-50", unlocked: stats?.totalSeconds >= 86400 * 7 },
                  { name: "P. Puro", icon: Lungs, color: "text-indigo-500", bg: "bg-indigo-50", unlocked: false },
                  { name: "Economista", icon: Wallet, color: "text-rose-500", bg: "bg-rose-50", unlocked: stats?.moneySaved > 100 },
                  { name: "Mestre SOS", icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-50", unlocked: false },
                ].map((badge, i) => (
                  <div key={i} className={cn("flex flex-col items-center gap-3", !badge.unlocked && "opacity-20 grayscale-0")}>
                    <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer", badge.bg)}>
                      <badge.icon className={cn("w-8 h-8", badge.color)} />
                    </div>
                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-tighter text-center">{badge.name}</span>
                  </div>
                ))}
              </div>
            </Card>
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

function StatCard({ label, value, sub, icon: Icon, color, bg }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8 h-full flex flex-col justify-between group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform">
          <Icon className={cn("w-20 h-20", color)} />
        </div>
        
        <div className="flex justify-between items-start mb-10 relative z-10">
          <div className={cn("p-4 rounded-2xl group-hover:rotate-12 transition-transform shadow-sm", bg, color)}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="w-2 h-2 rounded-full bg-slate-100 group-hover:bg-primary transition-colors" />
        </div>
        
        <div className="relative z-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
          <h3 className="text-4xl font-black text-slate-900 mb-2 truncate leading-none">{value}</h3>
          <p className="text-xs text-slate-500 font-bold">{sub}</p>
        </div>
      </Card>
    </motion.div>
  );
}

function HealthMetric({ label, value, icon: Icon, color }: any) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6 group">
      <div className="relative w-24 h-24">
        <div className="absolute inset-2 border border-slate-50 rounded-full" />
        
        <svg className="w-full h-full transform -rotate-90 filter drop-shadow-sm">
          <circle
            cx="48"
            cy="48"
            r={radius}
            strokeWidth="8"
            fill="transparent"
            className="stroke-slate-100/30"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "circOut" }}
            cx="48"
            cy="48"
            r={radius}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={cn("transition-all duration-1000", color)}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn("p-3 rounded-full bg-slate-50 group-hover:scale-110 transition-transform shadow-inner", color.replace('stroke', 'text'))}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>
        <span className="text-lg font-black text-slate-900 leading-none">{value}%</span>
      </div>
    </div>
  );
}
