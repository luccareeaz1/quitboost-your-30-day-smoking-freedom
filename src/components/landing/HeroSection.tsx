import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-person.png";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-transparent">
      <div className="container relative z-10 mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest mb-8">
              <Sparkles size={12} /> O Futuro do Bem-Estar
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic">
              Seu Último <br /> 
              <span className="text-white not-italic">Cigarro.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-lg mb-12 leading-relaxed font-medium">
              30 dias para a liberdade definitiva. Combinamos neurociência de ponta, 
              suporte humanizado de IA e uma comunidade de elite para você retomar o controle agora.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Button
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="h-16 px-10 text-md rounded-2xl bg-white text-black hover:bg-white/90 font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Ativar Protocolo <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
                className="h-16 px-10 text-md rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold transition-all backdrop-blur-md"
              >
                Calcular Economia
              </Button>
            </div>

            {/* QUICK STATS */}
            <div className="mt-16 flex items-center gap-10">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white italic tracking-tighter">12.8k</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Usuários Livres</span>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white italic tracking-tighter">98.4%</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Taxa de Sucesso</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: VISUALS (CLAYO STYLE) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.05)] aspect-[4/5] lg:aspect-square">
                <img 
                  src={heroImg} 
                  alt="Libertade" 
                  className="w-full h-full object-cover filter brightness-[0.8]"
                />
                
                {/* FLOATING CARDS */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute bottom-10 left-10 right-10 p-6 glass-dark rounded-[2.5rem] border-white/20 shadow-2xl space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                                <Zap size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white uppercase tracking-widest">Protocolo Ativo</p>
                                <p className="text-[10px] text-white/40">Sincronização Neural Estável</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-primary italic">80%</p>
                        </div>
                    </div>
                    
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "80%" }}
                          transition={{ delay: 1.5, duration: 2 }}
                          className="h-full bg-primary"
                        />
                    </div>
                </motion.div>

                {/* SMALL TOP BADGE */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-10 right-10 p-4 px-6 glass rounded-full flex items-center gap-3 shadow-xl backdrop-blur-2xl bg-white/90"
                >
                    <ShieldCheck className="text-black" size={18} />
                    <span className="text-[10px] font-black text-black uppercase tracking-widest leading-none">Proteção Ativa</span>
                </motion.div>
            </div>
            
            {/* GLOW EFFECT */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
