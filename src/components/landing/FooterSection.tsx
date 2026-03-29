import { Wind } from "lucide-react";

const FooterSection = () => (
  <footer className="py-12 border-t border-border bg-background">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-foreground" />
          <span className="text-lg font-semibold tracking-tight">QuitBoost</span>
        </div>
        <p className="text-muted-foreground text-sm">© 2026 QuitBoost AI. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
);

export default FooterSection;
