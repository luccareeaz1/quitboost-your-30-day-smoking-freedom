import { motion } from "framer-motion";
import { Heart, Wallet, Users, Target, Brain, Shield } from "lucide-react";

const benefits = [
  { icon: Heart, title: "Melhore sua saúde", desc: "Recupere a capacidade pulmonar e reduza riscos de doenças graves." },
  { icon: Wallet, title: "Economize dinheiro", desc: "Veja em tempo real quanto dinheiro você está economizando." },
  { icon: Users, title: "Comunidade de apoio", desc: "Conecte-se com milhares de pessoas na mesma jornada." },
  { icon: Target, title: "Plano personalizado", desc: "Receba um plano de 30 dias feito sob medida para o seu perfil." },
  { icon: Brain, title: "Coaching com IA", desc: "Receba recomendações inteligentes baseadas nos seus padrões." },
  { icon: Shield, title: "Prevenção de recaída", desc: "Alertas inteligentes nos momentos de maior risco." },
];

const BenefitsSection = () => (
  <section className="py-32 bg-transparent relative">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-24"
      >
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white italic">
          Por que funciona?
        </h2>
        <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto">
          Unimos neurociência e tecnologia espacial para sua liberdade.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group p-10 rounded-[2.5rem] glass-dark border border-white/5 hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.02)]"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <b.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-black mb-4 tracking-tight text-white uppercase italic">{b.title}</h3>
            <p className="text-white/40 text-sm font-medium leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
