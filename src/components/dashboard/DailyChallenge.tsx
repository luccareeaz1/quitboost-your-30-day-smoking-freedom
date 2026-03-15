import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const challenges = [
  "Atrasar o primeiro cigarro do dia em 30 minutos",
  "Beber 8 copos de água hoje",
  "Caminhar por 15 minutos",
  "Praticar respiração por 5 minutos",
  "Escrever 3 motivos para parar",
  "Trocar o cigarro por uma fruta",
  "Meditar por 10 minutos",
  "Não fumar após o almoço",
];

const DailyChallenge = () => {
  const today = new Date().toDateString();
  const challengeIndex = new Date().getDate() % challenges.length;
  const challenge = challenges[challengeIndex];

  const [completed, setCompleted] = useState(() => {
    return localStorage.getItem("ba_challenge_" + today) === "done";
  });

  const handleComplete = () => {
    localStorage.setItem("ba_challenge_" + today, "done");
    setCompleted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl bg-card border border-border p-6"
    >
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <Target className="w-4 h-4" /> Desafio do dia
      </h3>
      <p className="text-foreground font-medium mb-4 leading-relaxed">{challenge}</p>
      {completed ? (
        <div className="flex items-center gap-2 text-apple-green text-sm font-medium">
          <Check className="w-4 h-4" /> Concluído!
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={handleComplete}
        >
          Concluir desafio
        </Button>
      )}
    </motion.div>
  );
};

export default DailyChallenge;
