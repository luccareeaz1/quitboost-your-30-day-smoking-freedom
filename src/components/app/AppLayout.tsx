import AppToolbar from "@/components/app/AppToolbar";
import SpaceBackground from "@/components/landing/SpaceBackground";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <SpaceBackground />
      <AppToolbar />
      <div className="pt-24 pb-32 relative z-10 w-full animate-in fade-in duration-700">
        {children}
      </div>
      <footer className="mt-12 mb-20 px-4 border-t border-border pt-12 relative z-10">
        <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
          ⚕️ Breathe Again AI • Dados baseados em OMS/CDC 2026 • Em caso de crise: ligue 192 (SAMU) ou 188 (CVV).
        </p>
      </footer>
    </div>
  );
};

export default AppLayout;
