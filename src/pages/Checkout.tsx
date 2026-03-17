import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Zap, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Default to elite if not specified
  const plan = location.state?.plan || {
    name: "Elite",
    price: "197,90",
    features: ["IA Coach Ilimitada", "Comunidade VIP", "Suporte 24/7", "Relatórios PDF"]
  };

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment gateway redirect
    await new Promise(r => setTimeout(r, 2000));
    localStorage.setItem('quitboost_subscription', plan.name.toLowerCase());
    toast.success("Pagamento aprovado! Bem-vindo ao time Elite.");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-10">
        
        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> Voltar
          </button>
          
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Finalizar <span className="text-primary italic">Inscrição.</span></h1>
            <p className="text-gray-500 font-medium">Você está a um passo de recuperar sua liberdade e sua saúde.</p>
          </div>

          <div className="space-y-4">
            {plan.features.map((f: string) => (
              <div key={f} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-primary">
                  <Check size={12} strokeWidth={3} />
                </div>
                {f}
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4 text-gray-400">
              <ShieldCheck size={40} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Pagamento Seguro</p>
                <p className="text-xs font-medium">Sua transação é criptografada e processada com segurança total.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Card */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <AppleCard className="p-10 bg-white border-gray-200 shadow-2xl space-y-8">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total a pagar</span>
              <span className="text-3xl font-black text-gray-900 italic">R${plan.price}</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-primary transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 font-bold text-xs uppercase">Card</div>
                  <span className="text-sm font-bold text-gray-700">Cartão de Crédito</span>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary" />
              </div>
              
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 font-bold text-xs uppercase">PIX</div>
                  <span className="text-sm font-bold text-gray-700">PIX (Em breve)</span>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
              </div>
            </div>

            <Button 
              className="w-full h-16 rounded-full bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-green-500/30 hover:scale-[1.02] active:scale-95 transition-all"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <Zap size={18} className="mr-2" fill="currentColor" /> Assinar {plan.name} Agora
                </>
              )}
            </Button>

            <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest">
              Ao assinar, você concorda com nossos termos de serviço e política de privacidade.
            </p>
          </AppleCard>
        </motion.div>

      </div>
    </div>
  );
}
