import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Mapeamento Neural", desc: "Analisamos seus padrões de fumo e gatilhos psicológicos em segundos." },
  { num: "02", title: "Ativação do Plano", desc: "Seu protocolo personalizado de 30 dias é gerado pela nossa IA." },
  { num: "03", title: "Execução & Vitória", desc: "Dashboard em tempo real. Suporte 24/7. Liberdade garantida." },
];

const HowItWorksSection = () => (
  <section className="py-32 bg-black text-white">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-24"
      >
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">O CAMINHO DA <span className="text-primary">ELITE</span>.</h2>
        <p className="text-white/40 text-xl font-medium">Três passos entre você e sua nova vida.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center group"
          >
            <div className="relative w-24 h-24 mx-auto mb-8">
               <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-all" />
               <div className="relative w-full h-full rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-all">
                <span className="text-3xl font-black italic text-primary">{s.num}</span>
               </div>
            </div>
            <h3 className="text-xl font-bold mb-4 tracking-tight uppercase group-hover:text-primary transition-colors">{s.title}</h3>
            <p className="text-white/40 text-sm font-medium leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
