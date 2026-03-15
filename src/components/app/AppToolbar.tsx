import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, TrendingUp, Target, Users, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Progresso", path: "/progresso", icon: TrendingUp },
  { label: "Desafios", path: "/desafios", icon: Target },
  { label: "Comunidade", path: "/comunidade", icon: Users },
  { label: "Conquistas", path: "/conquistas", icon: Trophy },
  { label: "Perfil", path: "/perfil", icon: User },
];

const AppToolbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
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
      </nav>
    </div>
  );
};

export default AppToolbar;
