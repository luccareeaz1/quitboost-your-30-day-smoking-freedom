import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Zap, ArrowLeft, Loader2, CreditCard, Rocket, Target, Star, ShieldCheck, Sparkles, TrendingUp, Key } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "standard",
    name: "Standard",
    price: "39,90",
    priceId: "price_1TDaiH2N0nzreyfm7NzaopPG",
    desc: "Início da jornada",
    icon: Rocket,
    color: "text-slate-400",
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
    color: "text-primary",
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

  const plan = PLANS.find(p => p.id === selectedPlan)!;

  const handlePayment = async () => {
    if (!user) {
      toast.error("Faça login para continuar.");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] -mr-[25vw] -mt-[25vw] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-sky-400/5 rounded-full blur-[100px] -ml-[20vw] -mb-[20vw] pointer-events-none" />

      <div className="max-w-6xl w-full relative z-10 flex flex-col items-center">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors mb-16 self-start"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Voltar ao Sistema
        </button>

        {/* Header Section */}
        <header className="text-center mb-20 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/10 shadow-sm mb-8">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Garantia Reembolso 7 Dias</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none mb-6">
            Sua nova vida <span className="text-primary italic">começa agora.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Escolha o plano que melhor se adapta à sua determinação.</p>
        </header>

        {/* Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-20">
          {PLANS.map((p) => {
             const isSelected = selectedPlan === p.id;
             const Icon = p.icon;

             return (
               <motion.div
                 key={p.id}
                 whileHover={{ y: -5 }}
                 onClick={() => setSelectedPlan(p.id)}
                 className="cursor-pointer"
               >
                 <Card className={cn(
                    "relative border-none h-full transition-all duration-500 rounded-[3rem] p-12 overflow-hidden",
                    isSelected 
                      ? "bg-slate-900 text-white shadow-2xl shadow-slate-300 scale-[1.02]" 
                      : "bg-white text-slate-900 shadow-xl shadow-slate-100 border-2 border-transparent hover:border-slate-200"
                 )}>
                    {p.badge && (
                      <div className="absolute top-8 right-8 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                        {p.badge}
                      </div>
                    )}

                    <div className="mb-12">
                      <div className={cn(
                        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner",
                        isSelected ? "bg-white/10 text-white" : "bg-slate-50 text-primary"
                      )}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-black tracking-tight mb-2 uppercase">{p.name}</h3>
                      <p className={cn("text-sm font-bold", isSelected ? "text-white/40" : "text-slate-400")}>{p.desc}</p>
                    </div>

                    <div className="flex items-baseline gap-2 mb-10">
                       <span className={cn("text-sm font-black uppercase tracking-widest", isSelected ? "text-white/20" : "text-slate-300")}>R$</span>
                       <span className="text-6xl font-black tracking-tighter">{p.price.split(',')[0]}</span>
                       <span className={cn("text-2xl font-black", isSelected ? "text-white/40" : "text-slate-300")}>,{p.price.split(',')[1]}</span>
                    </div>

                    <div className={cn("h-px w-full mb-10", isSelected ? "bg-white/10" : "bg-slate-100")} />

                    <ul className="space-y-6 flex-1">
                       {p.features.map(f => (
                         <li key={f} className="flex items-center gap-4 group">
                           <div className={cn(
                             "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                             isSelected ? "bg-primary text-white" : "bg-slate-50 text-slate-300"
                           )}>
                             <Check className="w-3.5 h-3.5" strokeWidth={4} />
                           </div>
                           <span className={cn(
                             "text-[13px] font-black uppercase tracking-widest",
                             isSelected ? "text-white/80" : "text-slate-500"
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
             className="w-full h-24 bg-slate-900 hover:bg-black text-white rounded-[2.5rem] shadow-2xl shadow-slate-300 group overflow-hidden relative"
           >
             <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
             <div className="relative z-10 flex items-center justify-center gap-6">
                {loading ? <Loader2 className="animate-spin w-8 h-8" /> : (
                  <>
                    <div className="text-left">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Confirmar Assinatura</p>
                       <p className="text-xl font-black uppercase tracking-tight">Liberar {plan.name}</p>
                    </div>
                    <ArrowLeft className="w-8 h-8 rotate-180" />
                  </>
                )}
             </div>
           </Button>
           
           <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              <SecurityBadge icon={ShieldCheck} text="Checkout Seguro" />
              <SecurityBadge icon={Key} text="Dados Criptografados" />
              <SecurityBadge icon={TrendingUp} text="+94% Sucesso" />
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
      <span className="text-[9px] font-black uppercase tracking-widest">{text}</span>
    </div>
  );
}
