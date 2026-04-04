import AppToolbar from "@/components/app/AppToolbar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen text-white relative" style={{ background: "#050505" }}>
      {/* Subtle ambient glow — sem cor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />

      <AppToolbar />
      <div className="pt-20 pb-24 relative z-10">
        {children}
      </div>
      <footer className="mt-8 mb-6 px-4 border-t border-white/5 pt-6 relative z-10">
        <p className="text-[11px] text-white/20 text-center max-w-2xl mx-auto leading-relaxed font-medium tracking-wide">
          ⚕️ Este app não substitui consulta médica.
          <span className="hidden sm:inline"> Baseado nas diretrizes da OMS, CDC e INCA.</span>
          {" "}Emergência: 192 (SAMU) | 188 (CVV).
        </p>
      </footer>
    </div>
  );
};

export default AppLayout;
