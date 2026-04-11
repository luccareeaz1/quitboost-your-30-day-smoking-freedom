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
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 pb-32">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Centro de Treinamento</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Suas <span className="text-primary italic">Missões Ativas</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Complete desafios para fortalecer sua mente e subir de nível.</p>
        </div>

        <div className="flex items-center gap-6">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status de XP</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">12.450 <span className="text-primary">XP</span></p>
           </div>
           <Button className="bg-slate-900 text-white rounded-2xl h-16 px-8 gap-3 shadow-xl shadow-slate-200">
             <Trophy className="w-5 h-5 text-amber-400" />
             <div className="text-left">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Ranking</p>
                <p className="text-sm font-black tracking-tight">Elite II</p>
             </div>
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Quests */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MISSÕES.map((mission) => (
              <QuestCard key={mission.id} mission={mission} />
            ))}
          </div>

          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10 mt-10">
             <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Checklist de Resiliência</h3>
               <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                 <Target className="w-5 h-5" />
               </div>
             </div>

             <div className="space-y-4">
               {checklist.map((item) => (
                 <motion.div 
                   key={item.id} 
                   onClick={() => toggleCheck(item.id)}
                   whileHover={{ x: 4 }}
                   className={cn(
                     "group flex items-center gap-6 p-6 rounded-[2rem] transition-all border border-transparent cursor-pointer relative overflow-hidden",
                     item.completed 
                       ? "bg-slate-50/50 border-slate-100" 
                       : "bg-white shadow-sm hover:shadow-xl hover:shadow-slate-100 border-slate-100"
                   )}
                 >
                   <div className={cn(
                     "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-inner",
                     item.completed 
                       ? "bg-primary text-white scale-90" 
                       : "bg-slate-50 text-slate-300 border border-slate-100"
                   )}>
                     {item.completed ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-3 h-3 rounded-full bg-slate-200" />}
                   </div>
                   
                   <div className="flex-1">
                     <h4 className={cn(
                       "text-md font-black transition-all",
                       item.completed ? "text-slate-400 line-through" : "text-slate-800"
                     )}>
                       {item.label}
                     </h4>
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">+{item.xp} XP</p>
                   </div>

                   <ArrowUpRight className={cn(
                     "w-10 h-10 absolute -right-2 -bottom-2 opacity-5 transition-opacity",
                     item.completed ? "opacity-0" : "group-hover:opacity-10"
                   )} />
                 </motion.div>
               ))}
             </div>
          </Card>
        </div>

        {/* Global Stats/Sidebar */}
        <div className="lg:col-span-4 space-y-10">
           <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10 flex flex-col h-fit">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Progresso Total</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{completedCount}/{totalCount}</span>
              </div>
              
              <div className="relative w-48 h-48 mx-auto mb-10">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="#f1f5f9" strokeWidth="16" fill="transparent" />
                  <motion.circle 
                    cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 80}
                    initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                    animate={{ strokeDashoffset: (2 * Math.PI * 80) * (1 - completedCount/totalCount) }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900">{Math.round((completedCount/totalCount) * 100)}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Concluído</span>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <p className="text-sm font-bold text-slate-600 leading-relaxed mb-4 text-center">
                  "Você é um dos 5% de usuários que mantêm o foco total nas missões diárias."
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="text-xs font-black text-slate-900">Top 5% Resiliência</span>
                </div>
              </div>
           </Card>

           <Card className="border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-[3rem] p-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-black mb-4">Missões de Elite</h4>
              <p className="text-white/60 font-medium text-sm leading-relaxed mb-10">
                Desbloqueie missões personalizadas por profissionais de saúde ao atingir o Nível 15.
              </p>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                <span>Trancado</span>
                <span>Nv. 15 Necessário</span>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

function QuestCard({ mission }: any) {
  return (
    <Card className={cn(
      "border-none shadow-xl shadow-slate-100 bg-white rounded-[2.5rem] p-8 h-full flex flex-col relative overflow-hidden group",
      mission.status === "locked" && "opacity-60"
    )}>
      {mission.status === "completed" && (
        <div className="absolute top-6 right-6">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
            <CheckCircle2 className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-widest">Sucesso</span>
          </div>
        </div>
      )}
      
      <div className={cn(
        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-transform group-hover:scale-110",
        mission.bg, mission.color
      )}>
        <mission.icon className="w-8 h-8" />
      </div>

      <div className="mb-6 flex-1">
        <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight tracking-tight">{mission.title}</h3>
        <p className="text-xs text-slate-500 font-bold leading-relaxed">{mission.desc}</p>
      </div>

      <div className="pt-6 border-t border-slate-50 flex justify-between items-center mt-auto">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="text-[10px] font-black text-slate-900">+{mission.xp} XP</span>
        </div>
        <span className={cn(
          "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
          mission.difficulty === "FÁCIL" && "bg-emerald-50 text-emerald-600",
          mission.difficulty === "MÉDIO" && "bg-sky-50 text-sky-600",
          mission.difficulty === "DIFÍCIL" && "bg-indigo-50 text-indigo-600",
        )}>
          {mission.difficulty}
        </span>
      </div>
    </Card>
  );
}
