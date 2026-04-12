import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  Heart,
  ChevronRight,
  LogOut,
  Languages
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('pt') ? 'en' : 'pt-BR';
    i18n.changeLanguage(newLang);
  };

  const NAV_ITEMS = [
    { id: "dashboard", label: t('sidebar.overview'), path: "/dashboard", icon: LayoutDashboard },
    { id: "progresso", label: t('sidebar.analysis'), path: "/progresso", icon: BarChart3 },
    { id: "conquistas", label: t('sidebar.badges'), path: "/conquistas", icon: Trophy },
    { id: "desafios", label: t('sidebar.missions'), path: "/desafios", icon: Target },
    { id: "ai-coach", label: t('sidebar.coach'), path: "/coach", icon: Bot },
    { id: "comunidade", label: t('sidebar.social'), path: "/comunidade", icon: Users },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-slate-100 hidden lg:flex flex-col z-[100] px-4 py-8 overflow-y-auto">
      <div 
        onClick={() => navigate("/")}
        className="flex items-center gap-3 mb-10 px-4 cursor-pointer group"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform">
          <Zap className="w-4 h-4 fill-white/20" />
        </div>
        <span className="text-sm font-black text-slate-900 tracking-tighter uppercase">
          Quit<span className="text-blue-600">Boost</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">{t('sidebar.commandCenter')}</p>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                isActive 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && (
                <div className="w-1 h-4 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-slate-50 space-y-2">
        <button 
          onClick={toggleLanguage}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all text-slate-500 hover:text-slate-900 text-xs font-medium"
        >
          <Languages className="w-4 h-4 text-slate-400" />
          <span className="flex-1 text-left">{i18n.language.startsWith('pt') ? 'Português' : 'English'}</span>
        </button>

        <button 
          onClick={() => navigate("/perfil")}
          className={cn(
             "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
             location.pathname === "/perfil" ? "bg-slate-50" : "hover:bg-slate-50"
          )}
        >
           <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shadow-sm overflow-hidden border border-slate-200">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
           </div>
           <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{profile?.display_name || "Guerreiro"}</p>
              <p className="text-[10px] text-slate-400 truncate tracking-tight">{t('sidebar.profile')}</p>
           </div>
           <Settings className="w-4 h-4 text-slate-300" />
        </button>
        
        <button 
          onClick={signOut}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all text-xs font-medium"
        >
           <LogOut className="w-4 h-4" /> {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  );
}
