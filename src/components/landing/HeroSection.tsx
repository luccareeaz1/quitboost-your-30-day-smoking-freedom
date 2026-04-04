import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Clean particle canvas (white dots)
const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const PARTICLE_COUNT = 60;
    interface Particle {
      x: number; y: number; size: number;
      speedX: number; speedY: number;
      opacity: number; life: number; maxLife: number;
    }
    const particles: Particle[] = [];
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const spawn = (): Particle => ({
      x: rand(0, canvas.width),
      y: rand(canvas.height * 0.1, canvas.height),
      size: rand(0.5, 1.5),
      speedX: rand(-0.1, 0.1),
      speedY: rand(-0.3, -0.1),
      opacity: 0,
      life: 0,
      maxLife: rand(200, 400),
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = spawn();
      p.life = rand(0, p.maxLife);
      particles.push(p);
    }

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.life++;
        if (p.life > p.maxLife) {
          Object.assign(p, spawn(), { life: 0 });
          continue;
        }
        const progress = p.life / p.maxLife;
        p.opacity = progress < 0.1 ? progress / 0.1 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
        p.x += p.speedX; p.y += p.speedY;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.2})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      }
      animId = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />;
};

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      background: "#050505",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      padding: "80px 24px",
    }}>
      {/* Ambient glow top */}
      <div style={{
        position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
        width: "1000px", height: "400px",
        background: "radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <ParticleCanvas />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "900px", width: "100%" }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(64px, 12vw, 150px)",
            color: "#FFFFFF",
            letterSpacing: "-0.06em",
            lineHeight: 0.9,
            margin: "0 0 32px",
          }}
        >
          QuitBoost
        </motion.h1>

        <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ position: "relative", width: "100%", maxWidth: "600px", height: "1px", background: "rgba(255,255,255,0.1)", margin: "0 auto 48px" }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            fontSize: "clamp(18px, 2.5vw, 24px)",
            color: "rgba(255,255,255,0.45)",
            fontWeight: 400,
            lineHeight: 1.4,
            margin: "0 auto 56px",
            maxWidth: "500px",
          }}
        >
          A tecnologia definitiva para parar de fumar. <br /> Clean, moderno e feito para durar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button
            onClick={() => navigate("/onboarding")}
            style={{
              fontFamily: "'Geist', sans-serif", fontWeight: 700, fontSize: "16px",
              color: "#050505", background: "#FFFFFF",
              border: "none", borderRadius: "14px", padding: "18px 48px",
              cursor: "pointer", letterSpacing: "-0.01em",
              boxShadow: "0 10px 40px rgba(255,255,255,0.15)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 15px 50px rgba(255,255,255,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 10px 40px rgba(255,255,255,0.15)"; }}
          >
            Começar agora
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", marginTop: "32px", fontWeight: 500 }}
        >
          +87.000 pessoas já transformaram suas vidas.
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
