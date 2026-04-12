import { useState, useEffect } from "react";
import { X, Heart, Shield, MessageSquare, Phone, Play, RefreshCw, Zap, Wind, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SOSModeProps {
  isOpen: boolean;
  onClose: (outcome?: 'resisted' | 'relapsed' | 'incomplete') => void;
  supportContact?: { name: string; phone: string };
}

const MOTIVATIONAL_MESSAGES = [
  "A fissura dura apenas alguns minutos. Seja mais forte que ela.",
  "Beba um copo de água bem gelado agora mesmo.",
  "Sua saúde é mais valiosa que um cigarro.",
  "Pense nos seus pulmões se curando a cada respiração.",
  "Você já chegou longe demais para desistir agora.",
  "Cada fissura vencida é um passo para a liberdade.",
];

export function SOSMode({ isOpen, onClose, supportContact }: SOSModeProps) {
  const [timer, setTimer] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle');
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          if (prev % 60 === 0) setMessageIndex((idx) => (idx + 1) % MOTIVATIONAL_MESSAGES.length);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  useEffect(() => {
    if (!isActive) return;
    let timeout: any;
    const runBreathingCycle = () => {
      setBreathPhase('inhale');
      timeout = setTimeout(() => {
        setBreathPhase('hold');
        timeout = setTimeout(() => {
          setBreathPhase('exhale');
          timeout = setTimeout(() => { runBreathingCycle(); }, 8000);
        }, 7000);
      }, 4000);
    };
    runBreathingCycle();
    return () => clearTimeout(timeout);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => onClose('incomplete')} />
      
      <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl relative z-10">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Modo Emergência</h2>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">Estamos com você nesta jornada</p>
              </div>
            </div>
            <button onClick={() => onClose('incomplete')} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full transition-colors group">
              <X className="w-5 h-5 text-slate-400 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <div className="bg-slate-50/50 rounded-[2.5rem] p-10 flex flex-col items-center mb-10 border border-slate-100 relative group">
            <div className="absolute top-8 right-8">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                Duração da Fissura
              </div>
            </div>

            <h3 className="text-7xl font-black text-slate-900 mb-2 tracking-tighter tabular-nums">{formatTime(timer)}</h3>
            <p className="text-xs text-slate-400 font-bold mb-10">Fique calmo. Isto vai passar em instantes.</p>

            <div className="relative w-56 h-56 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isActive ? (
                  <motion.div key={breathPhase} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: breathPhase === 'inhale' ? 1.4 : breathPhase === 'hold' ? 1.4 : 0.8, opacity: 1 }} transition={{ duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 7 : 8, ease: "easeInOut" }}
                    className={cn("w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center shadow-xl", breathPhase === 'inhale' ? "border-sky-400 bg-sky-50 text-sky-600" : breathPhase === 'hold' ? "border-emerald-400 bg-emerald-50 text-emerald-600" : "border-amber-400 bg-amber-50 text-amber-600")}>
                    <Wind className="w-6 h-6 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{breathPhase === 'inhale' ? 'Inspire' : breathPhase === 'hold' ? 'Segure' : 'Expire'}</span>
                  </motion.div>
                ) : (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsActive(true)} className="w-36 h-36 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center gap-3 shadow-2xl shadow-slate-400 transition-all group">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Play className="w-5 h-5 fill-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Iniciar Calmaria</span>
                  </motion.button>
                )}
              </AnimatePresence>
              <div className="absolute inset-0 border border-slate-100 rounded-full scale-110" />
              <div className="absolute inset-0 border border-slate-50 rounded-full scale-125" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <CardOption icon={Zap} title="MINI-JOGO" desc="Distraia sua mente" color="bg-amber-100 text-amber-600" onClick={() => window.open('https://www.google.com/logos/2010/pacman10-i.html', '_blank')} />
            <CardOption icon={Phone} title="APOIADOR" desc={supportContact?.name || "Emergência"} color="bg-sky-100 text-sky-600" onClick={() => { if (supportContact?.phone) window.location.href = `tel:${supportContact.phone}`; }} />
          </div>

          <div className="p-8 bg-slate-100/50 rounded-[2rem] flex items-start gap-5 mb-10 border border-slate-100">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{MOTIVATIONAL_MESSAGES[messageIndex]}"</p>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => onClose('resisted')} variant="outline" className="flex-1 rounded-[1.5rem] h-16 font-black text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 active:scale-95 transition-all text-sm uppercase tracking-widest">Venci a Fissura!</Button>
            <Button onClick={() => onClose('relapsed')} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-[1.5rem] h-16 font-black active:scale-95 transition-all text-sm uppercase tracking-widest shadow-lg shadow-rose-200">Tive uma Recaída</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CardOption({ icon: Icon, title, desc, color, onClick }: any) {
  return (
    <button onClick={onClick} className="flex items-center gap-5 p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-100 transition-all text-left group">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <p className="text-sm font-black text-slate-900 truncate">{desc}</p>
      </div>
    </button>
  );
}
