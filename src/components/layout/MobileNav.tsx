import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Trophy,
  BarChart3,
  Bot,
  User,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { path: "/progresso", icon: BarChart3, label: "Stats" },
  { path: "/coach", icon: Bot, label: "Coach" },
  { path: "/conquistas", icon: Trophy, label: "Vagas" },
  { path: "/perfil", icon: User, label: "Perfil" },
];

export function MobileNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* MOBILE TOP BAR */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex lg:hidden items-center justify-between px-6 z-[60]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary shadow-lg shadow-primary/10">
            <Zap className="w-5 h-5 fill-primary/20" />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tighter">QUIT<span className="text-primary italic">BOOST</span></span>
        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] px-6 py-6 pb-10">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-between p-2 shadow-2xl shadow-slate-200 border border-slate-100/50">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[2rem] transition-all relative",
                isActive(item.path) ? "text-primary scale-110" : "text-slate-300"
              )}
            >
              <item.icon className={cn("w-6 h-6 relative z-10", isActive(item.path) ? "text-primary" : "text-slate-300")} />
              <span className={cn("text-[9px] font-black uppercase tracking-widest relative z-10", isActive(item.path) ? "text-slate-900" : "text-slate-300")}>
                {item.label}
              </span>
              {isActive(item.path) && (
                 <motion.div layoutId="mobile-nav-active" className="absolute -bottom-1 w-1.5 h-1.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
