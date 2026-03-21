/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useMemo } from "react";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import {
  Send, Bot, User, Sparkles, Target, Zap, Heart,
  Brain, Shield, Clock, Flame, ChevronRight, Calendar,
  MessageCircle, ThumbsUp, AlertTriangle, BookOpen, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { coachService } from "@/lib/services";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// ========== MEDICAL RESPONSE ENGINE (Fontes: OMS, CDC, INCA) ==========
const getCoachResponse = (userText: string, profile: any): string => {
  const lowerText = userText.toLowerCase();

  const responsePool: Record<string, { keywords: string[]; responses: string[] }> = {
    craving: {
      keywords: ["vontade", "fumar", "cigarro", "fissura", "desejo", "querendo", "pito", "maço", "craving", "recaída", "recaida"],
      responses: [
        "Eu entendo que a fissura é intensa agora. Vamos usar uma técnica comprovada:\n\n**Técnica da Espera Ativa (TCC - INCA):**\n1. O craving dura em média 3-5 minutos\n2. Beba um copo grande de água gelada AGORA\n3. Respire usando 4-7-8: inspire 4s, segure 7s, expire 8s\n4. Mova-se: caminhe, levante, faça 10 agachamentos\n\nCada craving que você vence ENFRAQUECE o circuito de dependência no seu cérebro. Você está reprogramando suas conexões neurais. 💪\n\n_Fonte: INCA_",
        "O que você sente agora é real, mas temporário. Seu cérebro está pedindo a recompensa habitual.\n\n**Técnica de Grounding (OMS):**\nIdentifique:\n• 5 coisas que você VÊ\n• 4 coisas que você TOCA\n• 3 coisas que você OUVE\n• 2 coisas que você CHEIRA\n• 1 coisa que você SABOREIA\n\nIsso ativa o córtex pré-frontal e desvia a atenção da amígdala (centro do desejo). Use AGORA.\n\n_Fonte: OMS_",
      ],
    },
    anxiety: {
      keywords: ["ansiedade", "nervoso", "estresse", "irritado", "impaciente", "bravo", "surtando", "tenso", "angústia", "angustia", "pânico", "panico"],
      responses: [
        "A irritabilidade e ansiedade são **sintomas normais da abstinência de nicotina** e tendem a melhorar entre 2-4 semanas.\n\n**Exercício de Respiração (INCA):**\n1. Sente-se confortavelmente\n2. Inspire lentamente pelo nariz (4 segundos)\n3. Segure (2 segundos)\n4. Expire lentamente pela boca (6 segundos)\n5. Repita 10 vezes\n\nA respiração diafragmática ativa o sistema nervoso parassimpático.\n\n_Fonte: INCA_",
      ],
    },
    relapse: {
      keywords: ["recaí", "fumei", "voltei", "recaída", "recaida", "fracasso", "fracassei", "caí", "cai"],
      responses: [
        "**Recaída NÃO é fracasso.** Segundo a OMS, a dependência de nicotina é uma doença crônica recidivante.\n\n**O que fazer AGORA:**\n1. ✅ Não se culpe\n2. ✅ Identifique o que desencadeou o gatilho\n3. ✅ Recomece IMEDIATAMENTE\n4. ✅ Reforce suas estratégias de enfrentamento\n\nVocê está pronto para recomeçar? Estou aqui com você. 💚\n\n_Fonte: OMS, INCA_",
      ],
    },
    greeting: {
      keywords: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "hey", "eae", "e aí"],
      responses: [
        "Olá! Como você está se sentindo hoje? Estou aqui para te apoiar com técnicas comprovadas pela ciência. 😊",
        "Oi! Que bom te ver aqui. Como posso te ajudar agora?\n• 🆘 Estou com fissura\n• 😰 Estou ansioso\n• 💪 Quero motivação",
      ],
    },
  };

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  for (const category of Object.values(responsePool)) {
    if (category.keywords.some((k) => lowerText.includes(k))) {
      return pick(category.responses);
    }
  }

  return "Entendo o que você está passando. A jornada de cessação tem altos e baixos e isso é biologicamente normal.\n\nSobre o que você gostaria de falar agora?\n1. 🆘 Técnicas para fissura\n2. 📊 Análise do seu progresso\n3. 🎯 Plano para hoje";
};

const QUICK_ACTIONS = [
  { label: "Estou com fissura", icon: Flame, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
  { label: "Ansioso/irritado", icon: Brain, color: "text-violet-500 bg-violet-500/10 border-violet-500/20" },
  { label: "Preciso de motivação", icon: Heart, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { label: "Tive uma recaída", icon: AlertTriangle, color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
];

export default function AICoachInterface() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initialize Conversation
  useEffect(() => {
    const initChat = async () => {
      if (!user) return;
      try {
        setInitLoading(true);
        const conv = await coachService.getOrCreateConversation(user.id);
        const convId = conv.id;
        
        setActiveConversationId(convId);
        const msgs = await coachService.getMessages(convId);
        setMessages(msgs as any);
      } catch (error) {
        console.error("Erro ao iniciar chat:", error);
      } finally {
        setInitLoading(false);
      }
    };

    initChat();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading || !activeConversationId || !user) return;

    try {
      setIsLoading(true);
      setInput("");
      
      // 1. Save User Message
      const userMsg = await coachService.addMessage(activeConversationId, "user", text);
      setMessages(prev => [...prev, userMsg as any]);

      // 2. Simulate AI Brain (Medical Engine)
      await new Promise(r => setTimeout(r, 1500));
      const response = getCoachResponse(text, profile);
      
      // 3. Save Assistant Message
      const assistantMsg = await coachService.addMessage(activeConversationId, "assistant", response);
      setMessages(prev => [...prev, assistantMsg as any]);
      
    } catch (error) {
      toast.error("Erro ao processar mensagem.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, i) => {
      let rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      rendered = rendered.replace(/_(.*?)_/g, '<em class="text-muted-foreground text-[11px]">$1</em>');
      return (
        <p key={i} className="py-0.5" dangerouslySetInnerHTML={{ __html: rendered }} />
      );
    });
  };

  if (initLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Acordando o Coach...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col h-[calc(100vh-140px)] animate-fade-in">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Coach <span className="text-primary italic">Neural.</span></h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Conectado • Supabase Realtime • OMS/CDC</p>
        </div>
        <div className="flex gap-2">
           <div className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center shadow-soft"><Target size={18} className="text-primary" /></div>
        </div>
      </header>

      <AppleCard className="flex-1 flex flex-col bg-card border-none shadow-elevated overflow-hidden relative rounded-[40px]">
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 no-scrollbar">
          {messages.length === 0 && (
             <div className="flex flex-col items-center text-center space-y-4 py-20 opacity-60">
                <div className="w-20 h-20 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/10">
                   <MessageCircle size={40} />
                </div>
                <h3 className="text-xl font-bold">Inicie sua jornada</h3>
                <p className="text-sm max-w-xs font-medium">Fale sobre seu dia ou use um dos botões rápidos abaixo.</p>
             </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div className={cn("flex gap-4 max-w-[85%] sm:max-w-[75%]", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                <div className={cn("w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border-2", 
                  msg.role === "assistant" ? "bg-primary border-primary shadow-lg shadow-primary/20 text-white" : "bg-muted border-border text-muted-foreground"
                )}>
                  {msg.role === "assistant" ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={cn("space-y-1", msg.role === "user" ? "items-end" : "items-start")}>
                  <div className={cn("p-5 rounded-[1.8rem] text-[15px] leading-relaxed shadow-soft", 
                    msg.role === "user" ? "bg-foreground text-background rounded-tr-sm font-medium" : "bg-muted/40 text-foreground rounded-tl-sm border border-border/50"
                  )}>
                    {msg.role === "assistant" ? renderMarkdown(msg.content) : msg.content}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {messages.length < 2 && (
             <div className="flex flex-wrap gap-2 justify-center pt-8">
               {QUICK_ACTIONS.map((action) => (
                 <button
                   key={action.label}
                   onClick={() => handleSend(action.label)}
                   className={cn("flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all hover:scale-105 hover:shadow-lg", action.color)}
                 >
                   <action.icon size={16} />
                   {action.label}
                 </button>
               ))}
             </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg animate-pulse"><Bot size={20} /></div>
                <div className="px-6 py-4 rounded-[1.8rem] bg-muted/40 border border-border/50 flex gap-2">
                   <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                   <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                   <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 sm:p-10 bg-muted/20 border-t border-border/40">
           <div className="flex gap-4 items-center">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                placeholder="Como você está hoje?"
                className="flex-1 bg-card h-14 sm:h-16 rounded-[24px] px-8 shadow-inner border-2 border-transparent focus:border-primary/20 outline-none transition-all font-bold text-lg"
              />
              <Button onClick={() => handleSend(input)} disabled={isLoading || !input.trim()} className="w-14 h-14 sm:w-16 sm:h-16 rounded-[24px] bg-primary shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                 <Send size={24} />
              </Button>
           </div>
        </div>
      </AppleCard>
    </div>
  );
}
