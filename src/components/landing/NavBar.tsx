import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Wind, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NavBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary/30 transition-all">
            <Wind className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">Breathe <span className="text-primary">Again</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Benefícios</button>
          <button onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Como Funciona</button>
          <button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Planos</button>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Button size="sm" className="rounded-xl px-6 bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90" onClick={() => navigate("/dashboard")}>
              <User size={14} className="mr-2" /> Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-medium text-sm" onClick={() => navigate("/auth")}>
                Entrar
              </Button>
              <Button size="sm" className="rounded-xl px-6 bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90" onClick={() => navigate("/onboarding")}>
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
