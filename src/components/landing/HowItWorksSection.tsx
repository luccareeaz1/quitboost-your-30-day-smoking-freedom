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
  <section id="como-funciona" className="py-32 bg-background relative overflow-hidden stars-bg">
    {/* Nebula glow streak */}
    <div className="absolute top-1/2 right-0 w-1/3 h-full bg-primary/10 blur-[150px] -skew-x-12 transform origin-top translate-x-1/4 pointer-events-none" />
    
    <div className="container mx-auto px-6 max-w-7xl relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-24"
      >
        <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-white text-gradient-white italic leading-none">O Caminho para a <span className="text-primary">Liberdade</span></h2>
        <p className="text-muted-foreground text-xl font-medium italic max-w-2xl mx-auto leading-relaxed">O protocolo definitivo sintetizado em <span className="text-white font-bold">4 fases neurais</span>.</p>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-12">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="flex flex-col group relative"
          >
            <div className="relative mb-12">
              <div className="w-24 h-24 rounded-[2.5rem] bg-card/40 border border-border/40 flex items-center justify-center shadow-2xl backdrop-blur-xl group-hover:bg-primary group-hover:scale-110 group-hover:shadow-[0_0_30px_hsla(152,58%,48%,0.3)] transition-all duration-700 overflow-hidden relative">
                 <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                 <s.icon className="w-10 h-10 text-primary group-hover:text-white relative z-10 transition-colors" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-black italic shadow-2xl border-4 border-background z-20 group-hover:scale-110 transition-transform duration-500">
                {s.num}
              </div>
            </div>
            
            <h3 className="text-2xl font-black tracking-tighter mb-4 text-white italic group-hover:text-primary transition-colors">{s.title}</h3>
            <p className="text-muted-foreground text-sm font-semibold leading-relaxed group-hover:text-foreground/80 transition-colors">{s.desc}</p>
            
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-12 left-28 w-24 h-[1px] bg-gradient-to-r from-border/50 to-transparent pointer-events-none" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
