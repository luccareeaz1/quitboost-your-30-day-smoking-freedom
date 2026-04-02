/* eslint-disable @typescript-eslint/no-explicit-any */
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

const QUICK_ACTIONS = [
  { label: "Estou com fissura", icon: Flame, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
  { label: "Ansioso/irritado", icon: Brain, color: "text-violet-500 bg-violet-500/10 border-violet-500/20" },
  { label: "Preciso de motivação", icon: Heart, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { label: "Tive uma recaída", icon: AlertTriangle, color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
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

      // Get session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      // Stream from edge function
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Powered by AI • OMS/CDC/INCA</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center shadow-soft">
          <Target size={18} className="text-primary" />
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
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
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

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
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
