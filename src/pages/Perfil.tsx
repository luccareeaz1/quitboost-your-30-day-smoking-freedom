import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { User, Trophy, Flame, Calendar, Cigarette, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
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
  const diffDays = Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60 * 60 * 24));
  const cigarrosEvitados = diffDays * profile.cigarrosPorDia;
  const economia = cigarrosEvitados * profile.custoPorCigarro;

  const handleReset = () => {
    if (confirm("Tem certeza? Isso vai resetar todo seu progresso.")) {
      localStorage.removeItem("quitboost_profile");
      localStorage.removeItem("quitboost_craving_count");
      navigate("/onboarding");
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-6 max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-8">Perfil</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card border border-border p-6 mb-6 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold tracking-tight">Usuário</p>
          <p className="text-sm text-muted-foreground">Membro desde {quitDate.toLocaleDateString("pt-BR")}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { icon: Calendar, label: "Dias livres", value: diffDays },
            { icon: Flame, label: "Streak", value: `${diffDays} dias` },
            { icon: Cigarette, label: "Evitados", value: cigarrosEvitados.toLocaleString() },
            { icon: Wallet, label: "Economizado", value: `R$${economia.toFixed(0)}` },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-4"
            >
              <s.icon className="w-4 h-4 text-muted-foreground mb-1" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className="text-lg font-bold tracking-tight">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-card border border-border p-6 mb-6"
        >
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Seus dados</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cigarros por dia</span>
              <span className="font-medium">{profile.cigarrosPorDia}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Anos fumando</span>
              <span className="font-medium">{profile.anosFumando}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Custo por cigarro</span>
              <span className="font-medium">R${profile.custoPorCigarro.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gatilhos</span>
              <span className="font-medium">{profile.gatilhos?.join(", ") || "—"}</span>
            </div>
          </div>
        </motion.div>

        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-full text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleReset}
        >
          Resetar progresso
        </Button>
      </div>
    </AppLayout>
  );
};

export default Perfil;
