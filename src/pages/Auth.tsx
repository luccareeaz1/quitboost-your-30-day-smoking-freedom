import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        toast.success("Verifique seu e-mail para confirmar o cadastro!");
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050a18] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glimmer */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-white/[0.03] border border-white/[0.05] backdrop-blur-3xl rounded-[40px] p-10 md:p-14 shadow-2xl shadow-black/50">
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl mb-8 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <Zap size={32} className="text-[#050a18]" />
            </div>
            <h1 className="text-4xl font-extralight tracking-tight text-white mb-2 text-center">
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
            </h1>
            <p className="text-white/30 text-sm tracking-widest uppercase font-bold text-center">
              A ciência da sua liberdade
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <Input
                    placeholder="Nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/[0.03] border-white/10 h-14 pl-12 rounded-2xl focus:border-indigo-400/50 transition-all text-white placeholder:text-white/10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/[0.03] border-white/10 h-14 pl-12 rounded-2xl focus:border-indigo-400/50 transition-all text-white placeholder:text-white/10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <Input
                  type="password"
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/[0.03] border-white/10 h-14 pl-12 rounded-2xl focus:border-indigo-400/50 transition-all text-white placeholder:text-white/10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-white hover:bg-white/90 text-[#050a18] font-bold text-lg rounded-2xl transition-all shadow-xl shadow-indigo-500/10 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <div className="flex items-center gap-3">
                  {isLogin ? "Acessar Sistema" : "Finalizar Cadastro"}
                  <ArrowRight size={20} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/30 text-sm font-bold tracking-widest uppercase hover:text-white transition-colors"
            >
              {isLogin ? "Ainda não tem conta? Clique aqui" : "Já tem conta? Clique aqui"}
            </button>
          </div>
        </div>
        </div>
      </motion.div>
    </div>
  );
}
