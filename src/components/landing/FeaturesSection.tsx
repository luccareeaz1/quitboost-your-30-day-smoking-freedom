import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title: "Rastreamento preciso de cravings",
    desc: "Monitore cada desejo em tempo real. Nossa IA mapeia seus padrões e te prepara para os momentos críticos antes que eles aconteçam.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    title: "Plano diário personalizado",
    desc: "Rotina construída especialmente para você. Cada dia um novo desafio calibrado pelo seu progresso, mantendo a motivação sempre alta.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
    title: "Suporte 24h que realmente te entende",
    desc: "Nosso AI Coach está disponível a qualquer hora. Não apenas respostas genéricas — conversas empáticas que te ajudam a atravessar os momentos difíceis.",
  },
];

const FeaturesSection = () => (
  <section id="recursos" style={{ padding: "100px 24px", background: "#050505" }}>
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: "center", marginBottom: "64px" }}
      >
        <p style={{
          fontFamily: "'Geist', sans-serif",
          fontWeight: 600,
          fontSize: "13px",
          color: "#00D1FF",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          margin: 0,
          marginBottom: "12px",
        }}>
          Recursos
        </p>
        <h2 style={{
          fontFamily: "'Geist', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(28px, 5vw, 48px)",
          color: "#FFFFFF",
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          margin: 0,
        }}>
          Tudo que você precisa para parar
        </h2>
      </motion.div>

      {/* 3 cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "16px",
      }}>
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
          >
            <FeatureCard feature={f} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FeatureCard = ({ feature }: { feature: typeof features[0] }) => {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "36px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        cursor: "default",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "100%",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(0,209,255,0.3)";
        e.currentTarget.style.background = "rgba(0,209,255,0.04)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 0 40px -8px rgba(0,209,255,0.2), 0 20px 40px -10px rgba(0,0,0,0.5)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{
        width: "52px",
        height: "52px",
        borderRadius: "12px",
        background: "rgba(0,209,255,0.08)",
        border: "1px solid rgba(0,209,255,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#00D1FF",
        flexShrink: 0,
      }}>
        {feature.icon}
      </div>
      <div>
        <h3 style={{
          fontFamily: "'Geist', sans-serif",
          fontWeight: 700,
          fontSize: "20px",
          color: "#FFFFFF",
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
          margin: 0,
          marginBottom: "12px",
        }}>
          {feature.title}
        </h3>
        <p style={{
          fontFamily: "'Geist', sans-serif",
          fontWeight: 400,
          fontSize: "15px",
          color: "#A1A1AA",
          letterSpacing: "-0.01em",
          lineHeight: 1.6,
          margin: 0,
        }}>
          {feature.desc}
        </p>
      </div>
    </div>
  );
};

export default FeaturesSection;
