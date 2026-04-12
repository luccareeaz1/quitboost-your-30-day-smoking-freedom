import { motion } from "framer-motion";
import { Brain, LayoutDashboard, Users, Trophy, Wallet, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { AppleCard } from "@/components/ui/apple-card";

const AppContentSection = () => {
  const content = [
    {
      icon: Brain,
      title: "IA Coach Inteligente",
      desc: "Um assistente que aprende seus gatilhos e te guia nos momentos de crise 24h por dia.",
      className: "md:col-span-2 md:row-span-2 bg-blue-50 border-blue-100 shadow-xl shadow-blue-50/50",
      iconColor: "text-blue-600",
      badge: "Inovação"
    },
    {
      icon: LayoutDashboard,
      title: "Dashboard de Liberdade",
      desc: "Acompanhe cada segundo e cada centavo economizado em tempo real.",
      className: "md:col-span-1 md:row-span-1 bg-white border-slate-100 shadow-lg shadow-slate-200/50",
      iconColor: "text-blue-500"
    },
    {
      icon: Users,
      title: "Comunidade VIP",
      desc: "Conecte-se com pessoas que celebram suas vitórias e compartilham a jornada.",
      className: "md:col-span-1 md:row-span-1 bg-white border-slate-100 shadow-lg shadow-slate-200/50",
      iconColor: "text-indigo-500"
    },
    {
      icon: Trophy,
      title: "Sistema de Conquistas",
      desc: "Gamificação aplicada para manter seu cérebro focado na sua evolução.",
      className: "md:col-span-1 md:row-span-1 bg-white border-slate-100 shadow-lg shadow-slate-200/50",
      iconColor: "text-blue-400"
    },
    {
      icon: Wallet,
      title: "Gestão Financeira",
      desc: "Veja seu dinheiro voltando para o seu bolso de forma clara e visual.",
      className: "md:col-span-2 md:row-span-1 bg-blue-50/50 border-blue-100 shadow-lg shadow-blue-50/20",
      iconColor: "text-blue-600",
      badge: "Economia"
    }
  ];

  return (
    <section id="funcionalidades" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-6"
          >
            <Sparkles size={14} fill="currentColor" />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Ecossistema Completo</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Ferramentas para sua <span className="text-blue-600 italic">Libertação</span>
          </h2>
          <p className="text-slate-500 text-xl max-w-3xl font-medium leading-relaxed">
            Criamos uma infraestrutura de suporte completa com base em dados científicos para garantir que você nunca mais volte a fumar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[280px]">
          {content.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`rounded-[2.5rem] border p-10 flex flex-col items-start relative overflow-hidden transition-all duration-500 hover:-translate-y-2 ${item.className}`}
            >
              {item.badge && (
                <div className="absolute top-8 right-8 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-[9px] font-bold text-blue-600 uppercase tracking-widest italic leading-none">
                  {item.badge}
                </div>
              )}
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-white shadow-sm border border-slate-100 transition-transform duration-500 ${item.iconColor}`}>
                <item.icon size={28} strokeWidth={2} />
              </div>
              
              <div className="mt-auto">
                <h3 className="text-2xl font-bold tracking-tight mb-3 text-slate-900 italic">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-4 gap-8">
           {[
             { title: "Nota 5.0", sub: "Satisfação total" },
             { title: "+12k", sub: "Vidas transformadas" },
             { title: "Seguro", sub: "Privacidade absoluta" },
             { title: "Neural", sub: "Tecnologia de ponta" }
           ].map((stat, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.4 + (i * 0.1) }}
               className="text-center p-8 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-50"
             >
               <p className="text-3xl font-bold tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">{stat.title}</p>
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">{stat.sub}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default AppContentSection;
