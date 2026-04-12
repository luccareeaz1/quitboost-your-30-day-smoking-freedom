import { motion } from "framer-motion";
import { HEALTH_MILESTONES } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import { 
  HeartPulse, 
  Wind, 
  ShieldCheck, 
  Soup, 
  Activity, 
  Zap, 
  Stethoscope, 
  Heart, 
  Brain, 
  Lungs, 
  Trophy 
} from "lucide-react";

interface RecoveryTimelineProps {
  totalSeconds: number;
}

const ICON_MAP: Record<string, any> = {
  "heart-pulse": HeartPulse,
  "wind": Wind,
  "shield-check": ShieldCheck,
  "soup": Soup,
  "activity": Activity,
  "zap": Zap,
  "stetho": Stethoscope,
  "heart": Heart,
  "brain": Brain,
  "lungs": Lungs,
  "trophy": Trophy,
};

export function RecoveryTimeline({ totalSeconds }: RecoveryTimelineProps) {
  const diffMinutes = totalSeconds / 60;

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100" />
        
        <div className="space-y-12">
          {HEALTH_MILESTONES.map((m, i) => {
            const isAchieved = diffMinutes >= m.minutes;
            const Icon = ICON_MAP[m.icon] || ShieldCheck;
            
            return (
              <motion.div 
                key={m.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "relative flex gap-8 pl-14 transition-all",
                  !isAchieved && "opacity-40 grayscale"
                )}
              >
                <div className={cn(
                  "absolute left-2.5 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-10 shadow-sm",
                  isAchieved ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"
                )}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className={cn(
                  "flex-1 p-6 rounded-2xl border transition-all",
                  isAchieved 
                    ? "bg-white border-blue-100 shadow-md shadow-blue-50/50" 
                    : "bg-slate-50/50 border-transparent shadow-none"
                )}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">{m.title}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.timeLabel}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{m.description}</p>
                  
                  {isAchieved && (
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Alcançado</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
