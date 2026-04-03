import { motion } from "framer-motion";
import { Brain, LayoutDashboard, Users, Trophy, Wallet, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { AppleCard } from "@/components/ui/apple-card";

const AppContentSection = () => {
  const content = [
    {
      icon: Brain,
      title: "IA Coach Neural",
      desc: "Um cérebro digital que aprende seus gatilhos e te guia nos momentos de crise 24/7.",
      className: "md:col-span-2 md:row-span-2 bg-primary/5 border-primary/20",
      iconColor: "text-primary",
      badge: "Inovação"
    },
    {
      icon: LayoutDashboard,
      title: "Dashboard de Liberdade",
      desc: "Acompanhe cada segundo, cada centavo e cada respiração recuperada em tempo real.",
      className: "md:col-span-1 md:row-span-1 bg-secondary/30",
      iconColor: "text-blue-500"
    },
    {
      icon: Users,
      title: "Comunidade VIP",
      desc: "Conecte-on com pessoas que entendem sua dor e celebram suas vitórias.",
      className: "md:col-span-1 md:row-span-1 bg-violet-500/5 border-violet-500/10",
      iconColor: "text-violet-500"
    },
    {
      icon: Trophy,
      title: "Sistema de Desafios",
      desc: "Gamificação aplicada para manter seu cérebro focado no que importa.",
      className: "md:col-span-1 md:row-span-1 bg-amber-500/5 border-amber-500/10",
      iconColor: "text-amber-500"
    },
    {
      icon: Wallet,
      title: "Gestão Financeira",
      desc: "Veja seu dinheiro voltando para o seu bolso automaticamente.",
      className: "md:col-span-2 md:row-span-1 bg-emerald-500/5 border-emerald-500/10",
      iconColor: "text-emerald-500",
      badge: "Fator Chave"
    }
  ];

  return (
    <section id="funcionalidades" className="py-32 bg-background overflow-hidden stars-bg">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6 backdrop-blur-md"
          >
            <Sparkles size={12} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Ecossistema Completo</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-white leading-none">
            O que você encontra no <span className="text-primary italic">QuitBoost</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl font-medium italic leading-relaxed">
            Nós não construímos apenas um aplicativo. Criamos um <span className="text-white font-bold">arsenal tecnológico</span> de elite para a sua libertação definitiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {content.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={item.className}
            >
              <AppleCard className="h-full group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col p-8 bg-card/40 backdrop-blur-xl border-border/40 overflow-hidden relative">
                {item.badge && (
                  <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest italic leading-none">
                    {item.badge}
                  </div>
                )}
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 bg-black/40 border border-border/50 shadow-2xl ${item.iconColor}`}>
                  <item.icon size={28} strokeWidth={2.5} />
                </div>
                
                <div className="mt-auto relative z-10">
                  <h3 className="text-2xl font-black tracking-tighter mb-3 text-white italic group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-xs">{item.desc}</p>
                </div>

                {/* Nebula individual glow */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </AppleCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-4 gap-8">
           {[
             { title: "Nota 5.0", sub: "Avaliação Global" },
             { title: "+12k", sub: "Novos Sopros de Vida" },
             { title: "Militar", sub: "Estandard de Segurança" },
             { title: "Neural", sub: "Aprendizado em Tempo Real" }
           ].map((stat, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.4 + (i * 0.1) }}
               className="text-center p-8 rounded-[2.5rem] bg-card/20 border border-border/20 backdrop-blur-sm group hover:border-primary/30 transition-all"
             >
               <p className="text-3xl font-black tracking-tighter text-white italic group-hover:scale-110 transition-transform">{stat.title}</p>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">{stat.sub}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default AppContentSection;
