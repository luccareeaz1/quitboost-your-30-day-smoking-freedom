import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap, ArrowLeft, Loader2, Sparkles, CreditCard, Landmark, Star, Crown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const plans = [
  {
    id: "standard",
    name: "Standard",
    price: "39,90",
    desc: "O essencial para começar",
    badge: null,
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
    name: "Elite",
    price: "197,90",
    desc: "Arsenal completo de liberdade",
    badge: "Recomendado",
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
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
  const { user } = useAuth();

  const plan = plans.find(p => p.id === selectedPlan)!;

  const handlePayment = async () => {
    if (!user) {
      toast.error("Sua sessão expirou. Reconecte-se.");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      await new Promise(r => setTimeout(r, 2500));

      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan: plan.id,
          status: 'active',
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success(`Pagamento aprovado! Bem-vindo ao plano ${plan.name}.`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no pagamento:", error);
      toast.error("Erro no processamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all mb-10"
        >
          <div className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={14} />
          </div>
          Voltar
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Escolha seu <span className="text-primary">Plano</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mt-3 max-w-md mx-auto">
            Invista na sua saúde. Retorno garantido em qualidade de vida.
          </p>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {plans.map((p, i) => {
            const isSelected = selectedPlan === p.id;
            const isElite = p.id === "elite";

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedPlan(p.id)}
                className={`relative cursor-pointer rounded-3xl p-8 border-2 transition-all duration-300 ${
                  isSelected
                    ? "border-primary bg-card shadow-lg scale-[1.02]"
                    : "border-border bg-card/50 hover:border-muted-foreground/30"
                }`}
              >
                {/* Badge */}
                {p.badge && (
                  <div className="absolute -top-3 right-6 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Star size={10} fill="currentColor" /> {p.badge}
                  </div>
                )}

                {/* Radio */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isElite ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {isElite ? <Crown size={20} /> : <Zap size={20} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground tracking-tight">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-all ${
                    isSelected ? "border-primary bg-primary" : "border-border"
                  }`}>
                    {isSelected && <Check size={14} className="text-primary-foreground" strokeWidth={3} />}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-foreground tracking-tight">R${p.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">/ único</span>
                </div>

                {/* Features */}
                <ul className="space-y-2.5">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-foreground/80">
                      <Check className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground/50"}`} strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-lg mx-auto"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4 text-center">
            Método de Pagamento
          </p>

          <div className="space-y-3 mb-8">
            <div
              onClick={() => setPaymentMethod("card")}
              className={`p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === "card"
                  ? "bg-foreground text-background shadow-lg"
                  : "bg-card border border-border hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={20} />
                <span className="text-sm font-semibold">Cartão de Crédito</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                paymentMethod === "card" ? "border-background bg-primary" : "border-border"
              }`} />
            </div>

            <div
              onClick={() => setPaymentMethod("pix")}
              className={`p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === "pix"
                  ? "bg-foreground text-background shadow-lg"
                  : "bg-card border border-border hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <Landmark size={20} />
                <span className="text-sm font-semibold">Pix Imediato</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                paymentMethod === "pix" ? "border-background bg-primary" : "border-border"
              }`} />
            </div>
          </div>

          {/* CTA */}
          <Button
            className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-bold text-sm tracking-wide shadow-xl hover:opacity-90 active:scale-[0.98] transition-all"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                Confirmar — R${plan.price}
              </div>
            )}
          </Button>

          {/* Social proof */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-background bg-muted overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="h-7 px-2.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center border-2 border-background">
                +2.4k hoje
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Pagamento seguro com criptografia SSL
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
