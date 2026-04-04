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
    <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-6 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-white border border-gray-100 rounded-[40px] p-10 md:p-14 shadow-lg">
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 bg-[#528114] flex items-center justify-center rounded-2xl mb-8 shadow-md">
              <Zap size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black mb-2 text-center">
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
            </h1>
            <p className="text-gray-500 text-sm tracking-wide font-medium text-center">
              A ciência da sua liberdade
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#528114] transition-colors" size={18} />
                  <Input
                    placeholder="Nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-[#F2F2F7] border-transparent h-14 pl-12 rounded-2xl focus:border-[#528114] transition-all text-black placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#528114] transition-colors" size={18} />
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#F2F2F7] border-transparent h-14 pl-12 rounded-2xl focus:border-[#528114] transition-all text-black placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#528114] transition-colors" size={18} />
                <Input
                  type="password"
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#F2F2F7] border-transparent h-14 pl-12 rounded-2xl focus:border-[#528114] transition-all text-black placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-4 bg-[#528114] hover:bg-green-700 text-white font-bold text-[15px] rounded-2xl transition-transform active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <div className="flex items-center justify-center gap-2">
                  {isLogin ? "Acessar Plataforma" : "Finalizar Cadastro"}
                  <ArrowRight size={18} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-500 text-sm font-semibold hover:text-[#528114] transition-colors"
            >
              {isLogin ? "Não possui conta? Cadastre-se" : "Já possui conta? Faça login"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
