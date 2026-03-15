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
    <section id="calculator" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Quanto você vai economizar?
          </h2>
          <p className="text-muted-foreground text-lg">Calcule agora mesmo.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-3xl border border-border p-8 md:p-12 bg-card">
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Cigarros por dia: <span className="text-foreground text-xl font-bold">{cigarros}</span>
                </label>
                <input
                  type="range" min={1} max={60} value={cigarros}
                  onChange={e => setCigarros(+e.target.value)}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Preço por cigarro: <span className="text-foreground text-xl font-bold">R${preco.toFixed(2)}</span>
                </label>
                <input
                  type="range" min={0.5} max={5} step={0.1} value={preco}
                  onChange={e => setPreco(+e.target.value)}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-foreground"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { label: "Por dia", value: diario },
                  { label: "Por mês", value: mensal },
                  { label: "Por ano", value: anual },
                ].map(item => (
                  <div key={item.label} className="text-center p-4 rounded-2xl bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-2xl md:text-3xl font-bold tracking-tight">
                      R${item.value.toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted border border-border">
                <TrendingUp className="w-5 h-5 text-foreground flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Em 1 ano, você economiza{" "}
                  <strong className="text-foreground">R${anual.toFixed(0)}</strong> — suficiente para uma viagem!
                </p>
              </div>

              <Button size="lg" className="w-full h-14 text-base rounded-full" onClick={() => navigate("/onboarding")}>
                <Wallet className="mr-2 w-5 h-5" /> Quero economizar agora
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CalculatorSection;
