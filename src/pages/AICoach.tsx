import { useState, useRef, useEffect } from "react";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useChat, type Message as VercelMessage } from "ai/react";

export default function AICoach() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced system prompt with AI/ML expertise
  const systemPrompt = `Você é o Coach QuitBoost, uma Inteligência Artificial de última geração projetada com expertise em Machine Learning e Psicologia Comportamental. 
  Sua missão é guiar usuários através dos 30 dias de liberdade do tabaco. 
  Utilize uma abordagem baseada em dados, empatia algorítmica e suporte técnico para ajudar a superar fissuras. 
  Seja profissional, motivador e use insights clínicos reais.`;

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      { 
        id: "welcome", 
        role: "assistant", 
        content: "Olá! Sou seu Coach QuitBoost, equipado com análise preditiva e suporte comportamental. Como posso ajudar na sua jornada de liberdade hoje?" 
      }
    ],
    body: {
      model: "gpt-4o",
      systemPrompt: systemPrompt
    }
  });

  const quickPrompts = [
    "Estou com vontade de fumar.",
    "Me ajude a controlar a ansiedade.",
    "Preciso de motivação para continuar."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickPrompt = (prompt: string) => {
    // Manually trigger chat with a quick prompt
    const event = {
      preventDefault: () => {},
      target: { value: prompt }
    } as any;
    
    // This is a bit hacky for useChat but works for simulation/real API
    // Normally you'd append or just set input and submit
    handleInputChange({ target: { value: prompt } } as any);
  };

  return (
    <div className="min-h-screen pt-28 pb-10 px-4 max-w-4xl mx-auto flex flex-col animate-fade-in font-sans">
      <header className="mb-8 text-center shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-wider">
          <Sparkles size={12} />
          <span>Powered by GPT-4o</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tighter">Coach IA</h1>
        <p className="text-muted-foreground mt-2 text-lg">Apoio e orientação com inteligência preditiva para sua liberdade.</p>
      </header>

      <AppleCard className="flex-1 flex flex-col min-h-[60vh] max-h-[70vh] p-0 overflow-hidden shadow-elevated border-none bg-background/50 backdrop-blur-xl">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-secondary/5">
          {messages.map((msg: VercelMessage) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                  msg.role === 'assistant' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-secondary text-muted-foreground'
                }`}>
                  {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`px-5 py-3.5 rounded-2xl shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-foreground text-background border-foreground rounded-br-none' 
                    : 'bg-background text-foreground border-border/40 rounded-bl-none'
                }`}>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center animate-pulse">
                  <Bot size={20} />
                </div>
                <div className="px-5 py-3 rounded-2xl bg-secondary/20 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-background/80 backdrop-blur-md border-t border-border/30 shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {quickPrompts.map((prompt, i) => (
              <Button 
                key={i} 
                variant="outline" 
                size="sm" 
                className="rounded-full shrink-0 border-border/50 hover:bg-primary/5 hover:text-primary transition-all font-medium text-xs py-1 h-8"
                onClick={() => handleQuickPrompt(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
          
          <form 
            onSubmit={handleSubmit} 
            className="flex gap-3 relative items-center"
          >
            <input 
              type="text" 
              value={input}
              onChange={handleInputChange}
              placeholder="Como posso te ajudar agora?..." 
              className="flex-1 bg-secondary/40 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/30 border border-border/20 focus:border-primary/20 transition-all text-base pr-16"
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="absolute right-1 w-12 h-12 rounded-xl bg-foreground text-background hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <Send size={18} />
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-3 opacity-50">
            Inteligência Artificial pode cometer erros. Considere consultar um profissional de saúde.
          </p>
        </div>
      </AppleCard>
    </div>
  );
}

