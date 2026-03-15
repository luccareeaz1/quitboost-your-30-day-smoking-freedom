import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Target, Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";

const allChallenges = [
  { id: "1", text: "Fumar um cigarro a menos hoje", points: 10 },
  { id: "2", text: "Esperar 10 minutos antes de fumar", points: 15 },
  { id: "3", text: "Beber água quando sentir vontade", points: 10 },
  { id: "4", text: "Caminhar por 5 minutos", points: 15 },
  { id: "5", text: "Praticar 3 minutos de respiração", points: 20 },
  { id: "6", text: "Escrever como se sentiu hoje", points: 10 },
  { id: "7", text: "Trocar o cigarro por fruta", points: 15 },
  { id: "8", text: "Meditar por 10 minutos", points: 25 },
  { id: "9", text: "Não fumar após o café", points: 20 },
  { id: "10", text: "Fazer 20 agachamentos", points: 15 },
  { id: "11", text: "Ligar para alguém que te apoia", points: 10 },
  { id: "12", text: "Dormir sem fumar antes", points: 25 },
];

const Desafios = () => {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("ba_completed_challenges");
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
      localStorage.setItem("ba_completed_challenges", JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Desafios</h1>
          <p className="text-muted-foreground mb-8">Complete desafios para ganhar pontos e se fortalecer.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card border border-border p-6 mb-6 text-center"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pontos totais</p>
          <p className="text-4xl font-bold tracking-tight">{totalPoints}</p>
        </motion.div>

        <div className="space-y-3">
          {allChallenges.map((c, i) => {
            const done = completed.has(c.id);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl bg-card border p-5 flex items-center justify-between cursor-pointer transition-all hover:shadow-sm ${
                  done ? "border-apple-green/30" : "border-border"
                }`}
                onClick={() => handleToggle(c.id)}
              >
                <div className="flex items-center gap-3">
                  {done ? (
                    <Check className="w-5 h-5 text-apple-green" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {c.text}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">+{c.points} pts</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Desafios;
