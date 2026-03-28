import { motion } from "framer-motion";

const steps = [
  { 
    num: "01", 
    title: "Mapeamento Neural", 
    desc: "Nossa tecnologia analisa seus gatilhos comportamentais em segundos. Entendemos sua relação com o vício para criar o caminho de menor resistência." 
  },
  { 
    num: "02", 
    title: "Suporte Ativo 24/7", 
    desc: "Diferente de apps comuns, nossa IA não apenas monitora — ela intervém. Se a fissura bater, seu Coach IA estará pronto com protocolos científicos." 
  },
  { 
    num: "03", 
    title: "Resgate de Liberdade", 
    desc: "Acompanhe sua regeneração biológica e economia financeira em tempo real. Celebre vitórias com uma comunidade que fala sua língua." 
  },
];

const HowItWorksSection = () => (
  <section className="py-32 bg-transparent relative">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-24"
      >
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white italic">A Engenharia da Liberdade</h2>
        <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto italic">Parar de fumar não é sobre força de vontade. É sobre o sistema certo.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative"
          >
            <div className="text-8xl font-black text-white/[0.03] absolute -top-10 -left-4 italic pointer-events-none">{s.num}</div>
            <h3 className="text-2xl font-black mb-4 tracking-tighter text-white uppercase italic">{s.title}</h3>
            <p className="text-white/40 text-sm font-medium leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
