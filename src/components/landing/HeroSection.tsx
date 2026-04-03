import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShieldCheck, Zap, Crosshair, Cpu, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SparklesCore } from "@/components/ui/sparkles";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden bg-black flex flex-col font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* === SPARKLES HERO BLOCK === */}
      <div className="w-full bg-black flex flex-col items-center justify-center overflow-hidden pt-48 pb-12 relative">
        {/* Main title */}
        <div className="relative z-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 px-6 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-xl flex items-center gap-3 shadow-glow"
          >
            <ShieldCheck size={14} className="text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white italic">Protocolo Alpha v4.0 Ativo</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="md:text-8xl text-5xl lg:text-[10rem] font-black text-center text-white relative z-20 tracking-tighter uppercase italic leading-none"
          >
            Quit<span className="text-primary italic drop-shadow-glow">Boost.</span>
          </motion.h1>
        </div>

        {/* Sparkles area — Emerald Optimized */}
        <div className="w-[60rem] h-40 relative mt-4">
          {/* Emerald Gradient lines */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-[2px] w-3/4 blur-sm shadow-glow" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent h-px w-1/4" />

          {/* Core particle component */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleDensity={1500}
            className="w-full h-full"
            particleColor="#10b981" // Emerald Primary
          />

          {/* Radial gradient mask */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
        </div>
      </div>

      {/* === REST OF HERO === */}
      <div className="relative z-10 flex-1 px-6">
        <div className="container relative z-10 mx-auto max-w-5xl py-12">
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl text-white/40 max-w-4xl mx-auto mb-16 font-black italic text-center uppercase tracking-tight leading-tight"
          >
            A única plataforma que usa{" "}
            <span className="text-white drop-shadow-glow">Inteligência Artificial Neural</span>{" "}
            para reprogramar sua biologia e te libertar do cigarro em 30 dias.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-8 items-center justify-center mb-24"
          >
            <Button
              size="lg"
              onClick={() => navigate("/onboarding")}
              className="h-24 px-16 text-[13px] rounded-[2.5rem] bg-white text-black font-black uppercase tracking-[0.3em] shadow-glow hover:scale-105 active:scale-95 transition-all italic flex items-center group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Iniciar Recrutamento</span>
              <ArrowRight className="relative z-10 ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>

            <div className="flex flex-col items-center sm:items-start px-6 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex gap-1 text-primary mb-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={14} fill="currentColor" className="drop-shadow-glow" />
                ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">
                Sincronização Perfeita <span className="text-white">5.0/5.0</span>
              </p>
            </div>
          </motion.div>

          {/* Tactical Specs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-16"
          >
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:shadow-glow transition-all">
                <Cpu size={20} />
              </div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest italic mb-1">Mecanismo</p>
              <p className="text-[11px] font-bold text-white/40 italic">IA Neuro-Focada</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:shadow-glow transition-all">
                <Crosshair size={20} />
              </div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest italic mb-1">Taxa Êxito</p>
              <p className="text-[11px] font-bold text-white/40 italic">94.2% Conclusão</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:shadow-glow transition-all">
                <Globe size={20} />
              </div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest italic mb-1">Global</p>
              <p className="text-[11px] font-bold text-white/40 italic">+12k Usuários</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:shadow-glow transition-all">
                <ShieldCheck size={20} />
              </div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest italic mb-1">Segurança</p>
              <p className="text-[11px] font-bold text-white/40 italic">Militar AES-256</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero Footnote */}
      <div className="pb-12 text-center relative z-20">
         <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em] italic">
           Sincronized with Global Health Standards • 2026 Fleet Base
         </p>
      </div>
    </section>
  );
};

export default HeroSection;
