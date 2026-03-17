import AICoachInterface from "@/components/app/AICoachInterface";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";

export default function AICoach() {
  const { subscription } = useAuth();
  const navigate = useNavigate();

  if (subscription !== 'elite') {
    return (
      <AppLayout>
        <div className="container max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-[2.5rem] bg-amber-50 text-amber-500 flex items-center justify-center mb-10 border border-amber-100 shadow-xl shadow-amber-500/10">
            <Star size={40} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Acesso <span className="text-primary italic">Elite Required.</span></h1>
          <p className="text-gray-500 font-medium max-w-lg mb-12">
            O Coach Neural IA é uma ferramenta avançada disponível exclusivamente para membros Elite. 
            Comece agora e tenha suporte 24/7 para vencer qualquer gatilho.
          </p>
          <Button 
            className="h-16 px-12 rounded-full bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-green-500/20 hover:scale-105 transition-all"
            onClick={() => navigate("/checkout")}
          >
            Fazer Upgrade para Elite
          </Button>
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
