import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Standard",
    price: "39,90",
    desc: "O essencial para começar",
    features: ["Plano de 30 dias", "Monitor de Saúde", "Economia em tempo real", "Badges", "Comunidade"],
    highlighted: false,
  },
  {
    name: "Elite",
    price: "197,90",
    desc: "Arsenal completo + Coach IA",
    features: ["Tudo do Standard +", "Coach IA ilimitado", "Previsão de Gatilhos", "Comunidade VIP", "Suporte 24/7", "Relatórios PDF", "Protocolos Anti-Crise"],
    highlighted: true,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-primary text-sm font-semibold mb-3">Planos</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Invista na sua liberdade
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            O custo de um mês de cigarro é maior que o investimento na sua nova vida.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 border-2 transition-all ${
                plan.highlighted ? "bg-primary/5 border-primary/30" : "bg-card border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                  <Star size={10} fill="currentColor" /> RECOMENDADO
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-bold">R${plan.price}</span>
                <span className="text-sm text-muted-foreground ml-1">/mês</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 ${plan.highlighted ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full h-12 rounded-xl font-semibold ${
                  plan.highlighted ? "bg-primary text-primary-foreground glow-green" : "bg-secondary text-foreground hover:bg-accent"
                }`}
                onClick={() => navigate("/checkout")}
              >
                Começar Agora
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
