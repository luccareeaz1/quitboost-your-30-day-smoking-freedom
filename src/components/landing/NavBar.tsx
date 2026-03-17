import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-100 bg-white/70 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary transition-all">
            <Zap className="w-5 h-5 text-primary group-hover:text-white transition-colors" fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Quit<span className="text-primary">Boost</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-gray-900 font-bold uppercase tracking-widest text-[10px]" 
            onClick={() => navigate("/dashboard")}
          >
            Entrar
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-full px-8 bg-primary text-white font-bold uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/20" 
            onClick={() => navigate("/onboarding")}
          >
            Começar Grátis
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
