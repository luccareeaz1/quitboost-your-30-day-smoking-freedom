import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/utils/analytics";


const plans = [
  {
    name: "Essencial",
    price: "39,90",
    desc: "O ponto de partida para sua nova vida.",
    features: [
      "Protocolo Científico de 30 dias",
      "Monitor de Saúde em Tempo Real",
      "Cálculo de Lucro Acumulado",
      "Galeria de Conquistas",
      "Acesso à Comunidade",
    ],
    highlighted: false,
  },
  {
    name: "Premium",
    price: "197,90",
    desc: "Aceleração total com inteligência neural.",
    features: [
      "Tudo do Essencial +",
      "IA Coach QuitBoost (Ilimitada)",
      "Análise Preditiva de Gatilhos",
      "Acesso à Comunidade VIP",
      "Protocolos Anti-Crises Exclusivos",
      "Relatórios de Saúde Semanais",
      "Suporte Prioritário",
    ],
    highlighted: true,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="precos" className="py-32 bg-white overflow-hidden relative border-y border-slate-50">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-50 rounded-full blur-[100px] -ml-40 -mb-40" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 shadow-sm border border-blue-100 mb-8">
            <Zap size={14} fill="currentColor" /> 
            <span className="text-[10px] font-bold uppercase tracking-widest">Inicie sua Liberdade</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight text-slate-900 leading-[1.1]">
            Um investimento em <span className="text-blue-600">vida.</span>
          </h2>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            O custo do vício é a sua saúde. O custo do <span className="text-blue-600 font-bold">QuitBoost</span> é a sua vitória definitiva.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative rounded-3xl p-10 md:p-12 border transition-all duration-300 ${
                plan.highlighted
                  ? "bg-white border-blue-600 shadow-2xl shadow-blue-100 scale-105 z-10"
                  : "bg-white border-slate-200 hover:border-blue-200"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-8 right-8 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Star size={12} fill="currentColor" /> Recomendado
                </div>
              )}

              <h3 className="text-2xl font-black tracking-tight mb-2 uppercase text-slate-900">{plan.name}</h3>
              <p className="text-xs font-bold text-slate-400 mb-10 leading-relaxed">
                {plan.desc}
              </p>

              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tighter text-slate-900">R${plan.price}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ único</span>
              </div>

              <ul className="space-y-4 mb-12">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-4 text-xs font-bold text-slate-600">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-blue-600" : "text-slate-300"}`} strokeWidth={4} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? "default" : "outline"}
                className={`w-full h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => {
                  trackEvent("pricing_plan_click", { plan: plan.name });
                  navigate("/checkout", { state: { plan } });
                }}

              >
                Garantir meu Plano
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
