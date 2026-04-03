import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Wind, Cigarette, Clock, DollarSign, Brain, Sparkles, Loader2, CheckCircle2, ShieldCheck, FileText, Zap, Shield, Target } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/lib/services";
import { toast } from "sonner";
import { AppleCard } from "@/components/ui/apple-card";

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
    if (!user && !isSubmitting) {
      navigate("/auth");
    }
  }, [user, navigate, isSubmitting]);

  const toggleGatilho = (g: string) => {
    setData(prev => ({
      ...prev,
      gatilhos: prev.gatilhos.includes(g)
        ? prev.gatilhos.filter(x => x !== g)
        : [...prev.gatilhos, g],
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
        policy_version: '2026.1',
        accepted_terms: true,
        accepted_health_data: true,
        marketing_consent: acceptedMarketing
      });

      toast.success("Sincronização concluída! Iniciando protocolo.");
      navigate("/checkout");
    } catch (error) {
       console.error("Erro no onboarding:", error);
       toast.error("Falha na sincronização neuronal. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      icon: Cigarette,
      title: "Carga Operacional",
      subtitle: "Quantos sinais tóxicos por ciclo solar?",
      content: (
        <div className="space-y-12">
          <div className="flex flex-col items-center">
             <div className="text-9xl font-black text-primary italic tracking-tighter drop-shadow-glow leading-none">{data.cigarrosPorDia}</div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mt-4 italic">Unidades / Dia</p>
          </div>
          <div className="relative pt-6">
            <input
              type="range" min={1} max={60} value={data.cigarrosPorDia}
              onChange={e => setData(d => ({ ...d, cigarrosPorDia: +e.target.value }))}
              className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="absolute top-0 left-0 w-full flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20 italic">
              <span>Nível Mínimo</span>
              <span>Alinhamento Crítico</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Clock,
      title: "Vetor de Tempo",
      subtitle: "Tempo total de exposição em órbitas?",
      content: (
        <div className="space-y-12">
          <div className="flex flex-col items-center">
             <div className="text-9xl font-black text-primary italic tracking-tighter drop-shadow-glow leading-none">{data.anosFumando}</div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mt-4 italic">Anos de Acúmulo</p>
          </div>
          <div className="relative pt-6">
            <input
              type="range" min={1} max={50} value={data.anosFumando}
              onChange={e => setData(d => ({ ...d, anosFumando: +e.target.value }))}
              className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="absolute top-0 left-0 w-full flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20 italic">
              <span>1 Órbita</span>
              <span>50 Órbitas</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: DollarSign,
      title: "Alocação de Recurso",
      subtitle: "Investimento por unidade individual?",
      content: (
        <div className="space-y-12">
          <div className="flex flex-col items-center">
             <div className="text-7xl font-black text-primary italic tracking-tighter drop-shadow-glow leading-none">R${data.custoPorCigarro.toFixed(2)}</div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mt-4 italic">Preço Individual</p>
          </div>
          <div className="relative pt-6">
            <input
              type="range" min={0.2} max={10} step={0.1} value={data.custoPorCigarro}
              onChange={e => setData(d => ({ ...d, custoPorCigarro: +e.target.value }))}
              className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="absolute top-0 left-0 w-full flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20 italic">
              <span>Econômico</span>
              <span>Premium</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Brain,
      title: "Sinais de Gatilho",
      subtitle: "Mapeie seus pontos de falha sistêmica.",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {gatilhoOptions.map(g => (
            <button
              key={g}
              onClick={() => toggleGatilho(g)}
              className={`h-16 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] border-2 transition-all flex items-center justify-center px-4 text-center italic ${
                data.gatilhos.includes(g)
                  ? "bg-primary text-white border-primary shadow-glow scale-105"
                  : "bg-white/5 text-white/40 border-white/10 hover:border-primary/40 hover:text-white"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      ),
    },
    {
      icon: Shield,
      title: "Protocolo de Segurança",
      subtitle: "Ative seus módulos de proteção e privacidade.",
      content: (
        <div className="space-y-4">
           <div 
             onClick={() => setAcceptedTerms(!acceptedTerms)}
             className={`p-6 rounded-[1.5rem] border transition-all flex items-start gap-4 backdrop-blur-xl cursor-pointer ${acceptedTerms ? "bg-primary/10 border-primary/40 shadow-glow" : "bg-white/5 border-white/10 opacity-60 hover:opacity-100"}`}
           >
              <div className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center ${acceptedTerms ? "bg-primary border-primary text-white" : "border-white/20"}`}>
                 {acceptedTerms && <CheckCircle2 size={14} />}
              </div>
              <div className="flex-1">
                 <p className="text-sm font-black text-white italic tracking-tight mb-2 uppercase">Protokollo Alpha v1.0</p>
                 <p className="text-[10px] font-bold text-white/60 mb-2 leading-tight">Li e aceito os Termos de Uso e a Política de Privacidade.</p>
                 <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-primary italic">
                    <Link to="/politica-de-privacidade" target="_blank" className="hover:underline underline-offset-4">Privacidade</Link>
                    <Link to="/termos-de-uso" target="_blank" className="hover:underline underline-offset-4">Licença</Link>
                 </div>
              </div>
           </div>

           <div 
             onClick={() => setAcceptedHealth(!acceptedHealth)}
             className={`p-6 rounded-[1.5rem] border transition-all flex items-start gap-4 backdrop-blur-xl cursor-pointer ${acceptedHealth ? "bg-emerald-500/10 border-emerald-500/40 shadow-glow" : "bg-white/5 border-white/10 opacity-60 hover:opacity-100"}`}
           >
              <div className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center ${acceptedHealth ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/20"}`}>
                 {acceptedHealth && <CheckCircle2 size={14} />}
              </div>
              <div className="flex-1">
                 <p className="text-sm font-black text-white italic tracking-tight mb-2 uppercase">Dados Biométricos</p>
                 <p className="text-[10px] font-bold text-white/60 leading-tight">Consinto no processamento de meus dados sensíveis de saúde para otimização do plano.</p>
              </div>
           </div>

           <div 
             onClick={() => setAcceptedMarketing(!acceptedMarketing)}
             className={`p-6 rounded-[1.5rem] border transition-all flex items-start gap-4 backdrop-blur-xl cursor-pointer ${acceptedMarketing ? "bg-blue-500/10 border-blue-500/40 shadow-glow" : "bg-white/5 border-white/10 opacity-40 hover:opacity-100"}`}
           >
              <div className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center ${acceptedMarketing ? "bg-blue-500 border-blue-500 text-white" : "border-white/20"}`}>
                 {acceptedMarketing && <CheckCircle2 size={14} />}
              </div>
              <div className="flex-1">
                 <p className="text-sm font-black text-white italic tracking-tight mb-2 uppercase">Transmissão de Inteligência</p>
                 <p className="text-[10px] font-bold text-white/60 leading-tight">Desejo receber dicas semanais de alta performance por e-mail.</p>
              </div>
           </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none animate-pulse duration-5000" />
      
      <div className="w-full max-w-xl relative z-10">
        <header className="flex flex-col items-center mb-12">
           <motion.div 
             initial={{ scale: 0 }} animate={{ scale: 1 }}
             className="w-16 h-16 rounded-[1.5rem] bg-primary flex items-center justify-center text-white mb-6 shadow-glow"
           >
              <Wind size={32} className="animate-pulse" />
           </motion.div>
           <h1 className="text-5xl font-black tracking-tighter text-white italic uppercase leading-none">Recrutamento.</h1>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mt-4 italic">Sincronizando Perfil de Comandante</p>
        </header>

        {/* Progress System */}
        <div className="flex gap-3 mb-12 px-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${i <= step ? "bg-primary shadow-glow" : "bg-white/5"}`} />
          ))}
        </div>

        <section className="relative min-h-[550px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.5, ease: "anticipate" }}
              className="h-full"
            >
              <AppleCard className="bg-card/40 backdrop-blur-3xl p-10 sm:p-16 border border-white/10 shadow-elevated h-full flex flex-col justify-center rounded-[3rem]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-[1rem] bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <currentStep.icon className="w-7 h-7 text-primary drop-shadow-glow" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{currentStep.title}</h2>
                    <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase mt-2 italic">{currentStep.subtitle}</p>
                  </div>
                </div>
                {currentStep.content}
              </AppleCard>
            </motion.div>
          </AnimatePresence>
        </section>

        <footer className="flex gap-4 mt-12 px-2">
          {step > 0 && !isSubmitting ? (
            <Button 
              variant="outline" 
              className="flex-1 h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] border-white/10 bg-white/5 hover:bg-white/10 text-white italic transition-all active:scale-95 border-none" 
              onClick={() => setStep(s => s - 1)}
            >
              <ArrowLeft size={16} className="mr-3" /> Regressar
            </Button>
          ) : (
            <div className="flex-1" />
          )}
          <Button disabled={isSubmitting || (step === steps.length - 1 && (!acceptedTerms || !acceptedHealth))} 
            className="flex-[1.5] h-16 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-widest text-[11px] shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all italic"
            onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : finishOnboarding()}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : step < steps.length - 1 ? <>Próxima Fase <ArrowRight className="ml-3 w-5 h-5" /></> : <>Finalizar Conexão <Sparkles className="ml-3 w-5 h-5" /></>}
          </Button>
        </footer>

        {/* Tactical Footer */}
        <div className="mt-16 text-center">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-loose">
            🔒 Protocolo de Criptografia Ativo • LGPD Compliant 2026<br />
            Sistema de Automação QuitBoost v4.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
