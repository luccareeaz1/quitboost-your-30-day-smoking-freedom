import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ListTodo, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  text: string;
  completed: boolean;
}

const DailyActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem("qb_activities_" + today);
    
    if (stored) {
      setActivities(JSON.parse(stored) as Activity[]);
    } else {
      // Generate daily specific activities based on day of month
      const dayOfMonth = new Date().getDate();
      const allPossibleActivities = [
        "Atrasar o primeiro cigarro em 30 min",
        "Beber 2 litros de água",
        "Praticar 5 min de respiração profunda",
        "Caminhada rápida de 15 minutos",
        "Escrever 3 motivos para não fumar hoje",
        "Trocar o café da tarde por chá",
        "Ligar para um amigo ou familiar",
        "Completar 1 aula de meditação no app",
        "Evitar gatilhos de estresse",
        "Comer uma fruta no lugar do cigarro"
      ];
      
      // Pick 4 activities based on date to make it "automatic" and "specific"
      const dailyPack = [
        allPossibleActivities[(dayOfMonth) % allPossibleActivities.length],
        allPossibleActivities[(dayOfMonth + 3) % allPossibleActivities.length],
        allPossibleActivities[(dayOfMonth + 7) % allPossibleActivities.length],
        allPossibleActivities[(dayOfMonth + 1) % allPossibleActivities.length],
      ].map((text, idx) => ({
        id: `act-${idx}`,
        text,
        completed: false
      }));
      
      setActivities(dailyPack);
      localStorage.setItem("qb_activities_" + today, JSON.stringify(dailyPack));
    }
  }, []);

  const toggleActivity = (id: string) => {
    const today = new Date().toDateString();
    const newActivities = activities.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    );
    setActivities(newActivities);
    localStorage.setItem("qb_activities_" + today, JSON.stringify(newActivities));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-3xl bg-white border border-border/50 p-6 shadow-soft"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-primary" /> Atividades de Hoje
        </h3>
        <span className="text-sm font-medium font-bold px-2 py-1 bg-primary/5 text-primary rounded-full border border-primary/10 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Automático
        </span>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <button
            key={activity.id}
            onClick={() => toggleActivity(activity.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left",
              activity.completed 
                ? "bg-primary/5 border-primary/20 text-primary/70" 
                : "bg-secondary/20 border-border/50 text-foreground hover:border-primary/30"
            )}
          >
            {activity.completed ? (
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
            )}
            <span className={cn(
              "text-sm font-medium leading-tight",
              activity.completed && "line-through opacity-60"
            )}>
              {activity.text}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default DailyActivities;
