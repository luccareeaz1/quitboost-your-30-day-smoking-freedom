const SpaceBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ background: 'hsl(150, 10%, 4%)' }}>
      {/* Top green glow */}
      <div className="absolute top-[-30%] left-[20%] w-[800px] h-[800px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, hsla(152, 58%, 48%, 0.15), transparent 70%)' }} />
      {/* Right accent */}
      <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, hsla(152, 58%, 48%, 0.12), transparent 70%)' }} />
      {/* Bottom subtle */}
      <div className="absolute bottom-[-20%] left-[40%] w-[500px] h-[500px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, hsla(152, 58%, 48%, 0.1), transparent 70%)' }} />
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(hsla(152, 58%, 48%, 0.3) 1px, transparent 1px), linear-gradient(90deg, hsla(152, 58%, 48%, 0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    </div>
  );
};

export default SpaceBackground;
