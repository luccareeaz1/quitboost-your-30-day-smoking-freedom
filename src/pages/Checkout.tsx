import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap, ArrowLeft, Loader2, Sparkles, Star, Crown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SpaceBackground from "@/components/landing/SpaceBackground";

const PLANS = [
  {
    id: "standard", name: "Standard", price: "39,90",
    priceId: "price_1TDaiH2N0nzreyfm7NzaopPG",
    desc: "O essencial para começar",
    features: ["Plano de 30 dias", "Monitor de Saúde", "Economia em tempo real", "Badges de Conquista", "Comunidade"],
  },
  {
    id: "elite", name: "Elite", price: "197,90",
    priceId: "price_1TDaj82N0nzreyfmstYsVMTI",
    desc: "Arsenal completo + Coach IA",
    badge: "RECOMENDADO",
    features: ["Tudo do Standard +", "Coach IA ilimitado", "Previsão de Gatilhos", "Comunidade VIP", "Suporte 24/7", "Relatórios PDF", "Protocolos Anti-Crise"],
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("elite");
  const { user } = useAuth();
  const plan = PLANS.find(p => p.id === selectedPlan)!;

  const handlePayment = async () => {
    if (!user) { toast.error("Sessão expirada."); navigate("/auth"); return; }
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', { body: { priceId: plan.priceId } });
      if (error) throw error;
      if (data?.url) setTimeout(() => { window.location.href = data.url; }, 800);
      else throw new Error("URL não recebida");
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error("Erro ao iniciar pagamento.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative flex items-center justify-center px-6 py-12 overflow-hidden">
      <SpaceBackground />
      
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-16 h-16 rounded-2xl border-4 border-primary/20 border-t-primary mb-8" />
            <h3 className="text-xl font-bold mb-2">Processando...</h3>
            <p className="text-sm text-muted-foreground">Redirecionando para o pagamento</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl relative z-10">
        <button onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-10">
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Escolha seu plano
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            O custo de um mês de cigarro é maior que o investimento na sua nova vida.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          {PLANS.map((p) => {
            const isSelected = selectedPlan === p.id;
            return (
              <motion.div key={p.id} onClick={() => setSelectedPlan(p.id)}
                className={`relative cursor-pointer rounded-2xl p-8 border-2 transition-all ${
                  isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"
                }`}>
                {p.badge && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> {p.badge}
                  </div>
                )}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isSelected ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {p.id === "elite" ? <Crown size={22} /> : <Zap size={22} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">R${p.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">/mês</span>
                </div>
                <ul className="space-y-3">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check size={14} className={`mt-0.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={isSelected ? "text-foreground" : "text-muted-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <div className="max-w-md mx-auto">
          <Button className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold text-base glow-green"
            onClick={handlePayment} disabled={loading}>
            <Sparkles size={18} className="mr-2" /> Assinar {plan.name}
          </Button>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><ShieldCheck size={14} /> PCI-DSS Secure</div>
            <span>•</span>
            <span>Stripe Partner</span>
          </div>
        </div>
      </div>
    </div>
  );
}
