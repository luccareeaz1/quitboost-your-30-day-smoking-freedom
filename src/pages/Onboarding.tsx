import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Wind, Cigarette, Clock, DollarSign, Brain, Sparkles, Loader2, CheckCircle2, Shield, Zap } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/lib/services";
import { toast } from "sonner";

interface OnboardingData {
  cigarrosPorDia: number;
  anosFumando: number;
  custoPorCigarro: number;
  gatilhos: string[];
}

const gatilhoOptions = [
  "Estresse", "Após refeições", "Café", "Álcool", "Socialização", "Tédio", "Ansiedade", "Ao dirigir",
];

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
  padding: "40px",
};

const Onboarding = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    cigarrosPorDia: 15,
    anosFumando: 5,
    custoPorCigarro: 1.5,
    gatilhos: [],
  });

  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [acceptedHealth, setAcceptedHealth] = useState(true);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isSubmitting) navigate("/auth");
  }, [user, navigate, isSubmitting]);

  const toggleGatilho = (g: string) => {
    setData(prev => ({
      ...prev,
      gatilhos: prev.gatilhos.includes(g) ? prev.gatilhos.filter(x => x !== g) : [...prev.gatilhos, g],
    }));
  };

  const finishOnboarding = async () => {
    if (!user) return;
    try {
      setIsSubmitting(true);
      await profileService.saveOnboarding(user.id, {
        cigarettes_per_day: data.cigarrosPorDia,
        years_smoking: data.anosFumando,
        price_per_cigarette: data.custoPorCigarro,
        triggers: data.gatilhos,
        quit_date: new Date().toISOString(),
        display_name: user.email?.split("@")[0],
      });

      await profileService.saveConsent(user.id, {
        policy_version: "2026.1",
        accepted_terms: true,
        accepted_health_data: true,
        marketing_consent: acceptedMarketing,
      });

      toast.success("Configuração concluída!");
      navigate("/checkout");
    } catch (error) {
      console.error("Erro no onboarding:", error);
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const numStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    fontWeight: 900,
    fontSize: "96px",
    color: "#FFFFFF",
    letterSpacing: "-0.06em",
    lineHeight: 1,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.35)",
    letterSpacing: "0.02em",
    marginTop: "8px",
  };

  const steps = [
    {
      icon: Cigarette,
      title: "Cigarros por dia",
      subtitle: "Quantos cigarros você fuma por dia?",
      content: (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={numStyle}>{data.cigarrosPorDia}</div>
            <div style={labelStyle}>cigarros / dia</div>
          </div>
          <input
            type="range" min={1} max={60} value={data.cigarrosPorDia}
            onChange={e => setData(d => ({ ...d, cigarrosPorDia: +e.target.value }))}
            style={{ width: "100%", accentColor: "#FFFFFF", cursor: "pointer", height: "4px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>1</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>60</span>
          </div>
        </div>
      ),
    },
    {
      icon: Clock,
      title: "Tempo fumando",
      subtitle: "Há quantos anos você fuma?",
      content: (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={numStyle}>{data.anosFumando}</div>
            <div style={labelStyle}>anos fumando</div>
          </div>
          <input
            type="range" min={1} max={50} value={data.anosFumando}
            onChange={e => setData(d => ({ ...d, anosFumando: +e.target.value }))}
            style={{ width: "100%", accentColor: "#FFFFFF", cursor: "pointer", height: "4px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>1 ano</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>50 anos</span>
          </div>
        </div>
      ),
    },
    {
      icon: DollarSign,
      title: "Custo por cigarro",
      subtitle: "Quanto custa cada cigarro?",
      content: (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ ...numStyle, fontSize: "72px" }}>R${data.custoPorCigarro.toFixed(2)}</div>
            <div style={labelStyle}>por cigarro</div>
          </div>
          <input
            type="range" min={0.2} max={10} step={0.1} value={data.custoPorCigarro}
            onChange={e => setData(d => ({ ...d, custoPorCigarro: +e.target.value }))}
            style={{ width: "100%", accentColor: "#FFFFFF", cursor: "pointer", height: "4px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>R$0,20</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>R$10,00</span>
          </div>
        </div>
      ),
    },
    {
      icon: Brain,
      title: "Seus gatilhos",
      subtitle: "O que costuma te dar vontade de fumar?",
      content: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {gatilhoOptions.map(g => {
            const selected = data.gatilhos.includes(g);
            return (
              <button
                key={g}
                onClick={() => toggleGatilho(g)}
                style={{
                  height: "52px",
                  borderRadius: "14px",
                  fontSize: "13px",
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 600,
                  border: selected ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  background: selected ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
                  color: selected ? "#FFFFFF" : "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: selected ? "scale(1.02)" : "scale(1)",
                }}
              >
                {g}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      icon: Shield,
      title: "Privacidade",
      subtitle: "Leia e aceite nossos termos para continuar.",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            {
              label: "Termos de Uso e Privacidade",
              desc: "Li e aceito os Termos de Uso e a Política de Privacidade.",
              links: (
                <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                  <Link to="/politica-de-privacidade" target="_blank" style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}>Privacidade</Link>
                  <Link to="/termos-de-uso" target="_blank" style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}>Termos</Link>
                </div>
              ),
              checked: acceptedTerms,
              toggle: () => setAcceptedTerms(!acceptedTerms),
            },
            {
              label: "Dados de saúde",
              desc: "Consinto no processamento dos meus dados de saúde para personalização do plano.",
              links: null,
              checked: acceptedHealth,
              toggle: () => setAcceptedHealth(!acceptedHealth),
            },
            {
              label: "Comunicações (opcional)",
              desc: "Desejo receber dicas semanais por e-mail.",
              links: null,
              checked: acceptedMarketing,
              toggle: () => setAcceptedMarketing(!acceptedMarketing),
            },
          ].map(item => (
            <div
              key={item.label}
              onClick={item.toggle}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                padding: "16px",
                borderRadius: "16px",
                border: item.checked ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.06)",
                background: item.checked ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{
                width: "22px", height: "22px", borderRadius: "8px", flexShrink: 0, marginTop: "2px",
                border: item.checked ? "1px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.15)",
                background: item.checked ? "rgba(255,255,255,0.15)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {item.checked && <CheckCircle2 size={13} style={{ color: "#FFFFFF" }} />}
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>{item.label}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{item.desc}</p>
                {item.links}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "700px", height: "300px",
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <header className="flex flex-col items-center mb-10 text-center">
          <div
            style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px",
              boxShadow: "0 0 24px rgba(255,255,255,0.15)",
            }}
          >
            <Wind size={28} style={{ color: "#050505" }} />
          </div>
          <h1 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 900, fontSize: "32px", letterSpacing: "-0.05em", color: "#FFFFFF", margin: 0, marginBottom: "8px" }}>
            QuitBoost
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>Configure seu perfil</p>
        </header>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "32px" }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1, height: "3px", borderRadius: "99px",
                background: i <= step ? "#FFFFFF" : "rgba(255,255,255,0.08)",
                transition: "background 0.4s ease",
              }}
            />
          ))}
        </div>

        {/* Step card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={card}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={22} style={{ color: "rgba(255,255,255,0.7)" }} />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 800, fontSize: "22px", letterSpacing: "-0.04em", color: "#FFFFFF", margin: 0 }}>
                  {currentStep.title}
                </h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "4px", fontWeight: 400 }}>
                  {currentStep.subtitle}
                </p>
              </div>
            </div>
            {currentStep.content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          {step > 0 && !isSubmitting ? (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                flex: 1, height: "56px", borderRadius: "16px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)", fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: "14px",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            >
              <ArrowLeft size={16} /> Voltar
            </button>
          ) : <div style={{ flex: 1 }} />}

          <button
            disabled={isSubmitting || (step === steps.length - 1 && (!acceptedTerms || !acceptedHealth))}
            onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : finishOnboarding()}
            style={{
              flex: 1.5, height: "56px", borderRadius: "16px",
              background: "#FFFFFF", color: "#050505",
              fontFamily: "'Geist', sans-serif", fontWeight: 700, fontSize: "14px",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: "0 4px 20px rgba(255,255,255,0.15)",
              transition: "all 0.2s", opacity: (isSubmitting || (step === steps.length - 1 && (!acceptedTerms || !acceptedHealth))) ? 0.4 : 1,
            }}
            onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,255,255,0.2)"; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,255,255,0.15)"; }}
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (
              step < steps.length - 1 ? <><span>Próximo</span><ArrowRight size={16} /></> : <><span>Finalizar</span><Sparkles size={16} /></>
            )}
          </button>
        </div>

        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "20px" }}>
          🔒 Dados protegidos · LGPD 2026
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
