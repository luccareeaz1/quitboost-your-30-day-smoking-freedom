import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  Trophy, Star, Flame, Heart, Shield, Zap, Target,
  Award, Lock, Share2, ChevronRight, Sparkles, Clock,
  TrendingUp, Crown, Medal, Gift, Check
} from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// ========== MEDICAL BADGES (Fontes: OMS, CDC, INCA) ==========
interface Badge {
  id: string;
  label: string;
  daysNeeded: number;
  emoji: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  story: string;
  medicalFact: string;
  source: string;
  rarity: "comum" | "raro" | "épico" | "lendário";
  points: number;
}

const badgeDefinitions: Badge[] = [
  {
    id: "b1", label: "Primeiro Passo", daysNeeded: 0, emoji: "🌱",
    icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20",
    story: "Você tomou a decisão mais importante da sua vida: começar.",
    medicalFact: "Segundo a OMS, a decisão de parar de fumar é o passo mais importante do tratamento. A intenção precede a ação.",
    source: "OMS - Stages of Change Model (Prochaska & DiClemente)", rarity: "comum", points: 10,
  },
  {
    id: "b2", label: "24 Horas Livre", daysNeeded: 1, emoji: "⭐",
    icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20",
    story: "24 horas sem fumar! O monóxido de carbono saiu do seu sangue.",
    medicalFact: "Após 24 horas sem fumar, o nível de monóxido de carbono (CO) no sangue retorna ao normal, permitindo que o oxigênio circule de forma eficiente.",
    source: "CDC - Health Benefits of Smoking Cessation", rarity: "comum", points: 25,
  },
  {
    id: "b3", label: "72 Horas — Desintoxicação", daysNeeded: 3, emoji: "💪",
    icon: Shield, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20",
    story: "A nicotina foi completamente eliminada do seu corpo!",
    medicalFact: "Após 72 horas, a nicotina é totalmente eliminada do organismo. Os brônquios relaxam, facilitando a respiração. Os sentidos de paladar e olfato começam a se recuperar.",
    source: "INCA - Protocolo Clínico do Tabagismo", rarity: "comum", points: 40,
  },
  {
    id: "b4", label: "1 Semana Invencível", daysNeeded: 7, emoji: "🔥",
    icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20",
    story: "Uma semana! As terminações nervosas começam a se regenerar.",
    medicalFact: "Após 7 dias, as terminações nervosas nas vias aéreas começam a se regenerar. A capacidade pulmonar começa a melhorar mensurável. O risco de infarto agudo já diminuiu significativamente.",
    source: "OMS - WHO Report on Global Tobacco Epidemic", rarity: "raro", points: 60,
  },
  {
    id: "b5", label: "2 Semanas de Aço", daysNeeded: 14, emoji: "🚀",
    icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20",
    story: "A circulação sanguínea melhorou significativamente!",
    medicalFact: "Após 2 semanas, a circulação sanguínea melhora em até 30%. Caminhar fica mais fácil. A função pulmonar pode aumentar até 30%. O período de maior risco de recaída foi superado.",
    source: "CDC - Treating Tobacco Use and Dependence", rarity: "raro", points: 80,
  },
  {
    id: "b6", label: "21 Dias — Novo Cérebro", daysNeeded: 21, emoji: "🧠",
    icon: Zap, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20",
    story: "Um novo padrão neurológico se formou no seu cérebro!",
    medicalFact: "Estudos de neuroimagem mostram que após 21 dias, novos caminhos neurais se consolidam. O córtex pré-frontal (autocontrole) fortalece sua atividade, enquanto a amígdala (desejo) reduz a resposta ao cigarro.",
    source: "OMS - Neurosciense of Addiction", rarity: "épico", points: 100,
  },
  {
    id: "b7", label: "30 Dias — Campeão!", daysNeeded: 30, emoji: "🏆",
    icon: Trophy, color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-600/20",
    story: "30 dias! A função pulmonar aumentou dramaticamente.",
    medicalFact: "Após 1 mês: função pulmonar melhora 30%, cílios das vias aéreas regeneram (melhor limpeza do muco), tosse e cansaço diminuem significativamente. O risco de infecções respiratórias cai.",
    source: "INCA - Benefícios da Cessação Tabágica", rarity: "épico", points: 150,
  },
  {
    id: "b8", label: "90 Dias — Lendário", daysNeeded: 90, emoji: "👑",
    icon: Crown, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20",
    story: "Seu risco de ataque cardíaco caiu significativamente!",
    medicalFact: "Após 3 meses: risco de ataque cardíaco reduz em 50%. A circulação melhora substancialmente. A capacidade pulmonar pode aumentar até 10% do valor perdido. Tosse crônica praticamente desaparece.",
    source: "OMS, CDC", rarity: "lendário", points: 300,
  },
  {
    id: "b9", label: "1 Ano — Imortal", daysNeeded: 365, emoji: "🌟",
    icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20",
    story: "O risco de doença coronariana caiu pela metade!",
    medicalFact: "Após 1 ano sem fumar: o risco de doença coronariana cai pela metade comparado a quem continua fumando. O risco de AVC se aproxima ao de não-fumantes. Você salvou literalmente milhares de minutos de expectativa de vida.",
    source: "OMS - Global Tobacco Epidemic Report, CDC", rarity: "lendário", points: 500,
  },
];

const RARITY_MAP = {
  "comum": { label: "Comum", color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-200" },
  "raro": { label: "Raro", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
  "épico": { label: "Épico", color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" },
  "lendário": { label: "Lendário", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
};

// ========== ANIMATED COUNTER ==========
function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const ctrl = animate(0, value, { duration: 2, ease: "easeOut", onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => ctrl.stop();
  }, [value]);
  return <span>{display}</span>;
}

const Conquistas = () => {
  const navigate = useNavigate();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [shareModal, setShareModal] = useState<Badge | null>(null);
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

  const profile = useMemo(() => {
    const stored = localStorage.getItem("quitboost_profile");
    if (!stored) return null;
    return JSON.parse(stored);
  }, []);

  if (!profile) {
    navigate("/onboarding");
    return null;
  }

  const quitDate = new Date(profile.quitDate);
  const diffDays = Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60 * 60 * 24));

  const unlockedBadges = badgeDefinitions.filter((b) => diffDays >= b.daysNeeded);
  const lockedBadges = badgeDefinitions.filter((b) => diffDays < b.daysNeeded);
  const totalPoints = unlockedBadges.reduce((sum, b) => sum + b.points, 0);

  const nextBadge = lockedBadges.length > 0 ? lockedBadges[0] : null;
  const nextBadgeProgress = nextBadge ? Math.min(100, (diffDays / nextBadge.daysNeeded) * 100) : 100;
  const daysRemaining = nextBadge ? nextBadge.daysNeeded - diffDays : 0;

  const currentLevel = useMemo(() => {
    if (totalPoints >= 1000) return { level: 6, name: "Lenda Viva", icon: "🌟" };
    if (totalPoints >= 500) return { level: 5, name: "Mestre", icon: "👑" };
    if (totalPoints >= 300) return { level: 4, name: "Guerreiro", icon: "⚔️" };
    if (totalPoints >= 150) return { level: 3, name: "Determinado", icon: "🔥" };
    if (totalPoints >= 50) return { level: 2, name: "Forte", icon: "💪" };
    return { level: 1, name: "Iniciante", icon: "🌱" };
  }, [totalPoints]);

  const filteredBadges = useMemo(() => {
    if (filter === "unlocked") return badgeDefinitions.filter((b) => diffDays >= b.daysNeeded);
    if (filter === "locked") return badgeDefinitions.filter((b) => diffDays < b.daysNeeded);
    return badgeDefinitions;
  }, [filter, diffDays]);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl pb-20">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Conquistas</h1>
          <p className="text-muted-foreground text-sm mb-6">
            {unlockedBadges.length} de {badgeDefinitions.length} desbloqueadas — Cada badge tem fundamento médico.
          </p>
        </motion.div>

        {/* LEVEL & POINTS HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl bg-foreground text-background p-6 mb-6 relative overflow-hidden"
        >
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentLevel.icon}</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Nível {currentLevel.level}</p>
                <p className="text-xl font-black">{currentLevel.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black">
                <AnimatedCounter value={totalPoints} />
              </p>
              <p className="text-[10px] uppercase tracking-wider opacity-60">Pontos Totais</p>
            </div>
          </div>
        </motion.div>

        {/* NEXT BADGE PROGRESS */}
        {nextBadge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-card border border-border p-5 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{nextBadge.emoji}</span>
                <div>
                  <p className="text-sm font-semibold">Próxima Conquista</p>
                  <p className="text-xs text-muted-foreground">{nextBadge.label}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{daysRemaining} dias</p>
                <p className="text-[10px] text-muted-foreground">restantes</p>
              </div>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${nextBadgeProgress}%` }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">{Math.round(nextBadgeProgress)}% concluído</p>
          </motion.div>
        )}

        {/* FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 mb-5"
        >
          {[
            { key: "all" as const, label: `Todas (${badgeDefinitions.length})` },
            { key: "unlocked" as const, label: `Desbloqueadas (${unlockedBadges.length})` },
            { key: "locked" as const, label: `Bloqueadas (${lockedBadges.length})` },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                filter === f.key ? "bg-foreground text-background" : "bg-card border border-border hover:bg-accent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* BADGES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredBadges.map((badge, i) => {
            const unlocked = diffDays >= badge.daysNeeded;
            const rarityInfo = RARITY_MAP[badge.rarity];

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.03 }}
                onClick={() => unlocked && setSelectedBadge(badge)}
                className={`rounded-2xl bg-card border p-5 cursor-pointer transition-all ${
                  unlocked
                    ? `${badge.border} hover:shadow-md hover:scale-[1.01]`
                    : "border-border opacity-50 grayscale"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${unlocked ? badge.bg : "bg-muted"} flex items-center justify-center text-2xl shrink-0`}>
                    {unlocked ? badge.emoji : "🔒"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold truncate">{badge.label}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${rarityInfo.bg} ${rarityInfo.color} ${rarityInfo.border} border`}>
                        {rarityInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {unlocked ? badge.story : `Desbloqueie com ${badge.daysNeeded} dias sem fumar.`}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-bold text-primary">+{badge.points} pts</span>
                      {unlocked && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setShareModal(badge); }}
                          className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                        >
                          <Share2 className="w-3 h-3" />
                          Compartilhar
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress for locked badges */}
                {!unlocked && (
                  <div className="mt-3">
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/30 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (diffDays / badge.daysNeeded) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      {diffDays}/{badge.daysNeeded} dias ({Math.round((diffDays / badge.daysNeeded) * 100)}%)
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* HISTORY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-2xl bg-card border border-border p-5"
        >
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Histórico Completo
          </h3>
          <div className="space-y-3">
            {unlockedBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium">{badge.label}</p>
                  <p className="text-[10px] text-muted-foreground">Desbloqueado no dia {badge.daysNeeded}</p>
                </div>
                <span className="text-[10px] font-bold text-primary">+{badge.points}</span>
              </div>
            ))}
            {unlockedBadges.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                Suas conquistas aparecerão aqui conforme você avançar! 🌱
              </p>
            )}
          </div>
        </motion.div>

        {/* BADGE DETAIL MODAL */}
        <AnimatePresence>
          {selectedBadge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => setSelectedBadge(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-card rounded-3xl border border-border p-6 sm:p-8 max-w-md w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 rounded-3xl ${selectedBadge.bg} flex items-center justify-center text-4xl mx-auto mb-4`}>
                    {selectedBadge.emoji}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="text-xl font-bold tracking-tight">{selectedBadge.label}</h3>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${RARITY_MAP[selectedBadge.rarity].bg} ${RARITY_MAP[selectedBadge.rarity].color}`}>
                      {RARITY_MAP[selectedBadge.rarity].label}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 mb-4">{selectedBadge.story}</p>
                </div>

                <div className="rounded-xl bg-muted/50 p-4 mb-4">
                  <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    Fato Médico
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedBadge.medicalFact}
                  </p>
                  <p className="text-[9px] text-primary font-medium mt-2">
                    📚 {selectedBadge.source}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={() => { setShareModal(selectedBadge); setSelectedBadge(null); }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar
                  </Button>
                  <Button
                    className="flex-1 rounded-full"
                    onClick={() => setSelectedBadge(null)}
                  >
                    Fechar
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SHARE MODAL */}
        <AnimatePresence>
          {shareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => setShareModal(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-card rounded-3xl border border-border p-6 max-w-sm w-full shadow-xl text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-4xl mb-3">{shareModal.emoji}</div>
                <h3 className="text-lg font-bold mb-1">{shareModal.label}</h3>
                <p className="text-xs text-muted-foreground mb-6">{shareModal.medicalFact.slice(0, 100)}...</p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {["WhatsApp", "Twitter", "Copiar"].map((opt) => (
                    <button
                      key={opt}
                      className="p-3 rounded-xl border border-border hover:bg-accent transition-colors text-center"
                      onClick={() => setShareModal(null)}
                    >
                      <Share2 className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground font-medium">{opt}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShareModal(null)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MEDICAL DISCLAIMER */}
        <div className="mt-8 rounded-2xl bg-muted/50 border border-border p-4 text-center">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            ⚕️ <strong>Aviso Legal:</strong> As informações médicas nas badges são baseadas em estudos epidemiológicos
            da OMS, CDC e INCA. Resultados individuais podem variar. Este app não substitui consulta médica.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Conquistas;
