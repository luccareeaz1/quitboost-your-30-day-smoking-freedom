import { motion } from "framer-motion";
import { Users, Cigarette, Wallet, Star, ShieldCheck } from "lucide-react";

const stats = [
  { icon: Users, value: "15.4k", label: "Guerreiros Venceram", color: "text-emerald-400" },
  { icon: Cigarette, value: "2.8M", label: "Cigarros Evitados", color: "text-white" },
  { icon: Wallet, value: "R$9.4M", label: "Economia Gerada", color: "text-emerald-400" },
];

const testimonials = [
  { 
    name: "Carlos Mendes", 
    role: "Ex-fumante há 8 meses", 
    text: "O QuitBoost redefiniu minha jornada. O suporte do Coach Neural nas madrugadas de ansiedade foi o divisor de águas que nenhum outro método ofereceu.", 
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=carlos"
  },
  { 
    name: "Mariana Costa", 
    role: "Livre há 3 meses", 
    text: "Pela primeira vez em 10 anos, sinto que tenho o controle. Ver a economia real subindo todo dia é viciante e me motiva a nunca mais tocar em um cigarro.", 
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=mariana"
  },
  { 
    name: "Ricardo Fonseca", 
    role: "Livre há 1 ano", 
    text: "A engenharia emocional por trás do app é fantástica. A transição para uma vida saudável foi fluida, sem o sofrimento que eu esperava.", 
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=ricardo"
  },
];

const SocialProofSection = () => (
  <section className="py-24 bg-transparent relative overflow-hidden">
    <div className="container mx-auto px-6">
      
      {/* TESTIMONIALS */}
      <div className="grid lg:grid-cols-3 gap-8 mb-32">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass-dark p-8 rounded-[3rem] border border-white/5 relative group hover:border-emerald-500/30 transition-all shadow-xl"
          >
            <div className="flex gap-1 mb-6">
               {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} className="fill-emerald-400 text-emerald-400" />)}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-10 italic font-medium">"{t.text}"</p>
            <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="w-12 h-12 rounded-2xl border border-white/10 overflow-hidden shadow-glow">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white tracking-tight leading-none mb-1">{t.name}</h4>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{t.role}</p>
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* BIG STATS */}
      <div className="grid md:grid-cols-3 gap-16 border-t border-white/5 pt-24">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center group"
          >
            <div className="flex items-center justify-center mb-6">
                <s.icon className={`w-14 h-14 ${s.color} opacity-20 group-hover:opacity-100 transition-all duration-700`} />
            </div>
            <p className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 italic drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              {s.value}
            </p>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 text-center">
         <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
            <ShieldCheck size={14} /> Dados Certificados OMS 2026
         </div>
      </div>

    </div>
  </section>
);

export default SocialProofSection;
