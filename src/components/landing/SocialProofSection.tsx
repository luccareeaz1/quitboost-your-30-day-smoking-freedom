import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { 
    name: "Carlos Mendes", 
    role: "Livre há 8 meses", 
    text: "O Coach IA me ajudou nas noites difíceis de ansiedade. Foi o divisor de águas que nenhum outro método ofereceu.", 
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=carlos"
  },
  { 
    name: "Mariana Costa", 
    role: "Livre há 3 meses", 
    text: "Pela primeira vez em 10 anos, sinto que tenho o controle. Ver a economia crescendo todo dia me motiva demais.", 
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=mariana"
  },
  { 
    name: "Ricardo Fonseca", 
    role: "Livre há 1 ano", 
    text: "A transição para uma vida saudável foi fluida, sem o sofrimento que eu esperava. A comunidade é incrível.", 
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=ricardo"
  },
  { 
    name: "Ana Beatriz", 
    role: "Livre há 5 meses", 
    text: "O acompanhamento da saúde em tempo real foi o que me manteve firme. Ver meus pulmões se recuperando é motivador.", 
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=ana"
  },
];

const SocialProofSection = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary text-sm font-semibold mb-3">Histórias reais</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Quem usou, recomenda
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Milhares de pessoas já transformaram suas vidas com o Breathe Again.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all group"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(t.rating)].map((_, j) => (
                <Star key={j} size={14} className="fill-primary text-primary" />
              ))}
            </div>
            <p className="text-foreground/80 text-sm leading-relaxed mb-6">"{t.text}"</p>
            <div className="flex items-center gap-3 border-t border-border pt-4">
              <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-xl object-cover border border-border" />
              <div>
                <h4 className="text-sm font-semibold">{t.name}</h4>
                <p className="text-xs text-primary font-medium">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProofSection;
