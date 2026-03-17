import { motion } from "framer-motion";
import { Heart, Wallet, Users, Target, Brain, Shield, Sparkles } from "lucide-react";

const benefits = [
  { icon: Heart, title: "Saúde Inabalável", desc: "Recupere 100% da sua capacidade pulmonar e blinde seu coração contra doenças graves com protocolos validados." },
  { icon: Wallet, title: "Economia Explosiva", desc: "Monitore cada centavo que volta para o seu bolso. Dinheiro real, em tempo real, para seus verdadeiros sonhos." },
  { icon: Users, title: "Elite de Apoio", desc: "Faça parte de uma comunidade de alto nível que não aceita desculpas e celebra cada vitória real." },
  { icon: Target, title: "Precisão Cirúrgica", desc: "Um plano de 30 dias milimetrado para o seu perfil psicológico. Sem adivinhação, apenas resultados." },
  { icon: Brain, title: "Coach Neural AI", desc: "Nossa IA processa seus gatilhos e entrega suporte preventivo antes mesmo de você sentir a fissura." },
  { icon: Shield, title: "Muralha de Segurança", desc: "Tecnologia de ponta em prevenção de recaídas. Estamos um passo à frente do vício, sempre." },
];

const BenefitsSection = () => (
  <section className="py-32 bg-[#050505] text-white">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-24"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-6 uppercase tracking-[0.2em] border border-primary/20">
          <Sparkles size={12} /> Engenharia do Bem-Estar
        </div>
        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
          CIÊNCIA QUE <span className="text-primary">DOMINA</span> O VÍCIO.
        </h2>
        <p className="text-white/50 text-xl max-w-2xl mx-auto font-medium">
          Esqueça os métodos convencionais. Nós unimos biologia e algoritmos para garantir sua liberdade.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="group p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-primary/40 transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all duration-500">
              <b.icon className="w-8 h-8 transition-transform group-hover:scale-110" />
            </div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors">{b.title}</h3>
            <p className="text-white/40 text-[15px] leading-relaxed font-medium group-hover:text-white/60 transition-colors">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
