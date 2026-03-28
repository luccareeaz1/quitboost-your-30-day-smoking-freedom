import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Wind, Cigarette, Clock, DollarSign, Brain, Sparkles, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/lib/services";
import { toast } from "sonner";
import SpaceBackground from "@/components/landing/SpaceBackground";

interface OnboardingData {
  cigarrosPorDia: number;
  anosFumando: number;
  custoPorCigarro: number;
  gatilhos: string[];
}

const gatilhoOptions = [
  "Estresse", "Após refeições", "Café", "Álcool", "Socialização", "Tédio", "Ansiedade", "Ao dirigir",
];

const Onboarding = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    cigarrosPorDia: 15, anosFumando: 5, custoPorCigarro: 1.5, gatilhos: [],
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedHealth, setAcceptedHealth] = useState(false);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isSubmitting) navigate("/auth");
  }, [user, navigate]);

  const toggleGatilho = (g: string) => {
    setData(prev => ({
      ...prev,
      gatilhos: prev.gatilhos.includes(g) ? prev.gatilhos.filter(x => x !== g) : [...prev.gatilhos, g],
    }));
  };

  const finishOnboarding = async () => {
    if (!user) return;
    if (!acceptedTerms || !acceptedHealth) {
      toast.error("Aceite os termos para continuar.");
      return;
    }
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
        policy_version: '2026.1',
        accepted_terms: true,
        accepted_health_data: true,
        marketing_consent: acceptedMarketing,
      });
      toast.success("Seu plano foi criado!");
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
      icon: Cigarette, title: "Consumo Diário", subtitle: "Quantos cigarros por dia?",
      content: (
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold text-primary tracking-tight">{data.cigarrosPorDia}</div>
            <p className="text-xs text-muted-foreground mt-1">cigarros/dia</p>
          </div>
          <input type="range" min={1} max={60} value={data.cigarrosPorDia}
            onChange={e => setData(d => ({ ...d, cigarrosPorDia: +e.target.value }))}
            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary" />
        </div>
      ),
    },
    {
      icon: Clock, title: "Tempo Fumando", subtitle: "Há quantos anos?",
      content: (
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold text-primary tracking-tight">{data.anosFumando}</div>
            <p className="text-xs text-muted-foreground mt-1">anos</p>
          </div>
          <input type="range" min={1} max={50} value={data.anosFumando}
            onChange={e => setData(d => ({ ...d, anosFumando: +e.target.value }))}
            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary" />
        </div>
      ),
    },
    {
      icon: DollarSign, title: "Custo por Cigarro", subtitle: "Quanto custa cada unidade?",
      content: (
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold text-primary tracking-tight">R${data.custoPorCigarro.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">por unidade</p>
          </div>
          <input type="range" min={0.2} max={10} step={0.1} value={data.custoPorCigarro}
            onChange={e => setData(d => ({ ...d, custoPorCigarro: +e.target.value }))}
            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary" />
        </div>
      ),
    },
    {
      icon: Brain, title: "Seus Gatilhos", subtitle: "O que te faz querer fumar?",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {gatilhoOptions.map(g => (
            <button key={g} onClick={() => toggleGatilho(g)}
              className={`h-12 rounded-xl text-xs font-semibold border transition-all ${
                data.gatilhos.includes(g)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
              }`}>{g}</button>
          ))}
        </div>
      ),
    },
    {
      icon: ShieldCheck, title: "Termos", subtitle: "Aceite para continuar.",
      content: (
        <div className="space-y-3">
          {[
            { state: acceptedTerms, setter: () => setAcceptedTerms(!acceptedTerms), label: "Termos de Uso & Privacidade", sub: <div className="flex gap-3 text-xs text-primary"><Link to="/politica-de-privacidade" target="_blank">Política</Link><Link to="/termos-de-uso" target="_blank">Termos</Link></div> },
            { state: acceptedHealth, setter: () => setAcceptedHealth(!acceptedHealth), label: "Dados de Saúde", sub: <p className="text-xs text-muted-foreground">Essenciais para o plano personalizado.</p> },
            { state: acceptedMarketing, setter: () => setAcceptedMarketing(!acceptedMarketing), label: "Dicas por E-mail", sub: <p className="text-xs text-muted-foreground">Opcional.</p> },
          ].map((item, i) => (
            <div key={i} onClick={item.setter}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${item.state ? "bg-primary/5 border-primary/20" : "bg-secondary border-border"}`}>
              <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center ${item.state ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}>
                {item.state && <CheckCircle2 size={12} />}
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">{item.label}</p>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      <SpaceBackground />
      <div className="w-full max-w-lg relative z-10">
        <header className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
            <Wind size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Configurar Perfil</h1>
          <p className="text-xs text-muted-foreground mt-1">Passo {step + 1} de {steps.length}</p>
        </header>

        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="rounded-2xl p-8 bg-card border border-border min-h-[380px] flex flex-col"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <currentStep.icon className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-1">{currentStep.title}</h2>
            <p className="text-sm text-muted-foreground mb-8">{currentStep.subtitle}</p>
            <div className="flex-1 flex flex-col justify-center">{currentStep.content}</div>
          </motion.div>
        </AnimatePresence>

        <footer className="flex gap-3 mt-6">
          {step > 0 && !isSubmitting && (
            <Button variant="outline" className="flex-1 h-12 rounded-xl font-semibold" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft size={14} className="mr-2" /> Voltar
            </Button>
          )}
          <Button disabled={isSubmitting || (step === steps.length - 1 && (!acceptedTerms || !acceptedHealth))} 
            className="flex-[2] h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
            onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : finishOnboarding()}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : step < steps.length - 1 ? <>Próximo <ArrowRight className="ml-2 w-4 h-4" /></> : <>Finalizar <Sparkles className="ml-2 w-4 h-4" /></>}
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default Onboarding;
