import { Zap } from "lucide-react";

const FooterSection = () => (
  <footer className="py-20 border-t border-white/5 bg-transparent relative overflow-hidden italic">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
             <Zap className="w-4 h-4 text-primary" fill="currentColor" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">QuitBoost</span>
        </div>
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 QuitBoost AI. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
);

export default FooterSection;
