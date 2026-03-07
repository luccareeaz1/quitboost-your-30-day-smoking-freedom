import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-dark" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Tecnologia + Psicologia</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-primary-foreground font-display">
              Pare de fumar em{" "}
              <span className="text-gradient">30 dias</span>{" "}
              e economize milhares
            </h1>

            <p className="text-lg md:text-xl mb-8 text-primary-foreground/70 max-w-lg font-body">
              QuitBoost combina gamificação, IA e suporte comunitário para ajudar
              você a vencer o vício de forma definitiva.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" onClick={() => navigate("/onboarding")} className="h-14 px-8 text-lg">
                Começar grátis <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="lg" onClick={() => {
                document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
              }} className="h-14 px-8 text-lg border-primary-foreground/30 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground">
                Calcular economia
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full gradient-hero border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-primary-foreground font-semibold">+12.000 usuários</p>
                <p className="text-primary-foreground/50 text-sm">já pararam de fumar</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
              <img src={heroDashboard} alt="QuitBoost Dashboard" className="w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
