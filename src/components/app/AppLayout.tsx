import AppToolbar from "@/components/app/AppToolbar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <AppToolbar />
      <div className="pt-20 pb-24">
        {children}
      </div>
      {/* Fixed medical disclaimer footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-t border-border py-2 px-4">
        <p className="text-[9px] text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
          ⚕️ Este app não substitui consulta médica. Consulte seu médico antes de qualquer mudança no tratamento.
          <span className="hidden sm:inline"> Conteúdo baseado em diretrizes da OMS, CDC e INCA/Ministério da Saúde do Brasil.</span>
          {" "}Emergência: 192 (SAMU) | 188 (CVV).
        </p>
      </footer>
    </div>
  );
};

export default AppLayout;
