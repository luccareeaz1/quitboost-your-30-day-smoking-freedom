"use client"

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { NeonOrbs } from "@/components/ui/neon-orbs";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-[#050a18] flex items-center justify-center overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0">
        <NeonOrbs 
          title="QUIT BOOST" 
          subtitle="O FUTURO É AGORA" 
        />
      </div>

      <div className="relative z-30 flex flex-col items-center mt-[120px] md:mt-[180px]">
        {/* CTA Button with matching glow */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 2.2 }}
        >
          <button
            onClick={() => navigate("/onboarding")}
            className="group relative overflow-hidden px-14 py-5 rounded-[18px] bg-white text-[#050a18] font-bold text-lg tracking-tight transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              boxShadow: "0 0 40px rgba(99, 102, 241, 0.4), 0 0 80px rgba(99, 102, 241, 0.2)"
            }}
          >
            <div className="relative z-10 flex items-center gap-2">
              Começar jornada
              <motion.span 
                animate={{ x: [0, 5, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
              >
                →
              </motion.span>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-r from-indigo-500 to-blue-400" />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 2.8, duration: 1 }}
          className="mt-8 text-[11px] font-bold tracking-[0.4em] text-white/20 uppercase"
        >
          A tecnologia definitiva para parar de fumar
        </motion.p>
      </div>

      {/* Social Proof */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="flex items-center gap-4 text-white/20 text-[10px] tracking-[0.2em] font-medium"
        >
          <span>ESTADO DA ARTE</span>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span>PROVEN RESULTS</span>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span>JOIN +87K USERS</span>
        </motion.div>
      </div>

      {/* Subtle overlay gradients for depth */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(5,10,24,0.4)_100%)]" />
    </section>
  );
};

export default HeroSection;
