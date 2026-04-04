"use client"

import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Bot, 
  Settings,
  Flame,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { id: "comunidade", label: "Equipe", path: "/comunidade", icon: Users },
  { id: "conquistas", label: "Missões", path: "/conquistas", icon: Trophy },
  { id: "ai-coach", label: "Deep AI", path: "/ai-coach", icon: Bot },
];

export default function AppToolbar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-8 pointer-events-none">
      <div className="container mx-auto px-6 flex justify-center">
        <header 
          className="flex items-center gap-10 px-8 py-4 rounded-full border border-gray-200/60 bg-white/80 backdrop-blur-2xl pointer-events-auto shadow-xl shadow-black/5"
        >
          {/* Logo with matching pulse */}
          <div 
             onClick={() => navigate("/")}
             className="cursor-pointer group relative flex items-center gap-3 pr-6 border-r border-gray-200/60"
          >
            <div className="absolute inset-0 bg-[#528114]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
            <Zap size={22} className="relative z-10 text-[#528114]" />
            <span className="relative z-10 text-base font-black tracking-widest text-black uppercase select-none">
              QUIT<span className="text-gray-400">BOOST</span>
            </span>
          </div>

          <nav className="flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="relative group px-3 py-1.5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      size={18} 
                      className={`transition-colors duration-300 ${
                        isActive ? "text-[#528114]" : "text-gray-400 group-hover:text-gray-600"
                      }`} 
                    />
                    <span 
                      className={`text-base font-medium font-bold tracking-[0.1em] uppercase transition-all duration-300 ${
                        isActive ? "text-black" : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-[-10px] left-0 right-0 h-[2px] bg-[#528114] rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      style={{
                        boxShadow: "0 0 12px rgba(82, 129, 20, 0.5), 0 0 20px rgba(82, 129, 20, 0.2)"
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pl-6 border-l border-gray-200/60">
             <button
                onClick={() => navigate("/settings")}
                className="p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition-all"
             >
                <Settings size={18} />
             </button>
          </div>
        </header>
      </div>
    </div>
  );
}
