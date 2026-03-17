import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/app/AppLayout";
import { useNavigate } from "react-router-dom";

const badgeDefinitions = [
  { label: "Primeiro passo", daysNeeded: 0, emoji: "🌱", story: "Você tomou a decisão mais importante: começar." },
  { label: "24 horas limpo", daysNeeded: 1, emoji: "⭐", story: "24 horas! O monóxido de carbono saiu do seu sangue." },
  { label: "3 dias sem fumar", daysNeeded: 3, emoji: "💪", story: "A nicotina foi eliminada do corpo. Os sentidos estão voltando." },
  { label: "1 semana livre", daysNeeded: 7, emoji: "🔥", story: "Terminações nervosas começam a se regenerar." },
  { label: "2 semanas", daysNeeded: 14, emoji: "🚀", story: "A circulação sanguínea melhorou significativamente." },
  { label: "21 dias — novo hábito", daysNeeded: 21, emoji: "🧠", story: "Um novo hábito se formou no seu cérebro." },
  { label: "30 dias campeão", daysNeeded: 30, emoji: "🏆", story: "A função pulmonar aumentou. Você é um campeão!" },
  { label: "90 dias lendário", daysNeeded: 90, emoji: "👑", story: "Seu risco de ataque cardíaco caiu significativamente." },
  { label: "1 ano livre", daysNeeded: 365, emoji: "🌟", story: "O risco de doença coronariana caiu pela metade." },
];

const Conquistas = () => {
  const navigate = useNavigate();
  const [selectedBadge, setSelectedBadge] = useState<typeof badgeDefinitions[0] | null>(null);

  const profile = useMemo(() => {
    const stored = localStorage.getItem("quitboost_profile");
    if (!stored) return null;
    return JSON.parse(stored);
  }, []);

  if (!profile) {
    navigate("/onboarding");
    return null;
  }

  const quitDate = new Date(profile.quitDate);
  const diffDays = Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <AppLayout>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Conquistas</h1>
          <p className="text-muted-foreground mb-8">
            {badgeDefinitions.filter(b => diffDays >= b.daysNeeded).length} de {badgeDefinitions.length} desbloqueadas
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {badgeDefinitions.map((badge, i) => {
            const unlocked = diffDays >= badge.daysNeeded;
            return (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => unlocked && setSelectedBadge(badge)}
                className={`rounded-2xl bg-card border p-6 text-center cursor-pointer transition-all hover:shadow-sm ${
                  unlocked ? "border-border" : "border-border opacity-40"
                }`}
              >
                <div className="text-4xl mb-3">{unlocked ? badge.emoji : "🔒"}</div>
                <p className="text-sm font-medium">{badge.label}</p>
                {unlocked && <p className="text-[10px] text-muted-foreground mt-1">Toque para ver</p>}
              </motion.div>
            );
          })}
        </div>

        {/* Badge story modal */}
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-card rounded-3xl border border-border p-8 max-w-sm w-full text-center shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">{selectedBadge.emoji}</div>
              <h3 className="text-lg font-semibold tracking-tight mb-2">{selectedBadge.label}</h3>
              <p className="text-muted-foreground text-sm mb-6">{selectedBadge.story}</p>
              <button
                onClick={() => setSelectedBadge(null)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default Conquistas;
