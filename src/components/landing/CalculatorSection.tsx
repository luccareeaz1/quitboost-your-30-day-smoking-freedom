import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CalculatorSection = () => {
  const [cigarros, setCigarros] = useState(20);
  const [preco, setPreco] = useState(1.5);
  const navigate = useNavigate();

  const diario = cigarros * preco;
  const mensal = diario * 30;
  const anual = diario * 365;

  return (
    <section id="calculator" className="py-32 bg-[#0a0a0a] text-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
            O PREÇO DA SUA <span className="text-primary">LIBERDADE</span>.
          </h2>
          <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto italic">
            "Não é apenas fumaça. É o seu futuro sendo queimado."
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-[3rem] border border-white/10 p-10 md:p-16 bg-white/5 backdrop-blur-xl shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-12">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-white/60 mb-6">
                    Hábito Diário: <span className="text-primary text-3xl italic ml-2">{cigarros} un.</span>
                  </label>
                  <input
                    type="range" min={1} max={60} value={cigarros}
                    onChange={e => setCigarros(+e.target.value)}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-white/60 mb-6">
                    Custo Unitário: <span className="text-primary text-3xl italic ml-2">R${preco.toFixed(2)}</span>
                  </label>
                  <input
                    type="range" min={0.5} max={5} step={0.1} value={preco}
                    onChange={e => setPreco(+e.target.value)}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="flex items-center gap-4 p-5 rounded-3xl bg-primary/10 border border-primary/20">
                  <AlertCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <p className="text-xs font-bold text-primary/80 leading-relaxed uppercase tracking-wider">
                    Em 5 anos, você terá queimado mais de <span className="text-white">R${(anual * 5).toLocaleString('pt-BR')}</span>. 
                    Daria para comprar um carro zero.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-8 bg-white/5 p-8 rounded-[2rem] border border-white/5">
                <div className="space-y-6">
                  {[
                    { label: "Dreno Diário", value: diario, color: "text-white/40" },
                    { label: "Prejuízo Mensal", value: mensal, color: "text-white/60" },
                    { label: "CRIME ANUAL", value: anual, color: "text-primary" },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-end border-b border-white/5 pb-4">
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.color}`}>{item.label}</p>
                      <p className={`text-3xl font-black italic tracking-tighter ${item.color === 'text-primary' ? 'text-primary scale-110' : 'text-white'}`}>
                        R${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-full bg-primary text-black hover:scale-105 transition-all shadow-[0_0_30px_rgba(var(--primary),0.3)]"
                  onClick={() => navigate("/onboarding")}
                >
                  ESTANCAR O PREJUÍZO AGORA
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CalculatorSection;
