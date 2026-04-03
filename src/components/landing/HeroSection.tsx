import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-dashboard-new.png";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-background">
      {/* Background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 backdrop-blur-md"
          >
            <Zap size={14} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">O Futuro da Liberdade está aqui</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.8] mb-8 text-foreground"
          >
            Quit<span className="text-primary italic">Boost</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12 font-medium italic"
          >
            A única plataforma que usa <span className="text-foreground font-bold">Inteligência Artificial Neural</span> para reprogramar seu cérebro e te libertar do cigarro em 30 dias.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 items-center"
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
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nota de excelência 5.0/5</p>
            </div>
          </motion.div>
        </div>

        {/* Hero Image Mockup with 3D Effect */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full scale-75" />
          <div className="relative rounded-[3rem] p-4 bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <img 
              src={heroImg} 
              alt="QuitBoost Dashboard" 
              className="rounded-[2.5rem] w-full shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Floating badges */}
            <div className="absolute top-12 left-12 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl hidden lg:block animate-bounce-slow">
              <ShieldCheck className="w-8 h-8 text-primary mb-3" />
              <p className="text-xs font-black text-white uppercase tracking-widest">Protocolo Seguro</p>
            </div>
            <div className="absolute bottom-12 right-12 p-6 rounded-3xl bg-primary/90 text-white backdrop-blur-2xl shadow-2xl hidden lg:block animate-pulse-slow">
              <p className="text-4xl font-black italic">-R$12k</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Economia estimada</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
