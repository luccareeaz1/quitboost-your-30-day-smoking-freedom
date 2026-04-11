import { useState, useRef, useEffect } from "react";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import {
  Send, Bot, User, Target, Heart,
  Brain, Flame, MessageCircle, AlertTriangle, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { coachService } from "@/lib/services";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const MESSAGE_TYPES = {
  INSIGHT: "insight",
  ACTION_PLAN: "plan",
  EXERCISE: "exercise",
  DEFAULT: "default"
};

const getMessageType = (content: string) => {
  if (content.toLowerCase().includes("plano de ação") || content.toLowerCase().includes("primeiro passo")) return MESSAGE_TYPES.ACTION_PLAN;
  if (content.toLowerCase().includes("exercício") || content.toLowerCase().includes("respire") || content.toLowerCase().includes("meditação")) return MESSAGE_TYPES.EXERCISE;
  if (content.length > 200) return MESSAGE_TYPES.INSIGHT;
  return MESSAGE_TYPES.DEFAULT;
};

export default function AICoachInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ... (keep init logic)
  useEffect(() => {
    const initChat = async () => {
      if (!user) return;
      try {
        setInitLoading(true);
        const conv = await coachService.getOrCreateConversation(user.id);
        setActiveConversationId(conv.id);
        const msgs = await coachService.getMessages(conv.id);
        setMessages(msgs as Message[]);
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
    setIsLoading(true);
    setInput("");
    
    // UI Update immediately
    try {
      const userMsg = await coachService.addMessage(activeConversationId, "user", text);
      setMessages(prev => [...prev, userMsg as Message]);

      const historyForAI = [...messages, userMsg].map(m => ({
        role: m.role as string,
        content: m.content as string,
      }));

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: historyForAI }),
      });

      if (!resp.ok) throw new Error("Erro no serviço de IA");
      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      const tempId = crypto.randomUUID();
      setMessages(prev => [...prev, { id: tempId, role: "assistant", content: "", created_at: new Date().toISOString() }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantContent += delta;
                setMessages(prev => prev.map(m => m.id === tempId ? { ...m, content: assistantContent } : m));
              }
            } catch (e) {}
          }
        }
      }
      
      if (assistantContent) {
        await coachService.addMessage(activeConversationId, "assistant", assistantContent);
      }
    } catch (e) {
      toast.error("Erro ao falar com o Coach.");
    } finally {
      setIsLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sincronizando consciência...</p>
      </div>
    );
  }

  const showQuickActions = !input && !isInputFocused;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col h-[calc(100vh-100px)] animate-in fade-in duration-700">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            Coach <span className="text-primary italic">IA</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Guia Cognitivo Comportamental • Nível 4</p>
        </div>
        <div className="flex -space-x-3">
             <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-primary shadow-sm">
                  <Bot size={20} />
             </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 space-y-10 no-scrollbar pb-32">
        {messages.length === 0 && (
          <div className="flex flex-col items-center text-center py-20 opacity-50">
            <div className="w-24 h-24 rounded-[2.5rem] bg-primary/5 flex items-center justify-center text-primary mb-6 border border-primary/10">
              <MessageCircle size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Como posso te ajudar agora?</h3>
            <p className="text-sm max-w-sm font-medium text-slate-500 mt-2">Estou aqui para te apoiar em cada passo da sua jornada de liberdade.</p>
          </div>
        )}

        {messages.map((msg) => {
          const type = msg.role === "assistant" ? getMessageType(msg.content) : "user";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div className={cn("flex flex-col max-w-[85%] sm:max-w-[80%]", msg.role === "user" ? "items-end" : "items-start")}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2 ml-4">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Coach Insight</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                  </div>
                )}
                
                <div className={cn(
                  "p-6 rounded-[2rem] text-[16px] leading-relaxed shadow-sm transition-all border",
                  msg.role === "user" 
                    ? "bg-slate-900 text-white rounded-tr-none border-transparent" 
                    : cn(
                        "bg-white text-slate-800 rounded-tl-none border-slate-100",
                        type === MESSAGE_TYPES.ACTION_PLAN && "border-l-4 border-l-emerald-400 bg-emerald-50/30",
                        type === MESSAGE_TYPES.EXERCISE && "border-l-4 border-l-primary bg-blue-50/30",
                        type === MESSAGE_TYPES.INSIGHT && "border-l-4 border-l-amber-400 bg-amber-50/30"
                      )
                )}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-slate">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                      {type === MESSAGE_TYPES.ACTION_PLAN && (
                        <div className="mt-4 pt-4 border-t border-emerald-100">
                          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 rounded-full h-8 px-4 text-[10px] font-black uppercase tracking-widest">Adicionar às tarefas</Button>
                        </div>
                      )}
                    </div>
                  ) : msg.content}
                </div>
              </div>
            </motion.div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent pt-20 z-20 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <AnimatePresence>
            {showQuickActions && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="flex flex-wrap gap-2 justify-center mb-6"
              >
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.label)}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border bg-white/50 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white active:scale-95 shadow-sm", 
                        action.color
                    )}
                  >
                    <action.icon size={14} />
                    {action.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 items-center bg-white p-3 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 100)}
              onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              placeholder="Digite sua mensagem aqui..."
              className="flex-1 bg-transparent h-14 px-6 outline-none font-bold text-slate-900"
            />
            <Button 
                onClick={() => handleSend(input)} 
                disabled={isLoading || !input.trim()} 
                className="w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all shrink-0"
            >
              <Send size={24} className="fill-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
