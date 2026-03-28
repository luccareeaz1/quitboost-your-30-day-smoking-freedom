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
    <section className="py-32 bg-transparent text-white overflow-hidden relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-6 uppercase tracking-[0.2em] border border-primary/20">
            <Zap size={12} fill="currentColor" /> Escolha seu Plano
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter italic">Um investimento em <span className="text-primary">vida.</span></h2>
          <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto italic leading-relaxed">O custo do vício é a sua saúde. O custo do QuitBoost é a sua liberdade. Recupere o controle hoje mesmo.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative rounded-[3rem] p-12 md:p-14 border transition-all duration-500 overflow-hidden ${
                plan.highlighted 
                  ? "bg-white/[0.03] border-primary/30 shadow-[0_0_100px_rgba(255,255,255,0.02)] scale-105 z-10 backdrop-blur-3xl" 
                  : "bg-white/[0.01] border-white/5 hover:border-white/10"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-8 right-10 bg-primary text-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                  <Star size={12} fill="currentColor" /> Recomendado
                </div>
              )}
              
              <h3 className="text-4xl font-black tracking-tighter mb-2 uppercase italic">{plan.name}</h3>
              <p className={`text-sm font-bold mb-12 ${plan.highlighted ? "text-white/60" : "text-white/30"}`}>{plan.desc}</p>
              
              <div className="mb-14">
                <span className="text-6xl font-black tracking-tighter italic text-white flex items-baseline gap-2">
                    R${plan.price}
                    <span className={`text-sm font-bold tracking-widest uppercase ${plan.highlighted ? "text-white/40" : "text-white/20"}`}>/ único</span>
                </span>
              </div>
              
              <ul className="space-y-5 mb-14">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-4 text-sm font-bold text-white/50">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-primary" : "text-white/10"}`} strokeWidth={4} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
                className={`w-full h-16 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all ${
                  plan.highlighted 
                    ? "bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                    : "border-white/10 text-white/40 hover:bg-white/5"
                }`}
                onClick={() => navigate("/checkout", { state: { plan } })}
              >
                Ativar Minha Liberdade
              </Button>

              {plan.highlighted && (
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
