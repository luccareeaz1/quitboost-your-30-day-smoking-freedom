import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Wallet, Flame, Calendar } from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import { useNavigate } from "react-router-dom";

const Progresso = () => {
  const navigate = useNavigate();

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
  const now = new Date();
  const diffMs = now.getTime() - quitDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  const cigarrosEvitados = diffDays * profile.cigarrosPorDia;
  const economia = cigarrosEvitados * profile.custoPorCigarro;

  const weeklyData = Array.from({ length: Math.min(diffWeeks + 1, 8) }, (_, i) => ({
    week: `Sem ${i + 1}`,
    cigarros: i === 0 ? profile.cigarrosPorDia * 7 : 0,
    economia: profile.cigarrosPorDia * profile.custoPorCigarro * 7,
  }));

  return (
    <AppLayout>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Progresso</h1>
          <p className="text-muted-foreground mb-8">Análise detalhada da sua jornada.</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Calendar, label: "Dias sem fumar", value: diffDays },
            { icon: TrendingDown, label: "Cigarros evitados", value: cigarrosEvitados.toLocaleString() },
            { icon: Wallet, label: "Economia total", value: `R$${economia.toFixed(2)}` },
            { icon: Flame, label: "Streak atual", value: `${diffDays} dias` },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-card border border-border p-5"
            >
              <s.icon className="w-5 h-5 text-muted-foreground mb-2" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-bold tracking-tight mt-1">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Simple bar chart visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-card border border-border p-6"
        >
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">Economia semanal</h3>
          <div className="flex items-end gap-3 h-40">
            {weeklyData.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-foreground/10 rounded-t-lg transition-all"
                  style={{ height: `${Math.min(100, ((i + 1) / weeklyData.length) * 100)}%` }}
                />
                <p className="text-[10px] text-muted-foreground mt-2">{w.week}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Progresso;
