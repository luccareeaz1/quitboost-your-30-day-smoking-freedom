import { useState, useEffect } from "react";
import { Check, ArrowRight, Sparkles, Cigarette, Wallet, Clock, ShieldCheck, Package, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/lib/services";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/utils/analytics";


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
    if (!user && !isSubmitting) {
      navigate("/auth");
    } else if (user && step === 1) {
      trackEvent("onboarding_start");
    }
  }, [user, navigate, isSubmitting, step]);


  const handleContinue = async () => {
    if (!user) return;
    
    if (step < 3) {
      trackEvent("onboarding_step_complete", { step });
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

      trackEvent("onboarding_data_saved", {
        daily,
        packSize,
        price,
        timeToFirstCigarette: tempoPrimeiroCigarro
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 pb-32 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/20 rounded-full blur-[100px] -ml-40 -mb-40" />

      <div className="max-w-xl w-full relative z-10">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Etapa {step} de 3</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none mb-4">
            Construindo sua <span className="text-blue-600">Jornada</span>
          </h1>
          <p className="text-slate-500 font-medium">Nos conte sobre o seu hábito para gerarmos um plano científico.</p>
        </header>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                    <Cigarette className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">O que você fuma?</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {["Cigarros", "Tabaco de enrolar", "Vaper / Pod"].map(opt => (
                    <OptionButton key={opt} label={opt} active={whatFuma === opt} onClick={() => setWhatFuma(opt)} />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Seu primeiro cigarro do dia?</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {["Em 5 minutos", "6-30 minutos", "31-60 minutos", "Mais de 60 minutos"].map(opt => (
                    <OptionButton key={opt} label={opt} active={tempoPrimeiroCigarro === opt} onClick={() => setTempoPrimeiroCigarro(opt)} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                      <Cigarette className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Frequência Diária</h3>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Quantos cigarros por dia?</p>
                 <input 
                   type="number" value={quantosPorDia} onChange={e => setQuantosPorDia(e.target.value)}
                   placeholder="Ex: 20"
                   className="w-full h-16 bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-6 text-xl font-bold text-slate-900 outline-none transition-all"
                 />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                    <Package className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Tamanho do Maço</h3>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unidades por embalagem?</p>
                <input 
                  type="number" value={cigarrosNoMaco} onChange={e => setCigarrosNoMaco(e.target.value)}
                  placeholder="Ex: 20"
                  className="w-full h-16 bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl px-6 text-xl font-bold text-slate-900 outline-none transition-all"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Gasto Médio</h3>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Quanto custa o maço hoje?</p>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-300">R$</span>
                  <input 
                    type="number" value={precoMaco} onChange={e => setPrecoMaco(e.target.value)}
                    placeholder="12.00"
                    className="w-full h-20 bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-xl pl-16 px-6 text-3xl font-bold text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 relative shadow-sm">
                 <div className="flex gap-4 mb-3 items-center">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600">Privacidade Garantida</span>
                 </div>
                 <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                   Seus dados estão seguros e criptografados. Nada será compartilhado com terceiros.
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-6">
          <Button 
            onClick={handleContinue}
            disabled={isSubmitting}
            className="w-full h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold uppercase tracking-widest shadow-xl shadow-blue-200 flex items-center justify-center gap-4 transition-all"
          >
            {isSubmitting ? <Loader2 className="animate-spin w-8 h-8" /> : (
               <>
                 {step === 3 ? "Finalizar Configuração" : "Próximo Passo"}
                 <ArrowRight className="w-6 h-6" />
               </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}



function OptionButton({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all border",
        active 
          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" 
          : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/10"
      )}
    >
      <span className="text-sm font-bold tracking-tight">{label}</span>
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center transition-all",
        active ? "bg-white/20 text-white" : "bg-slate-50 text-slate-300"
      )}>
        {active ? <Check className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
      </div>
    </button>
  );
}
