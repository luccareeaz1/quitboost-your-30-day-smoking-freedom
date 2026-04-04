import { motion } from "framer-motion";
import { Heart, Wind } from "lucide-react";

const healthMilestones = [
{ hours: 0.33, label: "Pressão arterial normaliza", icon: Heart },
{ hours: 8, label: "Oxigênio no sangue normaliza", icon: Wind },
{ hours: 24, label: "Risco de infarto diminui", icon: Heart },
{ hours: 48, label: "Olfato e paladar melhoram", icon: Wind },
{ hours: 72, label: "Respiração melhora", icon: Wind },
{ hours: 168, label: "Terminações nervosas regeneram", icon: Heart },
{ hours: 720, label: "Circulação melhora significativamente", icon: Heart },
{ hours: 2160, label: "Função pulmonar aumenta 30%", icon: Wind },
{ hours: 8760, label: "Risco de câncer cai pela metade", icon: Heart }];


interface HealthTimelineProps {
  diffHours: number;
}

const HealthTimeline = ({ diffHours }: HealthTimelineProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-card border border-border p-6 mb-4">
      
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
        <Heart className="w-4 h-4" /> Recuperação do corpo
      </h3>
      <div className="space-y-4 rounded-sm">
        {healthMilestones.map((m) => {
          const completed = diffHours >= m.hours;
          const progress = Math.min(100, diffHours / m.hours * 100);
          const timeLabel = m.hours < 1 ? `${Math.round(m.hours * 60)} min` :
          m.hours < 24 ? `${m.hours}h` :
          m.hours < 720 ? `${Math.round(m.hours / 24)} dias` :
          m.hours < 8760 ? `${Math.round(m.hours / 720)} meses` : "1 ano";

          return (
            <div key={m.label} className="group">
              <div className="flex justify-between items-center mb-1.5">
                <span className="flex items-center gap-2">
                  <m.icon className={`w-3.5 h-3.5 transition-transform duration-500 group-hover:scale-125 ${
                  completed ? "text-apple-green" : "text-muted-foreground"}`
                  } />
                  <span className={`text-sm ${completed ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {m.label}
                  </span>
                </span>
                <span className="text-sm font-medium text-muted-foreground">{timeLabel}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                  completed ? "bg-apple-green" : "bg-foreground/20"}`
                  }
                  style={{ width: `${progress}%` }} />
                
              </div>
            </div>);

        })}
      </div>
    </motion.div>);

};

export default HealthTimeline;