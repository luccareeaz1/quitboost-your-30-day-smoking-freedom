import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
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
    <section id="calculator" className="py-32 bg-gray-50/50 text-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold mb-6 uppercase tracking-[0.2em] border border-green-100">
            <Sparkles size={12} /> Cálculo de Prosperidade
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Veja o impacto da sua <span className="text-primary italic">liberdade.</span>
          </h2>
          <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto">
            Não é só sobre quanto você gasta, mas sobre o que você poderia estar conquistando.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-[2.5rem] border border-gray-100 p-8 md:p-12 bg-white shadow-2xl shadow-gray-200/50">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Cigarros por Dia</label>
                    <span className="text-primary text-3xl font-black italic">{cigarros} <small className="text-xs">un.</small></span>
                  </div>
                  <input
                    type="range" min={1} max={60} value={cigarros}
                    onChange={e => setCigarros(+e.target.value)}
                    className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Preço do Cigarro</label>
                    <span className="text-primary text-3xl font-black italic">R${preco.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min={0.5} max={5} step={0.1} value={preco}
                    onChange={e => setPreco(+e.target.value)}
                    className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="flex items-center gap-4 p-5 rounded-3xl bg-green-50 border border-green-100">
                  <AlertCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <p className="text-xs font-bold text-green-700/80 leading-relaxed uppercase tracking-wider">
                    Em 5 anos, você terá economizado mais de <span className="text-green-900">R${(anual * 5).toLocaleString('pt-BR')}</span>. 
                    O equivalente a um carro ou a sua casa própria.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-8">
                <div className="space-y-6">
                  {[
                    { label: "Economia Diária", value: diario, color: "text-gray-400" },
                    { label: "Economia Mensal", value: mensal, color: "text-gray-600" },
                    { label: "LUCRO ANUAL", value: anual, color: "text-primary" },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-end border-b border-gray-200 pb-4">
                      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${item.color}`}>{item.label}</p>
                      <p className={`text-3xl font-black italic tracking-tighter ${item.color === 'text-primary' ? 'text-primary scale-110' : 'text-gray-900'}`}>
                        R${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-16 text-md font-bold uppercase tracking-widest rounded-full bg-primary text-white hover:bg-green-600 transition-all shadow-xl shadow-green-500/20"
                  onClick={() => navigate("/onboarding")}
                >
                  Estancar Gastos Agora
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
