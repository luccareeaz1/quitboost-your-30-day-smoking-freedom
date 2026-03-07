import { motion } from "framer-motion";
import { Users, Cigarette, Wallet } from "lucide-react";

const stats = [
  { icon: Users, value: "12.847", label: "Usuários ativos" },
  { icon: Cigarette, value: "2.4M", label: "Cigarros evitados" },
  { icon: Wallet, value: "R$8.2M", label: "Economizados" },
];

const SocialProofSection = () => (
  <section className="py-16 gradient-dark">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-4xl md:text-5xl font-bold text-primary-foreground font-display mb-1">{s.value}</p>
            <p className="text-primary-foreground/60 text-sm">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProofSection;
