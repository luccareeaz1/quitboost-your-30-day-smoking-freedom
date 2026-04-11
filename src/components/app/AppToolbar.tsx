import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Bot, 
  Settings,
  Zap,
  Target,
  BarChart3,
  User,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "dashboard", label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { id: "progresso", label: "Análise", path: "/progresso", icon: BarChart3 },
  { id: "conquistas", label: "Badges", path: "/conquistas", icon: Trophy },
  { id: "desafios", label: "Missões", path: "/desafios", icon: Target },
  { id: "ai-coach", label: "Coach IA", path: "/ai-coach", icon: Bot },
  { id: "comunidade", label: "Social", path: "/comunidade", icon: Users },
];

export default function AppToolbar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col z-[100] px-8 py-12 overflow-y-auto">
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-4 mb-20 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/10 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">
            QUIT<span className="text-primary italic">BOOST</span>
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 group",
                  isActive 
                    ? "bg-slate-900 text-white shadow-2xl shadow-slate-200" 
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-300 group-hover:text-slate-500")} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
                {isActive && (
                   <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_#10B981]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="pt-12 border-t border-slate-50">
          <button 
            onClick={() => navigate("/perfil")}
            className={cn(
               "w-full flex items-center gap-4 p-4 rounded-2xl transition-all",
               location.pathname === "/perfil" ? "bg-slate-50 border border-slate-100" : "hover:bg-slate-50"
            )}
          >
             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <User className="w-5 h-5" />
             </div>
             <div className="text-left flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 truncate">Sua Conta</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">Acessar Perfil</p>
             </div>
             <Settings className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-100 flex lg:hidden items-center justify-around px-4 py-3 z-[100] pb-8 shadow-2xl shadow-slate-200">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 transition-all",
                isActive ? "text-primary scale-110" : "text-slate-300"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* MOBILE TOP BAR */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex lg:hidden items-center justify-between px-6 z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tighter">QUIT<span className="text-primary italic">BOOST</span></span>
        </div>
        <button onClick={() => navigate("/perfil")} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
          <User className="w-5 h-5" />
        </button>
      </header>
    </>
  );
}
