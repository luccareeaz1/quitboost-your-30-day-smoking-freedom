import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Crie sua conta", desc: "Responda algumas perguntas sobre seus hábitos." },
  { num: "02", title: "Receba seu plano", desc: "Um plano personalizado de 30 dias gerado automaticamente." },
  { num: "03", title: "Acompanhe o progresso", desc: "Dashboard em tempo real com economia, saúde e conquistas." },
];

const HowItWorksSection = () => (
  <section className="py-24 bg-muted/50">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Como funciona?</h2>
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
            <div className="w-16 h-16 mx-auto rounded-full bg-foreground text-background flex items-center justify-center mb-6">
              <span className="text-lg font-bold">{s.num}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 tracking-tight">{s.title}</h3>
            <p className="text-muted-foreground text-sm">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
