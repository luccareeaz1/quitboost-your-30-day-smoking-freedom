import { useNavigate } from "react-router-dom";

const FooterSection = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: "#050a18",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "60px 24px 40px",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Top row */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          marginBottom: "48px",
        }} className="md:flex-row md:justify-between">

          {/* Brand */}
          <div style={{ maxWidth: "280px" }}>
            <div
              style={{ cursor: "pointer", marginBottom: "16px" }}
              onClick={() => navigate("/")}
            >
              <span style={{
                fontFamily: "'Geist', sans-serif",
                fontWeight: 900,
                fontSize: "20px",
                color: "#FFFFFF",
                letterSpacing: "-0.04em",
              }}>
                Quit<span style={{ color: "#6366f1" }}>Boost</span>
              </span>
            </div>
            <p style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 400,
              fontSize: "14px",
              color: "#A1A1AA",
              letterSpacing: "-0.01em",
              lineHeight: 1.6,
              margin: 0,
            }}>
              Ajudando pessoas a pararem de fumar com tecnologia e empatia.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "64px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{
                fontFamily: "'Geist', sans-serif",
                fontWeight: 600,
                fontSize: "12px",
                color: "#FFFFFF",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: 0,
              }}>
                Produto
              </p>
              {["#recursos", "#depoimentos", "#faq"].map((href, i) => {
                const labels = ["Recursos", "Depoimentos", "FAQ"];
                return (
                  <a
                    key={href}
                    href={href}
                    style={{
                      fontFamily: "'Geist', sans-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                      color: "#A1A1AA",
                      textDecoration: "none",
                      letterSpacing: "-0.01em",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#FFFFFF")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A1A1AA")}
                  >
                    {labels[i]}
                  </a>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{
                fontFamily: "'Geist', sans-serif",
                fontWeight: 600,
                fontSize: "12px",
                color: "#FFFFFF",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: 0,
              }}>
                Legal
              </p>
              <button
                onClick={() => navigate("/politica")}
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#A1A1AA",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  padding: 0,
                  textAlign: "left",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#FFFFFF")}
                onMouseLeave={e => (e.currentTarget.style.color = "#A1A1AA")}
              >
                Privacidade
              </button>
              <button
                onClick={() => navigate("/termos")}
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#A1A1AA",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  padding: 0,
                  textAlign: "left",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#FFFFFF")}
                onMouseLeave={e => (e.currentTarget.style.color = "#A1A1AA")}
              >
                Termos
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <p style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            color: "rgba(161,161,170,0.4)",
            letterSpacing: "-0.01em",
            margin: 0,
          }}>
            © {year} freesh. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
