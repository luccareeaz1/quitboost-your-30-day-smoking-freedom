import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { X, Wind, Heart, Sparkles } from "lucide-react";

const tips = [
  "Beba um copo de água gelada agora.",
  "Mude de ambiente por 5 minutos.",
  "A vontade passa em 3-5 minutos. Você consegue!",
  "Pense no dinheiro que está economizando.",
  "Ligue para alguém que você ama.",
  "Mastigue uma bala ou chiclete.",
  "Faça 10 agachamentos agora mesmo.",
  "Olhe seu progresso no dashboard.",
];

interface CravingModalProps {
  open: boolean;
  onClose: () => void;
}

const CravingModal = ({ open, onClose }: CravingModalProps) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"breathe" | "tip">("breathe");
  const [timer, setTimer] = useState(60);
  const [randomTip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

  const heartbeatSpeed = timer > 40 ? 0.5 : timer > 20 ? 0.8 : 1.2;

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

  const breathePhase = () => {
    const cycle = timer % 12;
    if (cycle >= 8) return "inspire";
    if (cycle >= 4) return "segure";
    return "expire";
  };

  const breatheLabel = () => {
    const p = breathePhase();
    if (p === "inspire") return "Inspire...";
    if (p === "segure") return "Segure...";
    return "Expire...";
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-card rounded-3xl border border-border p-8 max-w-md w-full shadow-lg"
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-semibold tracking-tight">Exercício de respiração</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {phase === "breathe" ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: heartbeatSpeed, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-5 h-5 text-destructive" />
                </motion.div>
                <span className="text-[10px] text-muted-foreground ml-2 self-center">
                  {timer > 40 ? "rápido" : timer > 20 ? "normalizando" : "calmo"}
                </span>
              </div>

              <div className="relative w-36 h-36 mx-auto mb-6">
                <motion.div
                  className="absolute inset-0 rounded-full bg-muted"
                  animate={{
                    scale: breathePhase() === "expire" ? 1 : 1.3,
                    opacity: breathePhase() === "expire" ? 0.3 : 0.6,
                  }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full bg-muted"
                  animate={{
                    scale: breathePhase() === "expire" ? 1 : 1.2,
                  }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wind className="w-8 h-8 text-foreground" />
                </div>
              </div>
              <p className="text-xl font-semibold tracking-tight mb-2">{breatheLabel()}</p>
              <p className="text-muted-foreground text-sm">{timer}s restantes</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <p className="text-lg font-semibold mb-2 font-display">Dica para você</p>
              <p className="text-muted-foreground mb-6">{randomTip}</p>
              <div className="space-y-3">
                <Button onClick={onClose} className="w-full h-12 rounded-full">
                  Me sinto melhor! 🎉
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { onClose(); navigate("/coach"); }}
                  className="w-full h-12 rounded-full border-2 border-primary/20 hover:bg-primary/5 text-primary"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Preciso de ajuda do Coach IA
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CravingModal;
