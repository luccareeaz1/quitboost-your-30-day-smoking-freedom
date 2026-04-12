import { useState, useRef, useEffect } from "react";
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Mic, 
  Send,
  Sparkles,
  User,
  Loader2,
  Wind,
  Gamepad2,
  AlertTriangle,
  Heart,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  }
];

export default function AICoach() {
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, profile } = useAuth();
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
    
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, userMessage] } : s));
    setInput("");
    setIsLoading(true);

    try {
      // Get profile for context
      const profileContext = profile ? {
        name: profile.display_name,
        quitDate: profile.quit_date,
        motivation: profile.reason_to_quit || profile.main_motivation,
        cigarettesPerDay: profile.cigarettes_per_day
      } : {};

      const { data, error } = await supabase.functions.invoke("ai-coach", {
        body: { 
          profile: profileContext,
          messages: [...activeSession.messages, userMessage].map(m => ({ 
            role: m.role, 
            content: m.content 
          })) 
        },
      });

      if (error) {
        console.error('ai-coach error:', error);
        throw error;
      }

      const aiResponseContent = 
        data?.reply || 
        data?.message ||
        "Não consegui processar agora. Tente novamente em instantes.";
      
      setSessions(prev => prev.map(s => s.id === activeSessionId 
        ? { ...s, messages: [...s.messages, { role: "assistant", content: aiResponseContent }] } 
        : s
      ));
    } catch (err: any) {
      console.error('Coach request failed:', err);
      const errorMsg = err?.message?.includes('429')
        ? "Muitas mensagens em pouco tempo. Aguarde alguns segundos."
        : "O Coach está momentaneamente offline. Tente novamente."
      toast({ title: "Erro na conexão", description: errorMsg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = () => {
    const newId = Date.now().toString();
    const newSession: Session = {
      id: newId, title: "Nova Conversa Freesh", date: "Agora",
      messages: [{ role: "assistant", content: "Como posso te apoiar nesta jornada?" }]
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
  };

  const handleQuickAction = (action: string) => {
    let prompt = "";
    switch(action) {
      case 'respira': prompt = "Exercício de respiração 4-7-8."; break;
      case 'foco': prompt = "Preciso mudar meu foco agora."; break;
      case 'fissura': prompt = "O que fazer com uma fissura agora?"; break;
      case 'porque': prompt = "Lembre-me por que parei."; break;
    }
    handleSend(prompt);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Mini History Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-slate-100 flex flex-col bg-[#FBFBFE] overflow-hidden"
          >
            <div className="p-8 pb-4">
              <Button 
                onClick={createNewSession}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 font-bold gap-3 shadow-lg shadow-blue-200"
              >
                <Plus className="w-5 h-5" />
                Nova Sessão
              </Button>
            </div>

            <div className="px-8 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar..." 
                  className="pl-12 h-12 bg-white border-slate-200 rounded-2xl text-xs font-bold focus-visible:ring-blue-600/20"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-1">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 px-4">Histórico Recente</p>
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={cn(
                    "w-full text-left px-5 py-4 rounded-2xl text-[13px] font-bold transition-all flex items-center gap-4 group",
                    activeSessionId === s.id ? "bg-white shadow-md text-blue-600" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <MessageSquare className={cn("w-4 h-4", activeSessionId === s.id ? "text-blue-600" : "text-slate-200")} />
                  <span className="truncate flex-1">{s.title}</span>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-white">
        {/* Header */}
        <header className="h-20 border-b border-slate-50 flex items-center justify-between px-8 bg-white/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 tracking-tight">{activeSession.title}</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IA Especialista</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </Button>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-12 max-w-4xl mx-auto w-full pb-48">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-6", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xl",
                  msg.role === "assistant" ? "bg-white text-blue-600 border border-slate-100" : "bg-blue-600 text-white shadow-blue-200"
                )}>
                  {msg.role === "assistant" ? <Sparkles className="w-6 h-6" /> : <User className="w-6 h-6" />}
                </div>

                <div className={cn("flex flex-col gap-4 max-w-[80%]", msg.role === "user" ? "items-end" : "items-start")}>
                  {msg.insight && (
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{msg.insight}</span>
                  )}
                  <div className={cn(
                    "p-8 rounded-[2rem] text-md font-medium leading-[1.8] shadow-sm",
                    msg.role === "assistant" ? "bg-white border border-slate-100 text-slate-700 shadow-slate-200/20" : "bg-blue-600 text-white shadow-blue-200"
                  )}>
                    {msg.content}
                  </div>
                  
                  {i === messages.length - 1 && msg.role === "assistant" && !isLoading && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      <ActionChip icon={Wind} label="Respirar" onClick={() => handleQuickAction('respira')} />
                      <ActionChip icon={Gamepad2} label="Distração" onClick={() => handleQuickAction('foco')} />
                      <ActionChip icon={AlertTriangle} label="Fissura" color="text-red-500" onClick={() => handleQuickAction('fissura')} />
                      <ActionChip icon={Heart} label="Meu Porquê" color="text-blue-500" onClick={() => handleQuickAction('porque')} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && <LoadingMessage />}
          </AnimatePresence>
        </div>

        {/* Input Bar */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8">
          <div className="bg-white/80 border border-slate-100/50 rounded-[3rem] p-4 shadow-2xl flex items-center gap-4 backdrop-blur-3xl ring-1 ring-slate-100/50">
            <button className="p-4 rounded-full text-slate-300 hover:text-primary transition-colors">
              <Mic className="w-6 h-6" />
            </button>
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Digite sua mensagem..." 
              className="border-none bg-transparent h-14 text-lg focus-visible:ring-0 placeholder:text-slate-300 font-bold"
            />
            <Button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-90"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function ActionChip({ icon: Icon, label, onClick, color }: any) {
  return (
    <Button 
      variant="outline" 
      onClick={onClick}
      className={cn("rounded-2xl bg-white border-slate-100 h-10 px-6 text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-slate-50 transition-all", color)}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </Button>
  );
}

function LoadingMessage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-50 flex items-center justify-center shadow-md">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
      <div className="p-8 rounded-[2.5rem] bg-white border border-slate-50 text-slate-300 font-bold italic text-sm flex items-center gap-3 shadow-xl shadow-slate-50">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" />
          <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.2s]" />
          <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
        Coach QuitBoost está elaborando uma resposta...
      </div>
    </motion.div>
  );
}
