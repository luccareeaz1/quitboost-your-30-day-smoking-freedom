import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  Zap,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";
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
        navigate(from, { replace: true });
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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-400/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="bg-white rounded-[3.5rem] p-12 md:p-16 shadow-2xl shadow-slate-200 border border-slate-50">
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 bg-slate-900 flex items-center justify-center rounded-[1.5rem] mb-8 shadow-xl shadow-primary/20 group hover:scale-105 transition-transform">
              <Zap size={32} className="text-primary fill-primary/20" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 text-center">
              {isLogin ? "Bem-vindo" : "Crie sua conta"}
            </h1>
            <p className="text-slate-400 text-xs tracking-[0.2em] font-black uppercase text-center flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> A ciência da sua liberdade
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nome Completo</label>
                <div className="relative group">
                  <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                  <Input
                    placeholder="Seu nome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-slate-50 border-transparent h-16 pl-14 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Endereço de E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                <Input
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50 border-transparent h-16 pl-14 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Sua Senha</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50 border-transparent h-16 pl-14 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 mt-6 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[11px] rounded-[1.5rem] shadow-xl shadow-slate-200 transition-all active:scale-[0.98] group"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <div className="flex items-center justify-center gap-4">
                  {isLogin ? "Acessar Plataforma" : "Finalizar Cadastro"}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors"
            >
              {isLogin ? "Não possui conta? Cadastre-se agora" : "Já possui conta? Faça login"}
            </button>
          </div>
          
          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-2">
             <ShieldCheck className="w-3.5 h-3.5 text-slate-200" />
             <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Sessão Criptografada</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
