import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Sparkles } from "lucide-react";
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
    <section className="py-32 bg-white text-gray-900 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold mb-6 uppercase tracking-[0.2em] border border-green-100">
            <Zap size={12} fill="currentColor" /> Escolha seu Plano
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Um investimento em <span className="text-primary italic">vida.</span></h2>
          <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto italic">O custo do vício é a sua saúde. O custo do QuitBoost é a sua liberdade.</p>
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
                  ? "bg-white border-primary shadow-2xl shadow-green-500/20 scale-105 z-10" 
                  : "bg-gray-50 border-gray-100 hover:border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-8 right-10 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                  <Star size={12} fill="currentColor" /> Recomendado
                </div>
              )}
              
              <h3 className="text-3xl font-black tracking-tight mb-2 uppercase">{plan.name}</h3>
              <p className={`text-sm font-bold mb-10 ${plan.highlighted ? "text-gray-600" : "text-gray-400"}`}>{plan.desc}</p>
              
              <div className="mb-12">
                <span className="text-5xl font-black tracking-tighter italic text-gray-900">R${plan.price}</span>
                <span className={`text-sm font-bold ml-2 ${plan.highlighted ? "text-gray-500" : "text-gray-400"}`}>/ único</span>
              </div>
              
              <ul className="space-y-4 mb-12">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-4 text-sm font-semibold text-gray-600">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-primary" : "text-gray-300"}`} strokeWidth={3} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
                className={`w-full h-16 rounded-full text-md font-bold uppercase tracking-widest transition-all ${
                  plan.highlighted 
                    ? "bg-primary text-white hover:bg-green-600 shadow-xl shadow-green-500/30" 
                    : "border-gray-200 text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => navigate("/onboarding")}
              >
                Inicar Protocolo
              </Button>

              {plan.highlighted && (
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-500/5 blur-[50px] rounded-full" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
