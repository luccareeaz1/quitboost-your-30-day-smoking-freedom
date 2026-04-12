"use client"

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { NeonOrbs } from "@/components/ui/neon-orbs";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
      <div className="relative z-30 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-600 mb-8 border border-blue-100 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{t('hero.socialProof')}</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8 max-w-4xl">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mb-12">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => navigate("/onboarding")}
              className="group relative px-10 py-5 rounded-2xl bg-blue-600 text-white font-bold text-lg tracking-tight transition-all duration-300 hover:bg-blue-700 hover:shadow-2xl shadow-blue-200/50"
            >
              <div className="flex items-center gap-2">
                {t('hero.cta')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <Lock className="w-4 h-4" />
              <span>Privacidade garantida • Seus dados estão seguros</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle patterns for a professional look */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-100/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-50/50 blur-[100px] rounded-full" />
      </div>
    </section>
  );
};

export default HeroSection;
