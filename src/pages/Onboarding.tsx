import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Wind, Cigarette, Clock, DollarSign, Brain, Sparkles, Loader2, CheckCircle2, ShieldCheck, FileText } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/lib/services";
import { supabase } from "@/lib/supabase";
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
  
  // LGPD States
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
      
      // 1. Update Profile
      await profileService.updateProfile(user.id, {
        daily_cigarettes: data.cigarrosPorDia,
        years_smoking: data.anosFumando,
        cigarette_cost: data.custoPorCigarro,
        triggers: data.gatilhos,
        quit_date: new Date().toISOString(),
        onboarding_completed: true, // column name in DB is onboarding_completed
        lgpd_consent: true,
        lgpd_consent_date: new Date().toISOString()
      });

      // 2. Save Consent Log (LGPD Requirement)
      await supabase.from('consent_logs').insert({
        user_id: user.id,
        policy_version: '2026.1',
        accepted_terms: true,
        accepted_health_data: true,
        marketing_consent: acceptedMarketing,
        ip_address: 'local' // simplified
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
             <div className="text-8xl font-black text-primary tracking-tighter drop-shadow-sm">{data.cigarrosPorDia}</div>
             <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">Unidades</p>
          </div>
          <input
            type="range" min={1} max={60} value={data.cigarrosPorDia}
            onChange={e => setData(d => ({ ...d, cigarrosPorDia: +e.target.value }))}
            className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground"><span>1 un.</span><span>60 un.</span></div>
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
             <div className="text-8xl font-black text-primary tracking-tighter drop-shadow-sm">{data.anosFumando}</div>
             <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">Anos</p>
          </div>
          <input
            type="range" min={1} max={50} value={data.anosFumando}
            onChange={e => setData(d => ({ ...d, anosFumando: +e.target.value }))}
            className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground"><span>1 ano</span><span>50 anos</span></div>
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
             <div className="text-7xl font-black text-primary tracking-tighter drop-shadow-sm">R${data.custoPorCigarro.toFixed(2)}</div>
             <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">Preço por Unidade</p>
          </div>
          <input
            type="range" min={0.2} max={10} step={0.1} value={data.custoPorCigarro}
            onChange={e => setData(d => ({ ...d, custoPorCigarro: +e.target.value }))}
            className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground"><span>R$0,20</span><span>R$10,00</span></div>
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
              className={`h-16 rounded-[20px] text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center px-4 text-center ${
                data.gatilhos.includes(g)
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30"
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
             className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex items-start gap-4 ${acceptedTerms ? "bg-primary/5 border-primary shadow-soft" : "bg-card border-border hover:border-primary/20"}`}
           >
              <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center ${acceptedTerms ? "bg-primary border-primary text-white" : "border-muted"}`}>
                 {acceptedTerms && <CheckCircle2 size={14} />}
              </div>
              <div className="flex-1">
                 <p className="text-sm font-black text-foreground mb-1 leading-tight">Li e aceito os Termos de Uso e a Política de Privacidade.</p>
                 <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-primary">
                    <Link to="/politica-de-privacidade" target="_blank" className="hover:underline">Política</Link>
                    <Link to="/termos-de-uso" target="_blank" className="hover:underline">Termos</Link>
                 </div>
              </div>
           </div>

           <div 
             onClick={() => setAcceptedHealth(!acceptedHealth)}
             className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex items-start gap-4 ${acceptedHealth ? "bg-emerald-500/5 border-emerald-500 shadow-soft" : "bg-card border-border hover:border-primary/20"}`}
           >
              <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center ${acceptedHealth ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted"}`}>
                 {acceptedHealth && <CheckCircle2 size={14} />}
              </div>
              <div className="flex-1">
                 <p className="text-sm font-black text-foreground mb-1 leading-tight">Consinto no processamento de meus dados sensíveis de saúde.</p>
                 <p className="text-[10px] font-medium text-muted-foreground italic">Essenciais para o funcionamento do protocolo de cessação.</p>
              </div>
           </div>

           <div 
             onClick={() => setAcceptedMarketing(!acceptedMarketing)}
             className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex items-start gap-4 ${acceptedMarketing ? "bg-blue-500/5 border-blue-500 shadow-soft" : "bg-card border-border hover:border-primary/20 opacity-60"}`}
           >
              <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center ${acceptedMarketing ? "bg-blue-500 border-blue-500 text-white" : "border-muted"}`}>
                 {acceptedMarketing && <CheckCircle2 size={14} />}
              </div>
              <div className="flex-1">
                 <p className="text-sm font-black text-foreground mb-1 leading-tight">Desejo receber dicas de saúde por e-mail.</p>
                 <p className="text-[10px] font-medium text-muted-foreground italic">Dicas científicas semanais para o e-mail {user?.email}.</p>
              </div>
           </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
      <div className="w-full max-w-lg">
        <header className="flex flex-col items-center mb-10">
           <div className="w-14 h-14 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary mb-5 shadow-soft">
              <Wind size={28} />
           </div>
           <h1 className="text-3xl font-black tracking-tighter">Onboarding.</h1>
           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-2">Iniciando Biografia Sanitária</p>
        </header>

        {/* Progress Bar */}
        <div className="flex gap-2.5 mb-10 px-4">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 shadow-sm ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <section className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="rounded-[40px] bg-card p-10 sm:p-14 border-none shadow-elevated h-full flex flex-col justify-center"
            >
              <div className="w-12 h-12 rounded-[18px] bg-primary/5 border border-primary/10 flex items-center justify-center mb-6">
                <currentStep.icon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-black text-foreground tracking-tight mb-2 leading-tight">{currentStep.title}</h2>
              <p className="text-sm font-medium text-muted-foreground mb-8 leading-relaxed max-w-xs">{currentStep.subtitle}</p>
              {currentStep.content}
            </motion.div>
          </AnimatePresence>
        </section>

        <footer className="flex gap-4 mt-8">
          {step > 0 && !isSubmitting ? (
            <Button variant="outline" className="flex-1 h-14 rounded-[20px] font-black uppercase tracking-widest text-[10px] border-2 border-border" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft size={14} className="mr-2" /> Voltar
            </Button>
          ) : (
            <div className="flex-1" />
          )}
          <Button disabled={isSubmitting || (step === steps.length - 1 && (!acceptedTerms || !acceptedHealth))} 
            className="flex-[1.5] h-14 rounded-[20px] bg-primary font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : finishOnboarding()}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : step < steps.length - 1 ? <>Continuar <ArrowRight className="ml-2 w-4 h-4" /></> : <>Ativar Minha Liberdade <Sparkles className="ml-2 w-4 h-4" /></>}
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default Onboarding;
