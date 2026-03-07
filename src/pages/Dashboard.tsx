import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Timer, Wallet, Cigarette, Trophy, Heart, Flame, Wind,
  Leaf, BookOpen, AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import CravingModal from "@/components/dashboard/CravingModal";
import StreakCard from "@/components/dashboard/StreakCard";
import CuriousStats from "@/components/dashboard/CuriousStats";

interface Profile {
  cigarrosPorDia: number;
  anosFumando: number;
  custoPorCigarro: number;
  gatilhos: string[];
  quitDate: string;
}

const healthMilestones = [
  { hours: 0.33, label: "Pressão arterial normaliza", icon: Heart },
  { hours: 8, label: "Oxigênio no sangue normaliza", icon: Wind },
  { hours: 24, label: "Risco de infarto diminui", icon: Heart },
  { hours: 48, label: "Olfato e paladar melhoram", icon: Leaf },
  { hours: 72, label: "Respiração melhora", icon: Wind },
  { hours: 720, label: "Circulação melhora", icon: Heart },
];

const dayPhrases: Record<string, string> = {
  "0": "A jornada começa agora. Cada segundo conta! 🌱",
  "1": "Primeiro dia completo. Você é mais forte do que imagina! 💪",
  "2": "Dois dias! Seu corpo já está se recuperando. 🌿",
  "3": "Três dias! Sua respiração já está melhorando. 🌬️",
  "7": "Uma semana inteira! Você é inspiração! 🔥",
  "14": "Duas semanas! Metade do caminho. Imparável! 🚀",
  "21": "21 dias — um novo hábito se formou! 🧠",
  "30": "30 DIAS! Você é um campeão absoluto! 🏆👑",
};

function getMotivationalPhrase(days: number): string {
  if (dayPhrases[String(days)]) return dayPhrases[String(days)];
  if (days > 30) return `${days} dias livre! Você reescreveu sua história! ✨`;
  if (days > 21) return "Reta final dos 30 dias. Você está quase lá! 🎯";
  if (days > 14) return "Mais de duas semanas. Seu corpo agradece! 💚";
  if (days > 7) return "Mais de uma semana! Continue assim! 🌟";
  if (days > 3) return "Cada dia é uma vitória. Siga em frente! 🏅";
  return "Os primeiros dias são os mais difíceis. Você consegue! 💪";
}

function getEmergencyButtonText(): { text: string; icon: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return { text: "Bom dia sem cigarro!", icon: "☀️" };
  if (hour >= 9 && hour < 12) return { text: "Resista à vontade matinal", icon: "💪" };
  if (hour >= 12 && hour < 14) return { text: "Depois do almoço é difícil, né?", icon: "🍽️" };
  if (hour >= 14 && hour < 18) return { text: "Tarde sem cigarro = vitória", icon: "🏆" };
  if (hour >= 18 && hour < 21) return { text: "Noite tranquila sem fumar", icon: "🌙" };
  return { text: "Durma limpo, acorde livre", icon: "😴" };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [showCraving, setShowCraving] = useState(false);
  const [moneyEmoji, setMoneyEmoji] = useState<{ show: boolean; emoji: string; x: number; y: number }>({ show: false, emoji: "", x: 0, y: 0 });
  const [prevCigarros, setPrevCigarros] = useState<number | null>(null);
  const [cigarroPulse, setCigarroPulse] = useState(false);
  const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set());
  const [badgeStory, setBadgeStory] = useState<string | null>(null);

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

  // Pulse effect on cigarette counter change
  if (prevCigarros !== null && cigarrosEvitados !== prevCigarros) {
    if (!cigarroPulse) setCigarroPulse(true);
    setTimeout(() => setCigarroPulse(false), 600);
  }
  if (prevCigarros !== cigarrosEvitados) setPrevCigarros(cigarrosEvitados);

  // Badge definitions
  const badges = [
    { label: "Primeiro passo", unlocked: true, story: "Você tomou a decisão mais importante: começar. O primeiro passo é sempre o mais difícil." },
    { label: "24h sem fumar", unlocked: diffDays >= 1, story: "Suas primeiras 24 horas! Seu corpo já começou a se recuperar. O monóxido de carbono caiu para zero." },
    { label: "7 dias livre", unlocked: diffDays >= 7, story: "Uma semana inteira! As terminações nervosas começam a se regenerar. Olfato e paladar estão voltando." },
    { label: "30 dias campeão", unlocked: diffDays >= 30, story: "30 dias! A circulação melhorou, a função pulmonar aumentou. Você é oficialmente um campeão!" },
  ];

  // Confetti on new badge unlock
  const currentUnlocked = new Set(badges.filter(b => b.unlocked).map(b => b.label));
  if (currentUnlocked.size > unlockedBadges.size) {
    const newBadges = [...currentUnlocked].filter(b => !unlockedBadges.has(b));
    if (newBadges.length > 0) {
      setTimeout(() => {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ["#2a9d62", "#f5a623", "#ffffff"] });
      }, 300);
      setUnlockedBadges(currentUnlocked);
    }
  }

  // Dynamic background based on days
  const bgProgress = Math.min(diffDays / 30, 1);
  const bgHue = 150; // green
  const bgSat = Math.round(5 + bgProgress * 15);
  const bgLight = Math.round(96 - bgProgress * 2);
  const dynamicBg = `hsl(${bgHue}, ${bgSat}%, ${bgLight}%)`;

  const handleMoneyClick = (e: React.MouseEvent) => {
    const emojis = ["🎉", "💰", "🤑", "💸", "🥳", "✨", "🎊"];
    setMoneyEmoji({
      show: true,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: e.clientX,
      y: e.clientY,
    });
    setTimeout(() => setMoneyEmoji(prev => ({ ...prev, show: false })), 1200);
  };

  const handleCravingClick = () => {
    const count = parseInt(localStorage.getItem("quitboost_craving_count") || "0", 10);
    localStorage.setItem("quitboost_craving_count", String(count + 1));
    setShowCraving(true);
  };

  const emergencyBtn = getEmergencyButtonText();

  return (
    <div className="min-h-screen transition-colors duration-1000" style={{ backgroundColor: dynamicBg }}>
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

      {/* Badge story modal */}
      <AnimatePresence>
        {badgeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setBadgeStory(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-card rounded-2xl border border-border p-8 max-w-sm w-full text-center shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">🏆</div>
              <p className="text-foreground font-medium">{badgeStory}</p>
              <Button variant="ghost" className="mt-4" onClick={() => setBadgeStory(null)}>Fechar</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="gradient-dark py-6 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Leaf className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary-foreground font-display">QuitBoost</span>
          </div>
          <div className="flex items-center gap-3">
            {cravingCount > 0 && (
              <span className="text-xs text-primary-foreground/70 font-medium">
                Resistiu {cravingCount}x 💪
              </span>
            )}
            <Button variant="craving" size="sm" onClick={handleCravingClick}>
              <AlertTriangle className="w-4 h-4 mr-1" /> {emergencyBtn.text}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Motivational phrase */}
        <motion.p
          key={diffDays}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm font-medium text-primary mb-6"
        >
          {getMotivationalPhrase(diffDays)}
        </motion.p>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-sm text-muted-foreground mb-2">Seu tempo sem fumar</p>
          <div className="flex items-center justify-center gap-4">
            {[
              { val: diffDays, label: "dias" },
              { val: hours, label: "horas" },
              { val: minutes, label: "min" },
              { val: seconds, label: "seg" },
            ].map(t => (
              <div key={t.label} className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-primary font-display animate-count-up">
                  {String(t.val).padStart(2, "0")}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Cigarros evitados - with pulse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl gradient-card border border-border p-6 transition-transform ${cigarroPulse ? "scale-105" : ""}`}
          >
            <Cigarette className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Cigarros evitados</p>
            <motion.p
              key={cigarrosEvitados}
              initial={{ scale: 1.2, color: "hsl(152, 60%, 40%)" }}
              animate={{ scale: 1, color: "hsl(var(--foreground))" }}
              className="text-3xl font-bold font-display mt-1"
            >
              {cigarrosEvitados.toLocaleString()}
            </motion.p>
          </motion.div>

          {/* Dinheiro economizado - clickable */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl gradient-card border border-border p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleMoneyClick}
          >
            <Wallet className="w-8 h-8 text-success mb-3" />
            <p className="text-sm text-muted-foreground">Dinheiro economizado</p>
            <p className="text-3xl font-bold font-display mt-1 text-success">R${economia.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Clique para comemorar! 🎉</p>
          </motion.div>

          {/* Conquistas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl gradient-card border border-border p-6"
          >
            <Trophy className="w-8 h-8 text-streak mb-3" />
            <p className="text-sm text-muted-foreground">Conquistas</p>
            <p className="text-3xl font-bold font-display mt-1">
              {badges.filter(b => b.unlocked).length}/{badges.length}
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Streak */}
          <StreakCard days={diffDays} />

          {/* Health milestones - with breathing hover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl gradient-card border border-border p-6"
          >
            <h3 className="text-lg font-semibold font-display mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" /> Progresso de saúde
            </h3>
            <div className="space-y-4">
              {healthMilestones.map(m => {
                const completed = diffHours >= m.hours;
                const progress = Math.min(100, (diffHours / m.hours) * 100);
                return (
                  <div key={m.label} className="group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="flex items-center gap-2">
                        <m.icon className={`w-4 h-4 transition-transform duration-700 group-hover:scale-125 ${
                          m.icon === Wind || m.icon === Heart
                            ? "group-hover:animate-breathe"
                            : ""
                        } ${completed ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-sm ${completed ? "text-foreground font-medium" : "text-muted-foreground"}`}>{m.label}</span>
                      </span>
                      {completed && <span className="text-xs text-primary font-semibold">✓</span>}
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-hero rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Curious stats */}
        <CuriousStats diffHours={diffHours} cigarrosEvitados={cigarrosEvitados} />

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 rounded-2xl gradient-card border border-border p-6"
        >
          <h3 className="text-lg font-semibold font-display mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-streak" /> Conquistas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map(b => (
              <div
                key={b.label}
                onDoubleClick={() => b.unlocked && setBadgeStory(b.story)}
                className={`p-4 rounded-xl text-center border cursor-pointer transition-transform hover:scale-105 ${
                  b.unlocked ? "border-streak bg-streak/10" : "border-border bg-muted/30 opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{b.unlocked ? "🏆" : "🔒"}</div>
                <p className="text-xs font-medium">{b.label}</p>
                {b.unlocked && <p className="text-[10px] text-muted-foreground mt-1">Duplo clique para ver</p>}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <CravingModal open={showCraving} onClose={() => setShowCraving(false)} />
    </div>
  );
};

export default Dashboard;
