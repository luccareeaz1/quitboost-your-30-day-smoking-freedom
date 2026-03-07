import { motion } from "framer-motion";
import { Heart, Wallet, Users, Target, Shield, Brain } from "lucide-react";

const benefits = [
  { icon: Heart, title: "Melhore sua saúde", desc: "Recupere a capacidade pulmonar e reduza riscos de doenças graves." },
  { icon: Wallet, title: "Economize dinheiro", desc: "Veja em tempo real quanto dinheiro você está economizando." },
  { icon: Users, title: "Comunidade de apoio", desc: "Conecte-se com milhares de pessoas na mesma jornada." },
  { icon: Target, title: "Plano personalizado", desc: "Receba um plano de 30 dias feito sob medida para o seu perfil." },
  { icon: Brain, title: "Coaching com IA", desc: "Receba recomendações inteligentes baseadas nos seus padrões." },
  { icon: Shield, title: "Prevenção de recaída", desc: "Alertas inteligentes nos momentos de maior risco." },
];

const BenefitsSection = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">
          Por que o <span className="text-gradient">QuitBoost</span> funciona?
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Combinamos ciência, tecnologia e comunidade para criar o método mais eficaz.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group p-8 rounded-2xl gradient-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
          >
            <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <b.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 font-display">{b.title}</h3>
            <p className="text-muted-foreground">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
