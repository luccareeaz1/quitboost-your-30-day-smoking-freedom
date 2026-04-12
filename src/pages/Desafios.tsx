import { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Trophy, 
  CheckCircle2,
  Lock,
  ChevronRight,
  Zap,
  Target,
  Trash2,
  Coffee,
  Package,
  Sparkles,
  Flame,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const MISSÕES = [
  {
    id: 1,
    title: "Arsenal Limpo",
    desc: "Elimine permanentemente todos os vestígios de fumo do seu ambiente pessoal.",
    difficulty: "FÁCIL",
    xp: 200,
    status: "completed",
    icon: Trash2,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    id: 2,
    title: "Hack de Rotina",
    desc: "Mude o local do seu café matinal para desativar o gatilho automático do cérebro.",
    difficulty: "MÉDIO",
    xp: 500,
    status: "in-progress",
    icon: Coffee,
    color: "text-sky-500",
    bg: "bg-sky-50",
    progress: 65
  },
  {
    id: 3,
    title: "Kit Sobrevivência",
    desc: "Prepare o kit antifissura: água gelada, chicletes e um objeto de distração tátil.",
    difficulty: "DIFÍCIL",
    xp: 1200,
    status: "locked",
    icon: Package,
    color: "text-indigo-500",
    bg: "bg-indigo-50"
  }
];

const INITIAL_CHECKLIST = [
  { id: "water", label: "Beber 2L de água para desintoxicar", xp: 150, completed: true },
  { id: "smell", label: "Exercício de respiração profunda (3min)", xp: 300, completed: false },
  { id: "walk", label: "Caminhada leve de 15 minutos", xp: 100, completed: false },
  { id: "photo", label: "Registrar humor no diário", xp: 200, completed: true },
];

export default function Desafios() {
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const { toast } = useToast();

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const newState = !item.completed;
        if (newState) {
          toast({
            title: "Missão Concluída! 🚀",
            description: `Você conquistou +${item.xp} XP de resiliência.`,
            style: { backgroundColor: '#22C55E', color: 'white' }
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
    <div className="min-h-screen bg-white">
      <header className="px-6 py-8 md:px-10 md:py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Desafios e Gamificação</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Suas <span className="text-blue-600">Missões Ativas</span></h1>
            <p className="text-slate-500 mt-2 text-sm">Fortaleça sua resiliência mental completando objetivos diários.</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pontuação Total</p>
                <p className="text-xl font-bold text-slate-900 tracking-tight">12.450 <span className="text-blue-600">XP</span></p>
             </div>
             <div className="p-4 border border-slate-200 bg-white rounded-2xl flex items-center gap-4 shadow-sm h-14">
               <Trophy className="w-5 h-5 text-blue-600" />
               <div className="text-left">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Ranking</p>
                  <p className="text-sm font-bold tracking-tight text-slate-900">Elite II</p>
               </div>
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MISSÕES.map((mission) => (
              <QuestCard key={mission.id} mission={mission} />
            ))}
          </div>

          <div className="p-6 md:p-8 border border-slate-200 bg-white rounded-2xl shadow-sm mt-8">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-lg font-bold text-slate-900">Checklist Diário</h3>
               <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                 <Target className="w-4 h-4" />
               </div>
             </div>

             <div className="space-y-3">
               {checklist.map((item) => (
                 <motion.div 
                   key={item.id} 
                   onClick={() => toggleCheck(item.id)}
                   whileHover={{ x: 2 }}
                   className={cn(
                     "group flex items-center gap-4 p-4 rounded-xl transition-all border cursor-pointer",
                     item.completed 
                       ? "bg-slate-50/50 border-slate-100 opacity-60" 
                       : "bg-white border-slate-200 hover:border-blue-300"
                   )}
                 >
                   <div className={cn(
                     "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                     item.completed 
                       ? "bg-blue-600 text-white" 
                       : "bg-slate-50 text-slate-300 border border-slate-100"
                   )}>
                     {item.completed ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />}
                   </div>
                   
                   <div className="flex-1">
                     <h4 className={cn(
                       "text-[13px] font-bold transition-all",
                       item.completed ? "text-slate-400 line-through" : "text-slate-800"
                     )}>
                       {item.label}
                     </h4>
                     <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">+{item.xp} XP</p>
                   </div>
                 </motion.div>
               ))}
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
           <div className="p-8 border border-slate-200 bg-white rounded-2xl shadow-sm flex flex-col items-center text-center">
              <div className="flex justify-between w-full items-center mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Progresso</h3>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{completedCount}/{totalCount}</span>
              </div>
              
              <div className="relative w-40 h-40 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                  <motion.circle 
                    cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 70}
                    initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                    animate={{ strokeDashoffset: (2 * Math.PI * 70) * (1 - completedCount/totalCount) }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="text-blue-600"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-900">{Math.round((completedCount/totalCount) * 100)}%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Geral</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 w-full">
                <p className="text-[11px] font-semibold text-slate-600 leading-relaxed mb-3">
                  "Você está entre os mais resilientes da comunidade hoje."
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-[10px] font-bold text-slate-900 uppercase">Top 5% Resiliência</span>
                </div>
              </div>
           </div>

           <div className="p-8 bg-slate-900 text-white rounded-2xl shadow-lg">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-bold mb-2">Missões de Elite</h4>
              <p className="text-white/50 font-medium text-[11px] leading-relaxed mb-6">
                Desbloqueie missões personalizadas por profissionais ao atingir o Nível 15.
              </p>
              <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-white/30">
                <span>Trancado</span>
                <span>Nv. 15 Necessário</span>
              </div>
           </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function QuestCard({ mission }: any) {
  return (
    <div className={cn(
      "p-6 border border-slate-200 bg-white rounded-2xl flex flex-col h-full relative transition-all hover:border-blue-300 hover:shadow-sm",
      mission.status === "locked" && "opacity-40 grayscale"
    )}>
      {mission.status === "completed" && (
        <div className="absolute top-4 right-4">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
        </div>
      )}
      
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-blue-50 text-blue-600 border border-blue-100"
      )}>
        <mission.icon className="w-6 h-6" />
      </div>

      <div className="mb-4 flex-1">
        <h3 className="text-sm font-bold text-slate-900 mb-1 leading-tight tracking-tight">{mission.title}</h3>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{mission.desc}</p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-blue-600" />
          <span className="text-[9px] font-bold text-slate-900">+{mission.xp} XP</span>
        </div>
        <span className="text-[8px] font-bold uppercase tracking-widest bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md">
          {mission.difficulty}
        </span>
      </div>
    </div>
  );
}
