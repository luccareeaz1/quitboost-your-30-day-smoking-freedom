import { motion } from "framer-motion";
import { Users, Cigarette, Wallet, Star, Quote } from "lucide-react";

const stats = [
  { icon: Users, value: "12.847", label: "Guerreiros Livres", color: "text-primary" },
  { icon: Cigarette, value: "2.4M", label: "Cigarros Vencidos", color: "text-white" },
  { icon: Wallet, value: "R$8.2M", label: "Economia Real", color: "text-primary" },
];

const testimonials = [
  { name: "Carlos M.", role: "Ex-fumante há 6 meses", text: "O QuitBoost não é só um app, é um mentor. A IA salvou minhas recaídas nas crises de ansiedade.", rating: 5 },
  { name: "Ana Paula S.", role: "Livre há 30 dias", text: "Minha pele, meu fôlego e minha carteira agradecem. O ritual matinal mudou meu jogo.", rating: 5 },
  { name: "Ricardo F.", role: "Livre há 2 meses", text: "A comunidade é o que faz a diferença. Saber que não estou sozinho me deu a força que faltava.", rating: 5 },
];

const SocialProofSection = () => (
  <section className="py-32 bg-transparent relative overflow-hidden">
    <div className="container mx-auto px-6">
      
      {/* TESTIMONIALS SLIDER / GRID */}
      <div className="grid lg:grid-cols-3 gap-8 mb-32">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-dark p-8 rounded-[2rem] border-white/5 relative group hover:border-white/20 transition-all"
          >
            <div className="flex gap-1 mb-6">
               {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="fill-primary text-primary" />)}
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-8 italic">"{t.text}"</p>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-xs text-white">
                    {t.name[0]}
                </div>
                <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">{t.name}</h4>
                    <p className="text-[10px] text-white/40">{t.role}</p>
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* BIG STATS GRID */}
      <div className="grid md:grid-cols-3 gap-12 border-t border-white/10 pt-20">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
                <s.icon className={`w-10 h-10 ${s.color} opacity-40`} />
            </div>
            <p className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2 italic">{s.value}</p>
            <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em]">{s.label}</p>
          </motion.div>
        ))}
      </div>

    </div>
  </section>
);

export default SocialProofSection;
