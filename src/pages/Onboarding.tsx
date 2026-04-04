import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Wind, Cigarette, Clock, DollarSign, Brain, Sparkles, Loader2, CheckCircle2, Shield, Package } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/lib/services";
import { toast } from "sonner";

interface OnboardingData {
  cigarrosPorDia: number;
  cigarrosPorMaco: number;
  custoPorMaco: number;
  anosFumando: number;
}

const Onboarding = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    cigarrosPorDia: 15,
    cigarrosPorMaco: 20,
    custoPorMaco: 12.0,
    anosFumando: 5,
  });

  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [acceptedHealth, setAcceptedHealth] = useState(true);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isSubmitting) navigate("/auth");
  }, [user, navigate, isSubmitting]);

  const finishOnboarding = async () => {
    if (!user) return;
    try {
      setIsSubmitting(true);
      // We calculate price_per_cigarette based on price per pack / cigarettes per pack
      const pricePerCigarette = data.custoPorMaco / data.cigarrosPorMaco;

      await profileService.saveOnboarding(user.id, {
        cigarettes_per_day: data.cigarrosPorDia,
        years_smoking: data.anosFumando,
        price_per_cigarette: pricePerCigarette,
        triggers: [],
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

  const steps = [
    {
      icon: Cigarette,
      title: "O seu hábito tabágico",
      subtitle: "Em média, quantos fumas por dia?",
      content: (
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <div className="text-[96px] font-black tracking-tight text-foreground leading-none">{data.cigarrosPorDia}</div>
            <div className="text-sm font-medium text-muted-foreground mt-2">cigarros / dia</div>
          </div>
          <input
            type="range" min={1} max={60} value={data.cigarrosPorDia}
            onChange={e => setData(d => ({ ...d, cigarrosPorDia: +e.target.value }))}
            className="w-full accent-black cursor-pointer h-1"
          />
          <div className="flex justify-between w-full text-xs text-muted-foreground">
            <span>1</span>
            <span>60</span>
          </div>
        </div>
      ),
    },
    {
      icon: Package,
      title: "O seu hábito tabágico",
      subtitle: "Quantos num maço?",
      content: (
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <div className="text-[96px] font-black tracking-tight text-foreground leading-none">{data.cigarrosPorMaco}</div>
            <div className="text-sm font-medium text-muted-foreground mt-2">cigarros no maço</div>
          </div>
          <input
            type="range" min={5} max={40} value={data.cigarrosPorMaco}
            onChange={e => setData(d => ({ ...d, cigarrosPorMaco: +e.target.value }))}
            className="w-full accent-black cursor-pointer h-1"
          />
          <div className="flex justify-between w-full text-xs text-muted-foreground">
            <span>5</span>
            <span>40</span>
          </div>
        </div>
      ),
    },
    {
      icon: DollarSign,
      title: "O seu hábito tabágico",
      subtitle: "Quanto custa um maço?",
      content: (
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <div className="text-[72px] font-black tracking-tight text-foreground leading-none">R${data.custoPorMaco.toFixed(2)}</div>
            <div className="text-sm font-medium text-muted-foreground mt-2">por maço</div>
          </div>
          <input
            type="range" min={2.0} max={40.0} step={0.5} value={data.custoPorMaco}
            onChange={e => setData(d => ({ ...d, custoPorMaco: +e.target.value }))}
            className="w-full accent-black cursor-pointer h-1"
          />
          <div className="flex justify-between w-full text-xs text-muted-foreground">
            <span>R$2,00</span>
            <span>R$40,00</span>
          </div>
        </div>
      ),
    },
    {
      icon: Clock,
      title: "O seu hábito tabágico",
      subtitle: "Há quantos anos que fumas?",
      content: (
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <div className="text-[96px] font-black tracking-tight text-foreground leading-none">{data.anosFumando}</div>
            <div className="text-sm font-medium text-muted-foreground mt-2">anos</div>
          </div>
          <input
            type="range" min={1} max={50} value={data.anosFumando}
            onChange={e => setData(d => ({ ...d, anosFumando: +e.target.value }))}
            className="w-full accent-black cursor-pointer h-1"
          />
          <div className="flex justify-between w-full text-xs text-muted-foreground">
            <span>1</span>
            <span>50</span>
          </div>
        </div>
      ),
    },
    {
      icon: Shield,
      title: "Finalizando",
      subtitle: "Aceite os termos para continuar",
      content: (
        <div className="flex flex-col gap-3">
          {[
            {
              label: "Termos de Uso e Privacidade",
              desc: "Li e aceito os Termos e Privacidade.",
              links: (
                <div className="flex gap-4 mt-2">
                  <Link to="/politica-de-privacidade" target="_blank" className="text-xs text-muted-foreground underline">Privacidade</Link>
                  <Link to="/termos-de-uso" target="_blank" className="text-xs text-muted-foreground underline">Termos</Link>
                </div>
              ),
              checked: acceptedTerms,
              toggle: () => setAcceptedTerms(!acceptedTerms),
            },
            {
              label: "Dados de saúde",
              desc: "Consinto no processamento dos meus dados.",
              links: null,
              checked: acceptedHealth,
              toggle: () => setAcceptedHealth(!acceptedHealth),
            },
            {
              label: "Comunicações (opcional)",
              desc: "Desejo receber dicas semanais.",
              links: null,
              checked: acceptedMarketing,
              toggle: () => setAcceptedMarketing(!acceptedMarketing),
            },
          ].map(item => (
            <div
              key={item.label}
              onClick={item.toggle}
              className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors border ${item.checked ? 'border-primary bg-primary/5' : 'border-border/50 bg-card hover:bg-muted/50'}`}
            >
              <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${item.checked ? 'border-primary bg-primary' : 'border-input bg-background'}`}>
                {item.checked && <CheckCircle2 size={13} className="text-primary-foreground" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="w-full max-w-lg relative z-10">
        <header className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center mb-5 shadow-lg">
            <Wind size={28} />
          </div>
          <h1 className="font-extrabold text-3xl tracking-tight text-foreground mb-2">QuitBoost</h1>
          <p className="text-sm text-muted-foreground">Configuração de Perfil</p>
        </header>

        {/* Progress bar */}
        <div className="flex gap-2 mb-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors duration-500 ${i <= step ? 'bg-primary' : 'bg-muted'}`}
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
            className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-muted border border-border/50 flex items-center justify-center">
                <Icon size={22} className="text-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-xl tracking-tight text-foreground">
                  {currentStep.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentStep.subtitle}
                </p>
              </div>
            </div>
            {currentStep.content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-4 mt-6">
          {step > 0 && !isSubmitting ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 h-14 rounded-xl bg-card border border-border hover:bg-muted text-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft size={16} /> Voltar
            </button>
          ) : <div className="flex-1" />}

          <button
            disabled={isSubmitting || (step === steps.length - 1 && (!acceptedTerms || !acceptedHealth))}
            onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : finishOnboarding()}
            className={`flex-none w-[60%] h-14 rounded-xl bg-foreground text-background font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              (isSubmitting || (step === steps.length - 1 && (!acceptedTerms || !acceptedHealth))) ? 'opacity-40 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-xl'
            }`}
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (
              step < steps.length - 1 ? <><span>Próximo</span><ArrowRight size={16} /></> : <><span>Finalizar</span><Sparkles size={16} /></>
            )}
          </button>
        </div>

        <p className="text-xs text-muted-foreground/50 text-center mt-12">
          🔒 Privacidade em 1º lugar · QuitBoost 2026
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
