const FooterSection = () => (
  <footer className="py-12 bg-foreground">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-bold text-background font-display">QuitBoost</h3>
          <p className="text-background/50 text-sm mt-1">Sua jornada para uma vida sem fumo.</p>
        </div>
        <p className="text-background/40 text-sm">© 2026 QuitBoost. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
);

export default FooterSection;
