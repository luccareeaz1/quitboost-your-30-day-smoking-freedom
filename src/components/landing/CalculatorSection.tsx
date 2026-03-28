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
    <section id="calculator" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-primary text-sm font-semibold mb-3">Calculadora</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Quanto o cigarro custa para você?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Descubra quanto dinheiro você pode recuperar ao parar de fumar.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl mx-auto">
          <div className="rounded-2xl border border-border p-8 bg-card">
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-4">
                  Cigarros por dia: <span className="text-foreground text-xl font-bold ml-1">{cigarros}</span>
                </label>
                <input type="range" min={1} max={60} value={cigarros} onChange={e => setCigarros(+e.target.value)}
                  className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer accent-primary" />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-4">
                  Preço por cigarro: <span className="text-foreground text-xl font-bold ml-1">R${preco.toFixed(2)}</span>
                </label>
                <input type="range" min={0.5} max={5} step={0.1} value={preco} onChange={e => setPreco(+e.target.value)}
                  className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer accent-primary" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Dia", value: diario },
                  { label: "Mês", value: mensal },
                  { label: "Ano", value: anual },
                ].map(item => (
                  <div key={item.label} className="text-center p-4 rounded-xl bg-secondary/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-xl font-bold">R${item.value.toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <TrendingUp className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Em 1 ano, você recupera <strong className="text-primary font-bold">R${anual.toFixed(0)}</strong>.
                </p>
              </div>

              <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold" onClick={() => navigate("/onboarding")}>
                <Wallet className="mr-2 w-4 h-4" /> Começar Agora
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CalculatorSection;
