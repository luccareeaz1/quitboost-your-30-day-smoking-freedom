import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Elite",
    price: "39,90",
    desc: "Fundação para a liberdade",
    features: [
      "Protocolo de 30 dias",
      "Monitor de Fôlego & Saúde",
      "Contador de Tempo Real",
      "Cálculo de Lucro Acumulado",
      "Badges de Conquista",
      "Comunidade de Base",
    ],
    highlighted: false,
  },
  {
    name: "Titan",
    price: "197,90",
    desc: "Arsenal completo de guerra",
    features: [
      "Tudo do Elite +",
      "IA Coach Neural (Iliditada)",
      "Previsão de Gatilhos com IA",
      "Acesso à Elite Comunidade",
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
    <section className="py-32 bg-black text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-6 uppercase tracking-[0.2em] border border-primary/20">
            <Zap size={12} fill="currentColor" /> Investimento na Liberdade
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">PREÇO <span className="text-white/40">VS</span> VALOR.</h2>
          <p className="text-white/50 text-xl font-medium max-w-2xl mx-auto">Um maço custa saúde. O QuitBoost custa liberdade.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-[3rem] p-10 md:p-14 border transition-all duration-500 overflow-hidden ${
                plan.highlighted 
                  ? "bg-primary text-black border-transparent shadow-[0_0_80px_rgba(var(--primary),0.3)] scale-105 z-10" 
                  : "bg-white/5 text-white border-white/10 hover:border-white/20"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-6 right-10 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                  <Star size={12} fill="currentColor" /> Recomendado
                </div>
              )}
              
              <h3 className="text-3xl font-black tracking-tighter mb-2 uppercase">{plan.name}</h3>
              <p className={`text-sm font-bold mb-10 ${plan.highlighted ? "text-black/60" : "text-white/40"}`}>{plan.desc}</p>
              
              <div className="mb-12">
                <span className="text-6xl font-black tracking-tighter italic">R${plan.price}</span>
                <span className={`text-sm font-bold ml-2 ${plan.highlighted ? "text-black/60" : "text-white/40"}`}>/ único</span>
              </div>
              
              <ul className="space-y-4 mb-12">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-4 text-sm font-bold">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-black" : "text-primary"}`} strokeWidth={3} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                variant={plan.highlighted ? "secondary" : "default"}
                size="lg"
                className={`w-full h-16 rounded-full text-lg font-black uppercase tracking-widest transition-all ${
                  plan.highlighted 
                    ? "bg-black text-white hover:bg-black/90" 
                    : "bg-primary text-black hover:scale-105 shadow-lg"
                }`}
                onClick={() => navigate("/onboarding")}
              >
                Ativar Minha Resiliência
              </Button>

              {plan.highlighted && (
                <motion.div 
                  className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 blur-[60px] rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
