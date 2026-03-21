import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { AppleCard } from "@/components/ui/apple-card";
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
    } catch (error: any) {
      toast.error(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mb-6">
            <Wind size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">QuitBoost</h1>
          <p className="text-gray-400 font-medium mt-2">
            {isLogin ? "Entre para continuar sua jornada" : "Comece sua libertação hoje"}
          </p>
        </div>

        <AppleCard className="p-8 bg-white border-gray-100 shadow-2xl">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-gray-50 rounded-2xl pl-12 pr-6 border border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-medium text-gray-700"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-gray-50 rounded-2xl pl-12 pr-6 border border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-medium text-gray-700"
                  required
                />
              </div>
            </div>

            <Button 
              className="w-full h-14 rounded-full bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all text-xs"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  {isLogin ? "Entrar" : "Criar Conta"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="h-[1px] bg-gray-100 flex-1" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">ou</span>
            <div className="h-[1px] bg-gray-100 flex-1" />
          </div>

          <Button 
            variant="outline"
            className="w-full h-14 rounded-full border-gray-100 text-gray-600 font-bold hover:bg-gray-50 flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
            onClick={async () => {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: window.location.origin + '/dashboard'
                }
              });
              if (error) toast.error(error.message);
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com Google
          </Button>


          <div className="text-center mt-10">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
            >
              {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Entre"}
            </button>
          </div>
        </AppleCard>
      </motion.div>
    </div>
  );
}
