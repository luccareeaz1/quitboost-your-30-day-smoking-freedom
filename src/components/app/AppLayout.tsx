import AppToolbar from "@/components/app/AppToolbar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden stars-bg">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none opacity-30" />
      
      <AppToolbar />
      <div className="pt-20 pb-24 relative z-10">
        {children}
      </div>
      <footer className="mt-12 mb-8 px-4 border-t border-border/20 pt-8 relative z-10">
        <p className="text-[9px] text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed italic uppercase font-black tracking-widest">
          ⚕️ Protocolo de monitoramento de elite. Questo app não substitui consulta médica especializada.
          <span className="hidden sm:inline"> Sincronizado conforme diretrizes globais da OMS, CDC e INCA.</span>
          {" "}Urgência: 192 (SAMU) | 188 (CVV).
        </p>
      </footer>
    </div>
  );
};

export default AppLayout;
