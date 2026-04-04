import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, TrendingUp, Target, Users, Trophy, User, Bot, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import CravingModal from "@/components/dashboard/CravingModal";
import { useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard",   path: "/dashboard",   icon: LayoutDashboard },
  { label: "Progresso",   path: "/progresso",   icon: TrendingUp },
  { label: "Desafios",    path: "/desafios",    icon: Target },
  { label: "Coach IA",    path: "/coach",       icon: Bot },
  { label: "Comunidade",  path: "/comunidade",  icon: Users },
  { label: "Conquistas",  path: "/conquistas",  icon: Trophy },
  { label: "Perfil",      path: "/perfil",      icon: User },
];

const AppToolbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCravingModal, setShowCravingModal] = useState(false);

  return (
    <>
      <CravingModal open={showCravingModal} onClose={() => setShowCravingModal(false)} />

      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-fit"
      >
        <nav
          style={{
            background: "rgba(10,10,10,0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "2rem",
            padding: "6px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderRadius: "1.4rem",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  fontFamily: "'Geist', sans-serif",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                  background: active ? "#FFFFFF" : "transparent",
                  color: active ? "#050505" : "rgba(255,255,255,0.4)",
                  boxShadow: active ? "0 2px 12px rgba(255,255,255,0.15)" : "none",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  }
                }}
              >
                <item.icon
                  size={15}
                  style={{ color: active ? "#050505" : "rgba(255,255,255,0.45)" }}
                />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}

          <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

          <button
            onClick={() => setShowCravingModal(true)}
            title="Estou com fissura"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "1.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "rgb(239,68,68)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.15)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.06)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
            }}
          >
            <AlertTriangle size={17} strokeWidth={2} />
          </button>
        </nav>
      </motion.div>
    </>
  );
};

export default AppToolbar;
