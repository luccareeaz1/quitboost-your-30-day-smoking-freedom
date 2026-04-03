import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FooterSection = () => {
  const navigate = useNavigate();
  return (
    <footer className="py-20 border-t border-border bg-background overflow-hidden relative">
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary transition-all">
                <Zap className="w-5 h-5 text-primary group-hover:text-white transition-colors" fill="currentColor" />
              </div>
              <span className="text-xl font-black text-foreground tracking-tighter italic">Quit<span className="text-primary">Boost</span></span>
            </div>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
              Transformando a tecnologia em liberdade. Junte-se a milhares de pessoas que já respiram melhor todos os dias.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Produto</p>
              <a href="#funcionalidades" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Funcionalidades</a>
              <a href="#precos" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Preços</a>
              <a href="#como-funciona" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Como Funciona</a>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Legal</p>
              <button onClick={() => navigate("/politica")} className="text-left text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Privacidade</button>
              <button onClick={() => navigate("/termos")} className="text-left text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Termos</button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">© 2026 QuitBoost AI. Protocolo de Liberdade.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
