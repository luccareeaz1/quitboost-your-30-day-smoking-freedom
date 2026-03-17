import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Mapeamento Comportamental", desc: "Analisamos seus padrões de fumo e gatilhos psicológicos em segundos." },
  { num: "02", title: "Ativação do Plano", desc: "Seu protocolo personalizado de 30 dias é gerado pela nossa IA Neural." },
  { num: "03", title: "Execução & Liberdade", desc: "Dashboard em tempo real com suporte 24/7. Liberdade física e financeira." },
];

const HowItWorksSection = () => (
  <section className="py-32 bg-gray-50 text-gray-900">
    <div className="container mx-auto px-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-24"
      >
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900">Como o <span className="text-primary italic">QuitBoost</span> guia você?</h2>
        <p className="text-gray-500 text-xl font-medium">Três etapas fundamentais entre você e sua nova vida saudável.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center group"
          >
            <div className="relative w-20 h-20 mx-auto mb-10">
               <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full group-hover:bg-primary/20 transition-all" />
               <div className="relative w-full h-full rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:border-primary/50 transition-all shadow-sm">
                <span className="text-2xl font-black italic text-primary">{s.num}</span>
               </div>
            </div>
            <h3 className="text-xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors">{s.title}</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
