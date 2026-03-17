import { motion } from "framer-motion";
import { Heart, Wallet, Users, Target, Brain, Shield, Sparkles } from "lucide-react";

const benefits = [
  { icon: Heart, title: "Saúde Plena", desc: "Recupere 100% da sua capacidade pulmonar com protocolos validados pela ciência." },
  { icon: Wallet, title: "Economia Inteligente", desc: "Monitore o dinheiro que volta para o seu bolso em tempo real e realize seus objetivos." },
  { icon: Users, title: "Comunidade de Elite", desc: "Conecte-se com pessoas que compartilham sua jornada e celebram suas vitórias." },
  { icon: Target, title: "Plano Sob Medida", desc: "Um roteiro minucioso de 30 dias adaptado ao seu perfil psicológico e físico." },
  { icon: Brain, title: "Suporte Neural AI", desc: "Nossa IA antecipa seus gatilhos e oferece suporte imediato nos momentos críticos." },
  { icon: Shield, title: "Prevenção Ativa", desc: "Muralha tecnológica contra recaídas, mantendo você no caminho da liberdade." },
];

const BenefitsSection = () => (
  <section className="py-32 bg-white text-gray-900 overflow-hidden">
    <div className="container mx-auto px-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-24"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold mb-6 uppercase tracking-[0.2em] border border-green-100">
          <Sparkles size={12} /> Engenharia da Libertação
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
          A ciência trabalhando para <span className="text-primary italic">você.</span>
        </h2>
        <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          Unimos tecnologia de ponta e os pilares da psicologia behaviorista para garantir que você não apenas pare, mas permaneça livre.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="group p-10 rounded-[2rem] bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-primary/30 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500"
          >
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-8 border border-gray-100 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
              <b.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors">{b.title}</h3>
            <p className="text-gray-500 text-[15px] leading-relaxed font-medium group-hover:text-gray-600 transition-colors">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
