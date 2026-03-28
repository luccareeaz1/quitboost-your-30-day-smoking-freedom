import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NavBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50  bg-transparent backdrop-blur-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:bg-primary transition-all">
            <Zap className="w-5 h-5 text-primary group-hover:text-black transition-colors" fill="currentColor" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter italic">Quit<span className="text-primary">Boost</span></span>
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <Button 
              variant="default" 
              size="sm" 
              className="rounded-full px-8 bg-gray-900 text-white font-bold uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gray-500/20" 
              onClick={() => navigate("/dashboard")}
            >
              <User size={14} className="mr-2" /> Meu Dashboard
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/50 hover:text-white font-black uppercase tracking-widest text-[10px]" 
                onClick={() => navigate("/auth")}
              >
                Entrar
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="rounded-full px-8 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10" 
                onClick={() => navigate("/onboarding")}
              >
                Começar Grátis
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
