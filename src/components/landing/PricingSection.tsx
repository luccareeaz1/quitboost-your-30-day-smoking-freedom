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
    desc: "Para resultados máximos",
    features: [
      "Tudo do Basic +",
      "Coaching com IA",
      "Análise comportamental avançada",
      "Relatórios semanais",
      "Previsão de recaída com IA",
      "Comunidade premium",
      "Desafios exclusivos",
      "Relatórios PDF",
    ],
    highlighted: true,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Escolha seu plano</h2>
          <p className="text-muted-foreground text-lg">Invista na sua saúde. Cancele quando quiser.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-3xl p-8 md:p-10 border bg-card ${
                plan.highlighted ? "border-foreground shadow-lg" : "border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" /> Mais popular
                </div>
              )}
              <h3 className="text-xl font-bold tracking-tight mb-1">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight">R${plan.price}</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
                className="w-full h-12 rounded-full"
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
