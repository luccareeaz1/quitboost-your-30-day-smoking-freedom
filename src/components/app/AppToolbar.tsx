import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, TrendingUp, Target, Users, Trophy, User, Bot, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import CravingModal from "@/components/dashboard/CravingModal";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Progresso", path: "/progresso", icon: TrendingUp },
  { label: "Desafios", path: "/desafios", icon: Target },
  { label: "Coach IA", path: "/coach", icon: Bot },
  { label: "Comunidade", path: "/comunidade", icon: Users },
  { label: "Conquistas", path: "/conquistas", icon: Trophy },
  { label: "Perfil", path: "/perfil", icon: User },
];

const AppToolbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCravingModal, setShowCravingModal] = useState(false);

  return (
    <>
      <CravingModal open={showCravingModal} onClose={() => setShowCravingModal(false)} />
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <nav className="glass rounded-2xl px-2 py-2 flex items-center gap-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          );
        })}

        <div className="w-[1px] h-6 bg-border mx-1" />

        <button 
          onClick={() => setShowCravingModal(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-all border border-rose-100 shadow-sm"
          title="SOS Fissura"
        >
          <AlertTriangle size={18} />
        </button>

        <button 
          onClick={() => navigate("/perfil")}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all"
        >
          <User size={18} />
        </button>
      </nav>
    </div>
    </>
  );
};

export default AppToolbar;
