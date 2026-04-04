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
    name: "Standard",
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
    name: "Elite",
    price: "197,90",
    priceId: "price_1TDaj82N0nzreyfmstYsVMTI",
    desc: "Para resultados definitivos",
    badge: "Mais popular",
    icon: Target,
    features: [
      "Tudo do Standard",
      "Coach IA ilimitado",
      "Previsão de gatilhos com IA",
      "Comunidade VIP",
      "Suporte prioritário 24/7",
      "Relatórios em PDF",
      "Protocolos anti-crise",
    ],
  },
];

const cardStyle = (selected: boolean): React.CSSProperties => ({
  position: "relative",
  borderRadius: "24px",
  padding: "32px",
  border: selected ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.07)",
  background: selected ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
  cursor: "pointer",
  transition: "all 0.25s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transform: selected ? "scale(1.015)" : "scale(1)",
  boxShadow: selected ? "0 20px 40px rgba(0,0,0,0.4)" : "none",
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
      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (error) {
      console.error("Erro no pagamento:", error);
      toast.error("Erro ao abrir checkout. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Ambient */}
      <div
        className="absolute top-[-5%] left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "800px", height: "300px",
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-5xl relative z-10">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            fontSize: "13px", fontWeight: 500, fontFamily: "'Geist', sans-serif",
            color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer",
            marginBottom: "48px", transition: "color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
        >
          <ArrowLeft size={15} />
          Voltar
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "6px 14px", borderRadius: "99px",
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
              fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)",
              marginBottom: "20px",
            }}
          >
            <ShieldCheck size={12} /> Pagamento seguro
          </div>
          <h1
            style={{
              fontFamily: "'Geist', sans-serif", fontWeight: 900,
              fontSize: "clamp(40px, 8vw, 72px)", color: "#FFFFFF",
              letterSpacing: "-0.05em", lineHeight: 1, margin: "0 0 16px",
            }}
          >
            Escolha seu plano.
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", fontWeight: 400, maxWidth: "400px", margin: "0 auto" }}>
            Pare de fumar de uma vez. Garantia de 7 dias.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {PLANS.map((p, i) => {
            const isSelected = selectedPlan === p.id;
            const Icon = p.icon;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ height: "100%" }}
                onClick={() => setSelectedPlan(p.id)}
              >
                <div style={cardStyle(isSelected)}>
                  {p.badge && (
                    <div style={{
                      position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                      background: "#FFFFFF", color: "#050505",
                      padding: "4px 16px", borderRadius: "99px",
                      fontSize: "11px", fontWeight: 700, fontFamily: "'Geist', sans-serif",
                      display: "flex", alignItems: "center", gap: "5px",
                      boxShadow: "0 4px 16px rgba(255,255,255,0.15)",
                    }}>
                      <Star size={10} fill="currentColor" /> {p.badge}
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "14px",
                        background: isSelected ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isSelected ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={22} style={{ color: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.35)" }} />
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.04em", color: "#FFFFFF", margin: "0 0 4px" }}>
                          {p.name}
                        </h3>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>{p.desc}</p>
                      </div>
                    </div>
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "50%",
                      border: isSelected ? "2px solid #FFFFFF" : "2px solid rgba(255,255,255,0.15)",
                      background: isSelected ? "#FFFFFF" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, transition: "all 0.2s",
                    }}>
                      {isSelected && <Check size={13} strokeWidth={3} style={{ color: "#050505" }} />}
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>R$</span>
                      <span style={{ fontFamily: "'Geist', sans-serif", fontWeight: 900, fontSize: "52px", letterSpacing: "-0.05em", color: "#FFFFFF" }}>
                        {p.price.split(",")[0]}
                      </span>
                      <span style={{ fontFamily: "'Geist', sans-serif", fontWeight: 700, fontSize: "24px", color: "rgba(255,255,255,0.5)", letterSpacing: "-0.03em" }}>
                        ,{p.price.split(",")[1]}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginTop: "2px" }}>pagamento único</p>
                  </div>

                  <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "20px" }} />

                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "18px", height: "18px", borderRadius: "6px", flexShrink: 0,
                          background: isSelected ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Check size={11} strokeWidth={3} style={{ color: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.25)" }} />
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: isSelected ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)" }}>
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
          className="max-w-md mx-auto"
        >
          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              width: "100%", height: "64px", borderRadius: "20px",
              background: "#FFFFFF", color: "#050505",
              fontFamily: "'Geist', sans-serif", fontWeight: 700, fontSize: "15px",
              letterSpacing: "-0.01em", border: "none", cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              boxShadow: "0 8px 32px rgba(255,255,255,0.18)",
              transition: "all 0.25s ease",
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,255,255,0.25)"; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,255,255,0.18)"; }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              <>
                <CreditCard size={18} />
                Assinar plano {plan.name} — R${plan.price}
              </>
            )}
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
            {["💳 Stripe Secure", "🔒 Criptografado", "↩ 7 dias garantia"].map(item => (
              <span key={item} style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
