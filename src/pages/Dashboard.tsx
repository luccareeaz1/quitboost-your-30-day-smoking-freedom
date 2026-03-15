import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import { 
  Heart, Wind, Activity, Wallet, Cigarette, 
  MessageCircle, Target, Trophy, Flame, CheckCircle2,
  AlertTriangle, Sparkles
} from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import CravingModal from "@/components/dashboard/CravingModal";
import StreakCard from "@/components/dashboard/StreakCard";
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [showCraving, setShowCraving] = useState(false);
  const [moneyEmoji, setMoneyEmoji] = useState<{ show: boolean; emoji: string; x: number; y: number }>({ show: false, emoji: "", x: 0, y: 0 });

  const profile: Profile | null = useMemo(() => {
    const stored = localStorage.getItem("quitboost_profile");
    if (!stored) return null;
    return JSON.parse(stored);
  }, []);

  const cravingCount = useMemo(() => {
    return parseInt(localStorage.getItem("quitboost_craving_count") || "0", 10);
  }, [showCraving]);

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
  
  const daysFormatted = Math.floor(diffSeconds / (3600 * 24));
  const hoursFormatted = Math.floor((diffSeconds % (3600 * 24)) / 3600);
  const minutesFormatted = Math.floor((diffSeconds % 3600) / 60);
  const secondsFormatted = diffSeconds % 60;
  const diffHours = diffSeconds / 3600;

  const avoidedCount = Math.floor((diffSeconds / (3600 * 24)) * profile.cigarrosPorDia);
  const moneySaved = avoidedCount * profile.custoPorCigarro;

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
      <div className="container mx-auto px-6 space-y-12 animate-fade-in pb-20">
        
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

        {/* HEADER SECTION */}
        <header className="text-center space-y-4 pt-10">
          <motion.p 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
            className="text-muted-foreground uppercase tracking-widest text-xs font-semibold"
          >
            {getMotivationalPhrase(daysFormatted)}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-semibold tracking-tighter"
          >
            Breathe Again.
          </motion.h1>
        </header>

        {/* CORE TIMER (Priority 1) */}
        <section className="flex flex-col items-center justify-center">
          <AppleCard className="p-10 sm:p-14 text-center max-w-3xl w-full shadow-elevated">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-8 font-medium">Tempo sem fumar</p>
            <div className="grid grid-cols-4 gap-4 sm:gap-8 divide-x divide-border">
              <div className="flex flex-col items-center">
                <span className="text-5xl sm:text-7xl font-bold tracking-tighter">{daysFormatted}</span>
                <span className="text-xs text-muted-foreground mt-2 font-medium uppercase">Dias</span>
              </div>
              <div className="flex flex-col items-center pl-4 sm:pl-8">
                <span className="text-5xl sm:text-7xl font-bold tracking-tighter">{String(hoursFormatted).padStart(2, "0")}</span>
                <span className="text-xs text-muted-foreground mt-2 font-medium uppercase">Horas</span>
              </div>
              <div className="flex flex-col items-center pl-4 sm:pl-8">
                <span className="text-5xl sm:text-7xl font-bold tracking-tighter">{String(minutesFormatted).padStart(2, "0")}</span>
                <span className="text-xs text-muted-foreground mt-2 font-medium uppercase">Minutos</span>
              </div>
              <div className="flex flex-col items-center pl-4 sm:pl-8">
                <span className="text-5xl sm:text-7xl font-bold tracking-tighter text-muted-foreground/40">{String(secondsFormatted).padStart(2, "0")}</span>
                <span className="text-xs text-muted-foreground mt-2 font-medium uppercase">Segundos</span>
              </div>
            </div>
          </AppleCard>
        </section>

        {/* EMERGENCY BUTTON */}
        <div className="flex justify-center -mt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={handleCravingClick}
            className="rounded-full h-12 px-8 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            {getEmergencyButtonText()}
            {cravingCount > 0 && (
              <span className="ml-2 text-xs opacity-60">· Resistiu {cravingCount}x</span>
            )}
          </Button>
        </div>

        {/* SECONDARY STATS (Priority 2 & 3) */}
        <div className="grid sm:grid-cols-2 gap-6">
          <AppleCard 
            className="p-8 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow" 
            onClick={handleMoneyClick}
          >
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Economia Total</p>
              <p className="text-4xl font-semibold tracking-tight text-apple-green">R${moneySaved.toFixed(2)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Toque para comemorar</p>
            </div>
            <Wallet className="h-8 w-8 text-muted-foreground/30" />
          </AppleCard>
          <AppleCard className="p-8 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Cigarros Evitados</p>
              <p className="text-4xl font-semibold tracking-tight">{avoidedCount.toLocaleString()}</p>
            </div>
            <Cigarette className="h-8 w-8 text-muted-foreground/30" />
          </AppleCard>
        </div>

        {/* STREAK & ACHIEVEMENTS */}
        <div className="grid md:grid-cols-2 gap-6">
          <StreakCard days={daysFormatted} />
          <AppleCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Conquistas Recentes</h2>
              <Button variant="link" onClick={() => navigate("/conquistas")} className="text-xs text-muted-foreground">Ver Todas</Button>
            </div>
            <div className="flex gap-4">
              {[
                { title: "Início", icon: Trophy, color: "text-orange-500" },
                { title: "3 Dias", icon: Trophy, color: "text-blue-500" },
              ].map((ach, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-center p-4 border border-border/50 rounded-2xl bg-secondary/20">
                  <ach.icon className={`h-8 w-8 ${ach.color} mb-2`} />
                  <p className="text-xs font-semibold">{ach.title}</p>
                </div>
              ))}
            </div>
          </AppleCard>
        </div>

        {/* CHALLENGES & AI COACH (Priority 4) */}
        <div className="grid md:grid-cols-2 gap-6">
          <DailyChallenge />
          <AppleCard className="p-8 cursor-pointer group" onClick={() => navigate("/coach")}>
            <h2 className="text-xl font-semibold tracking-tight mb-6 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              Coach IA
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground font-medium italic">"Você está indo muito bem! Lembre-se que cada cigarro evitado é uma vitória para sua saúde."</p>
              <Button variant="outline" className="w-full mt-4 rounded-full font-medium h-11 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">Conversar com o Coach</Button>
            </div>
          </AppleCard>
        </div>

        {/* HEALTH TIMELINE (Priority 5) */}
        <HealthTimeline diffHours={diffHours} />

      </div>

      <CravingModal open={showCraving} onClose={() => setShowCraving(false)} />
    </AppLayout>
  );
}
