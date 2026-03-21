import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Check, Circle, Flame, Trophy, Users, Filter,
  Clock, Zap, Brain, Heart, Shield, Star, ChevronRight,
  TrendingUp, Award, Timer, Sparkles, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";

// ========== MEDICAL-BACKED CHALLENGES (Fontes: OMS, CDC, INCA - TCC) ==========
interface Challenge {
  id: string;
  text: string;
  description: string;
  points: number;
  category: "comportamental" | "mindfulness" | "fisico" | "social" | "cognitivo";
  difficulty: "facil" | "medio" | "dificil";
  technique: string;
  source: string;
  duration?: string;
  collaborative?: boolean;
  weeklyOnly?: boolean;
}

const CHALLENGE_CATEGORIES = {
  comportamental: { label: "Comportamental", icon: Brain, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  mindfulness: { label: "Mindfulness", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  fisico: { label: "Atividade Física", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  social: { label: "Suporte Social", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  cognitivo: { label: "Reestruturação", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

const allChallenges: Challenge[] = [
  // === DIÁRIOS ===
  {
    id: "1", text: "Resista à primeira fissura do dia", description: "Quando sentir a primeira vontade, aplique a técnica de espera ativa: aguarde 5 minutos fazendo outra atividade.",
    points: 20, category: "comportamental", difficulty: "medio", technique: "Terapia Cognitivo-Comportamental (TCC)", source: "INCA - Protocolo Clínico do Tabagismo"
  },
  {
    id: "2", text: "Pratique respiração 4-7-8 por 3 minutos", description: "Inspire pelo nariz contando até 4, segure contando até 7, expire pela boca contando até 8. Repita 4 ciclos.",
    points: 15, category: "mindfulness", difficulty: "facil", technique: "Respiração Diafragmática", source: "OMS - Treating Tobacco Use", duration: "3 min"
  },
  {
    id: "3", text: "Beba 8 copos de água hoje", description: "A hidratação adequada acelera a eliminação de toxinas do tabaco e reduz a intensidade do craving.",
    points: 10, category: "fisico", difficulty: "facil", technique: "Manejo de Sintomas", source: "CDC - Treating Tobacco Dependence"
  },
  {
    id: "4", text: "Caminhe por 15 minutos ao ar livre", description: "A caminhada leve libera endorfinas e dopamina, compensando parcialmente a falta de nicotina de forma saudável.",
    points: 20, category: "fisico", difficulty: "medio", technique: "Atividade Física Substitutiva", source: "OMS", duration: "15 min"
  },
  {
    id: "5", text: "Escreva 3 motivos para parar de fumar", description: "A escrita reflexiva ativa o córtex pré-frontal, fortalecendo a motivação e o controle de impulsos.",
    points: 15, category: "cognitivo", difficulty: "facil", technique: "Entrevista Motivacional", source: "INCA"
  },
  {
    id: "6", text: "Evite seu principal gatilho hoje", description: "Identifique seu gatilho #1 (café, álcool, estresse) e evite-o ou substitua-o conscientemente por uma alternativa saudável.",
    points: 25, category: "comportamental", difficulty: "dificil", technique: "Manejo de Gatilhos (TCC)", source: "CDC"
  },
  {
    id: "7", text: "Pratique a técnica dos 5 sentidos", description: "Quando vier o craving: identifique 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira e 1 que saboreia. Técnica de grounding.",
    points: 15, category: "mindfulness", difficulty: "facil", technique: "Grounding / Ancoragem", source: "OMS", duration: "5 min"
  },
  {
    id: "8", text: "Converse com alguém sobre sua jornada", description: "O suporte social é um dos fatores mais importantes para o sucesso na cessação. Compartilhe seu progresso com alguém de confiança.",
    points: 20, category: "social", difficulty: "medio", technique: "Suporte Social", source: "CDC"
  },
  {
    id: "9", text: "Substitua o café da manhã por chá verde", description: "O café é um dos 3 maiores gatilhos de recaída. O chá verde contém L-teanina, que promove calma e foco.",
    points: 15, category: "comportamental", difficulty: "medio", technique: "Substituição de Estímulo", source: "INCA"
  },
  {
    id: "10", text: "Medite por 10 minutos", description: "A meditação mindfulness reduz a atividade da amígdala (centro do estresse) e fortalece o córtex pré-frontal (autocontrole).",
    points: 25, category: "mindfulness", difficulty: "medio", technique: "Mindfulness-Based Intervention", source: "OMS", duration: "10 min"
  },
  {
    id: "11", text: "Faça 20 flexões ou agachamentos", description: "O exercício intenso de curtíssima duração gera pico de endorfina que pode literalmente 'desligar' um craving ativo.",
    points: 20, category: "fisico", difficulty: "medio", technique: "Exercício de Alta Intensidade", source: "CDC", duration: "5 min"
  },
  {
    id: "12", text: "Vá dormir sem fumar o último cigarro", description: "Eliminar o cigarro antes de dormir é um dos marcos mais importantes. Melhora a qualidade do sono em até 30%.",
    points: 30, category: "comportamental", difficulty: "dificil", technique: "Extinção de Rotina", source: "INCA"
  },
  // === SEMANAIS ===
  {
    id: "w1", text: "Complete 5 dias sem nenhum gatilho", description: "Passe 5 dias consecutivos evitando conscientemente todos os seus gatilhos identificados no perfil.",
    points: 100, category: "comportamental", difficulty: "dificil", technique: "Prevenção de Recaída", source: "OMS", weeklyOnly: true
  },
  {
    id: "w2", text: "Publique na comunidade sua história", description: "Compartilhar sua experiência ajuda outros e fortalece seu próprio compromisso. É terapia de grupo digital.",
    points: 50, category: "social", difficulty: "facil", technique: "Terapia de Grupo", source: "INCA", weeklyOnly: true, collaborative: true
  },
  {
    id: "w3", text: "Pratique exercício físico 4x esta semana", description: "A atividade física regular reduz o craving em até 60% e melhora o humor durante a cessação.",
    points: 80, category: "fisico", difficulty: "medio", technique: "Protocolo de Exercícios", source: "CDC", weeklyOnly: true
  },
];

const DIFFICULTY_MAP = {
  facil: { label: "Fácil", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  medio: { label: "Médio", color: "text-amber-500", bg: "bg-amber-500/10" },
  dificil: { label: "Difícil", color: "text-rose-500", bg: "bg-rose-500/10" },
};

// ========== LEADERBOARD (mock anônimo) ==========
const mockLeaderboard = [
  { name: "Guerreiro123", points: 285, streak: 14 },
  { name: "Respiro_Livre", points: 240, streak: 21 },
  { name: "NovaVida22", points: 215, streak: 10 },
  { name: "ForcaTotal", points: 190, streak: 7 },
  { name: "Liberdade_Já", points: 175, streak: 12 },
];

const Desafios = () => {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("ba_completed_challenges");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showWeekly, setShowWeekly] = useState(false);
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const totalPoints = useMemo(() => {
    return allChallenges.filter((c) => completed.has(c.id)).reduce((sum, c) => sum + c.points, 0);
  }, [completed]);

  const dailyChallenges = allChallenges.filter((c) => !c.weeklyOnly);
  const weeklyChallenges = allChallenges.filter((c) => c.weeklyOnly);

  const currentLevel = useMemo(() => {
    if (totalPoints >= 500) return { level: 5, name: "Mestre da Resiliência", icon: "👑", next: null, progress: 100 };
    if (totalPoints >= 300) return { level: 4, name: "Guerreiro", icon: "⚔️", next: 500, progress: ((totalPoints - 300) / 200) * 100 };
    if (totalPoints >= 150) return { level: 3, name: "Determinado", icon: "🔥", next: 300, progress: ((totalPoints - 150) / 150) * 100 };
    if (totalPoints >= 50) return { level: 2, name: "Iniciante Forte", icon: "💪", next: 150, progress: ((totalPoints - 50) / 100) * 100 };
    return { level: 1, name: "Primeiro Passo", icon: "🌱", next: 50, progress: (totalPoints / 50) * 100 };
  }, [totalPoints]);

  const filteredChallenges = useMemo(() => {
    const source = showWeekly ? weeklyChallenges : dailyChallenges;
    if (selectedCategory === "all") return source;
    return source.filter((c) => c.category === selectedCategory);
  }, [selectedCategory, showWeekly, dailyChallenges, weeklyChallenges]);

  const completedCount = dailyChallenges.filter((c) => completed.has(c.id)).length;
  const dailyProgress = Math.round((completedCount / dailyChallenges.length) * 100);

  const handleToggle = (id: string) => {
    setAnimatingId(id);
    setTimeout(() => setAnimatingId(null), 600);

    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("ba_completed_challenges", JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl pb-20">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Desafios</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Desafios baseados em técnicas comprovadas (TCC, Mindfulness, Manejo de Gatilhos).
          </p>
        </motion.div>

        {/* LEVEL & POINTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl bg-foreground text-background p-6 mb-6 relative overflow-hidden"
        >
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentLevel.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-60">Nível {currentLevel.level}</p>
                  <p className="text-lg font-black">{currentLevel.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black">{totalPoints}</p>
                <p className="text-[10px] uppercase tracking-wider opacity-60">Pontos</p>
              </div>
            </div>

            {currentLevel.next && (
              <div>
                <div className="flex justify-between text-[10px] opacity-60 mb-1">
                  <span>Progresso para Nível {currentLevel.level + 1}</span>
                  <span>{currentLevel.next - totalPoints} pts restantes</span>
                </div>
                <div className="w-full h-2 bg-background/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentLevel.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* DAILY PROGRESS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card border border-border p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Progresso Diário</span>
            </div>
            <span className="text-xs font-bold text-primary">{completedCount}/{dailyChallenges.length}</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dailyProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            {dailyProgress === 100
              ? "🎉 Todos os desafios do dia concluídos! Você é incrível!"
              : `Complete mais ${dailyChallenges.length - completedCount} desafios para fechar o dia!`}
          </p>
        </motion.div>

        {/* TABS: Daily / Weekly */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="flex gap-2 mb-4"
        >
          <button
            onClick={() => setShowWeekly(false)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              !showWeekly ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            <Clock className="w-3.5 h-3.5 inline mr-1.5" />
            Diários ({dailyChallenges.length})
          </button>
          <button
            onClick={() => setShowWeekly(true)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              showWeekly ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            <Star className="w-3.5 h-3.5 inline mr-1.5" />
            Semanais ({weeklyChallenges.length})
          </button>
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              showLeaderboard ? "bg-amber-500 text-white" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* LEADERBOARD */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="rounded-2xl bg-card border border-border p-5">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Ranking Anônimo
                </h3>
                <div className="space-y-3">
                  {mockLeaderboard.map((user, i) => (
                    <div key={user.name} className="flex items-center gap-3">
                      <span className={`w-6 text-center text-sm font-bold ${
                        i === 0 ? "text-amber-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-muted-foreground"
                      }`}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}º`}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-medium">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground">Streak: {user.streak} dias</p>
                      </div>
                      <span className="text-xs font-bold text-primary">{user.points} pts</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-3 italic">
                  Ranking baseado em pontos de desafios. Identidades anônimas.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CATEGORY FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-5"
        >
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
              selectedCategory === "all" ? "bg-foreground text-background" : "bg-card border border-border hover:bg-accent"
            }`}
          >
            Todos
          </button>
          {Object.entries(CHALLENGE_CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1 transition-colors ${
                selectedCategory === key
                  ? `${cat.bg} ${cat.color} ${cat.border} border`
                  : "bg-card border border-border hover:bg-accent"
              }`}
            >
              <cat.icon className="w-3 h-3" />
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* CHALLENGES LIST */}
        <div className="space-y-3">
          {filteredChallenges.map((c, i) => {
            const done = completed.has(c.id);
            const catInfo = CHALLENGE_CATEGORIES[c.category];
            const diffInfo = DIFFICULTY_MAP[c.difficulty];
            const expanded = expandedChallenge === c.id;

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-2xl bg-card border p-4 transition-all ${
                  done ? "border-primary/20 bg-primary/[0.02]" : "border-border hover:shadow-sm"
                } ${animatingId === c.id ? "ring-2 ring-primary/50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggle(c.id)}
                    className="mt-0.5 shrink-0"
                  >
                    {done ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                      </motion.div>
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => setExpandedChallenge(expanded ? null : c.id)}
                    >
                      <div className="flex-1">
                        <p className={`text-sm font-medium leading-snug ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {c.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${catInfo.bg} ${catInfo.color}`}>
                            {catInfo.label}
                          </span>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${diffInfo.bg} ${diffInfo.color}`}>
                            {diffInfo.label}
                          </span>
                          {c.collaborative && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                              <Users className="w-2.5 h-2.5 inline mr-0.5" />
                              Colaborativo
                            </span>
                          )}
                          {c.duration && (
                            <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                              <Timer className="w-2.5 h-2.5" />
                              {c.duration}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        <span className="text-xs font-bold text-primary">+{c.points}</span>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
                      </div>
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                              {c.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-[9px] bg-muted px-2 py-1 rounded-lg">
                                📋 Técnica: {c.technique}
                              </span>
                              <span className="text-[9px] bg-muted px-2 py-1 rounded-lg">
                                📚 Fonte: {c.source}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum desafio nesta categoria.</p>
          </div>
        )}

        {/* GAMIFICATION INFO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-2xl bg-muted/50 border border-border p-4"
        >
          <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Como funciona a gamificação
          </h4>
          <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">
            Complete desafios para ganhar pontos, subir de nível e desbloquear badges nas Conquistas.
            Os desafios são baseados em técnicas comprovadas de TCC (Terapia Cognitivo-Comportamental),
            Mindfulness e Manejo de Gatilhos — recomendadas pelas diretrizes da OMS, CDC e INCA.
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed italic">
            ⚕️ <strong>Aviso:</strong> Este app não substitui consulta médica. Os desafios são complementares
            ao tratamento profissional. Consulte seu médico.
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Desafios;
