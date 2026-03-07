import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Wind } from "lucide-react";

const tips = [
  "Beba um copo de água gelada agora.",
  "Mude de ambiente por 5 minutos.",
  "A vontade passa em 3-5 minutos. Você consegue!",
  "Pense no dinheiro que está economizando.",
  "Ligue para alguém que você ama.",
  "Mastigue uma bala ou chiclete.",
];

interface CravingModalProps {
  open: boolean;
  onClose: () => void;
}

const CravingModal = ({ open, onClose }: CravingModalProps) => {
  const [phase, setPhase] = useState<"breathe" | "tip">("breathe");
  const [timer, setTimer] = useState(60);
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  useEffect(() => {
    if (!open) {
      setPhase("breathe");
      setTimer(60);
      return;
    }
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          setPhase("tip");
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  const breatheLabel = () => {
    const cycle = timer % 12;
    if (cycle >= 8) return "Inspire...";
    if (cycle >= 4) return "Segure...";
    return "Expire...";
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-card rounded-3xl border border-border p-8 max-w-md w-full shadow-2xl"
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold font-display">Exercício Anti-Craving</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {phase === "breathe" ? (
            <div className="text-center py-8">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-breathe" />
                <div className="absolute inset-4 rounded-full bg-primary/30 animate-breathe" style={{ animationDelay: "0.5s" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wind className="w-10 h-10 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-semibold text-primary font-display mb-2">{breatheLabel()}</p>
              <p className="text-muted-foreground">{timer}s restantes</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <p className="text-lg font-semibold mb-2 font-display">Dica para você</p>
              <p className="text-muted-foreground mb-6">{randomTip}</p>
              <Button variant="hero" onClick={onClose} className="w-full h-12">
                Me sinto melhor!
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CravingModal;
