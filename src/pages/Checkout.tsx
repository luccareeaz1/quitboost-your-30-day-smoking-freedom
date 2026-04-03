import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap, ArrowLeft, Loader2, Sparkles, Star, Crown, ShieldCheck, CreditCard, Rocket, Target } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppleCard } from "@/components/ui/apple-card";

const PLANS = [
  {
    id: "standard",
    name: "Standard Protocol",
    price: "39,90",
    priceId: "price_1TDaiH2N0nzreyfm7NzaopPG",
    desc: "Fundação para o despertar",
    badge: null,
    icon: Rocket,
    features: [
      "Protocolo de 30 dias",
      "Monitor de Saúde em Tempo Real",
      "Cálculo de Lucro Acumulado",
      "Badges de Conquista",
      "Comunidade de Base",
    ],
  },
  {
    id: "elite",
    name: "Elite Tactical",
    price: "197,90",
    priceId: "price_1TDaj82N0nzreyfmstYsVMTI",
    desc: "Supremacia total de liberdade",
    badge: "Alta Performance",
    icon: Target,
    features: [
      "Tudo do Standard +",
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
      toast.error("Sincronização perdida. Reinicie o sistema.");
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
        window.open(data.url, '_blank');
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (error) {
      console.error("Erro no pagamento:", error);
      toast.error("Falha ao abrir portal de pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Immersive Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse duration-5000" />

      <div className="w-full max-w-6xl relative z-10 font-sans">
        {/* Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary transition-all mb-16 italic"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:shadow-glow transition-all">
            <ArrowLeft size={16} />
          </div>
          Recuar
        </motion.button>

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 italic animate-fade-in shadow-glow">
            <ShieldCheck size={12} /> Autorização de Missão
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">
            Ative sua <span className="text-primary italic drop-shadow-glow">Soberania.</span>
          </h1>
          <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.5em] mt-6 max-w-md mx-auto leading-relaxed italic">
            Selecione o seu protocolo de libertação para iniciar a reconexão.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {PLANS.map((p, i) => {
            const isSelected = selectedPlan === p.id;
            const isElite = p.id === "elite";
            const Icon = p.icon;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                onClick={() => setSelectedPlan(p.id)}
                className="h-full"
              >
                <AppleCard 
                  className={`relative cursor-pointer rounded-[3rem] p-10 border transition-all duration-500 h-full flex flex-col ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-glow scale-[1.03]"
                      : "border-white/10 bg-white/5 hover:border-white/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  {p.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic shadow-glow">
                      <Zap size={12} fill="currentColor" /> {p.badge}
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center border ${isElite ? "bg-primary border-primary text-white shadow-glow" : "bg-white/5 border-white/10 text-white/40"}`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{p.name}</h3>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-2 italic">{p.desc}</p>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      isSelected ? "border-primary bg-primary text-white shadow-glow" : "border-white/20"
                    }`}>
                      {isSelected && <Check size={16} strokeWidth={4} />}
                    </div>
                  </div>

                  <div className="mb-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[13px] font-black text-primary uppercase italic mr-1">R$</span>
                      <span className="text-6xl font-black text-white tracking-tighter italic">{p.price.split(',')[0]}</span>
                      <span className="text-2xl font-black text-white/60 tracking-tighter italic">,{p.price.split(',')[1]}</span>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-3 italic">/ Ciclo Solar</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/10 mb-10 w-full" />

                  <ul className="space-y-4 mb-10 flex-1">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-4 text-[11px] font-black text-white/70 uppercase italic tracking-tight">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-primary/20 text-primary border border-primary/20" : "bg-white/5 text-white/20 border border-white/10"}`}>
                          <Check className="w-3 h-3" strokeWidth={4} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isElite && (
                    <div className="mt-auto p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.1em] italic leading-tight">
                        ⚡ OTIMIZAÇÃO NEURAL INCLUSA
                      </p>
                    </div>
                  )}
                </AppleCard>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-xl mx-auto">
          <Button
            className="w-full h-20 rounded-[2rem] bg-white text-black font-black italic uppercase tracking-[0.2em] text-[13px] shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all group overflow-hidden"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <div className="flex items-center gap-4">
                <CreditCard size={20} className="group-hover:rotate-12 transition-transform" />
                Validar Acesso {plan.name} — R${plan.price}
                <Sparkles size={20} className="text-primary animate-pulse" />
              </div>
            )}
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

          <div className="mt-10 flex flex-col items-center gap-6">
            {/* Social Trust */}
            <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-black overflow-hidden ring-1 ring-white/10">
                    <img src={`https://i.pravatar.cc/150?u=${i + 60}`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="h-px w-6 bg-white/10" />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">
                +4.2k <span className="text-primary italic">Comandantes</span> Ativos
              </p>
            </div>

            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-center italic mt-4 leading-loose">
              💳 PAGAMENTO CRIPTOGRAFADO • STRIPE SECURE GATEWAY<br />
              TERMINE O SEU VÍCIO OU SOLICITE REEMBOLSO EM 7 DIAS.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
