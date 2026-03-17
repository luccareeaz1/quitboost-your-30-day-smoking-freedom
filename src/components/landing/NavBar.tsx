import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:bg-primary transition-all">
            <Zap className="w-5 h-5 text-primary group-hover:text-black transition-colors" fill="currentColor" />
          </div>
          <span className="text-xl font-black text-white tracking-[0.05em] uppercase">Quit<span className="text-primary">Boost</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" className="text-white/40 hover:text-white font-bold uppercase tracking-widest text-[10px]" onClick={() => navigate("/dashboard")}>
            Entrar
          </Button>
          <Button variant="default" size="sm" className="rounded-full px-8 bg-primary text-black font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)]" onClick={() => navigate("/onboarding")}>
            DOMINAR AGORA
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
