import { motion } from "framer-motion";
import { Heart, Wallet, Users, Target, Brain, Shield } from "lucide-react";

const benefits = [
  { icon: Heart, title: "Melhore sua saúde", desc: "Acompanhe a recuperação pulmonar e cardiovascular em tempo real, com dados baseados em pesquisas da OMS." },
  { icon: Wallet, title: "Economize dinheiro", desc: "Veja exatamente quanto dinheiro você economiza a cada dia sem fumar. É motivação que você pode contar." },
  { icon: Users, title: "Comunidade de apoio", desc: "Conecte-se com milhares de pessoas na mesma jornada. Juntos, a taxa de sucesso aumenta 40%." },
  { icon: Target, title: "Plano personalizado", desc: "Receba um plano adaptado ao seu perfil de fumante, gatilhos e rotina pessoal." },
  { icon: Brain, title: "Coaching com IA", desc: "Um assistente inteligente 24/7 que entende seus padrões e te ajuda nos momentos mais difíceis." },
  { icon: Shield, title: "Prevenção de recaída", desc: "Alertas inteligentes baseados nos seus gatilhos identificados, agindo antes da vontade aparecer." },
];

const BenefitsSection = () => (
  <section id="benefits" className="py-24 relative">
    <div className="container mx-auto px-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <p className="text-primary text-sm font-semibold mb-3">Por que funciona</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Simplifique sua jornada<br />com nossas ferramentas
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl">
          Tecnologia e ciência trabalhando juntas para sua liberdade.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
              <b.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-bold mb-2">{b.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
