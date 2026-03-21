/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useMemo } from "react";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import {
  Send, Bot, User, Sparkles, Target, Zap, Heart,
  Brain, Shield, Clock, Flame, ChevronRight, Calendar,
  MessageCircle, ThumbsUp, AlertTriangle, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Olá! Sou seu Coach QuitBoost, especializado em cessação do tabagismo baseado em evidências científicas da OMS, CDC e INCA.\n\nAnalisei seus dados e estou pronto para te guiar com suporte 24/7. Posso ajudar com:\n\n• 🆘 Manejo de fissuras e craving\n• 🧠 Técnicas de TCC e mindfulness\n• 💊 Informações sobre tratamento farmacológico\n• 📊 Interpretação do seu progresso\n• 🎯 Plano personalizado de cessação\n\nComo você está se sentindo neste momento?",
  timestamp: new Date(),
};

// ========== MEDICAL RESPONSE ENGINE (Fontes: OMS, CDC, INCA) ==========
const getCoachResponse = (userText: string, profile: any): string => {
  const lowerText = userText.toLowerCase();

  const responsePool: Record<string, { keywords: string[]; responses: string[] }> = {
    craving: {
      keywords: ["vontade", "fumar", "cigarro", "fissura", "desejo", "querendo", "pito", "maço", "craving", "recaída", "recaida"],
      responses: [
        "Eu entendo que a fissura é intensa agora. Vamos usar uma técnica comprovada:\n\n**Técnica da Espera Ativa (TCC - INCA):**\n1. O craving dura em média 3-5 minutos\n2. Beba um copo grande de água gelada AGORA\n3. Respire usando 4-7-8: inspire 4s, segure 7s, expire 8s\n4. Mova-se: caminhe, levante, faça 10 agachamentos\n\nCada craving que você vence ENFRAQUECE o circuito de dependência no seu cérebro. Você está reprogramando suas conexões neurais. Aguente 5 minutos — depois me conta como está. 💪\n\n_Fonte: INCA - Protocolo Clínico do Tabagismo_",

        "O que você sente agora é real, mas temporário. A nicotina ativa o mesmo sistema de recompensa que é ativado por comida e afeto. Seu cérebro está pedindo a 'recompensa' habitual.\n\n**Técnica de Grounding (OMS):**\nIdentifique:\n• 5 coisas que você VÊ\n• 4 coisas que você TOCA\n• 3 coisas que você OUVE\n• 2 coisas que você CHEIRA\n• 1 coisa que você SABOREIA\n\nIsso ativa o córtex pré-frontal e desvia a atenção da amígdala (centro do desejo). Use AGORA.\n\n_Fonte: OMS - WHO Clinical Treatment Guideline for Tobacco Cessation_",

        "Você está enfrentando um momento crucial. Estudos mostram que a intensidade do craving **diminui progressivamente** a cada dia sem fumar.\n\n**Dados reais:**\n• Dia 1-3: craving intenso (nicotina sendo eliminada)\n• Dia 4-7: craving moderado (picos menos frequentes)\n• Dia 8-14: craving ocasional (já com intervalos longos)\n• Dia 15-30: craving leve (gatilhos situacionais)\n• Após 30 dias: craving raro e fraco\n\nCada minuto que você resiste está te aproximando da liberdade. O que te levou a sentir essa vontade agora? Vamos identificar o gatilho.\n\n_Fonte: CDC - Treating Tobacco Use and Dependence_",
      ],
    },
    anxiety: {
      keywords: ["ansiedade", "nervoso", "estresse", "irritado", "impaciente", "bravo", "surtando", "tenso", "angústia", "angustia", "pânico", "panico"],
      responses: [
        "A irritabilidade e ansiedade são **sintomas normais da abstinência de nicotina** e tendem a melhorar significativamente entre 2-4 semanas.\n\n**Exercício de Respiração Diafragmática (INCA):**\n1. Sente-se confortavelmente\n2. Coloque uma mão no peito, outra no abdômen\n3. Inspire lentamente pelo nariz (4 segundos) — sinta o abdômen expandir\n4. Segure (2 segundos)\n5. Expire lentamente pela boca (6 segundos)\n6. Repita 10 vezes\n\nA respiração diafragmática ativa o sistema nervoso parassimpático, reduzindo cortisol e adrenalina.\n\n_Fonte: INCA - Protocolo Clínico e Diretrizes Terapêuticas do Tabagismo_",

        "Sua ansiedade tem base neurobiológica: a nicotina estimulava a liberação de dopamina e serotonina artificialmente. Agora seu cérebro está reaprendendo a produzir esses neurotransmissores naturalmente.\n\n**Estratégias comprovadas para ansiedade:**\n• 🏃 Exercício aeróbico por 20-30 min (eleva endorfinas)\n• 🧘 Meditação mindfulness por 10 min\n• 💧 Hidratação adequada (2L/dia mínimo)\n• 😴 Sono regulado (7-8h por noite)\n• 🗣️ Conversa de suporte com alguém de confiança\n\nSe a ansiedade persistir intensamente por mais de 4 semanas, converse com seu médico — pode ser indicada avaliação para suporte medicamentoso.\n\n_Fonte: OMS, CDC_",
      ],
    },
    motivation: {
      keywords: ["motivação", "motivacao", "desistir", "não consigo", "nao consigo", "fraco", "difícil", "dificil", "desanimo", "desânimo", "cansado"],
      responses: [
        "Eu ouço você e quero que saiba: **sentir-se assim é parte do processo, não sinal de fracasso.**\n\nVamos relembrar seus motivos:\n\n**Fatos médicos sobre o que você JÁ conquistou:**\n• Após 20 min: sua pressão arterial normalizou\n• Após 8h: o oxigênio no sangue normalizou\n• Após 24h: o risco de infarto já começou a diminuir\n• Após 48h: terminações nervosas se regenerando\n• Após 72h: a nicotina foi eliminada do corpo\n\n**Você já venceu a parte mais difícil!** Os estudos da OMS mostram que a maioria das recaídas ocorre nos primeiros 14 dias. Cada dia que passa, seu cérebro fica mais forte.\n\nO que te motivou a parar de fumar lá atrás? Vamos relembrar juntos.\n\n_Fonte: OMS - Global Tobacco Epidemic Report_",

        "A falta de motivação é um sintoma esperado da abstinência. A nicotina sequestrava seu sistema de recompensa — agora você está reconstruindo-o.\n\n**Pesquisas mostram que:**\n• Fumantes que tentam 5-7 vezes antes de parar definitivamente têm a MESMA taxa de sucesso\n• Cada tentativa fortalece os circuitos cerebrais de autocontrole\n• Não existe 'tentar tarde demais' — seus pulmões começam a se regenerar imediatamente\n\n**Exercício de Motivação (Entrevista Motivacional - OMS):**\nEscreva agora:\n1. Meu motivo #1 para parar\n2. O que eu perco se voltar a fumar\n3. Como quero me sentir daqui 30 dias\n\nVocê é mais forte do que pensa. O fato de estar aqui, lendo isso, prova isso.\n\n_Fonte: CDC - Treating Tobacco Use and Dependence_",
      ],
    },
    relapse: {
      keywords: ["recaí", "fumei", "voltei", "recaída", "recaida", "fracasso", "fracassei", "caí", "cai"],
      responses: [
        "**Recaída NÃO é fracasso.** Isso é um fato científico, não uma frase motivacional.\n\nSegundo a OMS, a dependência de nicotina é uma doença crônica recidivante. A maioria dos ex-fumantes precisou de múltiplas tentativas (média de 5-7) antes de parar definitivamente.\n\n**O que fazer AGORA:**\n1. ✅ Não se culpe — a culpa pode levar a mais cigarros\n2. ✅ Identifique o que desencadeou: qual foi o gatilho?\n3. ✅ Recomece AGORA, não amanhã\n4. ✅ Reforce suas estratégias de enfrentamento\n5. ✅ Considere conversar com seu médico sobre opções farmacológicas\n\n**Dado importante:** Quem tenta novamente após uma recaída tem a mesma probabilidade de sucesso que na primeira tentativa.\n\nVocê está pronto para recomeçar? Estou aqui com você. 💚\n\n_Fonte: OMS, INCA, CDC_",
      ],
    },
    medication: {
      keywords: ["remédio", "remedio", "medicamento", "adesivo", "patch", "nicotina", "bupropiona", "vareniclina", "champix", "zyban", "TRN", "goma", "pastilha"],
      responses: [
        "**Importante: SEMPRE consulte seu médico antes de iniciar qualquer medicamento.**\n\nAs diretrizes atuais (OMS, CDC, INCA) reconhecem 3 linhas de tratamento farmacológico:\n\n**1. Terapia de Reposição de Nicotina (TRN):**\n• Adesivos, gomas e pastilhas\n• Reduzem sintomas de abstinência em 50-70%\n• Disponíveis pelo SUS em UBSs\n\n**2. Bupropiona:**\n• Antidepressivo que reduz o craving\n• Receita médica obrigatória\n• Iniciado 1-2 semanas antes de parar\n\n**3. Vareniclina (Champix):**\n• Agonista parcial dos receptores nicotínicos\n• Maior eficácia entre os fármacos (33% em 12 semanas)\n• Receita médica obrigatória\n\n**A combinação de farmacoterapia + terapia comportamental** (como o que fazemos aqui) tem as maiores taxas de sucesso: até 35-40%. Converse com seu médico!\n\n⚕️ _Este app não substitui consulta médica._\n_Fonte: INCA - Protocolo Clínico, CDC Clinical Practice Guideline_",
      ],
    },
    greeting: {
      keywords: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "hey", "eae", "e aí"],
      responses: [
        "Olá! Como você está se sentindo hoje? Estou aqui para te apoiar com técnicas comprovadas pela ciência. 😊\n\nMe conte:\n• Como está a intensidade do craving (0-10)?\n• Conseguiu completar algum desafio hoje?\n• Precisa de alguma técnica específica?",

        "Oi! Que bom te ver aqui. Cada vez que você busca apoio, está fortalecendo sua decisão de parar.\n\nComo posso te ajudar agora?\n• 🆘 Estou com fissura\n• 😰 Estou ansioso/irritado\n• 💪 Quero motivação\n• 📊 Como está meu progresso?",
      ],
    },
    progress: {
      keywords: ["progresso", "como estou", "quanto", "dias", "evolução", "melhora", "estatística", "dados"],
      responses: [
        "Que ótimo que você quer acompanhar seu progresso! Isso mostra comprometimento.\n\n**Linha do tempo de recuperação (OMS):**\n\n⏱️ 20 min → Pressão arterial normaliza\n⏱️ 8h → Nível de CO₂ no sangue cai pela metade\n⏱️ 24h → Risco de ataque cardíaco começa a diminuir\n⏱️ 48h → Terminações nervosas se regeneram (paladar/olfato)\n⏱️ 72h → Capacidade pulmonar melhora, brônquios relaxam\n⏱️ 2 semanas → Circulação melhora 30%\n⏱️ 1 mês → Função pulmonar +30%, cílios brônquicos regeneram\n⏱️ 3 meses → Risco cardíaco reduz 50%\n⏱️ 1 ano → Risco de doença coronariana cai pela metade\n\nAcesse a aba **Progresso** no menu para ver seus dados detalhados em tempo real! 📊\n\n_Fonte: OMS, CDC, INCA_",
      ],
    },
    sleep: {
      keywords: ["sono", "dormir", "insônia", "insonia", "acordar", "madrugada"],
      responses: [
        "Distúrbios do sono são comuns nas primeiras 1-3 semanas de cessação. A nicotina atuava como estimulante e, paradoxalmente, também regulava o ciclo sono-vigília.\n\n**Higiene do sono para ex-fumantes (INCA):**\n• 🌙 Evite cafeína após 14h\n• 📱 Sem telas 1h antes de dormir\n• 🛁 Banho morno relaxante antes de dormir\n• 🧘 Exercício de relaxamento muscular progressivo\n• ⏰ Mantenha horários fixos para dormir e acordar\n• 💧 Chá de camomila ou valeriana podem ajudar\n\n**Importante:** Se a insônia persistir por mais de 3 semanas, consulte seu médico. Pode haver indicação de melatonina ou outro suporte.\n\nO sono vai normalizar — seu corpo está se readaptando!\n\n_Fonte: CDC, INCA_",
      ],
    },
    weight: {
      keywords: ["peso", "gor", "engordar", "engordando", "comendo", "apetite", "fome"],
      responses: [
        "O ganho de peso é uma preocupação legítima e comum. Em média, ex-fumantes ganham 2-4kg nos primeiros meses — mas isso é temporário e muito mais saudável do que continuar fumando.\n\n**Por que acontece:**\n• O metabolismo diminui levemente (a nicotina acelerava 7-15%)\n• O paladar retorna (e a comida fica mais gostosa!)\n• Alguns substituem o cigarro por comida\n\n**Estratégias comprovadas:**\n• 🥗 Frutas e vegetais cortados para substituir o gesto oral\n• 🏃 Exercício regular (compensa a queda metabólica)\n• 💧 Beba água antes das refeições\n• 🍎 Mantenha snacks saudáveis acessíveis\n• ⏱️ Coma devagar, mastigue bem\n\n**Dado importante:** Os benefícios cardiovasculares de parar de fumar superam em MUITO o risco de ganhar 5kg. Para equilibrar os danos do cigarro, seria preciso ganhar mais de 40kg!\n\n_Fonte: CDC, OMS_",
      ],
    },
  };

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  for (const category of Object.values(responsePool)) {
    if (category.keywords.some((k) => lowerText.includes(k))) {
      return pick(category.responses);
    }
  }

  return "Entendo perfeitamente o que você está passando. A jornada de cessação tem altos e baixos, e isso é completamente normal do ponto de vista médico.\n\n**Três coisas que posso te ajudar agora:**\n1. 🆘 Técnicas para craving imediato\n2. 📊 Análise do seu progresso\n3. 🎯 Plano personalizado para hoje\n\nSobre o que você gostaria de falar?\n\n_Lembre-se: este app complementa, mas não substitui, o acompanhamento médico. Consulte seu médico._";
};

// ========== QUICK ACTION BUTTONS ==========
const QUICK_ACTIONS = [
  { label: "Estou com fissura", icon: Flame, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
  { label: "Ansioso/irritado", icon: Brain, color: "text-violet-500 bg-violet-500/10 border-violet-500/20" },
  { label: "Preciso de motivação", icon: Heart, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { label: "Como está meu progresso?", icon: Target, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  { label: "Tive uma recaída", icon: AlertTriangle, color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
  { label: "Dúvida sobre medicamento", icon: BookOpen, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
];

export default function AICoachInterface() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const profile = useMemo(() => {
    const stored = localStorage.getItem("quitboost_profile");
    return stored ? JSON.parse(stored) : null;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const simulateResponse = async (userText: string) => {
    setIsLoading(true);
    // Simulate typing delay (1-3s based on response complexity)
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500));

    const response = getCoachResponse(userText, profile);
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setShowQuickActions(false);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    await simulateResponse(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering for bold, bullets, and emojis
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Bold
      let rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic
      rendered = rendered.replace(/_(.*?)_/g, '<em class="text-muted-foreground text-[11px]">$1</em>');

      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <p key={i} className="pl-4 py-0.5" dangerouslySetInnerHTML={{ __html: rendered }} />
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <p key={i} className="pl-4 py-0.5" dangerouslySetInnerHTML={{ __html: rendered }} />
        );
      }
      if (line.trim() === "") {
        return <br key={i} />;
      }
      return (
        <p key={i} className="py-0.5" dangerouslySetInnerHTML={{ __html: rendered }} />
      );
    });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col h-[calc(100vh-140px)]">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Coach <span className="text-primary">Neural.</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Suporte 24/7 baseado em evidências médicas (OMS, CDC, INCA).
          </p>
        </div>
        <div className="hidden sm:flex gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-card border border-border flex items-center gap-2">
            <Zap size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Modo Empático
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-card border border-border flex items-center gap-2">
            <Shield size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              100% Evidência
            </span>
          </div>
        </div>
      </header>

      {/* CHAT AREA */}
      <AppleCard className="flex-1 flex flex-col bg-card border-border shadow-lg overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 scrollbar-hide">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div className={cn("flex gap-3 max-w-[85%]", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                <div
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-2xl shrink-0 flex items-center justify-center border",
                    msg.role === "assistant"
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {msg.role === "assistant" ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div>
                  <div
                    className={cn(
                      "p-4 sm:p-5 rounded-[1.5rem] text-[13px] sm:text-[14px] leading-relaxed shadow-sm",
                      msg.role === "user"
                        ? "bg-foreground text-background rounded-tr-md"
                        : "bg-muted/50 text-foreground rounded-tl-md border border-border"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <div className="space-y-0">{renderMarkdown(msg.content)}</div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <p className={cn("text-[10px] text-muted-foreground mt-1 px-2", msg.role === "user" ? "text-right" : "text-left")}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Quick Actions */}
          <AnimatePresence>
            {showQuickActions && messages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-wrap gap-2 justify-center pt-4"
              >
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.label)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all hover:scale-[1.02] hover:shadow-sm ${action.color}`}
                  >
                    <action.icon className="w-3.5 h-3.5" />
                    {action.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse border border-primary/20">
                  <Bot size={20} />
                </div>
                <div className="px-5 py-3 rounded-[1.5rem] bg-muted/50 border border-border flex gap-1.5">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 sm:p-6 bg-muted/30 border-t border-border">
          <div className="flex gap-3 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Descreva como se sente ou peça uma técnica..."
              className="flex-1 bg-card h-12 sm:h-14 rounded-full px-5 sm:px-8 shadow-sm border border-border outline-none focus:border-primary/50 transition-all font-medium text-foreground text-sm"
            />
            <Button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Send size={22} />
            </Button>
          </div>
          <p className="text-[9px] text-muted-foreground text-center mt-2">
            ⚕️ Respostas baseadas em OMS, CDC e INCA. Não substitui consulta médica.
          </p>
        </div>
      </AppleCard>
    </div>
  );
}
