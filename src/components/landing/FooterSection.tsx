import { Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FooterSection = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="py-12 border-t border-border relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <Wind className="w-4 h-4 text-primary" />
            </div>
            <span className="text-base font-bold tracking-tight">Breathe <span className="text-primary">Again</span></span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <button onClick={() => navigate("/politica-de-privacidade")} className="hover:text-foreground transition-colors">Privacidade</button>
            <button onClick={() => navigate("/termos-de-uso")} className="hover:text-foreground transition-colors">Termos</button>
          </div>
          <p className="text-muted-foreground text-xs">© 2026 Breathe Again AI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
