import { motion } from "framer-motion";
import { Users, Cigarette, Wallet } from "lucide-react";

const stats = [
  { icon: Users, value: "12.847", label: "Pessoas livres" },
  { icon: Cigarette, value: "2.4M", label: "Cigarros evitados" },
  { icon: Wallet, value: "R$8.2M", label: "Economizados" },
];

const SocialProofSection = () => (
  <section className="py-20 bg-background border-t border-border">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <s.icon className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
            <p className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-1">{s.value}</p>
            <p className="text-muted-foreground text-sm">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProofSection;
