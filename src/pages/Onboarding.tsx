import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Wind, Cigarette, Clock, DollarSign, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    cigarrosPorDia: 15,
    anosFumando: 5,
    custoPorCigarro: 1.5,
    gatilhos: [],
  });
  const navigate = useNavigate();

  const toggleGatilho = (g: string) => {
    setData(prev => ({
      ...prev,
      gatilhos: prev.gatilhos.includes(g)
        ? prev.gatilhos.filter(x => x !== g)
        : [...prev.gatilhos, g],
    }));
  };

  const finishOnboarding = () => {
    localStorage.setItem("quitboost_profile", JSON.stringify({
      ...data,
      quitDate: new Date().toISOString(),
    }));
    navigate("/dashboard");
  };

  const steps = [
    {
      icon: Cigarette,
      title: "Quantos cigarros você fuma por dia?",
      content: (
        <div className="space-y-6">
          <div className="text-7xl font-bold text-foreground text-center tracking-tight">{data.cigarrosPorDia}</div>
          <input
            type="range" min={1} max={60} value={data.cigarrosPorDia}
            onChange={e => setData(d => ({ ...d, cigarrosPorDia: +e.target.value }))}
            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-foreground"
          />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1</span><span>60</span></div>
        </div>
      ),
    },
    {
      icon: Clock,
      title: "Há quantos anos você fuma?",
      content: (
        <div className="space-y-6">
          <div className="text-7xl font-bold text-foreground text-center tracking-tight">{data.anosFumando}</div>
          <input
            type="range" min={1} max={40} value={data.anosFumando}
            onChange={e => setData(d => ({ ...d, anosFumando: +e.target.value }))}
            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-foreground"
          />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1 ano</span><span>40 anos</span></div>
        </div>
      ),
    },
    {
      icon: DollarSign,
      title: "Quanto custa cada cigarro?",
      content: (
        <div className="space-y-6">
          <div className="text-7xl font-bold text-foreground text-center tracking-tight">R${data.custoPorCigarro.toFixed(2)}</div>
          <input
            type="range" min={0.5} max={5} step={0.1} value={data.custoPorCigarro}
            onChange={e => setData(d => ({ ...d, custoPorCigarro: +e.target.value }))}
            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-foreground"
          />
          <div className="flex justify-between text-xs text-muted-foreground"><span>R$0,50</span><span>R$5,00</span></div>
        </div>
      ),
    },
    {
      icon: Brain,
      title: "Quando você sente mais vontade?",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {gatilhoOptions.map(g => (
            <button
              key={g}
              onClick={() => toggleGatilho(g)}
              className={`p-3 rounded-2xl text-sm font-medium border transition-all ${
                data.gatilhos.includes(g)
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-foreground border-border hover:border-foreground/30"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <Wind className="w-6 h-6 text-foreground" />
          <span className="text-lg font-semibold text-foreground tracking-tight">QuitBoost</span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? "bg-foreground" : "bg-border"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-border bg-card p-8"
          >
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6">
              <currentStep.icon className="w-6 h-6 text-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight mb-6">{currentStep.title}</h2>
            {currentStep.content}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="outline" size="lg" className="flex-1 h-12 rounded-full" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
            </Button>
          )}
          <Button size="lg" className="flex-1 h-12 rounded-full"
            onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : finishOnboarding()}
          >
            {step < steps.length - 1 ? <>Próximo <ArrowRight className="ml-2 w-4 h-4" /></> : "Criar meu plano"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
