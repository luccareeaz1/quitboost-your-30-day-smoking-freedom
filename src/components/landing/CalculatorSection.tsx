import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp } from "lucide-react";
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
    <section id="calculator" className="py-32 bg-transparent relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white italic">
            O Preço da sua Liberdade
          </h2>
          <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto italic leading-relaxed">Quantos milhares de reais o vício está drenando da sua vida? Calcule o resgate abaixo.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-[3rem] border border-white/5 p-10 md:p-14 glass-dark shadow-2xl backdrop-blur-3xl overflow-hidden relative">
            <div className="space-y-12">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-5 italic">
                  Cigarros por dia: <span className="text-white text-2xl font-black ml-2">{cigarros}</span>
                </label>
                <input
                  type="range" min={1} max={60} value={cigarros}
                  onChange={e => setCigarros(+e.target.value)}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-5 italic">
                  Preço por cigarro: <span className="text-white text-2xl font-black ml-2">R${preco.toFixed(2)}</span>
                </label>
                <input
                  type="range" min={0.5} max={5} step={0.1} value={preco}
                  onChange={e => setPreco(+e.target.value)}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6 italic">
                {[
                  { label: "Diário", value: diario },
                  { label: "Mensal", value: mensal },
                  { label: "Anual", value: anual },
                ].map(item => (
                  <div key={item.label} className="text-center p-6 rounded-[1.5rem] bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">{item.label}</p>
                    <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">
                      R${item.value.toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-primary/5 border border-primary/10">
                <TrendingUp className="w-6 h-6 text-primary flex-shrink-0" />
                <p className="text-sm font-bold text-white/50 leading-relaxed italic">
                  Em 1 ano, você resgata{" "}
                  <strong className="text-primary text-xl font-black px-1 tracking-tighter">R${anual.toFixed(0)}</strong> direto para sua conta.
                </p>
              </div>

              <Button size="lg" className="w-full h-16 text-sm font-black uppercase tracking-widest rounded-[1.5rem] bg-white text-black hover:bg-white/90 shadow-xl shadow-white/5 transition-all" onClick={() => navigate("/onboarding")}>
                <Wallet className="mr-2 w-5 h-5" /> Iniciar Resgate Financeiro
              </Button>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 blur-[60px] rounded-full pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CalculatorSection;
