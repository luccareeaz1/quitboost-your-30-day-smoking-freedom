import AppToolbar from "@/components/app/AppToolbar";
import SpaceBackground from "@/components/landing/SpaceBackground";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <SpaceBackground />
      <AppToolbar />
      <div className="pt-24 pb-32 relative z-10 w-full animate-in fade-in duration-700">
        {children}
      </div>
      <footer className="mt-12 mb-20 px-4 border-t border-white/5 pt-12 relative z-10">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] text-center max-w-2xl mx-auto leading-relaxed italic">
          ⚕️ PROTOCOLO QUITBOOST • DADOS BASEADOS EM OMS/CDC 2026 • EM CASO DE CRISE: LIGUE 192 (SAMU) OU 188 (CVV).
        </p>
      </footer>
    </div>
  );
};

export default AppLayout;
