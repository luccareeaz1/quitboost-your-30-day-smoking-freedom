import { Link, useLocation } from "react-router-dom";
import { Home, TrendingUp, Target, Award, MessageCircle, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/dashboard", icon: Home, label: "Dashboard" },
  { path: "/progress", icon: TrendingUp, label: "Progress" },
  { path: "/challenges", icon: Target, label: "Challenges" },
  { path: "/achievements", icon: Award, label: "Achievements" },
  { path: "/community", icon: MessageCircle, label: "Comunidade" },
  { path: "/coach", icon: Sparkles, label: "Coach IA" },
  { path: "/profile", icon: User, label: "Perfil" },
];

export function TopNavigation() {
  const location = useLocation();

  // Don't show on onboarding or home
  if (location.pathname === "/" || location.pathname === "/onboarding") return null;

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 animate-fade-in pointer-events-none">
      <nav className="glass rounded-full px-6 py-3 flex items-center gap-6 md:gap-8 shadow-elevated pointer-events-auto transition-all">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 ease-out",
                isActive 
                  ? "text-primary scale-110" 
                  : "text-muted-foreground hover:text-foreground hover:scale-105"
              )}
              title={label}
            >
              <Icon strokeWidth={isActive ? 2.5 : 2} className="w-5 h-5 sm:w-6 sm:h-6" />
              {isActive && (
                <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
