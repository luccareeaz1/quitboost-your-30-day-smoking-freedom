import { useState, useEffect } from "react";
import { Check, ArrowRight, Sparkles, Cigarette, Wallet, Clock, User, ShieldCheck, Package, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/lib/services";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Form State
  const [whatFuma, setWhatFuma] = useState("Cigarros");
  const [precoMaco, setPrecoMaco] = useState("");
  const [quantosPorDia, setQuantosPorDia] = useState("");
  const [cigarrosNoMaco, setCigarrosNoMaco] = useState("");
  const [tempoPrimeiroCigarro, setTempoPrimeiroCigarro] = useState("");

  useEffect(() => {
    if (!user && !isSubmitting) navigate("/auth");
  }, [user, navigate, isSubmitting]);

  const handleContinue = async () => {
    if (!user) return;
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (!precoMaco || !quantosPorDia || !cigarrosNoMaco || !tempoPrimeiroCigarro) {
      toast.error("Por favor, preencha todos os campos para personalizar seu plano.");
      return;
    }

    try {
      setIsSubmitting(true);
      const price = parseFloat(precoMaco.replace(",", "."));
      const packSize = parseInt(cigarrosNoMaco, 10);
      const daily = parseInt(quantosPorDia, 10);
      const pricePerCigarette = price / packSize;

      await profileService.saveOnboarding(user.id, {
        cigarettes_per_day: daily,
        years_smoking: 1,
        price_per_cigarette: pricePerCigarette,
        quit_date: new Date().toISOString(),
        triggers: [`Fuma: ${whatFuma}`, `Primeiro cigarro: ${tempoPrimeiroCigarro}`],
        display_name: user.email?.split("@")[0],
      });

      await profileService.saveConsent(user.id, {
        policy_version: "2026.1",
        accepted_terms: true,
        accepted_health_data: true,
        marketing_consent: false,
      });

      toast.success("Plano personalizado gerado com sucesso!");
      navigate("/onboarding-motivo");
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar seus dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 pb-32 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-400/10 rounded-full blur-[100px] -ml-40 -mb-40" />

      <div className="max-w-xl w-full relative z-10">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-100 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passo {step} de 3</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
            Construindo sua <span className="text-primary italic">Liberdade</span>
          </h1>
          <p className="text-slate-500 font-medium">Nos conte sobre o seu hábito para gerarmos um plano científico.</p>
        </header>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <OnboardingSection title="O que você fuma?" icon={Cigarette}>
                <div className="grid grid-cols-1 gap-4">
                  {["Cigarros", "Tabaco de enrolar", "Vaper / Pod"].map(opt => (
                    <OptionButton key={opt} label={opt} active={whatFuma === opt} onClick={() => setWhatFuma(opt)} />
                  ))}
                </div>
              </OnboardingSection>

              <OnboardingSection title="Quando fuma o primeiro?" icon={Clock}>
                <div className="grid grid-cols-1 gap-4">
                  {["Em 5 minutos", "6-30 minutos", "31-60 minutos", "Mais de 60 minutos"].map(opt => (
                    <OptionButton key={opt} label={opt} active={tempoPrimeiroCigarro === opt} onClick={() => setTempoPrimeiroCigarro(opt)} />
                  ))}
                </div>
              </OnboardingSection>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <OnboardingSection title="Frequência Diária" icon={Cigarette}>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-4">Quantos cigarros por dia?</p>
                <input 
                  type="number" value={quantosPorDia} onChange={e => setQuantosPorDia(e.target.value)}
                  placeholder="Ex: 20"
                  className="w-full h-20 bg-white border-2 border-slate-100 focus:border-primary/20 rounded-[2rem] px-8 text-2xl font-black text-slate-900 outline-none shadow-xl shadow-slate-200/50"
                />
              </OnboardingSection>

              <OnboardingSection title="Tamanho do Maço" icon={Package}>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-4">Unidades por embalagem?</p>
                <input 
                  type="number" value={cigarrosNoMaco} onChange={e => setCigarrosNoMaco(e.target.value)}
                  placeholder="Ex: 20"
                  className="w-full h-20 bg-white border-2 border-slate-100 focus:border-primary/20 rounded-[2rem] px-8 text-2xl font-black text-slate-900 outline-none shadow-xl shadow-slate-200/50"
                />
              </OnboardingSection>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <OnboardingSection title="Investimento Financeiro" icon={Wallet}>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-4">Quanto custa o seu maço atual?</p>
                <div className="relative">
                  <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">R$</span>
                  <input 
                    type="number" value={precoMaco} onChange={e => setPrecoMaco(e.target.value)}
                    placeholder="12.00"
                    className="w-full h-24 bg-white border-2 border-slate-100 focus:border-primary/20 rounded-[2.5rem] pl-20 px-8 text-4xl font-black text-slate-900 outline-none shadow-xl shadow-slate-200/50"
                  />
                </div>
              </OnboardingSection>

              <Card className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                 <div className="flex gap-4 mb-4 items-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Garantia de Privacidade</span>
                 </div>
                 <p className="text-sm font-medium leading-relaxed">
                   Seus dados são protegidos por criptografia militar e nunca serão compartilhados com seguradoras ou terceiros.
                 </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-6">
          <Button 
            onClick={handleContinue}
            disabled={isSubmitting}
            className="w-full h-20 bg-slate-900 hover:bg-black text-white rounded-[2rem] text-lg font-black uppercase tracking-widest shadow-2xl shadow-slate-300 flex items-center justify-center gap-4 active:scale-95 transition-all"
          >
            {isSubmitting ? <Loader2 className="animate-spin w-8 h-8" /> : (
               <>
                 {step === 3 ? "Finalizar Configuração" : "Continuar"}
                 <ArrowRight className="w-6 h-6" />
               </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function OnboardingSection({ title, icon: Icon, children }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function OptionButton({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-8 py-6 rounded-[2rem] transition-all border-2",
        active 
          ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
          : "bg-white text-slate-800 border-slate-100 hover:border-primary/20 hover:bg-slate-50"
      )}
    >
      <span className="text-lg font-black tracking-tight">{label}</span>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
        active ? "bg-white/20 text-white" : "bg-slate-50 text-slate-200"
      )}>
        {active ? <Check className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
      </div>
    </button>
  );
}
