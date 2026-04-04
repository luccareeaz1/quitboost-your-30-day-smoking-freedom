import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <section style={{
      padding: "120px 24px",
      background: "#050a18",
      borderTop: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
        {/* Ambient glow */}
        <div style={{
          position: "relative",
          display: "inline-block",
          width: "100%",
        }}>
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -60%)",
            width: "500px",
            height: "300px",
            background: "radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }} />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <p style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              color: "#6366f1",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              margin: 0,
              marginBottom: "20px",
            }}>
              Pronto para começar?
            </p>

            <h2 style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(36px, 7vw, 72px)",
              color: "#FFFFFF",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              margin: 0,
              marginBottom: "20px",
            }}>
              A sua última vez.
            </h2>

            <p style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 400,
              fontSize: "18px",
              color: "#A1A1AA",
              letterSpacing: "-0.01em",
              lineHeight: 1.6,
              margin: "0 auto",
              marginBottom: "48px",
              maxWidth: "480px",
            }}>
              Junte-se a +87.000 pessoas que já deram o primeiro passo. 
              O cigarro acaba hoje.
            </p>

            <button
              onClick={() => navigate("/onboarding")}
              style={{
                fontFamily: "'Geist', sans-serif",
                fontWeight: 700,
                fontSize: "17px",
                color: "#050a18",
                background: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                padding: "20px 56px",
                cursor: "pointer",
                letterSpacing: "-0.02em",
                boxShadow: "0 0 50px -4px rgba(99,102,241,0.6), 0 0 0 1px rgba(99,102,241,0.2)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 0 80px -4px rgba(99,102,241,0.9), 0 0 0 1px rgba(99,102,241,0.5)";
                e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 0 50px -4px rgba(99,102,241,0.6), 0 0 0 1px rgba(99,102,241,0.2)";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
              }}
            >
              Começar agora
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>

            <p style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "rgba(161,161,170,0.4)",
              marginTop: "20px",
              letterSpacing: "-0.01em",
            }}>
              Grátis para começar · Sem cartão de crédito
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
