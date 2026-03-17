import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-black text-white">
      {/* Dynamic Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(50,50,50,1),rgba(0,0,0,1))]" />
        
        {/* Moving Particles/Glows */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20 blur-[100px]"
            initial={{ 
              width: Math.random() * 300 + 100, 
              height: Math.random() * 300 + 100,
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5
            }}
            animate={{
              x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
              y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <motion.div 
              style={{ opacity }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-primary text-[10px] font-black mb-8 uppercase tracking-[0.3em]"
            >
              <Sparkles size={14} className="animate-pulse" />
              A Revolução do🚭 QuitBoost AI
            </motion.div>

            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] mb-10 tracking-tighter"
            >
              PARE.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">AGORA.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-16 leading-relaxed font-medium"
            >
              30 dias. Tecnologia Neural de Resposta. 
              <span className="text-white"> Resultados agressivos.</span> Sua nova vida começa no primeiro clique.
            </motion.p>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto"
            >
              <Button
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="h-16 px-12 text-lg font-bold rounded-full bg-primary text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(var(--primary),0.5)] group"
              >
                DOMINAR MINHA SAÚDE <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
                className="h-16 px-12 text-lg font-bold rounded-full border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white backdrop-blur-sm transition-all"
              >
                CÁLCULO DE IMPACTO
              </Button>
            </motion.div>

            {/* Premium Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-24 flex flex-wrap justify-center gap-12 text-white/40 font-bold uppercase tracking-widest text-[10px]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" />
                Segurança Biomédica
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-primary" />
                Feedback em Tempo Real
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                IA Psicológica Avançada
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Hero Image / Visualization with Parallax */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-video bg-gradient-to-t from-primary/20 to-transparent blur-[120px] rounded-full pointer-events-none z-0" 
      />
    </section>
  );
};

export default HeroSection;
