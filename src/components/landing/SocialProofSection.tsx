import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { AppleCard } from "@/components/ui/apple-card";

const testimonials = [
  {
    name: "Ricardo Santos",
    role: "Fumante por 15 anos",
    content: "O QuitBoost não é apenas um app, é um salva-vidas. O AI Coach me ajudou nos momentos mais sombrios da fissura.",
    avatar: "RS",
    rating: 5
  },
  {
    name: "Mariana Costa",
    role: "Livre há 6 meses",
    content: "Ver o dinheiro economizado subindo em tempo real foi o que me manteu focada. Já economizei mais de 5 mil reais!",
    avatar: "MC",
    rating: 5
  },
  {
    name: "João Oliveira",
    role: "Ex-fumante",
    content: "A comunidade é incrível. Saber que você não está sozinho faz toda a diferença no mundo.",
    avatar: "JO",
    rating: 5
  }
];

const TestimonialsSection = () => (
  <section id="comunidade" className="py-32 bg-background">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="flex flex-col items-center text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Vozes da <span className="text-primary italic">Liberdade</span></h2>
        <p className="text-muted-foreground text-xl font-medium italic max-w-2xl mx-auto">Mais de 12.000 pessoas já retomaram o controle. Você é o próximo.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <AppleCard className="p-10 h-full flex flex-col bg-secondary/5 border-border/50 relative group hover:scale-[1.02] transition-all duration-500">
              <Quote className="absolute top-8 right-10 w-12 h-12 text-primary/10 group-hover:text-primary/20 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-amber-500" fill="currentColor" />
                ))}
              </div>

              <p className="text-lg font-bold text-foreground leading-relaxed italic mb-8 flex-grow">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-black text-foreground uppercase tracking-widest text-[10px]">{t.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </AppleCard>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
