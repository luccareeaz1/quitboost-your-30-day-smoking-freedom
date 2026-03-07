import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    price: "39,90",
    desc: "Para quem quer começar",
    features: [
      "Plano personalizado de 30 dias",
      "Dashboard de progresso",
      "Contador de tempo sem fumar",
      "Cálculo de economia",
      "Registro diário (journal)",
      "Desafios básicos",
      "Conquistas e badges",
      "Notificações anti-craving",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "197,90",
    desc: "Para quem quer resultados máximos",
    features: [
      "Tudo do Basic +",
      "Coaching com IA",
      "Análise comportamental avançada",
      "Relatórios semanais detalhados",
      "Previsão de recaída com IA",
      "Comunidade premium",
      "Desafios exclusivos",
      "Relatórios PDF de progresso",
    ],
    highlighted: true,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">
            Escolha seu plano
          </h2>
          <p className="text-muted-foreground text-lg">Invista na sua saúde. Cancele quando quiser.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-3xl p-8 md:p-10 border ${
                plan.highlighted
                  ? "border-primary shadow-glow gradient-card"
                  : "border-border gradient-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-hero px-4 py-1 rounded-full text-sm font-semibold text-primary-foreground flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" /> Mais popular
                </div>
              )}
              <h3 className="text-2xl font-bold font-display mb-1">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold font-display">R${plan.price}</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlighted ? "hero" : "heroOutline"}
                size="lg"
                className="w-full h-12"
                onClick={() => navigate("/onboarding")}
              >
                Começar agora
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
