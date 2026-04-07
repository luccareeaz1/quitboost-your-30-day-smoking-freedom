import { FreeshNavbar } from "@/components/layout/FreeshNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  Wallet, 
  Ban, 
  HeartPulse, 
  Zap,
  Stethoscope,
  Activity,
  Soup,
  Wind,
  ShieldCheck,
  ChevronRight,
  Trophy,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const STATS = [
  { label: "DINHEIRO ECONOMIZADO", value: "R$218", sub: "+R$15.57 / dia", icon: Wallet, color: "bg-emerald-50 text-emerald-600" },
  { label: "CIGARROS EVITADOS", value: "280", sub: "14 maços não comprados", icon: Ban, color: "bg-blue-50 text-blue-600" },
  { label: "VIDA GANHA", value: "+7.2h", sub: "Tempo extra de vida", icon: HeartPulse, color: "bg-rose-50 text-rose-600" },
  { label: "EVOLUÇÃO", value: "Nível 4", xp: 349, maxXp: 500, icon: Zap, color: "bg-amber-50 text-amber-600" },
];

const RECOVERY_METRICS = [
  { name: "Pulmões", value: 72, icon: Heart, color: "text-blue-500" },
  { name: "Circulação", value: 88, icon: Activity, color: "text-emerald-500" },
  { name: "Pressão Arterial", value: 54, icon: Stethoscope, color: "text-orange-500" },
  { name: "Paladar", value: 65, icon: Soup, color: "text-indigo-500" },
  { name: "Frequência Cardíaca", value: 92, icon: Wind, color: "text-rose-500" },
  { name: "Imunidade", value: 41, icon: ShieldCheck, color: "text-amber-500" },
];

const CircularProgress = ({ value, label, icon: Icon, color }: any) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn("transition-all duration-1000", color)}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-slate-700">
          {value}%
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center h-8 flex items-center">{label}</span>
    </div>
  );
};


export default function Dashboard() {
  const { toast } = useToast();

  const handleSOS = () => {
    toast({
      title: "Respire fundo! 🧘‍♂️",
      description: "Dica rápida: Beba um copo de água bem gelada ou faça 10 flexões. A fissura dura em média apenas 5 a 10 minutos. Você consegue!",
      variant: "destructive",
    });
  };

  const [confirmedDays, setConfirmedDays] = useState(14);
  const handleConfirmDay = (day: number) => {
    if (day === confirmedDays + 1) {
      setConfirmedDays(day);
      toast({
        title: "Dia Confirmado! 🏆",
        description: `Parabéns por completar o dia ${day}. XP adicionado!`,
      });
    }
  };

  const handleLogTrigger = (trigger: string) => {
    toast({
      title: "Gatilho Registrado",
      description: `Entendido. Quando estiver com ${trigger}, procure respirar ou mudar de ambiente. O Coach IA pode te ajudar mais.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <FreeshNavbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          <div className="max-w-2xl">
            <p className="text-slate-500 font-medium mb-1">Você está respirando ar puro há:</p>
            <h1 className="text-6xl font-black text-slate-900 mb-2">
              14 <span className="text-4xl font-bold text-slate-400">dias sem fumar</span>
            </h1>
            <p className="text-slate-600 text-lg">
              Cada respiração é uma vitória. Seus pulmões estão se recuperando e seu futuro brilha a cada segundo.
            </p>
          </div>
          <Button 
            onClick={handleSOS}
            size="lg" 
            className="bg-[#2D45C1] hover:bg-[#1E30A1] text-white rounded-full px-8 gap-2 h-14 text-md shadow-xl shadow-blue-200/50"
          >
            <AlertCircle className="w-5 h-5 fill-white/20" />
            SOS: PRECISO DE AJUDA
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {STATS.map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm bg-white rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-3 rounded-2xl", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                  {stat.sub && <p className="text-xs text-slate-500 font-medium">{stat.sub}</p>}
                  {stat.xp && (
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>PROGRESSO DE XP</span>
                        <span>{stat.xp}/{stat.maxXp} XP</span>
                      </div>
                      <Progress value={(stat.xp / stat.maxXp) * 100} className="h-1.5 bg-slate-100" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Body Recovery */}
          <Card className="lg:col-span-8 border-none shadow-sm bg-white rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-900">Recuperação Corporal</h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progresso biológico de cura</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8">
              {RECOVERY_METRICS.map((metric) => (
                <CircularProgress 
                  key={metric.name} 
                  label={metric.name} 
                  value={metric.value} 
                  color={metric.color} 
                />
              ))}
            </div>
          </Card>

          {/* 30 Day Milestone */}
          <Card className="lg:col-span-4 border-none shadow-sm bg-white rounded-3xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Jornada de 30 Dias</h2>
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i} 
                  onClick={() => handleConfirmDay(i + 1)}
                  className={cn(
                    "aspect-square rounded-full flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer",
                    i < confirmedDays 
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" 
                      : i === confirmedDays ? "bg-[#2D45C1] text-white animate-pulse" : "bg-slate-50 text-slate-300"
                  )}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Trophy className="w-4 h-4 text-[#2D45C1]" />
              </div>
              <p className="text-xs text-slate-600 font-medium">
                faltam <span className="font-bold text-slate-900">16 dias</span> para você atingir a marca de Pulmão de Prata!
              </p>
            </div>
          </Card>

          {/* Craving Triggers */}
          <Card className="lg:col-span-6 border-none shadow-sm bg-white rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-900">Gatilhos de Fissura</h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Esta Semana</span>
            </div>
            <div className="flex items-end justify-between h-48 gap-4 px-4">
              {[
                { name: "Estresse", val: 80, color: "bg-rose-400" },
                { name: "Café", val: 40, color: "bg-[#2D45C1]" },
                { name: "Social", val: 60, color: "bg-emerald-400" },
                { name: "Tédio", val: 30, color: "bg-amber-400" },
                { name: "Álcool", val: 50, color: "bg-indigo-400" },
              ].map((trigger) => (
                <div key={trigger.name} className="flex-1 flex flex-col items-center gap-4">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${trigger.val}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn("w-full rounded-t-xl", trigger.color)}
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{trigger.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Craving Logger / Quick Check-in */}
          <Card className="lg:col-span-6 border-none shadow-sm bg-white rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Registro de Fissura</h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">O que disparou a vontade?</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Estresse", icon: Activity, color: "hover:bg-rose-50" },
                { name: "Café/Comida", icon: Soup, color: "hover:bg-amber-50" },
                { name: "Social/Álcool", icon: HeartPulse, color: "hover:bg-indigo-50" },
                { name: "Tédio", icon: Zap, color: "hover:bg-blue-50" },
              ].map((trigger) => (
                <button
                  key={trigger.name}
                  onClick={() => handleLogTrigger(trigger.name)}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-100 bg-white transition-all active:scale-95",
                    trigger.color
                  )}
                >
                  <trigger.icon className="w-10 h-10 text-slate-400 mb-3" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">{trigger.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50">
              <p className="text-sm font-medium text-slate-600 mb-4 italic">"A vontade é como uma onda. Ela vem, atinge o pico e passa. Você só precisa surfá-la."</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Dica: Mude de ambiente agora!</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
