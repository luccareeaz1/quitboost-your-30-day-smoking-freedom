import { motion } from "framer-motion";
import { Heart, Wind, Ruler, Globe } from "lucide-react";

interface CuriousStatsProps {
  diffHours: number;
  cigarrosEvitados: number;
}

const CuriousStats = ({ diffHours, cigarrosEvitados }: CuriousStatsProps) => {
  // ~72 bpm average heart rate, beats per hour
  const heartbeats = Math.floor(diffHours * 72 * 60);
  // Average ~7.5L air per minute
  const airLiters = Math.floor(diffHours * 60 * 7.5);
  // Average cigarette = 8.4cm
  const stackedMeters = (cigarrosEvitados * 0.084).toFixed(1);
  // Brazil sells ~300 billion cigarettes/year ≈ ~570k per minute
  const cigarrosBrasilDesde = Math.floor(diffHours * 60 * 570000);

  const stats = [
    {
      icon: Heart,
      color: "text-primary",
      label: "Batidas de coração limpas",
      value: heartbeats.toLocaleString(),
    },
    {
      icon: Wind,
      color: "text-primary",
      label: "Litros de ar puro respirados",
      value: `${airLiters.toLocaleString()} L`,
    },
    {
      icon: Ruler,
      color: "text-streak",
      label: "Cigarros empilhados teriam",
      value: `${stackedMeters} m`,
    },
    {
      icon: Globe,
      color: "text-destructive",
      label: "Cigarros vendidos no Brasil desde que parou",
      value: cigarrosBrasilDesde.toLocaleString(),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mt-6 rounded-2xl gradient-card border border-border p-6"
    >
      <h3 className="text-lg font-semibold font-display mb-4">📊 Dados curiosos</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="text-center p-3">
            <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
            <p className="text-lg font-bold font-display">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CuriousStats;
