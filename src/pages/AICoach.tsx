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
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-slate-100 flex flex-col bg-slate-50/50 overflow-hidden"
          >
            <div className="p-4">
              <Button 
                onClick={createNewSession}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 text-xs font-bold gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Conversa
              </Button>
            </div>

            <div className="px-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar..." 
                  className="pl-9 h-9 bg-white border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Histórico</p>
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-[13px] transition-all flex items-center gap-3 group",
                    activeSessionId === s.id ? "bg-white border border-slate-200 text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  <MessageSquare className={cn("w-3.5 h-3.5", activeSessionId === s.id ? "text-blue-600" : "text-slate-300")} />
                  <span className="truncate flex-1 font-medium">{s.title}</span>
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
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-4xl mx-auto w-full pb-32">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex items-start gap-4", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                  msg.role === "assistant" ? "bg-white border-slate-200 text-blue-600" : "bg-blue-600 border-blue-600 text-white"
                )}>
                  {msg.role === "assistant" ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={cn("flex flex-col gap-2 max-w-[85%]", msg.role === "user" ? "items-end" : "items-start")}>
                  <div className={cn(
                    "p-4 rounded-2xl text-[15px] leading-relaxed",
                    msg.role === "assistant" ? "bg-slate-100 text-slate-800" : "bg-blue-50 text-blue-700"
                  )}>
                    {msg.content}
                  </div>
                  
                  {i === messages.length - 1 && msg.role === "assistant" && !isLoading && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <ActionChip icon={Wind} label="Respirar" onClick={() => handleQuickAction('respira')} />
                      <ActionChip icon={Gamepad2} label="Foco" onClick={() => handleQuickAction('foco')} />
                      <ActionChip icon={AlertTriangle} label="Fissura" onClick={() => handleQuickAction('fissura')} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && <LoadingMessage />}
          </AnimatePresence>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="max-w-4xl mx-auto flex gap-3 items-center">
            <button className="p-2 text-slate-400 hover:text-blue-600">
               <Mic className="w-5 h-5" />
            </button>
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Como posso te ajudar agora?" 
              className="flex-1 bg-slate-50 border-slate-100 h-11 focus-visible:ring-blue-600/20"
            />
            <Button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg h-11 shadow-sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2">Coach AI pode cometer erros. Verifique informações importantes.</p>
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
