import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Zap, ArrowLeft, Loader2, CreditCard, Rocket, Target, Star, ShieldCheck, Sparkles, TrendingUp, Key, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/utils/analytics";

const PLANS = [
  {
    id: "standard",
    name: "Standard",
    price: "39,90",
    priceId: "price_1TDaiH2N0nzreyfm7NzaopPG",
    desc: "Início da jornada",
    icon: Rocket,
    color: "text-blue-400",
    features: [
      "Protocolo de 30 dias",
      "Monitor de Saúde em Tempo Real",
      "Economia acumulada",
      "Conquistas e badges",
      "Comunidade",
    ],
  },
  {
    id: "elite",
    name: "Elite Pro",
    price: "197,90",
    priceId: "price_1TDaj82N0nzreyfmstYsVMTI",
    desc: "Resultados definitivos",
    badge: "MAIS ESCOLHIDO",
    icon: Sparkles,
    color: "text-blue-600",
    features: [
      "Tudo do Standard",
      "Coach IA ilimitado",
      "Previsão de gatilhos",
      "Comunidade VIP",
      "Suporte prioritário 24/7",
      "Relatórios em PDF",
      "Protocolos anti-crise",
    ],
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("elite");
  const { user } = useAuth();

  useEffect(() => {
    trackEvent("checkout_view");
  }, []);

  const plan = PLANS.find(p => p.id === selectedPlan)!;

  const handlePayment = async () => {
    if (!user) {
      toast.error("Faça login para continuar.");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      trackEvent("checkout_initiation", { plan: selectedPlan });
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: plan.priceId },
      });

      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      console.error("Erro no pagamento:", error);
      toast.error("Erro ao abrir checkout. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-50 rounded-full blur-[120px] -mr-[25vw] -mt-[25vw] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-100/20 rounded-full blur-[100px] -ml-[20vw] -mb-[20vw] pointer-events-none" />

      <div className="max-w-6xl w-full relative z-10 flex flex-col items-center">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors mb-16 self-start outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Voltar
        </button>

        {/* Header Section */}
        <header className="text-center mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Garantia Reembolso 7 Dias</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6 uppercase">
            Sua nova vida <span className="text-blue-600">começa agora</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Escolha o plano que melhor se adapta à sua determinação.</p>
        </header>

        {/* Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mb-16">
          {PLANS.map((p) => {
             const isSelected = selectedPlan === p.id;
             const Icon = p.icon;

             return (
               <motion.div
                 key={p.id}
                 whileHover={{ y: -5 }}
                 onClick={() => {
                   setSelectedPlan(p.id);
                   trackEvent("checkout_plan_select", { plan: p.id });
                 }}
                 className="cursor-pointer"
               >
                 <Card className={cn(
                    "relative h-full transition-all duration-500 rounded-3xl p-10 overflow-hidden border-2",
                    isSelected 
                      ? "bg-white border-blue-600 shadow-2xl shadow-blue-100 scale-[1.02]" 
                      : "bg-white border-slate-100 text-slate-900 shadow-xl shadow-slate-50 hover:border-blue-200"
                 )}>
                    {p.badge && (
                      <div className="absolute top-6 right-6 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {p.badge}
                      </div>
                    )}

                    <div className="mb-10">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border",
                        isSelected ? "bg-blue-600 text-white border-blue-500" : "bg-slate-50 text-blue-600 border-slate-100"
                      )}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight mb-1 uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">{p.name}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{p.desc}</p>
                    </div>

                    <div className="flex items-baseline gap-1 mb-8">
                       <span className="text-sm font-bold text-slate-400">R$</span>
                       <span className="text-5xl font-black tracking-tighter text-slate-900">{p.price.split(',')[0]}</span>
                       <span className="text-xl font-bold text-slate-400">,{p.price.split(',')[1]}</span>
                    </div>

                    <div className="h-px w-full bg-slate-100 mb-8" />

                    <ul className="space-y-4 flex-1">
                       {p.features.map(f => (
                         <li key={f} className="flex items-center gap-3">
                           <div className={cn(
                             "w-5 h-5 rounded-lg flex items-center justify-center transition-all",
                             isSelected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
                           )}>
                             <Check className="w-3 h-3" strokeWidth={4} />
                           </div>
                           <span className={cn(
                             "text-[11px] font-bold uppercase tracking-widest",
                             isSelected ? "text-slate-900" : "text-slate-500"
                           )}>{f}</span>
                         </li>
                       ))}
                    </ul>
                 </Card>
               </motion.div>
             );
          })}
        </div>

        {/* Action Section */}
        <div className="max-w-md w-full text-center">
           <Button 
             onClick={handlePayment} 
             disabled={loading}
             className="w-full h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-2xl shadow-blue-100 flex items-center justify-center gap-4 transition-all active:scale-[0.98] outline-none"
           >
             {loading ? <Loader2 className="animate-spin w-8 h-8" /> : (
               <>
                 <div className="text-left">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Confirmar com Segurança</p>
                    <p className="text-lg font-black uppercase tracking-tight">Liberar {plan.name}</p>
                 </div>
                 <ChevronRight className="w-6 h-6" />
               </>
             )}
           </Button>
           
           <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <SecurityBadge icon={ShieldCheck} text="Checkout Seguro" />
              <SecurityBadge icon={Key} text="Criptografia SSL" />
              <SecurityBadge icon={TrendingUp} text="+94% de Sucesso" />
           </div>
        </div>
      </div>
    </div>
  );
}

function SecurityBadge({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-2 text-slate-300">
      <Icon className="w-4 h-4" />
      <span className="text-[9px] font-bold uppercase tracking-widest">{text}</span>
    </div>
  );
}
