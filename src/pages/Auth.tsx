import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Wind, Mail, Lock, ArrowRight, Loader2, Github } from "lucide-react";
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
    <div className="min-h-screen bg-black text-white relative flex items-center justify-center px-6 overflow-hidden stars-bg">
      {/* Background nebula glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none opacity-30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-20 h-20 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-glow transition-all duration-500 hover:scale-110"
          >
            <Wind size={40} />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">Quit<span className="text-primary">Boost</span></h1>
          <p className="text-muted-foreground font-medium text-sm italic">
            {isLogin ? "A Engenharia da sua Liberdade." : "Comece sua libertação hoje."}
          </p>
        </div>

        <div className="bg-card/40 backdrop-blur-2xl rounded-[3rem] p-8 sm:p-10 border border-border/40 shadow-elevated relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />

          <form onSubmit={handleAuth} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 italic leading-none">Identificação (E-mail)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-black/40 rounded-2xl pl-12 pr-6 border border-border/40 focus:border-primary/40 focus:bg-black/60 transition-all outline-none font-medium text-white placeholder:text-muted-foreground/50"
                  placeholder="seu@universo.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 italic leading-none">Chave de Acesso (Senha)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
                <input
                  type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-black/40 rounded-2xl pl-12 pr-6 border border-border/40 focus:border-primary/40 focus:bg-black/60 transition-all outline-none font-medium text-white placeholder:text-muted-foreground/50"
                  required
                />
              </div>
            </div>

            <Button
              className="w-full h-14 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-glow hover:scale-[1.02] active:scale-95 transition-all text-xs"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <div className="flex items-center">
                  <span className="italic">{isLogin ? "Ativar Protocolo" : "Gerar Nova Identidade"}</span>
                  <ArrowRight className="ml-2 w-4 h-4 animate-pulse-slow" />
                </div>
              )}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-8 relative z-10">
            <div className="h-[1px] bg-border/20 flex-1" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] italic">Interconexão</span>
            <div className="h-[1px] bg-border/20 flex-1" />
          </div>

          <Button
            variant="ghost"
            className="w-full h-14 rounded-full border border-border/40 text-foreground font-bold hover:bg-white/5 flex items-center justify-center gap-3 transition-all relative z-10 group/google"
            onClick={async () => {
              const { error } = await lovable.auth.signInWithOAuth("google");
              if (error) toast.error(error.message || "Erro ao entrar com Google");
            }}
          >
            <svg className="w-5 h-5 group-hover/google:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="italic text-[11px] uppercase tracking-widest font-black">Continuar com Google</span>
          </Button>

          <div className="text-center mt-10 relative z-10">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] italic"
            >
              {isLogin ? "Não possui protocolo carimbado? Comece aqui" : "Já possui identidade neural? Entrar"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
