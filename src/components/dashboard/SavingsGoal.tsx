import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function SavingsGoal() {
  const goal = 1000;
  const current = 218;
  const progress = (current / goal) * 100;

  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl p-6 overflow-hidden relative">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Meta de Economia</h3>
          <p className="text-xs text-slate-500 font-medium">Fundo para viagem de férias</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-xl text-primary">
          <Target className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-3xl font-bold text-slate-900">R${current}</span>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Alvo: R${goal}</span>
        </div>
        
        <div className="relative pt-2">
          <Progress value={progress} className="h-3 bg-slate-50" />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, left: `${progress}%` }}
            className="absolute top-0 w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg -ml-2"
          />
        </div>

        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
          <TrendingUp className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Você já economizou 21% da meta!</span>
        </div>
      </div>
    </Card>
  );
}
