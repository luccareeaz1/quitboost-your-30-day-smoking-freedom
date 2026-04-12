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
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[460px] relative z-10"
      >
        <div className="bg-white rounded-3xl p-10 md:p-14 shadow-2xl shadow-blue-100/50 border border-slate-100">
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-blue-600 flex items-center justify-center rounded-2xl mb-8 shadow-xl shadow-blue-200 group hover:scale-105 transition-transform">
              <Zap size={28} className="text-white fill-white/20" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2 text-center uppercase">
              {isLogin ? "Bem-vindo" : "Crie sua conta"}
            </h1>
            <p className="text-slate-400 text-[9px] tracking-[0.2em] font-bold uppercase text-center flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-blue-500" /> A ciência da sua liberdade
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nome Completo</label>
                <div className="relative group">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
                  <Input
                    placeholder="Seu nome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-slate-50 border-slate-200 h-14 pl-12 rounded-xl focus:border-blue-400 focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300 outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
                <Input
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50 border-slate-200 h-14 pl-12 rounded-xl focus:border-blue-400 focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300 outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Senha</label>
                {isLogin && (
                   <button type="button" className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:underline transition-all">Esqueceu?</button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50 border-slate-200 h-14 pl-12 rounded-xl focus:border-blue-400 focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300 outline-none"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] group"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <div className="flex items-center justify-center gap-3">
                  {isLogin ? "Acessar Sistema" : "Finalizar Cadastro"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              {isLogin ? "Novo aqui? Criar conta" : "Já tem conta? Entrar"}
            </button>
          </div>
          
          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-2">
             <ShieldCheck className="w-3.5 h-3.5 text-slate-200" />
             <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">Criptografia de Elite</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
