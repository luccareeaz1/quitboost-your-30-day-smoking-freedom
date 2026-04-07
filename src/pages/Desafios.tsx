import { FreeshNavbar } from "@/components/layout/FreeshNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Trophy, 
  Flame, 
  Droplet, 
  Brain, 
  Sun, 
  MapPin, 
  BookOpen, 
  Camera,
  CheckCircle2,
  Lock,
  ChevronRight,
  Zap,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MISSÕES = [
  {
    id: 1,
    title: "Clareza Matinal",
    desc: "Complete uma meditação de 10 minutos antes das 08:00.",
    difficulty: "FÁCIL",
    xp: 200,
    status: "completed",
    icon: Sun,
    color: "emerald"
  },
  {
    id: 2,
    title: "Herói da Hidratação",
    desc: "Beba 3 litros de água por 5 dias consecutivos.",
    difficulty: "MÉDIO",
    xp: 500,
    status: "in-progress",
    icon: Droplet,
    color: "blue",
    progress: 60
  },
  {
    id: 3,
    title: "Mestre do Foco",
    desc: "Registre dois blocos de 90 minutos de foco ininterrupto.",
    difficulty: "DIFÍCIL",
    xp: 1200,
    status: "locked",
    icon: Brain,
    color: "indigo"
  }
];

const INITIAL_CHECKLIST = [
  { id: "meal", label: "Registre sua refeição matinal", xp: 150, completed: true },
  { id: "steps", label: "Caminhe 10.000 passos", xp: 300, completed: false },
  { id: "read", label: "Leia 10 páginas de um livro", xp: 100, completed: false },
  { id: "photo", label: "Envie sua foto de progresso diário", xp: 200, completed: true },
];

export default function Missions() {
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const { toast } = useToast();

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const newState = !item.completed;
        if (newState) {
          toast({
            title: "Missão Cumprida! 🎉",
            description: `Você ganhou ${item.xp} XP por completar: ${item.label}`,
          });
        }
        return { ...item, completed: newState };
      }
      return item;
    }));
  };

  const completedCount = checklist.filter(i => i.completed).length + MISSÕES.filter(m => m.status === 'completed').length;
  const totalCount = checklist.length + MISSÕES.length;

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <FreeshNavbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight uppercase">Missões</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{completedCount} de {totalCount} concluídas</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">EXPERIÊNCIA TOTAL</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 justify-end">
                12.450 <span className="text-[#FBBF24]">XP</span>
              </h3>
            </div>
            <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-[1.5rem] shadow-xl shadow-slate-200">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#FBBF24]" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">RANKING</p>
                <p className="text-sm font-bold tracking-tight">Elite II</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mission Cards Row */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MISSÕES.map((mission) => (
              <motion.div 
                key={mission.id}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={cn(
                  "border-none shadow-[0_4px_32px_rgba(0,0,0,0.02)] bg-white rounded-[2.5rem] p-8 h-full flex flex-col relative",
                  mission.status === "locked" && "opacity-60 grayscale-[0.8]"
                )}>
                  {mission.status === "completed" && (
                    <div className="absolute top-8 right-8">
                      <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Concluído</span>
                      </div>
                    </div>
                  )}
                  {mission.status === "locked" && (
                    <div className="absolute top-8 right-8">
                      <div className="p-2 bg-slate-100 rounded-full">
                        <Lock className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  )}
                  
                  <div className={cn(
                    "w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-sm",
                    mission.status === "completed" ? "bg-emerald-50 text-emerald-500" : 
                    mission.status === "in-progress" ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-400"
                  )}>
                    <mission.icon className="w-8 h-8" />
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{mission.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{mission.desc}</p>
                  </div>

                  <div className="mt-auto space-y-6">
                    {mission.status === "in-progress" && mission.progress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                          <span>PROGRESSO</span>
                          <span>{mission.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${mission.progress}%` }}
                            className="h-full bg-blue-500 rounded-full"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                      <div className={cn(
                        "text-[10px] font-black tracking-widest px-2.5 py-1 rounded-lg border",
                        mission.difficulty === "FÁCIL" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                        mission.difficulty === "MÉDIO" ? "bg-amber-50 border-amber-100 text-amber-600" :
                        "bg-rose-50 border-rose-100 text-rose-600"
                      )}>
                        {mission.difficulty}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 fill-amber-200 text-amber-400" />
                        <span className="text-sm font-black text-slate-900 tracking-tight">{mission.xp} XP</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Daily Checklist Section */}
        <section className="bg-white border border-slate-100 shadow-[0_8px_48px_rgba(0,0,0,0.02)] rounded-[3rem] p-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Checklist Diário</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Renove suas metas todas as manhãs</p>
            </div>
            <Target className="w-8 h-8 text-[#2D45C1] opacity-20" />
          </div>

          <div className="space-y-4">
            {checklist.map((item) => (
              <div 
                key={item.id} 
                onClick={() => toggleCheck(item.id)}
                className={cn(
                  "group flex items-center gap-6 p-6 rounded-3xl transition-all border border-transparent cursor-pointer",
                  item.completed 
                    ? "bg-slate-50 border-slate-100/50" 
                    : "bg-white hover:border-slate-100 shadow-sm hover:shadow-md"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  item.completed 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" 
                    : "bg-slate-50 text-slate-300 ring-2 ring-slate-100"
                )}>
                  {item.completed ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                </div>
                
                <div className="flex-1">
                  <h4 className={cn(
                    "text-md font-bold transition-all",
                    item.completed ? "text-slate-400 line-through" : "text-slate-700"
                  )}>
                    {item.label}
                  </h4>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RECOMPENSA</p>
                    <p className={cn(
                      "text-sm font-black",
                      item.completed ? "text-slate-400" : "text-slate-900"
                    )}>{item.xp} XP</p>
                  </div>
                  <button className="p-3 bg-white shadow-sm border border-slate-100 rounded-2xl group-hover:bg-[#2D45C1] group-hover:text-white transition-all text-slate-300">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
