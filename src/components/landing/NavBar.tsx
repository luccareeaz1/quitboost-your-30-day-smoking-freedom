import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useState } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Recursos", href: "#recursos" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(5,10,24,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0px" }}
          onClick={() => navigate("/")}
        >
          <span style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 900,
            fontSize: "22px",
            color: "#FFFFFF",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}>
            freesh
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }} className="hidden lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: "'Geist', sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                color: "#A1A1AA",
                textDecoration: "none",
                transition: "color 0.2s ease",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#FFFFFF")}
              onMouseLeave={e => (e.currentTarget.style.color = "#A1A1AA")}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                fontFamily: "'Geist', sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: "#050505",
                background: "#00D1FF",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: "0 0 24px -4px rgba(0,209,255,0.5)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 40px -4px rgba(0,209,255,0.7)"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 24px -4px rgba(0,209,255,0.5)"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth")}
                className="hidden sm:block"
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#A1A1AA",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#FFFFFF")}
                onMouseLeave={e => (e.currentTarget.style.color = "#A1A1AA")}
              >
                Entrar
              </button>
              <button
                onClick={() => navigate("/onboarding")}
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#050a18",
                  background: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  boxShadow: "0 0 24px -4px rgba(99,102,241,0.5)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 40px -4px rgba(99,102,241,0.7)"; e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 24px -4px rgba(99,102,241,0.5)"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                Começar agora
              </button>
            </>
          )}
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "transparent", border: "none", color: "#A1A1AA", cursor: "pointer", padding: "4px" }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          background: "rgba(5,10,24,0.98)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Geist', sans-serif",
                fontWeight: 500,
                fontSize: "16px",
                color: "#A1A1AA",
                textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { navigate("/onboarding"); setMobileOpen(false); }}
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              color: "#050505",
              background: "#00D1FF",
              border: "none",
              borderRadius: "8px",
              padding: "14px 24px",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            Começar agora
          </button>
        </div>
      )}
    </motion.nav>
  );
};

export default NavBar;
