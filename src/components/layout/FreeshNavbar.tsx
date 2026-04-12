import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Users, Trophy, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/coach", icon: MessageSquare, label: "Coach IA" },
  { path: "/comunidade", icon: Users, label: "Comunidade" },
  { path: "/desafios", icon: Trophy, label: "Missões" },
];

export function FreeshNavbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-gray-100/50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <Link to="/dashboard" className="text-2xl font-black tracking-tighter text-slate-900 group">
          Quit<span className="text-primary italic">Boost</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "text-sm font-semibold transition-all hover:text-primary relative py-1",
                isActive(path) ? "text-primary" : "text-slate-500"
              )}
            >
              {label}
              {isActive(path) && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100/50 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">14 dias clean</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>
      </div>
    </nav>
  );
}
