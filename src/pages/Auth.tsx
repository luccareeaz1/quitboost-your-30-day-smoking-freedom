import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Wind, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail.");
        setIsLogin(true);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white relative flex items-center justify-center px-6 overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "700px",
          height: "300px",
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-5"
            style={{ boxShadow: "0 0 30px rgba(255,255,255,0.15)" }}
          >
            <Wind size={32} style={{ color: "#050505" }} />
          </motion.div>
          <h1
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 900,
              fontSize: "36px",
              letterSpacing: "-0.05em",
              color: "#FFFFFF",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            QuitBoost
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 400 }}>
            {isLogin ? "Entre na sua conta." : "Crie sua conta gratuitamente."}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "32px",
          }}
        >
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-1.5">
              <label
                style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.02em" }}
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    height: "52px",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "14px",
                    paddingLeft: "44px",
                    paddingRight: "16px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    outline: "none",
                    color: "#FFFFFF",
                    fontFamily: "'Geist', sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    transition: "border-color 0.2s",
                  }}
                  placeholder="seu@email.com"
                  required
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.02em" }}
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    height: "52px",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "14px",
                    paddingLeft: "44px",
                    paddingRight: "16px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    outline: "none",
                    color: "#FFFFFF",
                    fontFamily: "'Geist', sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    transition: "border-color 0.2s",
                  }}
                  required
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "52px",
                borderRadius: "14px",
                background: "#FFFFFF",
                color: "#050505",
                fontFamily: "'Geist', sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "-0.01em",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
                opacity: loading ? 0.6 : 1,
                boxShadow: "0 4px 20px rgba(255,255,255,0.12)",
                marginTop: "8px",
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,255,255,0.2)"; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,255,255,0.12)"; }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  {isLogin ? "Entrar" : "Criar conta"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>ou</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
          </div>

          <button
            style={{
              width: "100%",
              height: "52px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.8)",
              fontFamily: "'Geist', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            onClick={async () => {
              const { error } = await lovable.auth.signInWithOAuth("google");
              if (error) toast.error(error.message || "Erro ao entrar com Google");
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com Google
          </button>

          <div className="text-center mt-7">
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.35)",
                fontWeight: 500,
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
            >
              {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
