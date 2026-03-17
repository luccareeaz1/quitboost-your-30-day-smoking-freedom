import { motion } from "framer-motion";
import { Users, Cigarette, Wallet, TrendingUp } from "lucide-react";

const stats = [
  { icon: Users, value: "15.2k", label: "Pessoas Libertadas" },
  { icon: Cigarette, value: "3.1M", label: "Cigarros Evitados" },
  { icon: Wallet, value: "R$ 12M+", label: "Capital Recuperado" },
  { icon: TrendingUp, value: "98%", label: "Taxa de Sucesso" },
];

const SocialProofSection = () => (
  <section className="py-24 bg-white border-y border-gray-100">
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="text-center group"
          >
            <div className="w-12 h-12 mx-auto mb-6 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
               <s.icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2 italic">
              {s.value}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProofSection;
