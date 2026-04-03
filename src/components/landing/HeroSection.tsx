import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SparklesCore } from "@/components/ui/sparkles";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden bg-background flex flex-col">
      {/* === SPARKLES HERO BLOCK (top, exact replica of the image) === */}
      <div className="w-full bg-black flex flex-col items-center justify-center overflow-hidden pt-40 pb-0">
        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="md:text-7xl text-4xl lg:text-9xl font-bold text-center text-white relative z-20 tracking-tight"
        >
          Quit<span className="text-indigo-400 italic">Boost</span>
        </motion.h1>

        {/* Sparkles area — exactly as in image */}
        <div className="w-[40rem] h-40 relative">
          {/* Gradient lines — exact replica */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

          {/* Core particle component */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />

          {/* Radial gradient mask — fades particles at edges just like the image */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
        </div>
      </div>

      {/* === REST OF HERO (below the sparkles) === */}
      <div className="relative z-10 bg-background flex-1">
        {/* Soft gradient blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-6 max-w-7xl py-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-md">
              <Zap size={14} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">O Futuro da Liberdade está aqui</span>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-medium italic text-center"
          >
            A única plataforma que usa{" "}
            <span className="text-foreground font-bold">Inteligência Artificial Neural</span>{" "}
            para reprogramar seu cérebro e te libertar do cigarro em 30 dias.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 items-center justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/onboarding")}
              className="h-20 px-12 text-lg rounded-full bg-primary text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
            >
              Iniciar Protocolo <ArrowRight className="ml-3 w-6 h-6 animate-pulse" />
            </Button>

            <div className="flex flex-col items-start px-4">
              <div className="flex gap-0.5 text-amber-500 mb-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Nota de excelência 5.0/5
              </p>
            </div>
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-14"
          >
            <div className="flex -space-x-3">
              {["A", "B", "C", "D", "E"].map(l => (
                <div
                  key={l}
                  className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-bold text-muted-foreground"
                >
                  {l}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-foreground font-semibold text-sm">+12.000 pessoas</p>
              <p className="text-muted-foreground text-xs">já respiram livres</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 pl-6 border-l border-border text-muted-foreground text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} className="text-primary" />
              Protocolo Seguro
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
