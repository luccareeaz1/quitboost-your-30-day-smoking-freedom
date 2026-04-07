import { motion } from "framer-motion";
import { useState } from "react";

const testimonials = [
  {
    name: "Ricardo Santos",
    days: "127 dias sem fumar",
    text: "Fumei por 20 anos e tentei parar 8 vezes. Com o freesh finalmente consegui. O plano personalizado é cirúrgico.",
    initials: "RS",
  },
  {
    name: "Mariana Costa",
    days: "214 dias sem fumar",
    text: "Ver o dinheiro economizado subindo em tempo real foi o que me manteve focada. Já economizei mais de 5 mil reais!",
    initials: "MC",
  },
  {
    name: "João Oliveira",
    days: "89 dias sem fumar",
    text: "A comunidade é incrível. Saber que você não está sozinho faz toda a diferença no mundo. App recomendo demais.",
    initials: "JO",
  },
  {
    name: "Ana Ferreira",
    days: "312 dias sem fumar",
    text: "Fumei por 20 anos e tentei parar 8 vezes. Com o freesh finalmente consegui. O plano personalizado é cirúrgico.",
    initials: "AF",
  },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section id="depoimentos" style={{ padding: "100px 24px", background: "#050a18" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "56px" }}
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
            Depoimentos
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
            Histórias reais de liberdade
          </h2>
        </motion.div>

        {/* Carousel card */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "48px 40px",
            marginBottom: "32px",
            position: "relative",
          }}
        >
          {/* Quote icon */}
          <div style={{
            position: "absolute",
            top: "28px",
            right: "32px",
            fontFamily: "'Geist', sans-serif",
            fontSize: "60px",
            lineHeight: 1,
            color: "rgba(99,102,241,0.12)",
            fontWeight: 900,
            userSelect: "none",
          }}>
            "
          </div>

          {/* Text */}
          <p style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(16px, 2.5vw, 20px)",
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            lineHeight: 1.7,
            margin: 0,
            marginBottom: "32px",
          }}>
            "{t.text}"
          </p>

          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Geist', sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              color: "#6366f1",
              letterSpacing: "0.02em",
              flexShrink: 0,
            }}>
              {t.initials}
            </div>
            <div>
              <p style={{
                fontFamily: "'Geist', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
                margin: 0,
                lineHeight: 1,
                marginBottom: "4px",
              }}>
                {t.name}
              </p>
              <p style={{
                fontFamily: "'Geist Mono', monospace",
                fontWeight: 400,
                fontSize: "12px",
                color: "#6366f1",
                letterSpacing: "0.02em",
                margin: 0,
                lineHeight: 1,
              }}>
                {t.days}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dots navigation */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === active ? "#00D1FF" : "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
                boxShadow: i === active ? "0 0 12px rgba(0,209,255,0.5)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
