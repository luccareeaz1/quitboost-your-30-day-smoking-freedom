import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Timer, Wallet, Cigarette, Trophy, Heart, Flame, Wind,
  Leaf, BookOpen, AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CravingModal from "@/components/dashboard/CravingModal";
import StreakCard from "@/components/dashboard/StreakCard";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [showCraving, setShowCraving] = useState(false);

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

  const cigarrosEvitados = Math.floor((diffDays + diffHours / 24) * profile.cigarrosPorDia);
  const economia = cigarrosEvitados * profile.custoPorCigarro;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-dark py-6 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Leaf className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary-foreground font-display">QuitBoost</span>
          </div>
          <Button variant="craving" size="sm" onClick={() => setShowCraving(true)}>
            <AlertTriangle className="w-4 h-4 mr-1" /> Estou com vontade
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
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
          {[
            { icon: Cigarette, label: "Cigarros evitados", value: cigarrosEvitados.toLocaleString(), color: "text-primary" },
            { icon: Wallet, label: "Dinheiro economizado", value: `R$${economia.toFixed(2)}`, color: "text-success" },
            { icon: Trophy, label: "Conquistas", value: diffDays >= 30 ? "5/5" : diffDays >= 7 ? "3/5" : diffDays >= 1 ? "2/5" : "1/5", color: "text-streak" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl gradient-card border border-border p-6"
            >
              <s.icon className={`w-8 h-8 ${s.color} mb-3`} />
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-3xl font-bold font-display mt-1">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Streak */}
          <StreakCard days={diffDays} />

          {/* Health milestones */}
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
                  <div key={m.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm ${completed ? "text-foreground font-medium" : "text-muted-foreground"}`}>{m.label}</span>
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
            {[
              { label: "Primeiro passo", unlocked: true },
              { label: "24h sem fumar", unlocked: diffDays >= 1 },
              { label: "7 dias livre", unlocked: diffDays >= 7 },
              { label: "30 dias campeão", unlocked: diffDays >= 30 },
            ].map(b => (
              <div
                key={b.label}
                className={`p-4 rounded-xl text-center border ${
                  b.unlocked ? "border-streak bg-streak/10" : "border-border bg-muted/30 opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{b.unlocked ? "🏆" : "🔒"}</div>
                <p className="text-xs font-medium">{b.label}</p>
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
