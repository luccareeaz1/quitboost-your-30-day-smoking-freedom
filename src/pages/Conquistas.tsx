import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ShieldCheck, Zap, Sparkles, Star, HeartPulse, Wallet, Clock, Lock } from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import { useNavigate } from "react-router-dom";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";

const badgeDefinitions = [
  { id: 1, label: "Primeiro Passo", days: 0, icon: Sparkles, color: "text-blue-500", bg: "bg-blue-50", story: "Você tomou a decisão mais importante: declarar guerra ao vício. Sua jornada de 30 dias começou." },
  { id: 2, label: "Oxigenação", days: 1, icon: HeartPulse, color: "text-red-500", bg: "bg-red-50", story: "24 horas! O monóxido de carbono saiu do seu sangue. Seu coração bate com mais facilidade agora." },
  { id: 3, label: "Foco Total", days: 3, icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50", story: "3 dias! Toda a nicotina foi eliminada. Seus sentidos de paladar e olfato estão renascendo." },
  { id: 4, label: "Semana de Ferro", days: 7, icon: ShieldCheck, color: "text-green-500", bg: "bg-green-50", story: "Uma semana livre! Suas terminações nervosas começam a se regenerar. Você superou a fase crítica." },
  { id: 5, label: "Investidor de Vida", days: 14, icon: Wallet, color: "text-primary", bg: "bg-green-100", story: "14 dias! Sua circulação sanguínea melhorou. Você já economizou o suficiente para um presente especial." },
  { id: 6, label: "Novo Hábito", days: 21, icon: Star, color: "text-purple-500", bg: "bg-purple-50", story: "21 dias! A ciência afirma: um novo hábito neural se formou. Você não é mais um fumante em abstinência." },
  { id: 7, label: "Elite QuitBoost", days: 30, icon: Trophy, color: "text-orange-500", bg: "bg-orange-50", story: "30 dias de vitória absoluta! Sua capacidade pulmonar aumentou 30%. Você é oficialmente um Titã." },
];

const Conquistas = () => {
  const navigate = useNavigate();
  const [selectedBadge, setSelectedBadge] = useState<typeof badgeDefinitions[0] | null>(null);

  const profile = useMemo(() => {
    const stored = localStorage.getItem("quitboost_profile");
    return stored ? JSON.parse(stored) : null;
  }, []);

  if (!profile) {
    navigate("/onboarding");
    return null;
  }

  const quitDate = new Date(profile.quitDate);
  const diffDays = Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60 * 60 * 24));
  const unlockedCount = badgeDefinitions.filter(b => diffDays >= b.days).length;

  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto px-6 py-10">
        
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Trophy size={20} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Suas <span className="text-primary italic">Conquistas.</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-gray-400 font-medium">Você desbloqueou {unlockedCount} de {badgeDefinitions.length} marcos de liberdade.</p>
            <div className="h-1 flex-1 bg-gray-100 rounded-full max-w-[200px] overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000" 
                style={{ width: `${(unlockedCount / badgeDefinitions.length) * 100}%` }} 
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {badgeDefinitions.map((badge, i) => {
            const unlocked = diffDays >= badge.days;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => unlocked && setSelectedBadge(badge)}
                className={cn(
                  "relative group cursor-pointer transition-all",
                  !unlocked && "grayscale opacity-40 cursor-not-allowed"
                )}
              >
                <AppleCard className={cn(
                   "p-8 h-full flex flex-col items-center text-center justify-between aspect-square border-gray-100 bg-white hover:shadow-xl transition-all",
                   unlocked && "hover:border-primary/30"
                )}>
                  <div className={cn(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500",
                    unlocked ? badge.bg : "bg-gray-100"
                  )}>
                    {unlocked ? <badge.icon className={cn("w-8 h-8", badge.color)} /> : <Lock className="w-8 h-8 text-gray-400" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 leading-tight mb-1">{badge.label}</h3>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      {unlocked ? "Conquistado" : `Em ${badge.days} dias`}
                    </p>
                  </div>
                  {unlocked && (
                    <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles size={14} />
                    </div>
                  )}
                </AppleCard>
              </motion.div>
            );
          })}
        </div>

        {/* DETAILS OVERLAY */}
        <AnimatePresence>
          {selectedBadge && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-white/80 backdrop-blur-xl" 
                 onClick={() => setSelectedBadge(null)}
               />
               <motion.div
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative w-full max-w-md bg-white border border-gray-100 rounded-[3rem] p-12 text-center shadow-2xl"
               >
                 <div className={cn("w-24 h-24 mx-auto rounded-[2rem] flex items-center justify-center mb-8", selectedBadge.bg)}>
                    <selectedBadge.icon className={cn("w-12 h-12", selectedBadge.color)} />
                 </div>
                 <h2 className="text-3xl font-black text-gray-900 mb-4">{selectedBadge.label}</h2>
                 <p className="text-gray-500 font-medium leading-relaxed mb-10">{selectedBadge.story}</p>
                 <Button 
                   onClick={() => setSelectedBadge(null)}
                   className="w-full h-14 rounded-full bg-primary text-white font-bold uppercase tracking-widest shadow-xl shadow-green-500/20"
                 >
                   Compartilhar Conquista
                 </Button>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  );
};

export default Conquistas;
