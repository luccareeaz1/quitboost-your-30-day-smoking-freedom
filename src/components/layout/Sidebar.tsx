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
    <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col z-[100] px-8 py-12 overflow-y-auto">
      <div 
        onClick={() => navigate("/")}
        className="flex items-center gap-4 mb-20 cursor-pointer group"
      >
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover:scale-105 transition-transform">
          <Zap className="w-6 h-6 fill-white/20" />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tighter uppercase">
          Quit<span className="text-blue-600">Boost</span>
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6 px-6">{t('sidebar.commandCenter')}</p>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-200" 
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                isActive ? "bg-white/10 text-white" : "bg-slate-50 text-slate-300 group-hover:text-slate-500"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] flex-1 text-left">{item.label}</span>
              {isActive ? (
                <motion.div layoutId="sidebar-active" className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="pt-12 border-t border-slate-50 space-y-4">
        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
             <Languages className="w-5 h-5" />
          </div>
          <div className="text-left flex-1">
             <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Idioma / Language</p>
             <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{i18n.language.startsWith('pt') ? 'Português (BR)' : 'English (US)'}</p>
          </div>
        </button>

        <button 
          onClick={() => navigate("/perfil")}
          className={cn(
             "w-full flex items-center gap-4 p-4 rounded-2xl transition-all",
             location.pathname === "/perfil" ? "bg-slate-50 border border-slate-100" : "hover:bg-slate-50"
          )}
        >
           <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 shadow-sm overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
           </div>
           <div className="text-left flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 truncate">{profile?.display_name || "Guerreiro"}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{t('sidebar.profile')}</p>
           </div>
           <Settings className="w-4 h-4 text-slate-300" />
        </button>
        
        <button 
          onClick={signOut}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-400 hover:bg-rose-50 hover:text-rose-500 transition-all font-black text-[10px] uppercase tracking-widest"
        >
           <LogOut className="w-4 h-4" /> {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  );
}
