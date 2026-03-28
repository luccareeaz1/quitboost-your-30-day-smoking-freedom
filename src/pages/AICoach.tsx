import AICoachInterface from "@/components/app/AICoachInterface";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Star, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";
import { AppleCard } from "@/components/ui/apple-card";

export default function AICoach() {
  const { subscription } = useAuth();
  const navigate = useNavigate();

  if (subscription !== 'elite') {
    return (
      <AppLayout>
        <div className="container max-w-4xl mx-auto px-6 flex flex-col items-center">
          <AppleCard variant="glass-dark" className="w-full p-20 flex flex-col items-center text-center relative overflow-hidden group hover:border-amber-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl" />
            
            <div className="w-24 h-24 rounded-[2.5rem] bg-amber-500/10 text-amber-500 flex items-center justify-center mb-10 border border-amber-500/20 shadow-2xl shadow-amber-500/20 group-hover:scale-110 transition-transform duration-700">
              <Star size={44} fill="currentColor" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 italic">
              Protocolo <span className="text-amber-500 drop-shadow-glow">Elite</span> Necessário.
            </h1>
            
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-12 max-w-lg leading-relaxed">
              O Suporte Neural IA é o seu arsenal mais avançado contra o fumo. Ative sua licença Elite para desbloquear o Coach 24/7.
            </p>

            <Button 
              className="h-20 px-16 rounded-[2rem] bg-amber-500 text-black font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-500/20 hover:bg-amber-400 hover:scale-[1.05] transition-all"
              onClick={() => navigate("/checkout")}
            >
              <Sparkles size={20} className="mr-3" />
              Tornar-se membro Elite
            </Button>

            <div className="mt-14 flex items-center gap-6 opacity-30">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Lock size={14} /> Neural Security
               </div>
               <div className="w-[1px] h-4 bg-white/20" />
               <div className="text-[10px] font-black uppercase tracking-widest">
                  Unlimited Protocols
               </div>
            </div>
          </AppleCard>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AICoachInterface />
    </AppLayout>
  );
}
