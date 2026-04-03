import { motion } from "framer-motion";
import { UserPlus, Sparkles, TrendingUp, PartyPopper } from "lucide-react";

const steps = [
  { 
    icon: UserPlus,
    num: "01", 
    title: "Mapeamento Neural", 
    desc: "Responda ao nosso quiz inteligente para que a IA entenda seu perfil biológico e comportamental." 
  },
  { 
    icon: Sparkles,
    num: "02", 
    title: "Ativação do Protocolo", 
    desc: "Receba seu plano personalizado de 30 dias com micro-desafios e gatilhos mapeados." 
  },
  { 
    icon: TrendingUp,
    num: "03", 
    title: "Acompanhamento Real", 
    desc: "Use o dashboard para ver sua saúde voltando e seu dinheiro rendendo em tempo real." 
  },
  { 
    icon: PartyPopper,
    num: "04", 
    title: "Liberdade Total", 
    desc: "Ao fim dos 30 dias, você terá as ferramentas mentais e o histórico para nunca mais voltar." 
  }
];

const HowItWorksSection = () => (
  <section id="como-funciona" className="py-32 bg-secondary/10 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 transform origin-top translate-x-1/2 pointer-events-none" />
    
    <div className="container mx-auto px-6 max-w-7xl relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-24"
      >
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">O Caminho para a <span className="text-primary italic">Liberdade</span></h2>
        <p className="text-muted-foreground text-xl font-medium italic max-w-2xl mx-auto">Em apenas 4 passos, você retoma o controle da sua vida.</p>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-12">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="flex flex-col group"
          >
            <div className="relative mb-10">
              <div className="w-24 h-24 rounded-[2.5rem] bg-white border border-border/50 flex items-center justify-center shadow-xl group-hover:bg-primary group-hover:scale-110 transition-all duration-500 overflow-hidden relative">
                 <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                 <s.icon className="w-10 h-10 text-foreground group-hover:text-white relative z-10 transition-colors" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black italic shadow-lg">
                {s.num}
              </div>
            </div>
            
            <h3 className="text-2xl font-black tracking-tight mb-4 text-foreground italic">{s.title}</h3>
            <p className="text-muted-foreground text-sm font-semibold leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
