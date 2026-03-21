import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Zap, ArrowLeft, Loader2, Sparkles, CreditCard, Landmark } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/services";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Default to elite if not specified
  const plan = location.state?.plan || {
    name: "Elite",
    price: "197,90",
    features: ["IA Coach Ilimitada", "Comunidade VIP", "Suporte 24/7", "Relatórios PDF"]
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Sua sessão expirou. Reconecte-se.");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      // Simulate real payment gateway delay (Stripe/Pix)
      await new Promise(r => setTimeout(r, 2500));
      
      const planName = plan.name.toLowerCase();
      
      // Update the Subscription table in Supabase
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan: planName,
          status: 'active',
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success(`Pagamento aprovado! Bem-vindo ao plano ${plan.name}.`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no pagamento:", error);
      toast.error("Ocorreu um erro no processamento bancário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20 animate-fade-in">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        
        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all mb-12"
          >
            <div className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center group-hover:-translate-x-1 transition-transform">
               <ArrowLeft size={14} />
            </div>
            Voltar
          </button>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-foreground tracking-tighter leading-none">
              Inicie seu <br />
              <span className="text-primary italic">Protocolo.</span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-sm italic">
              Seu investimento em saúde é o único com retorno de 100% em tempo de vida.
            </p>
          </div>

          <div className="space-y-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Plano Selecionado:</p>
            <div className="bg-card border border-border/50 p-6 rounded-[32px] shadow-soft">
               <h3 className="text-2xl font-black italic mb-2 tracking-tight">{plan.name}</h3>
               <p className="text-xs font-bold text-primary uppercase tracking-widest mb-6">Acesso Vitalício (2026 Edition)</p>
               <div className="grid gap-3">
                 {plan.features.slice(0, 4).map((f: string) => (
                   <div key={f} className="flex items-center gap-3 text-xs font-semibold text-foreground">
                     <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                       <Check size={12} strokeWidth={4} />
                     </div>
                     {f}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="pt-10 border-t border-border/40">
            <div className="flex items-center gap-5 text-muted-foreground">
              <div className="p-4 rounded-[24px] bg-card border border-border shadow-soft">
                 <ShieldCheck size={32} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Garantia Brasil 2026</p>
                <p className="text-xs font-medium opacity-60">Transação Segura (SSL) e 7 dias para cancelamento total conforme CDC.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Card */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
        >
          <AppleCard className="p-10 bg-card border-none shadow-elevated rounded-[48px] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Zap className="w-16 h-16 text-primary" /></div>
            
            <div className="flex justify-between items-end mb-12">
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total a Pagar</p>
                 <span className="text-4xl font-black text-foreground italic">R${plan.price}</span>
               </div>
               <div className="text-right">
                 <p className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">Vitalício</p>
               </div>
            </div>

            <div className="space-y-4 mb-10">
              <div className="p-6 rounded-[28px] bg-foreground text-background flex items-center justify-between group cursor-pointer shadow-lg hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-4">
                  <CreditCard size={24} />
                  <span className="text-sm font-black uppercase tracking-widest">Cartão de Crédito</span>
                </div>
                <div className="w-6 h-6 rounded-full border-4 border-background bg-primary" />
              </div>
              
              <div className="p-6 rounded-[28px] bg-muted/40 border border-border flex items-center justify-between group cursor-pointer hover:border-primary transition-all">
                <div className="flex items-center gap-4">
                  <Landmark size={24} />
                  <span className="text-sm font-black uppercase tracking-widest">Pix Imediato</span>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-border" />
              </div>
            </div>

            <Button 
              className="w-full h-18 rounded-[28px] bg-primary text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all py-8"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <div className="flex items-center gap-3">
                   <Sparkles size={18} />
                   Confirmar Inscrição {plan.name}
                </div>
              )}
            </Button>

            <div className="mt-8 flex flex-col items-center gap-4">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center overflow-hidden">
                       <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="user" />
                    </div>
                  ))}
                  <div className="h-8 px-3 rounded-full bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center border-2 border-card">
                     +2.4k Assinaram Hoje
                  </div>
               </div>
               <p className="text-[9px] text-center text-muted-foreground font-black uppercase tracking-[0.2em] italic">
                 Última vaga disponível para o suporte prioritário 2026.
               </p>
            </div>
          </AppleCard>
        </motion.div>

      </div>
    </div>
  );
}
