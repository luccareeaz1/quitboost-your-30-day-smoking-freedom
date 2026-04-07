import { useState } from "react";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "O freesh funciona mesmo para fumantes de longa data?",
    a: "Sim. Nosso método foi desenvolvido para todos os perfis de fumantes, incluindo quem fuma há décadas. A IA personaliza o plano com base no seu histórico, aumentando significativamente as chances de sucesso."
  },
  {
    q: "Quanto tempo leva para ver resultados?",
    a: "92% dos usuários relatam uma redução significativa no número de cigarros já na primeira semana. A maioria para completamente em menos de 30 dias seguindo o plano diário."
  },
  {
    q: "O suporte 24h é com humano ou IA?",
    a: "É um AI Coach treinado especificamente para ajudar pessoas a pararem de fumar. Ele responde instante­aneamente a qualquer hora, com empatia e estratégias comprovadas — algo impossível com uma equipe humana."
  },
  {
    q: "Preciso pagar para começar?",
    a: "Não. Você pode começar gratuitamente e acessar os recursos essenciais. O plano premium desbloqueia o AI Coach ilimitado, o plano diário avançado e os relatórios detalhados de progresso."
  },
];

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <section id="faq" style={{ padding: "100px 24px", background: "#050a18" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
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
            FAQ
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
            Perguntas frequentes
          </h2>
        </motion.div>

        {/* Accordion items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}
              >
                {/* Question */}
                <button
                  onClick={() => toggle(i)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "24px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    textAlign: "left",
                  }}
                >
                  <span style={{
                    fontFamily: "'Geist', sans-serif",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: open === i ? "#FFFFFF" : "#A1A1AA",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.4,
                    transition: "color 0.2s ease",
                    flex: 1,
                  }}>
                    {faq.q}
                  </span>
                  <span style={{
                    flexShrink: 0,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: `1px solid ${open === i ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.1)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: open === i ? "#6366f1" : "#A1A1AA",
                    transition: "all 0.25s ease",
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>

                {/* Answer */}
                <div style={{
                  overflow: "hidden",
                  maxHeight: open === i ? "200px" : "0",
                  opacity: open === i ? 1 : 0,
                  transition: "max-height 0.35s ease, opacity 0.3s ease, padding 0.3s ease",
                  paddingBottom: open === i ? "24px" : "0",
                }}>
                  <p style={{
                    fontFamily: "'Geist', sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                    color: "#A1A1AA",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.7,
                    margin: 0,
                  }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
