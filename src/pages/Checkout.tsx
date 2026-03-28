import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap, ArrowLeft, Loader2, Sparkles, Star, Crown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SpaceBackground from "@/components/landing/SpaceBackground";

const PLANS = [
  {
    id: "standard",
    name: "Protocolo 30",
    price: "39,90",
    priceId: "price_1TDaiH2N0nzreyfm7NzaopPG",
    desc: "O essencial para sua virada",
    badge: null,
    features: [
      "Plano Clínico de 30 dias",
      "Monitor de Saúde em Tempo Real",
      "Cálculo de Lucro Acumulado",
      "Badges de Conquista",
      "Comunidade de Base",
    ],
  },
  {
    id: "elite",
    name: "Engenharia de Liberdade",
    price: "197,90",
    priceId: "price_1TDaj82N0nzreyfmstYsVMTI",
    desc: "Arsenal completo (VIP)",
    badge: "MAIS ESCOLHIDO",
    features: [
      "Tudo do Protocolo 30 +",
      "IA Coach Neural (Ilimitada)",
      "Previsão de Gatilhos com IA",
      "Acesso à Comunidade VIP",
      "Suporte Prioritário 24/7",
      "Relatórios de Performance PDF",
      "Protocolos Anti-Crises",
    ],
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("elite");
  const { user } = useAuth();

  const plan = PLANS.find(p => p.id === selectedPlan)!;

  const handlePayment = async () => {
    if (!user) {
      toast.error("Sua sessão expirou. Reconecte-se.");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: plan.priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (error: any) {
      console.error("Erro no pagamento:", error);
      toast.error("Erro ao iniciar checkout. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex items-center justify-center px-6 py-12 overflow-hidden">
      <SpaceBackground />
      
      <div className="w-full max-w-5xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <motion.button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-emerald-400 transition-all mb-12"
        >
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={16} />
          </div>
          Voltar
        </motion.button>

        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6 italic"
          >
            Invista na sua <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">Liberdade</span>.
          </motion.h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto font-medium">
            O custo de um mês de cigarro é maior que o investimento na sua nova vida. Comece a economizar hoje.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {PLANS.map((p, i) => {
            const isSelected = selectedPlan === p.id;
            const isElite = p.id === "elite";

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedPlan(p.id)}
                className={`relative cursor-pointer rounded-[3.5rem] p-10 border-2 transition-all duration-500 overflow-hidden group ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] scale-[1.02]"
                    : "border-white/5 bg-white/20 backdrop-blur-md hover:border-emerald-500/30"
                }`}
              >
                {p.badge && (
                  <div className="absolute top-6 right-6 bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                    <Star size={12} fill="currentColor" /> {p.badge}
                  </div>
                )}

                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isSelected ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-gray-400"}`}>
                    {isElite ? <Crown size={28} /> : <Zap size={28} />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">{p.name}</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{p.desc}</p>
                  </div>
                </div>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white tracking-tighter italic">R${p.price}</span>
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] ml-2">/mês</span>
                </div>

                <ul className="space-y-4 mb-2">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm font-medium text-gray-300">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-gray-600"}`}>
                         <Check size={12} strokeWidth={4} />
                      </div>
                      <span className={isSelected ? "text-white" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>
                
                {isSelected && (
                  <motion.div 
                    layoutId="selection-glow"
                    className="absolute inset-0 bg-emerald-500/5 pointer-events-none"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="max-w-xl mx-auto">
          <Button
            className="w-full h-20 rounded-[2.5rem] bg-emerald-500 text-black font-black text-base uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <div className="flex items-center gap-3">
                <Sparkles size={20} />
                Assinar {plan.name}
              </div>
            )}
          </Button>

          <footer className="mt-10 flex flex-col items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  key={i} 
                  className="w-9 h-9 rounded-full border-2 border-black bg-gray-900 overflow-hidden ring-2 ring-white/5"
                >
                  <img src={`https://i.pravatar.cc/150?u=qb${i}`} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
              <div className="h-9 px-4 rounded-full bg-emerald-500 text-black text-[10px] font-black flex items-center border-2 border-black shadow-lg">
                +4.2k usuários ativos
              </div>
            </div>
            
            <div className="flex items-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={14} /> PCI-DSS Secure
               </div>
               <div className="w-[1px] h-4 bg-white/20" />
               <div className="text-[10px] font-black uppercase tracking-widest">
                  Stripe Partner
               </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
