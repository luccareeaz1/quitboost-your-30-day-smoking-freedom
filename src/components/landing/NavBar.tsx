import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Wind } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
          <Wind className="w-6 h-6 text-foreground" />
          <span className="text-lg font-semibold text-foreground tracking-tight">Breathe Again</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          <Button variant="default" size="sm" className="rounded-full px-6" onClick={() => navigate("/onboarding")}>
            Começar grátis
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
