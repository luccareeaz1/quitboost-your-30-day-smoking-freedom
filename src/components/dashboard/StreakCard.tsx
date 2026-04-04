import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const StreakCard = ({ days }: { days: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="rounded-2xl bg-card border border-border p-6"
  >
    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
      <Flame className="w-4 h-4" /> Streak de Vitória
    </h3>
    <div className="text-center py-4">
      <div className="relative inline-block">
        <div className="w-28 h-28 rounded-full border-2 border-border flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full animate-breathe bg-muted/50" />
          <div className="z-10 text-center">
            <p className="text-4xl font-bold tracking-tight">{days}</p>
            <p className="text-sm font-medium text-muted-foreground">dias seguidos</p>
          </div>
        </div>
      </div>
    </div>
    <p className="text-center text-xs text-muted-foreground mt-2">
      {days === 0 && "Comece agora sua sequência!"}
      {days >= 1 && days < 7 && "Ótimo começo! Continue firme."}
      {days >= 7 && days < 30 && "Incrível! Uma semana de vitória!"}
      {days >= 30 && "Lendário! 30 dias sem fumar!"}
    </p>
  </motion.div>
);

export default StreakCard;
