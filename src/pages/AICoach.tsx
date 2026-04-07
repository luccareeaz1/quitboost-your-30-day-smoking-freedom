import { FreeshNavbar } from "@/components/layout/FreeshNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Settings, 
  Mic, 
  Send,
  Calendar,
  PlayCircle,
  Clock,
  Sparkles,
  User,
  Loader2,
  Wind,
  Gamepad2,
  AlertTriangle,
  Heart,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "assistant" | "user";
  content: string;
  insight?: string;
  plan?: string[];
}

interface Session {
  id: string;
  title: string;
  messages: Message[];
  date: string;
}

const INITIAL_SESSIONS: Session[] = [
  {
    id: "1",
    title: "Lidando com Gatilhos Fortes",
    date: "Hoje",
    messages: [
      {
        role: "assistant",
        content: "Olá! Notei que você registrou alguns gatilhos de estresse hoje. Quer conversar sobre como desviar esse pensamento agora?",
        insight: "ANÁLISE DE GATILHO"
      }
    ]
  },
  {
    id: "2",
    title: "Primeira Semana: O que esperar",
    date: "Ontem",
    messages: [
      {
        role: "assistant",
        content: "A primeira semana é o maior desafio, mas você já passou por 3 dias! Como está se sentindo fisicamente?",
      }
    ]
  }
];

export default function AICoach() {
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession.messages;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (overrideContent?: string) => {
    const textToSend = overrideContent || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    
    // Update local state immediately
    const updatedSessions = sessions.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, messages: [...s.messages, userMessage] };
      }
      return s;
    });
    setSessions(updatedSessions);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-coach", {
        body: { 
          messages: [...activeSession.messages, userMessage].map(m => ({ 
            role: m.role, 
            content: m.content 
          })) 
        },
      });

      if (error) {
        console.error("Supabase invoke error:", error);
        throw new Error(error.message || "Falha na chamada à Edge Function");
      }

      // New Edge Function returns { reply: string } — fall back to choices array for compatibility
      const aiResponseContent = 
        data?.reply || 
        data?.choices?.[0]?.message?.content || 
        "Não consegui processar sua mensagem. Tente novamente!";
      
      const finalSessions = updatedSessions.map(s => {
        if (s.id === activeSessionId) {
          return { 
            ...s, 
            messages: [...s.messages, { role: "assistant", content: aiResponseContent }] 
          };
        }
        return s;
      });
      setSessions(finalSessions);
    } catch (err: any) {
      console.error("Erro no chat:", err);
      const errMsg = err?.message || "Desconhecido";
      toast({
        title: "Erro na conexão",
        description: `Não consegui falar com o Coach: ${errMsg}`,
        variant: "destructive",
      });
      // Add a graceful fallback directly in the chat
      const fallbackSessions = sessions.map(s => {
        if (s.id === activeSessionId) {
          return { 
            ...s, 
            messages: [...s.messages, { 
              role: "assistant" as const, 
              content: "⚠️ Tive um problema técnico agora. **Sua jornada continua!** Tente me perguntar novamente em alguns segundos. Cada minuto sem fumar é uma vitória real. 💪" 
            }] 
          };
        }
        return s;
      });
      setSessions(fallbackSessions);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = () => {
    const newId = Date.now().toString();
    const newSession: Session = {
      id: newId,
      title: "Nova Conversa Freesh",
      date: "Agora",
      messages: [
        {
          role: "assistant",
          content: "Iniciando uma nova sessão. Como posso te apoiar agora?",
        }
      ]
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    toast({ title: "Nova Sessão", description: "Sessão criada com sucesso." });
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickAction = (action: string) => {
    let prompt = "";
    switch(action) {
      case 'respira': prompt = "Preciso de um exercício de respiração rápida 4-7-8 agora para me acalmar."; break;
      case 'foco': prompt = "Estou com uma fissura forte, me dê um desafio de 2 minutos para mudar meu foco agora."; break;
      case 'fissura': prompt = "Acabei de sentir uma vontade gigante de fumar. O que devo fazer neste exato segundo?"; break;
      case 'porque': prompt = "Me lembre por que decidi parar de fumar e qual o benefício que terei em 10 minutos se eu não acender."; break;
    }
    handleSend(prompt);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFDFD]">
      <FreeshNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-100 flex flex-col p-6 shadow-[4px_0_24px_rgba(0,0,0,0.01)] lg:relative absolute z-10 h-full lg:h-auto translate-x-[-100%] lg:translate-x-0 transition-transform">
          <Button 
            onClick={createNewSession}
            className="w-full bg-[#2D45C1] hover:bg-[#1E30A1] text-white rounded-2xl h-14 font-bold gap-2 mb-6 shadow-lg shadow-blue-100"
          >
            <Plus className="w-5 h-5" />
            Nova Sessão
          </Button>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar sessões..." 
              className="pl-11 h-12 bg-slate-50 border-none rounded-2xl text-sm font-medium focus-visible:ring-1 focus-visible:ring-slate-200"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 -mx-2 px-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">SESSÕES ANTERIORES</p>
            {filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={cn(
                  "w-full text-left px-4 py-3.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-3 group relative",
                  activeSessionId === session.id 
                    ? "bg-slate-50 text-[#2D45C1] shadow-sm ring-1 ring-slate-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <MessageSquare className={cn(
                  "w-4 h-4 transition-colors",
                  activeSessionId === session.id ? "text-[#2D45C1]" : "text-slate-300 group-hover:text-slate-400"
                )} />
                <span className="truncate flex-1">{session.title}</span>
                <span className="text-[10px] text-slate-400 font-bold">{session.date}</span>
              </button>
            ))}
            {filteredSessions.length === 0 && (
              <p className="text-center py-8 text-xs text-slate-400">Nenhuma sessão encontrada.</p>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400">
              U
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">Perfil Usuário</p>
              <p className="text-xs text-slate-500">Nível 4 · 349 XP</p>
            </div>
            <button className="text-slate-400 hover:text-slate-900">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col relative bg-white">
          {/* Active Session Header */}
          <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <Sparkles className="w-5 h-5 text-[#2D45C1]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{activeSession.title}</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coach IA Online</span>
                </div>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 max-w-4xl mx-auto w-full pb-48 scroll-smooth">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-5 w-full",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === "assistant" ? "bg-white border border-slate-100 text-[#2D45C1]" : "bg-slate-900 text-white"
                  )}>
                    {msg.role === "assistant" ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>

                  <div className={cn(
                    "flex flex-col gap-3 max-w-[85%]",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}>
                    {msg.insight && (
                      <span className="text-[10px] font-black text-[#2D45C1] uppercase tracking-widest mb-1 flex items-center gap-2">
                        <div className="w-4 h-px bg-blue-200" /> {msg.insight}
                      </span>
                    )}
                    <div className={cn(
                      "p-6 rounded-[2rem] text-md leading-relaxed shadow-[0_2px_12px_rgba(0,0,0,0.02)]",
                      msg.role === "assistant" 
                        ? "bg-white border border-slate-100 text-slate-700" 
                        : "bg-[#2D45C1] text-white shadow-lg shadow-blue-100"
                    )}>
                      {msg.content}
                    </div>
                    
                    {/* Quick Actions at the END of history */}
                    {i === messages.length - 1 && msg.role === "assistant" && !isLoading && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="flex flex-wrap gap-2 mt-4"
                      >
                        <Button 
                          onClick={() => handleQuickAction('respira')}
                          variant="outline" 
                          className="rounded-full bg-white border-slate-100 text-slate-600 font-bold text-xs gap-2 py-5 px-6 shadow-sm hover:border-[#2D45C1] hover:text-[#2D45C1] hover:bg-blue-50/30 transition-all"
                        >
                          <Wind className="w-4 h-4" /> Exercício de Respiração
                        </Button>
                        <Button 
                          onClick={() => handleQuickAction('foco')}
                          variant="outline" 
                          className="rounded-full bg-white border-slate-100 text-slate-600 font-bold text-xs gap-2 py-5 px-6 shadow-sm hover:border-[#2D45C1] hover:text-[#2D45C1] hover:bg-blue-50/30 transition-all"
                        >
                          <Gamepad2 className="w-4 h-4" /> Mudar o Foco
                        </Button>
                        <Button 
                          onClick={() => handleQuickAction('fissura')}
                          variant="outline" 
                          className="rounded-full bg-white border-slate-100 text-rose-500 font-bold text-xs gap-2 py-5 px-6 shadow-sm hover:border-rose-500 hover:bg-rose-50/30 transition-all"
                        >
                          <AlertTriangle className="w-4 h-4" /> Registrar Fissura
                        </Button>
                        <Button 
                          onClick={() => handleQuickAction('porque')}
                          variant="outline" 
                          className="rounded-full bg-white border-slate-100 text-emerald-600 font-bold text-xs gap-2 py-5 px-6 shadow-sm hover:border-emerald-500 hover:bg-emerald-50/30 transition-all"
                        >
                          <Heart className="w-4 h-4" /> Ver Meu "Porquê"
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-5">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-[#2D45C1]" />
                  </div>
                  <div className="p-6 rounded-[2rem] bg-white border border-slate-100 text-slate-400 italic text-sm shadow-sm flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </span>
                    Coach Freesh está digitando...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div> 
          
          {/* Input Bar Overlay */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
            <div className="bg-white/70 border border-white/50 rounded-[2.5rem] p-3 shadow-[0_24px_48px_rgba(0,0,0,0.1)] flex items-center gap-3 backdrop-blur-2xl ring-1 ring-slate-100">
              <button 
                onClick={() => toast({ title: "Voz", description: "Ouvindo... (Em breve)" })}
                className="p-4 bg-white/50 rounded-full text-slate-400 hover:text-[#2D45C1] hover:bg-white shadow-sm transition-all"
              >
                <Mic className="w-6 h-6" />
              </button>
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Fale com o Coach Freesh..." 
                className="border-none bg-transparent h-14 text-lg focus-visible:ring-0 placeholder:text-slate-400 font-medium"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="p-5 bg-slate-900 rounded-full text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 disabled:grayscale"
              >
                {isLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Send className="w-7 h-7" />}
              </button>
            </div>
            <p className="text-[9px] text-center mt-4 text-slate-400 font-bold uppercase tracking-[0.2em]">Sua jornada à inteligência artificial freesh</p>
          </div>
        </main>
      </div>
    </div>
  );
}
