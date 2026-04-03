import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap, User, Menu, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const NavBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-3xl"
    >
      <div className="container mx-auto px-6 h-24 flex items-center justify-between max-w-7xl">
        {/* Brand Logo */}
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="w-12 h-12 bg-primary/20 rounded-[1.2rem] flex items-center justify-center border border-primary/30 group-hover:bg-primary group-hover:scale-110 transition-all duration-700 shadow-glow">
            <Zap className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="currentColor" />
          </div>
          <div className="flex flex-col">
             <span className="text-3xl font-black text-white tracking-tighter leading-none italic uppercase">Quit<span className="text-primary italic">Boost.</span></span>
             <div className="flex items-center gap-2 mt-1">
               <Shield size={8} className="text-primary/60" />
               <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] leading-none italic">Sovereign Protocol</span>
             </div>
          </div>
        </div>

        {/* Global Navigation */}
        <div className="hidden lg:flex items-center gap-12">
          {["Funcionalidades", "Protocolo", "Esquadrão", "Acesso"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary transition-all duration-300 italic relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-500" />
            </a>
          ))}
        </div>

        {/* Tactical Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <Button 
              variant="default" 
              size="lg" 
              className="h-14 rounded-2xl px-10 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] italic hover:scale-105 active:scale-95 transition-all shadow-glow group overflow-hidden relative" 
              onClick={() => navigate("/dashboard")}
            >
               <span className="relative z-10">Ponte de Comando</span>
               <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:inline-flex text-white/40 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] italic transition-all" 
                onClick={() => navigate("/auth")}
              >
                Iniftrar
              </Button>
              <Button 
                variant="default" 
                size="lg" 
                className="h-14 rounded-2xl px-12 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] italic hover:scale-105 active:scale-95 transition-all shadow-glow group" 
                onClick={() => navigate("/onboarding")}
              >
                Recrutamento <Zap size={14} className="ml-2 animate-pulse" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="lg:hidden rounded-2xl text-white/40 hover:text-white bg-white/5 border border-white/10">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
