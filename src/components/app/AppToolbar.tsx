import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, TrendingUp, Target, Users, Trophy, User, Bot, AlertTriangle, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import CravingModal from "@/components/dashboard/CravingModal";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Reactor", path: "/dashboard", icon: LayoutDashboard },
  { label: "Biológico", path: "/progresso", icon: TrendingUp },
  { label: "Missões", path: "/desafios", icon: Target },
  { label: "IA Neural", path: "/coach", icon: Bot },
  { label: "Esquadrão", path: "/comunidade", icon: Users },
  { label: "Hangar", path: "/conquistas", icon: Trophy },
  { label: "Comandante", path: "/perfil", icon: User },
];

const AppToolbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCravingModal, setShowCravingModal] = useState(false);

  return (
    <>
      <CravingModal open={showCravingModal} onClose={() => setShowCravingModal(false)} />
      
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-fit"
      >
        <nav className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-2 flex items-center gap-1.5 shadow-elevated relative overflow-hidden group">
          {/* Subtle Scanning Line Effect */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-3000 pointer-events-none" />

          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative flex items-center gap-2.5 px-5 py-3 rounded-[1.2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 italic overflow-hidden",
                  active
                    ? "bg-white text-black shadow-glow scale-[1.02]"
                    : "text-white/40 hover:text-white hover:bg-white/5 active:scale-95"
                )}
              >
                <item.icon className={cn("w-4 h-4", active ? "text-black" : "text-primary/60")} />
                <span className="hidden lg:inline">{item.label}</span>
                
                {/* Active Indicator Pulse */}
                {active && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}

          <div className="w-[1px] h-8 bg-white/10 mx-2" />

          <button 
            onClick={() => setShowCravingModal(true)}
            className="w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 shadow-glow group/sos active:scale-90"
            title="SINAL DE FISSURA: ATIVAR PROTOCOLO DE EMERGÊNCIA"
          >
            <AlertTriangle size={20} className="group-hover/sos:animate-bounce" strokeWidth={3} />
          </button>
        </nav>
      </motion.div>
    </>
  );
};

export default AppToolbar;
