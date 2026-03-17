import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Target, Users, Trophy, Bot, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", path: "/dashboard", icon: LayoutDashboard },
  { label: "Coach", path: "/coach", icon: Bot },
  { label: "Social", path: "/comunidade", icon: Users },
  { label: "Missões", path: "/desafios", icon: Target },
  { label: "Marcos", path: "/conquistas", icon: Trophy },
];

const AppToolbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2rem] px-2 py-2 flex items-center gap-1 shadow-2xl shadow-gray-200/50">
        <div className="flex items-center gap-1.5 px-3 mr-2 border-r border-gray-100">
           <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white">
              <Zap size={16} fill="currentColor" />
           </div>
        </div>
        
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95",
                active
                  ? "bg-primary text-white shadow-lg shadow-green-500/20"
                  : "text-gray-400 hover:text-primary hover:bg-green-50"
              )}
            >
              <item.icon className={cn("w-4 h-4", active ? "text-white" : "text-gray-400")} />
              <span className="hidden lg:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AppToolbar;
