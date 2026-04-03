import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap, User, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const NavBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 border-b border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-3xl"
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 group-hover:bg-primary group-hover:scale-110 transition-all duration-500 shadow-lg shadow-primary/10">
            <Zap className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="currentColor" />
          </div>
          <div className="flex flex-col -gap-1">
             <span className="text-2xl font-black text-foreground tracking-tighter leading-none">Quit<span className="text-primary italic">Boost</span></span>
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">Sua nova vida</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {["Funcionalidades", "Como Funciona", "Comunidade", "Preços"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Button 
              variant="default" 
              size="lg" 
              className="rounded-full px-8 bg-foreground text-background font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-foreground/20" 
              onClick={() => navigate("/dashboard")}
            >
               Dashboard
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:inline-flex text-muted-foreground hover:text-foreground font-black uppercase tracking-[0.2em] text-[10px]" 
                onClick={() => navigate("/auth")}
              >
                Entrar
              </Button>
              <Button 
                variant="default" 
                size="lg" 
                className="rounded-full px-10 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20" 
                onClick={() => navigate("/onboarding")}
              >
                Começar Grátis
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden rounded-2xl text-muted-foreground">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
