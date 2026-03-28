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
    cigarrosPorDia: 15,
    anosFumando: 5,
    custoPorCigarro: 1.5,
    gatilhos: [],
  });
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedHealth, setAcceptedHealth] = useState(false);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isSubmitting) {
      navigate("/auth");
    }
  }, [user, navigate]);

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
    if (!acceptedTerms || !acceptedHealth) {
      toast.error("Você precisa aceitar os termos e o processamento de dados de saúde para continuar.");
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
        marketing_consent: acceptedMarketing
      });

      toast.success("Seu plano clínico foi criado!");
      navigate("/checkout");
    } catch (error) {
       console.error("Erro no onboarding:", error);
       toast.error("Ocorreu um erro ao salvar seus dados. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      icon: Cigarette,
      title: "Consumo Diário",
      subtitle: "Quantos cigarros você fuma por dia?",
      content: (
        <div className="space-y-8">
          <div className="flex flex-col items-center">
             <div className="text-8xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">{data.cigarrosPorDia}</div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-2">Unidades</p>
          </div>
          <input
            type="range" min={1} max={60} value={data.cigarrosPorDia}
            onChange={e => setData(d => ({ ...d, cigarrosPorDia: +e.target.value }))}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-600"><span>1 un.</span><span>60 un.</span></div>
        </div>
      ),
    },
    {
      icon: Clock,
      title: "Histórico de Uso",
      subtitle: "Há quantos anos você fuma?",
      content: (
        <div className="space-y-8">
          <div className="flex flex-col items-center">
             <div className="text-8xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">{data.anosFumando}</div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-2">Anos</p>
          </div>
          <input
            type="range" min={1} max={50} value={data.anosFumando}
            onChange={e => setData(d => ({ ...d, anosFumando: +e.target.value }))}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-600"><span>1 ano</span><span>50 anos</span></div>
        </div>
      ),
    },
    {
      icon: DollarSign,
      title: "Investimento Social",
      subtitle: "Quanto custa cada cigarro individual?",
      content: (
        <div className="space-y-8">
          <div className="flex flex-col items-center">
             <div className="text-7xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">R${data.custoPorCigarro.toFixed(2)}</div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-2">Preço por Unidade</p>
          </div>
          <input
            type="range" min={0.2} max={10} step={0.1} value={data.custoPorCigarro}
            onChange={e => setData(d => ({ ...d, custoPorCigarro: +e.target.value }))}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-600"><span>R$0,20</span><span>R$10,00</span></div>
        </div>
      ),
    },
    {
      icon: Brain,
      title: "Gatilhos Mentais",
      subtitle: "Identifique seus momentos mais críticos.",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {gatilhoOptions.map(g => (
            <button
              key={g}
              onClick={() => toggleGatilho(g)}
              className={`h-16 rounded-[20px] text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center px-4 text-center ${
                data.gatilhos.includes(g)
                  ? "bg-emerald-500 text-black border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105"
                  : "bg-white/5 text-gray-400 border-white/5 hover:border-emerald-500/30"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      ),
    },
    {
      icon: ShieldCheck,
      title: "Contrato de Liberdade",
      subtitle: "Conformidade LGPD & Termos Clínicos.",
      content: (
        <div className="space-y-4">
           <div 
             onClick={() => setAcceptedTerms(!acceptedTerms)}
             className={`p-5 rounded-[2rem] border transition-all flex items-start gap-4 ${acceptedTerms ? "bg-emerald-500/5 border-emerald-500/30" : "bg-white/5 border-white/5 hover:border-white/10"}`}
           >
              <div className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center ${acceptedTerms ? "bg-emerald-500 border-emerald-500 text-black" : "border-white/20"}`}>
                 {acceptedTerms && <CheckCircle2 size={14} />}
              </div>
              <div className="flex-1">
                 <p className="text-sm font-bold text-white mb-1 leading-tight">Termos de Uso & Privacidade</p>
                 <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <Link to="/politica-de-privacidade" target="_blank" className="hover:underline">Política</Link>
                    <Link to="/termos-de-uso" target="_blank" className="hover:underline">Termos</Link>
                 </div>
              </div>
           </div>

           <div 
             onClick={() => setAcceptedHealth(!acceptedHealth)}
             className={`p-5 rounded-[2rem] border transition-all flex items-start gap-4 ${acceptedHealth ? "bg-emerald-500/5 border-emerald-500/30" : "bg-white/5 border-white/5 hover:border-white/10"}`}
           >
              <div className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center ${acceptedHealth ? "bg-emerald-500 border-emerald-500 text-black" : "border-white/20"}`}>
                 {acceptedHealth && <CheckCircle2 size={14} />}
              </div>
              <div className="flex-1">
                 <p className="text-sm font-bold text-white mb-1 leading-tight">Dados de Saúde (Sensíveis)</p>
                 <p className="text-[10px] font-medium text-gray-500 italic">Essenciais para o plano personalizado.</p>
              </div>
           </div>

           <div 
             onClick={() => setAcceptedMarketing(!acceptedMarketing)}
             className={`p-5 rounded-[2rem] border transition-all flex items-start gap-4 ${acceptedMarketing ? "bg-emerald-500/5 border-emerald-500/30" : "bg-white/5 border-white/5 opacity-50"}`}
           >
              <div className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center ${acceptedMarketing ? "bg-emerald-500 border-emerald-500 text-black" : "border-white/20"}`}>
                 {acceptedMarketing && <CheckCircle2 size={14} />}
              </div>
              <div className="flex-1">
                 <p className="text-sm font-bold text-white mb-1 leading-tight">Dicas Científicas via E-mail</p>
                 <p className="text-[10px] font-medium text-gray-500 italic">Receba suporte semanal no e-mail.</p>
              </div>
           </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      <SpaceBackground />
      
      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-700">
        <header className="flex flex-col items-center mb-10">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_40px_-5px_rgba(16,185,129,0.2)]"
           >
              <Wind size={32} />
           </motion.div>
           <h1 className="text-4xl font-black tracking-tighter">Onboarding.</h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mt-2">Personalizando Sua Engenharia</p>
        </header>

        <div className="flex gap-3 mb-12 px-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-700 ${i <= step ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-white/10"}`} />
          ))}
        </div>

        <section className="relative min-h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.98, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.02, x: -20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="glass-dark rounded-[3.5rem] p-10 sm:p-14 border border-white/10 shadow-3xl h-full flex flex-col"
            >
              <div className="w-14 h-14 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                <currentStep.icon className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter mb-3 leading-none italic">{currentStep.title}</h2>
              <p className="text-sm font-medium text-gray-400 mb-10 leading-relaxed max-w-xs">{currentStep.subtitle}</p>
              <div className="flex-1 flex flex-col justify-center">
                {currentStep.content}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <footer className="flex gap-4 mt-10">
          {step > 0 && !isSubmitting ? (
            <Button variant="ghost" className="flex-1 h-16 rounded-[2rem] font-black uppercase tracking-widest text-[10px] border border-white/5 text-gray-400 hover:bg-white/5" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft size={14} className="mr-2" /> Voltar
            </Button>
          ) : (
            <div className="flex-1" />
          )}
          <Button disabled={isSubmitting || (step === steps.length - 1 && (!acceptedTerms || !acceptedHealth))} 
            className="flex-[2] h-16 rounded-[2rem] bg-emerald-500 text-black font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all"
            onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : finishOnboarding()}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : step < steps.length - 1 ? <>Próximo Passo <ArrowRight className="ml-2 w-4 h-4" /></> : <>Ativar Engenharia de Liberdade <Sparkles className="ml-2 w-4 h-4" /></>}
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default Onboarding;
