import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-foreground/80 backdrop-blur-lg border-b border-primary/10">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Leaf className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-background font-display">QuitBoost</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-background/70 hover:text-background hover:bg-primary/10" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          <Button variant="hero" size="sm" onClick={() => navigate("/onboarding")}>
            Começar grátis
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
