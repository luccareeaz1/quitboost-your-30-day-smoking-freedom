import { motion } from "framer-motion";

const stats = [
  { number: "+87.000", label: "Vidas transformadas" },
  { number: "92%", label: "Param em menos de 30 dias" },
  { number: "Testado", label: "Por milhares de pessoas" },
  { number: "24h", label: "Suporte disponível" },
];

const TrustBar = () => (
  <section style={{
    padding: "80px 24px",
    background: "#050a18",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  }}>
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: "center",
          marginBottom: "56px",
        }}
      >
        <p style={{
          fontFamily: "'Geist', sans-serif",
          fontWeight: 600,
          fontSize: "13px",
          color: "#6366f1",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          margin: 0,
          marginBottom: "12px",
        }}>
          Por que Quitboost?
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
          Números que não mentem
        </h2>
      </motion.div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "2px",
        background: "rgba(255,255,255,0.04)",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{
              padding: "48px 32px",
              background: "#050a18",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontWeight: 700,
              fontSize: "clamp(32px, 5vw, 52px)",
              color: "#6366f1",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              display: "block",
            }}>
              {stat.number}
            </span>
            <span style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 400,
              fontSize: "14px",
              color: "#A1A1AA",
              letterSpacing: "-0.01em",
              maxWidth: "160px",
              lineHeight: 1.4,
            }}>
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBar;
