import { Zap } from "lucide-react";

const FooterSection = () => (
  <footer className="py-20 border-t border-gray-100 bg-white">
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight italic">Quit<span className="text-primary NOT-italic">Boost</span></span>
        </div>
        
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
          <a href="#" className="hover:text-primary transition-colors">Termos</a>
          <a href="#" className="hover:text-primary transition-colors">Contato</a>
        </div>

        <p className="text-gray-400 text-xs font-medium">
          © 2026 QuitBoost AI. <span className="hidden md:inline">—</span> A revolução da saúde comportamental.
        </p>
      </div>
    </div>
  </footer>
);

export default FooterSection;
