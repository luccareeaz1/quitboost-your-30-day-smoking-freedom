import { motion } from "framer-motion";

const steps = [
  { 
    num: "01", 
    title: "Crie seu perfil", 
    desc: "Responda um questionário rápido sobre seus hábitos. Em 2 minutos, criamos um plano personalizado para o seu perfil de fumante." 
  },
  { 
    num: "02", 
    title: "Receba suporte diário", 
    desc: "Nosso Coach IA te acompanha 24/7. Quando a vontade bater, ative o protocolo de respiração guiada e receba apoio imediato." 
  },
  { 
    num: "03", 
    title: "Celebre sua evolução", 
    desc: "Acompanhe a regeneração do seu corpo, a economia acumulada e conquiste badges. Tudo em tempo real, com dados reais." 
  },
];

const HowItWorksSection = () => (
  <section id="how" className="py-24 relative">
    <div className="container mx-auto px-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary text-sm font-semibold mb-3">Simples e eficaz</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Como funciona</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Três passos simples para começar sua vida livre do cigarro.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
              <span className="text-xl font-bold text-primary">{s.num}</span>
            </div>
            <h3 className="text-lg font-bold mb-3">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
