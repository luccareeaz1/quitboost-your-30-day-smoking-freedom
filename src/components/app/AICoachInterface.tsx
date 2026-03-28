/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import {
  Send, Bot, User, Target, Heart,
  Brain, Flame, MessageCircle, AlertTriangle, Loader2, Sparkles, Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { coachService } from "@/lib/services";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const QUICK_ACTIONS = [
  { label: "Estou com fissura", icon: Flame, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  { label: "Ansioso/irritado", icon: Brain, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { label: "Preciso de motivação", icon: Heart, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { label: "Tive uma recaída", icon: AlertTriangle, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`;

export default function AICoachInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      if (!user) return;
      try {
        setInitLoading(true);
        const conv = await coachService.getOrCreateConversation(user.id);
        setActiveConversationId(conv.id);
        const msgs = await coachService.getMessages(conv.id);
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
      // Save user message to DB
      const userMsg = await coachService.addMessage(activeConversationId, "user", text);
      setMessages(prev => [...prev, userMsg as any]);

      // Build conversation history for AI
      const historyForAI = [...messages, userMsg].map(m => ({
        role: (m as any).role as string,
        content: (m as any).content as string,
      }));

      // Stream from edge function
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: historyForAI }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Erro no serviço de IA");
      }

      if (!resp.body) throw new Error("No response body");

      // Stream tokens
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";
      let streamDone = false;
      const tempId = crypto.randomUUID();

      // Add placeholder assistant message
      setMessages(prev => [...prev, { id: tempId, role: "assistant", content: "", created_at: new Date().toISOString() }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => prev.map(m => m.id === tempId ? { ...m, content: assistantContent } : m));
            }
          } catch { /* partial JSON, wait for more */ }
        }
      }

      // Save final assistant message to DB
      if (assistantContent) {
        const savedMsg = await coachService.addMessage(activeConversationId, "assistant", assistantContent);
        setMessages(prev => prev.map(m => m.id === tempId ? { ...(savedMsg as any) } : m));
      }
    } catch (error: any) {
      console.error("Coach error:", error);
      toast.error(error.message || "Erro ao processar mensagem.");
    } finally {
      setIsLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Sincronizando Link Neural...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col h-[calc(100vh-140px)]">
      <header className="flex items-center justify-between mb-10 shrink-0">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white italic">Neural <span className="text-emerald-400 drop-shadow-glow">Command.</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Elite Bio-Support System • Protocol v2.4</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Zap size={22} className="text-emerald-400 relative z-10" />
        </div>
      </header>

      <AppleCard variant="glass-dark" className="flex-1 flex flex-col border-none shadow-2xl overflow-hidden relative rounded-[40px] p-0">
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10 no-scrollbar">
          {messages.length === 0 && (
            <div className="flex flex-col items-center text-center space-y-6 py-24">
              <div className="w-24 h-24 rounded-[32px] bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                <Sparkles size={44} />
              </div>
              <h3 className="text-2xl font-black text-white italic tracking-tighter">Pronto para a Missão?</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest max-w-xs leading-relaxed">Sua rede neural de suporte está ativa. Qual o status da sua força de vontade hoje?</p>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex w-full px-2", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div className={cn("flex gap-6 max-w-[90%] sm:max-w-[80%]", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                <div className={cn("w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center border transition-all duration-500",
                  msg.role === "assistant" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-2xl shadow-emerald-500/10" : "bg-white/5 border-white/10 text-gray-400"
                )}>
                  {msg.role === "assistant" ? <Bot size={24} /> : <User size={24} />}
                </div>
                <div className={cn("space-y-2", msg.role === "user" ? "items-end text-right" : "items-start text-left")}>
                  <div className={cn("p-6 sm:p-8 rounded-[2rem] text-[16px] leading-[1.6] shadow-2xl border transition-all duration-500",
                    msg.role === "user" 
                      ? "bg-white text-black font-bold rounded-tr-sm border-white" 
                      : "bg-emerald-500/5 text-gray-100 rounded-tl-sm border-emerald-500/10 backdrop-blur-md"
                  )}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-emerald prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 block px-2">
                    {msg.role === "user" ? "Protocolo Enviado" : "Neural Link Estável"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {messages.length < 5 && (
            <div className="flex flex-wrap gap-3 justify-center pt-8 border-t border-white/5">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.label)}
                  className={cn("flex items-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border transition-all hover:scale-105 active:scale-95 shadow-xl", action.color)}
                >
                  <action.icon size={18} />
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start px-2">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-2xl animate-pulse">
                  <Bot size={24} />
                </div>
                <div className="px-8 py-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 flex gap-3 backdrop-blur-md">
                  <div className="w-2.5 h-2.5 bg-emerald-400/60 rounded-full animate-bounce" />
                  <div className="w-2.5 h-2.5 bg-emerald-400/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2.5 h-2.5 bg-emerald-400/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 sm:p-10 bg-black/50 border-t border-white/5 backdrop-blur-xl">
          <div className="flex gap-4 items-center max-w-3xl mx-auto">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              placeholder="Digite sua mensagem ao comando neural..."
              className="flex-1 bg-white/5 h-16 sm:h-20 rounded-[28px] px-10 shadow-inner border border-white/10 focus:border-emerald-500/40 outline-none transition-all font-bold text-lg text-white placeholder:text-gray-600"
            />
            <Button 
               onClick={() => handleSend(input)} 
               disabled={isLoading || !input.trim()} 
               className="w-16 h-16 sm:w-20 sm:h-20 rounded-[28px] bg-white text-black shadow-2xl hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all group"
            >
              <Send size={28} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </div>
          <p className="text-center mt-6 text-[9px] font-bold text-gray-700 uppercase tracking-[0.4em]">Secure Neural Connection • End-to-End Encrypted</p>
        </div>
      </AppleCard>
    </div>
  );
}
