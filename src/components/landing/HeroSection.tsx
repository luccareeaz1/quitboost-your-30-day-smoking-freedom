import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="container relative z-10 mx-auto px-6 pt-32 pb-20 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mb-8">
              <Shield size={14} /> Método Científico Comprovado
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6 text-gradient-white">
              Pare de fumar com<br />
              <span className="text-gradient">inteligência artificial</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              A plataforma que combina neurociência, IA personalizada e comunidade 
              de apoio para te ajudar a viver livre do cigarro em 30 dias.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="h-14 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all glow-green"
              >
                Começar Gratuitamente <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
                className="h-14 px-8 rounded-xl border-border bg-secondary/50 text-foreground hover:bg-secondary font-semibold text-base"
              >
                Calcular Economia
              </Button>
            </div>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {[
              { icon: Zap, title: "Coach IA 24/7", desc: "Suporte personalizado quando você mais precisa" },
              { icon: Heart, title: "Saúde em Tempo Real", desc: "Acompanhe a regeneração do seu corpo" },
              { icon: Shield, title: "Método Comprovado", desc: "Baseado em estudos da OMS e CDC" },
            ].map((f, i) => (
              <div key={i} className="p-5 rounded-2xl bg-card/50 border border-border hover:border-primary/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-all">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex items-center justify-center gap-10 md:gap-16"
          >
            {[
              { value: "15.4k+", label: "Usuários ativos" },
              { value: "98.4%", label: "Taxa de sucesso" },
              { value: "R$9.4M", label: "Economia gerada" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
