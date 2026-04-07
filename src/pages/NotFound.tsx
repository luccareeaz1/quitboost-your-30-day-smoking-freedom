import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ban, Wind, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: Access to", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-9xl font-black">404</div>
      <div className="absolute bottom-0 left-0 p-10 opacity-5 pointer-events-none text-9xl font-black rotate-180">404</div>

      <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary mb-8 shadow-soft animate-pulse">
         <Search size={40} />
      </div>

      <h1 className="text-5xl font-black tracking-tighter mb-4">Página <span className="text-primary italic">Perdida.</span></h1>
      <p className="text-muted-foreground font-medium text-lg max-w-sm mb-12 leading-relaxed italic">
        "O cigarro desvia o fôlego. O link desvia o caminho. <br />
        Vamos voltar para a jornada real."
      </p>

      <div className="flex gap-4">
         <Button onClick={() => navigate("/")} className="h-16 px-10 rounded-[28px] bg-foreground text-background font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-foreground/10">
            Retornar ao Home
         </Button>
         <Button onClick={() => navigate(-1)} variant="outline" className="h-16 px-10 rounded-[28px] border-2 border-border font-black uppercase tracking-widest text-xs hover:bg-muted transition-all">
            <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
         </Button>
      </div>

      <div className="mt-20 flex items-center gap-2 opacity-30 select-none">
         <Wind className="w-4 h-4" />
         <span className="text-sm font-medium font-black uppercase tracking-widest">freesh Ecosystem</span>
      </div>
    </div>
  );
};

export default NotFound;
