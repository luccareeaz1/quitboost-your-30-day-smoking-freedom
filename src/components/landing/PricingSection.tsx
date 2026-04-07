import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Standard",
    price: "39,90",
    desc: "O essencial para começar",
    features: [
      "Protocolo de 30 dias",
      "Monitor de Saúde em Tempo Real",
      "Cálculo de Lucro Acumulado",
      "Badges de Conquista",
      "Comunidade de Base",
    ],
    highlighted: false,
  },
  {
    name: "Elite",
    price: "197,90",
    desc: "Arsenal completo de liberdade",
    features: [
      "Tudo do Standard +",
      "IA Coach Neural (Ilimitada)",
      "Previsão de Gatilhos com IA",
      "Acesso à Comunidade VIP",
      "Suporte Prioritário 24/7",
      "Relatórios de Performance PDF",
      "Protocolos Anti-Crises",
    ],
    highlighted: true,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="precos" className="py-32 bg-background overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium font-bold mb-6 uppercase tracking-widest border border-primary/20">
            <Zap size={12} fill="currentColor" /> Escolha seu Plano
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-foreground">
            Um investimento em <span className="text-primary italic">vida.</span>
          </h2>
          <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto italic">
            O custo do vício é a sua saúde. O custo do freesh é a sua liberdade.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative rounded-[2.5rem] p-10 md:p-14 border transition-all duration-500 ${
                plan.highlighted
                  ? "bg-card border-primary/30 shadow-2xl shadow-primary/10 scale-105 z-10"
                  : "bg-card/50 border-border hover:border-border/80"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-8 right-10 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                  <Star size={12} fill="currentColor" /> Recomendado
                </div>
              )}

              <h3 className="text-3xl font-black tracking-tight mb-2 uppercase text-foreground">{plan.name}</h3>
              <p className={`text-sm font-bold mb-10 ${plan.highlighted ? "text-muted-foreground" : "text-muted-foreground/70"}`}>
                {plan.desc}
              </p>

              <div className="mb-12">
                <span className="text-5xl font-black tracking-tighter italic text-foreground">R${plan.price}</span>
                <span className="text-sm font-bold ml-2 text-muted-foreground">/ único</span>
              </div>

              <ul className="space-y-4 mb-12">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-4 text-sm font-semibold text-muted-foreground">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-primary" : "text-muted-foreground/40"}`} strokeWidth={3} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
                className={`w-full h-16 rounded-full text-md font-black uppercase tracking-widest transition-all ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/30"
                    : "border-border text-muted-foreground hover:bg-secondary"
                }`}
                onClick={() => navigate("/checkout", { state: { plan } })}
              >
                Iniciar Protocolo
              </Button>

              {plan.highlighted && (
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 blur-[50px] rounded-full" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
