import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Crie sua conta", desc: "Responda algumas perguntas sobre seus hábitos." },
  { num: "02", title: "Receba seu plano", desc: "Um plano personalizado de 30 dias gerado automaticamente." },
  { num: "03", title: "Acompanhe o progresso", desc: "Dashboard em tempo real com economia, saúde e conquistas." },
];

const HowItWorksSection = () => (
  <section className="py-24 bg-secondary/50">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">
          Como funciona?
        </h2>
        <p className="text-muted-foreground text-lg">Simples, rápido e eficaz.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto rounded-full gradient-hero flex items-center justify-center mb-6 shadow-glow">
              <span className="text-2xl font-bold text-primary-foreground font-display">{s.num}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 font-display">{s.title}</h3>
            <p className="text-muted-foreground">{s.desc}</p>
            {i < 2 && (
              <div className="hidden md:block absolute right-0 top-1/2 w-16 h-0.5 bg-primary/20" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
