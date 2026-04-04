import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Zap, ArrowLeft, Loader2, CreditCard, Rocket, Target, Star, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const PLANS = [
  {
    id: "standard",
    name: "STANDARD",
    price: "39,90",
    priceId: "price_1TDaiH2N0nzreyfm7NzaopPG",
    desc: "Para começar sua jornada",
    badge: null as string | null,
    icon: Rocket,
    features: [
      "Protocolo de 30 dias",
      "Monitor de Saúde em Tempo Real",
      "Economia acumulada",
      "Conquistas e badges",
      "Comunidade",
    ],
  },
  {
    id: "elite",
    name: "ELITE",
    price: "197,90",
    priceId: "price_1TDaj82N0nzreyfmstYsVMTI",
    desc: "Resultados definitivos",
    badge: "MAIS POPULAR",
    icon: Target,
    features: [
      "Tudo do Standard",
      "Coach IA ilimitado",
      "Previsão de gatilhos",
      "Comunidade VIP",
      "Suporte prioritário 24/7",
      "Relatórios em PDF",
      "Protocolos anti-crise",
    ],
  },
];

const cardStyle = (selected: boolean) => ({
  position: "relative" as const,
  borderRadius: "32px",
  padding: "40px",
  border: selected ? "2px solid rgba(99, 102, 241, 0.4)" : "1px solid rgba(255,255,255,0.05)",
  background: selected ? "rgba(99, 102, 241, 0.05)" : "rgba(255,255,255,0.02)",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "100%",
  display: "flex",
  flexDirection: "column" as const,
  transform: selected ? "scale(1.02)" : "scale(1)",
  boxShadow: selected ? "0 20px 80px rgba(99, 102, 241, 0.2)" : "none",
});

export default function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("elite");
  const { user } = useAuth();

  const plan = PLANS.find(p => p.id === selectedPlan)!;

  const handlePayment = async () => {
    if (!user) {
      toast.error("Faça login para continuar.");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: plan.priceId },
      });

      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (error) {
      console.error("Erro no pagamento:", error);
      toast.error("Erro ao abrir checkout. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050a18] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-6xl relative z-10">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium font-bold tracking-widest text-white/20 uppercase mb-16 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> VOLTAR AO SISTEMA
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.03] text-sm font-medium font-bold tracking-widest text-indigo-400 uppercase mb-8">
            <ShieldCheck size={12} /> PAGAMENTO CRIPTOGRAFADO
          </div>
          <h1 className="text-6xl md:text-8xl font-extralight tracking-tight text-white mb-6">
            ESCOLHA SEU PLANO
          </h1>
          <p className="text-white/30 text-base tracking-widest font-bold uppercase max-w-md mx-auto">
            A CIÊNCIA DA SUA LIBERDADE
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {PLANS.map((p, i) => {
            const isSelected = selectedPlan === p.id;
            const Icon = p.icon;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedPlan(p.id)}
              >
                <div style={cardStyle(isSelected)}>
                  {p.badge && (
                    <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-indigo-500 text-white text-sm font-medium font-black tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.6)]">
                      {p.badge}
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-12">
                    <div className="flex items-center gap-5">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isSelected ? "bg-white text-[#050a18]" : "bg-white/5 text-white/30"}`}>
                        <Icon size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-extralight tracking-tight text-white mb-1">
                          {p.name}
                        </h3>
                        <p className="text-sm font-medium font-bold text-white/20 tracking-widest uppercase">{p.desc}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-12">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-black text-white/20">R$</span>
                      <span className="text-7xl font-extralight tracking-tight text-white">
                        {p.price.split(",")[0]}
                      </span>
                      <span className="text-2xl font-extralight text-white/40">
                        ,{p.price.split(",")[1]}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-white/5 mb-10" />

                  <ul className="space-y-4 mb-12 flex-1">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-sm font-medium ${isSelected ? "bg-indigo-400 text-[#050a18]" : "bg-white/5 text-white/20"}`}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className={`text-base font-medium font-bold tracking-[0.05em] uppercase ${isSelected ? "text-white/80" : "text-white/30"}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto text-center"
        >
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full h-20 rounded-2xl bg-white text-[#050a18] font-bold text-lg tracking-tight transition-all hover:scale-[1.03] active:scale-[0.98] shadow-2xl shadow-indigo-500/10 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <CreditCard size={20} />
                ASSINAR {plan.name} — R${plan.price}
              </>
            )}
          </button>
          
          <p className="mt-8 text-sm font-medium font-bold tracking-widest text-white/10 uppercase">
             7 DIAS DE GARANTIA TOTAL — SATISFAÇÃO OU REEMBOLSO
          </p>
        </motion.div>
      </div>
    </div>
  );
}
