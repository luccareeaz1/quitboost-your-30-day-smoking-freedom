import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Target, Check, Circle, Zap, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";
import { AppleCard } from "@/components/ui/apple-card";
import { cn } from "@/lib/utils";

const allChallenges = [
  { id: "1", text: "Resista à fissura pós-almoço", points: 20 },
  { id: "2", text: "Beba 2L de água hoje", points: 15 },
  { id: "3", text: "Faça 10 minutos de respiração", points: 25 },
  { id: "4", text: "Caminhe por 15 minutos", points: 15 },
  { id: "5", text: "Mantenha o maço fechado o dia todo", points: 50 },
  { id: "6", text: "Ignore o gatilho da bebida", points: 30 },
  { id: "7", text: "Converse com o Coach Neural", points: 10 },
  { id: "8", text: "Dê apoio a um usuário no feed", points: 15 },
];

const Desafios = () => {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("quitboost_completed_challenges");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const totalPoints = useMemo(() => {
    return allChallenges.filter(c => completed.has(c.id)).reduce((sum, c) => sum + c.points, 0);
  }, [completed]);

  const handleToggle = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("quitboost_completed_challenges", JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto px-6 py-10">
        
        <header className="mb-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Target size={24} strokeWidth={3} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Missões <span className="text-primary italic">Diárias.</span></h1>
            <p className="text-gray-400 font-medium mt-2">Fortaleça sua mente e acumule pontos de impacto.</p>
        </header>

        <AppleCard className="p-8 mb-10 bg-gray-900 text-white border-transparent relative overflow-hidden text-center">
             <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
             <div className="relative z-10 flex flex-col items-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Pontos Acumulados</p>
                <p className="text-6xl font-black italic tracking-tighter text-primary">{totalPoints}</p>
                <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60">
                    <Trophy size={14} className="text-primary" /> Nível 12 em progresso
                </div>
             </div>
        </AppleCard>

        <div className="grid gap-4">
          {allChallenges.map((c, i) => {
            const done = completed.has(c.id);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleToggle(c.id)}
                className={cn(
                  "p-6 rounded-[1.8rem] border transition-all cursor-pointer group flex items-center justify-between",
                  done 
                    ? "bg-green-50 border-primary/20" 
                    : "bg-white border-gray-100 hover:border-primary/30 hover:shadow-lg"
                )}
              >
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border transition-all shadow-inner",
                    done ? "bg-primary border-primary text-white" : "border-gray-200 text-transparent bg-gray-50 group-hover:border-primary/50"
                  )}>
                    <Check size={16} strokeWidth={4} className={cn(!done && "opacity-0")} />
                  </div>
                  <span className={cn(
                    "font-bold text-sm transition-all",
                    done ? "text-primary/70 line-through" : "text-gray-700"
                  )}>
                    {c.text}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">+{c.points} XP</div>
                   <Zap size={14} className={cn(done ? "text-primary" : "text-gray-200")} fill="currentColor" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Desafios;
