import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Animated particle canvas (cyan dots drifting upward)
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

    // Particle pool
    const PARTICLE_COUNT = 80;
    interface Particle {
      x: number; y: number; size: number;
      speedX: number; speedY: number;
      opacity: number; life: number; maxLife: number;
    }
    const particles: Particle[] = [];
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const spawn = (): Particle => ({
      x: rand(0, canvas.width),
      y: rand(canvas.height * 0.3, canvas.height),
      size: rand(0.5, 1.8),
      speedX: rand(-0.2, 0.2),
      speedY: rand(-0.4, -0.15),
      opacity: 0,
      life: 0,
      maxLife: rand(180, 360),
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = spawn();
      p.life = rand(0, p.maxLife);      // stagger start
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
        // Fade in / out
        p.opacity = progress < 0.1
          ? progress / 0.1
          : progress > 0.8
          ? (1 - progress) / 0.2
          : 1;

        p.x += p.speedX;
        p.y += p.speedY;

        ctx.save();
        ctx.globalAlpha = p.opacity * 0.7;
        ctx.fillStyle = "#00D1FF";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#00D1FF";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    />
  );
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
      paddingTop: "72px",
    }}>
      {/* Ambient radial glow top */}
      <div style={{
        position: "absolute",
        top: "-10%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "900px",
        height: "400px",
        background: "radial-gradient(ellipse at center, rgba(0,209,255,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Floating particles */}
      <ParticleCanvas />

      {/* Main content */}
      <div style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "0 24px",
        maxWidth: "900px",
        width: "100%",
      }}>
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(72px, 14vw, 160px)",
            color: "#FFFFFF",
            letterSpacing: "-0.06em",
            lineHeight: 0.9,
            margin: 0,
            marginBottom: "24px",
          }}
        >
          Quit<span style={{ color: "#00D1FF" }}>Boost</span>
        </motion.h1>

        {/* Glow line separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "600px",
            height: "2px",
            marginBottom: "32px",
          }}
        >
          {/* Base line */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent, #00D1FF, transparent)",
          }} />
          {/* Glow layer */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent, #00D1FF, transparent)",
            filter: "blur(8px)",
            opacity: 0.8,
          }} />
          {/* Bright center point */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "8px",
            height: "8px",
            background: "#00D1FF",
            borderRadius: "50%",
            boxShadow: "0 0 16px 4px rgba(0,209,255,0.9)",
          }} />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 500,
            fontSize: "clamp(18px, 3vw, 32px)",
            color: "#A1A1AA",
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            margin: 0,
            marginBottom: "48px",
            maxWidth: "520px",
          }}
        >
          Pare de fumar para sempre.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button
            onClick={() => navigate("/onboarding")}
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              color: "#050505",
              background: "#00D1FF",
              border: "none",
              borderRadius: "12px",
              padding: "18px 48px",
              cursor: "pointer",
              letterSpacing: "-0.02em",
              boxShadow: "0 0 40px -4px rgba(0,209,255,0.6), 0 0 0 1px rgba(0,209,255,0.2)",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 0 70px -4px rgba(0,209,255,0.9), 0 0 0 1px rgba(0,209,255,0.4)";
              e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 0 40px -4px rgba(0,209,255,0.6), 0 0 0 1px rgba(0,209,255,0.2)";
              e.currentTarget.style.transform = "translateY(0) scale(1)";
            }}
          >
            Começar agora
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </motion.div>

        {/* Social proof micro-text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            color: "rgba(161,161,170,0.5)",
            letterSpacing: "-0.01em",
            marginTop: "20px",
          }}
        >
          +87.000 pessoas já transformaram sua vida
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
