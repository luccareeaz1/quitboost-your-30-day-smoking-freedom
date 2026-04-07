import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Users, Trophy, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/coach", icon: MessageSquare, label: "Coach IA" },
  { path: "/comunidade", icon: Users, label: "Comunidade" },
  { path: "/desafios", icon: Trophy, label: "Missões" },
];

export function FreeshNavbar() {
  const location = useLocation();

  // Highlight logic
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="text-2xl font-bold tracking-tight text-slate-900">
          freesh
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-slate-900",
                isActive(path) ? "text-slate-900" : "text-slate-500"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="text-sm font-bold text-orange-700">14 dias</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300" />
      </div>
    </nav>
  );
}
