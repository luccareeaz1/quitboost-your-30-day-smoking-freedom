import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Timer, Wallet, Cigarette, Trophy, Heart, Wind,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import AppLayout from "@/components/app/AppLayout";
import CravingModal from "@/components/dashboard/CravingModal";
import StreakCard from "@/components/dashboard/StreakCard";
import CuriousStats from "@/components/dashboard/CuriousStats";
import HealthTimeline from "@/components/dashboard/HealthTimeline";
import DailyChallenge from "@/components/dashboard/DailyChallenge";

interface Profile {
  cigarrosPorDia: number;
  anosFumando: number;
  custoPorCigarro: number;
  gatilhos: string[];
  quitDate: string;
}

const dayPhrases: Record<string, string> = {
  "0": "A jornada começa agora. Cada segundo conta.",
  "1": "Primeiro dia completo. Você é mais forte do que imagina.",
  "2": "Dois dias! Seu corpo já está se recuperando.",
  "3": "Três dias! Sua respiração já está melhorando.",
  "7": "Uma semana inteira! Você é inspiração.",
  "14": "Duas semanas! Imparável.",
  "21": "21 dias — um novo hábito se formou.",
  "30": "30 dias! Você é um campeão absoluto.",
};

function getMotivationalPhrase(days: number): string {
  if (dayPhrases[String(days)]) return dayPhrases[String(days)];
  if (days > 30) return `${days} dias livre. Você reescreveu sua história.`;
  if (days > 21) return "Reta final dos 30 dias. Quase lá.";
  if (days > 14) return "Mais de duas semanas. Seu corpo agradece.";
  if (days > 7) return "Mais de uma semana! Continue assim.";
  if (days > 3) return "Cada dia é uma vitória. Siga em frente.";
  return "Os primeiros dias são os mais difíceis. Você consegue.";
}

function getEmergencyButtonText(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return "Bom dia sem cigarro";
  if (hour >= 9 && hour < 12) return "Resista à vontade matinal";
  if (hour >= 12 && hour < 14) return "Pós-almoço: respire fundo";
  if (hour >= 14 && hour < 18) return "Tarde livre de cigarro";
  if (hour >= 18 && hour < 21) return "Noite tranquila";
  return "Durma bem, acorde livre";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [showCraving, setShowCraving] = useState(false);
  const [moneyEmoji, setMoneyEmoji] = useState<{ show: boolean; emoji: string; x: number; y: number }>({ show: false, emoji: "", x: 0, y: 0 });

  const cravingCount = useMemo(() => {
    return parseInt(localStorage.getItem("quitboost_craving_count") || "0", 10);
  }, [showCraving]);

  const profile: Profile | null = useMemo(() => {
    const stored = localStorage.getItem("quitboost_profile");
    if (!stored) return null;
    return JSON.parse(stored);
  }, []);

  useEffect(() => {
    if (!profile) {
      navigate("/onboarding");
      return;
    }
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [profile, navigate]);

  if (!profile) return null;

  const quitDate = new Date(profile.quitDate);
  const diffMs = now.getTime() - quitDate.getTime();
  const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const diffHours = diffSeconds / 3600;
  const diffDays = Math.floor(diffHours / 24);
  const hours = Math.floor(diffHours % 24);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  const cigarrosEvitados = Math.floor((diffDays + (diffHours % 24) / 24) * profile.cigarrosPorDia);
  const economia = cigarrosEvitados * profile.custoPorCigarro;

  const handleMoneyClick = (e: React.MouseEvent) => {
    const emojis = ["🎉", "💰", "🤑", "💸", "✨"];
    setMoneyEmoji({ show: true, emoji: emojis[Math.floor(Math.random() * emojis.length)], x: e.clientX, y: e.clientY });
    setTimeout(() => setMoneyEmoji(prev => ({ ...prev, show: false })), 1200);
  };

  const handleCravingClick = () => {
    const count = parseInt(localStorage.getItem("quitboost_craving_count") || "0", 10);
    localStorage.setItem("quitboost_craving_count", String(count + 1));
    setShowCraving(true);
  };

  return (
    <AppLayout>
      {/* Floating money emoji */}
      <AnimatePresence>
        {moneyEmoji.show && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -80, scale: 2 }}
            exit={{ opacity: 0 }}
            className="fixed z-[100] pointer-events-none text-4xl"
            style={{ left: moneyEmoji.x - 20, top: moneyEmoji.y - 20 }}
          >
            {moneyEmoji.emoji}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6">
        {/* Motivational phrase */}
        <motion.p
          key={diffDays}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-muted-foreground mb-8"
        >
          {getMotivationalPhrase(diffDays)}
        </motion.p>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Tempo sem fumar</p>
          <div className="flex items-center justify-center gap-6 md:gap-10">
            {[
              { val: diffDays, label: "dias" },
              { val: hours, label: "horas" },
              { val: minutes, label: "min" },
              { val: seconds, label: "seg" },
            ].map(t => (
              <div key={t.label} className="text-center">
                <div className="text-5xl md:text-7xl font-bold tracking-tight">
                  {String(t.val).padStart(2, "0")}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{t.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Emergency button */}
        <div className="flex justify-center mb-12">
          <Button
            variant="outline"
            size="lg"
            onClick={handleCravingClick}
            className="rounded-full h-12 px-8 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            {getEmergencyButtonText()}
            {cravingCount > 0 && (
              <span className="ml-2 text-xs opacity-60">· Resistiu {cravingCount}x</span>
            )}
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-card border border-border p-6"
          >
            <Cigarette className="w-5 h-5 text-muted-foreground mb-3" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Cigarros evitados</p>
            <p className="text-3xl font-bold tracking-tight mt-1">{cigarrosEvitados.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-card border border-border p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleMoneyClick}
          >
            <Wallet className="w-5 h-5 text-muted-foreground mb-3" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Economizado</p>
            <p className="text-3xl font-bold tracking-tight mt-1 text-apple-green">R${economia.toFixed(2)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Toque para comemorar</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card border border-border p-6"
          >
            <Trophy className="w-5 h-5 text-muted-foreground mb-3" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Conquistas</p>
            <p className="text-3xl font-bold tracking-tight mt-1">
              {diffDays >= 30 ? 4 : diffDays >= 7 ? 3 : diffDays >= 1 ? 2 : 1}/4
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <StreakCard days={diffDays} />
          <DailyChallenge />
        </div>

        {/* Health Timeline */}
        <HealthTimeline diffHours={diffHours} />

        {/* Curious Stats */}
        <CuriousStats diffHours={diffHours} cigarrosEvitados={cigarrosEvitados} />
      </div>

      <CravingModal open={showCraving} onClose={() => setShowCraving(false)} />
    </AppLayout>
  );
};

export default Dashboard;
