import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BackgroundLines } from "@/components/ui/BackgroundLines";
import { Zap, ShieldCheck, HeartPulse, Wallet, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-white">
      <BackgroundLines />
      
      <div className="container mx-auto px-6 relative z-10 w-full max-w-6xl">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-600 text-[10px] font-bold mb-10 uppercase tracking-[0.2em] shadow-sm"
          >
            <Zap size={14} fill="currentColor" /> Tecnologia + Ciência Comportamental
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-gray-900 leading-[1.05] tracking-tight mb-8"
          >
            O fim do vício <br />
            <span className="text-primary italic">começa agora.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto mb-12"
          >
            Recupere seu fôlego, sua saúde e seu dinheiro com o protocolo de 30 dias mais avançado já criado.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Button 
              size="lg" 
              className="h-16 px-10 rounded-full text-lg font-bold bg-primary hover:bg-green-600 text-white shadow-xl shadow-green-500/20 hover:scale-105 active:scale-95 transition-all group"
              onClick={() => navigate("/onboarding")}
            >
              Iniciar Minha Jornada <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-16 px-10 rounded-full text-lg font-bold border-gray-200 text-gray-600 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all"
              onClick={() => {
                const calc = document.getElementById('calculator');
                calc?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Cálculo de Impacto
            </Button>
          </motion.div>

          {/* Minimal Stats */}
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.6 }}
             className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gray-100"
          >
            {[
              { label: "Vidas Salvas", val: "5.4k+", icon: ShieldCheck },
              { label: "Economizados", val: "R$ 1.2M", icon: Wallet },
              { label: "Saúde Restabelecida", val: "100%", icon: HeartPulse },
              { label: "Suporte Ativo", val: "24/7", icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <stat.icon className="w-5 h-5 text-primary mb-3" />
                <span className="text-xl font-bold text-gray-900">{stat.val}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
