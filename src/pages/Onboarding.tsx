import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Leaf, Cigarette, Clock, DollarSign, Brain } from "lucide-react";
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
        <div className="space-y-4">
          <div className="text-6xl font-bold text-primary font-display text-center">{data.cigarrosPorDia}</div>
          <input
            type="range" min={1} max={60} value={data.cigarrosPorDia}
            onChange={e => setData(d => ({ ...d, cigarrosPorDia: +e.target.value }))}
            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1</span><span>60</span></div>
        </div>
      ),
    },
    {
      icon: Clock,
      title: "Há quantos anos você fuma?",
      content: (
        <div className="space-y-4">
          <div className="text-6xl font-bold text-primary font-display text-center">{data.anosFumando}</div>
          <input
            type="range" min={1} max={40} value={data.anosFumando}
            onChange={e => setData(d => ({ ...d, anosFumando: +e.target.value }))}
            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1 ano</span><span>40 anos</span></div>
        </div>
      ),
    },
    {
      icon: DollarSign,
      title: "Quanto custa cada cigarro?",
      content: (
        <div className="space-y-4">
          <div className="text-6xl font-bold text-primary font-display text-center">R${data.custoPorCigarro.toFixed(2)}</div>
          <input
            type="range" min={0.5} max={5} step={0.1} value={data.custoPorCigarro}
            onChange={e => setData(d => ({ ...d, custoPorCigarro: +e.target.value }))}
            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
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
              className={`p-3 rounded-xl text-sm font-medium border transition-all ${
                data.gatilhos.includes(g)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-border hover:border-primary/30"
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
    <div className="min-h-screen gradient-dark flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-10">
          <Leaf className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-primary-foreground font-display">QuitBoost</span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-primary/20"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-primary/20 bg-card/10 backdrop-blur-sm p-8"
          >
            <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-6">
              <currentStep.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-primary-foreground font-display mb-6">{currentStep.title}</h2>
            {currentStep.content}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="heroOutline" size="lg" className="flex-1 h-12 border-primary-foreground/20 text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
            </Button>
          )}
          <Button variant="hero" size="lg" className="flex-1 h-12"
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
