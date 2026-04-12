import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/lib/services";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Heart, Wallet, Users, Zap, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/utils/analytics";


export default function OnboardingMotivo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customMotivation, setCustomMotivation] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    if (!user && !isSubmitting) navigate("/auth");
  }, [user, navigate, isSubmitting]);

  const handleSelect = async (motivation: string) => {
    if (!user) return;
    try {
      setIsSubmitting(true);
      const profile = await profileService.get(user.id);
      const existingTriggers = profile?.triggers || [];
      
      await profileService.update(user.id, {
        triggers: [...existingTriggers, `Motivo: ${motivation}`]
      });
      
      trackEvent("motivation_selected", { motivation });

      
      navigate("/checkout");
    } catch (error) {
      console.error("Erro ao salvar motivo:", error);
      navigate("/checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = [
    { label: "Viver uma vida longa e feliz", icon: Heart, color: "text-blue-500" },
    { label: "Economizar dinheiro", icon: Wallet, color: "text-blue-600" },
    { label: "Estar presente para minha família", icon: Users, color: "text-blue-400" },
    { label: "Sentir a liberdade total", icon: Zap, color: "text-blue-500" },
    { label: "Cumprir uma promessa", icon: ShieldCheck, color: "text-blue-600" }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 pb-20 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/20 rounded-full blur-[100px] -ml-40 -mb-40" />

      <div className="max-w-xl w-full relative z-10">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Personalização</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none mb-6">
             O que te <span className="text-blue-600">move?</span>
          </h1>
          <p className="text-slate-500 font-medium">Recordar sua motivação é o principal fator científico para o sucesso na cessação.</p>
        </header>

        <div className="space-y-3">
           {options.map((opt, i) => (
             <motion.button
               key={opt.label}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               disabled={isSubmitting}
               onClick={() => handleSelect(opt.label)}
               className="w-full group flex items-center gap-5 p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/10 transition-all text-left shadow-sm hover:shadow-blue-100/50"
             >
               <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100", opt.color)}>
                 <opt.icon className="w-5 h-5" />
               </div>
               <span className="text-sm font-bold text-slate-800 tracking-tight flex-1">{opt.label}</span>
               <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
             </motion.button>
           ))}

           {!showCustom ? (
             <button 
                onClick={() => setShowCustom(true)}
                className="w-full p-6 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
             >
                Escrever motivo personalizado
             </button>
           ) : (
             <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 mt-6">
                <textarea 
                  placeholder="Descreva o que te motiva..." 
                  value={customMotivation}
                  onChange={(e) => setCustomMotivation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white rounded-2xl p-6 text-lg font-bold min-h-[120px] outline-none transition-all placeholder:text-slate-300 resize-none"
                  autoFocus
                />
                <Button 
                   onClick={() => handleSelect(customMotivation)}
                   disabled={!customMotivation.trim() || isSubmitting}
                   className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
                >
                   Salvar Motivação <ArrowRight className="w-4 h-4" />
                </Button>
             </motion.div>
           )}
        </div>

        {!showCustom && (
           <div className="mt-12 text-center">
              <button 
                onClick={() => {
                  trackEvent("motivation_skipped");
                  navigate("/checkout");
                }}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-colors"
              >
                Ignorar por enquanto
              </button>

           </div>
        )}
      </div>
    </div>
  );
}
