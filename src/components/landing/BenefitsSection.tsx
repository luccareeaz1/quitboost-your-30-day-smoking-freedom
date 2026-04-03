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
    <section id="funcionalidades" className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border mb-6"
          >
            <Sparkles size={12} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Ecossistema Completo</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            O que você encontra no <span className="text-primary italic">QuitBoost</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl font-medium italic">
            Não é apenas um aplicativo. É o seu novo arsenal tecnológico para a liberdade definitiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {content.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={item.className}
            >
              <AppleCard className="h-full group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col p-8 bg-white dark:bg-zinc-900 border-border/50 overflow-hidden relative">
                {item.badge && (
                  <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest">
                    {item.badge}
                  </div>
                )}
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 bg-white shadow-xl ${item.iconColor}`}>
                  <item.icon size={28} strokeWidth={2.5} />
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-2xl font-black tracking-tight mb-3 text-foreground italic">{item.title}</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-xs">{item.desc}</p>
                </div>

                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </AppleCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-4 gap-8">
           {[
             { title: "Nota 5.0", sub: "Avaliação App Store" },
             { title: "+50k", sub: "Vidas transformadas" },
             { title: "Seguro", sub: "Criptografia ponta a ponta" },
             { title: "Científico", sub: "Baseado em TCC" }
           ].map((stat, i) => (
             <div key={i} className="text-center p-6 rounded-[2rem] bg-secondary/10 border border-border/50">
               <p className="text-2xl font-black tracking-tighter text-foreground">{stat.title}</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{stat.sub}</p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default AppContentSection;
