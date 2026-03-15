import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Subtle gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-muted/50 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] rounded-full bg-muted/30 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-6">
              Breathe Again AI
            </p>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 tracking-tight">
              Respire.
              <br />
              <span className="text-muted-foreground">Viva livre.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Pare de fumar em 30 dias com tecnologia, psicologia comportamental
              e uma comunidade que te apoia a cada passo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="h-14 px-10 text-base rounded-full"
              >
                Começar grátis <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
                className="h-14 px-10 text-base rounded-full"
              >
                Calcular economia
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-16 flex items-center justify-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-foreground font-semibold text-sm">+12.000 pessoas</p>
                <p className="text-muted-foreground text-xs">já respiram melhor</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
