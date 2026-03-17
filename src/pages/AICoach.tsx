/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Sparkles } from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "welcome", 
      role: "assistant", 
      content: "Olá! Sou seu Coach QuitBoost. Estou aqui para te apoiar em cada passo da sua jornada para parar de fumar. Como você está se sentindo hoje? Podemos conversar sobre vontades, ansiedade ou qualquer desafio que esteja enfrentando." 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const simulateResponse = async (userText: string) => {
    setIsLoading(true);
    
    // Simulate thinking/streaming delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let response = "Estou aqui para apoiar você. Lembre-se que cada desejo de fumar dura apenas alguns minutos. Tente respirar fundo dez vezes ou beber um copo de água gelada. Você é mais forte que esse vício!";
    
    const lowerText = userText.toLowerCase();
    if (lowerText.includes("vontade") || lowerText.includes("fumar") || lowerText.includes("cigarro")) {
      response = "Entendo perfeitamente essa sensação. É a fissura tentando te enganar. Ela vai passar em 5 a 10 minutos. Que tal fazer uma caminhada rápida ou praticar 2 minutos de respiração agora? Posso te guiar.";
    } else if (lowerText.includes("ansiedade") || lowerText.includes("nervoso")) {
      response = "A ansiedade é comum nesse período. Seu corpo está se reajustando. Tente a técnica do 4-7-8: inspire por 4 segundos, segure por 7 e expire por 8. Vamos tentar juntos?";
    } else if (lowerText.includes("motivação") || lowerText.includes("desistir")) {
      response = "Não desista agora! Pense nos benefícios: em apenas 24 horas seu risco de ataque cardíaco já diminuiu. Você economizou dinheiro e ganhou fôlego. O pior já passou, continue firme!";
    } else if (lowerText.includes("obrigado") || lowerText.includes("vlw")) {
      response = "De nada! Estou sempre aqui. Quando a vontade bater de novo, é só me chamar. Você está indo muito bem!";
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: response
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'user',
      content: text
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    
    await simulateResponse(text);
  };

  const quickPrompts = [
    { label: "Estou com vontade de fumar", value: "Estou com muita vontade de fumar agora, me ajude!" },
    { label: "Preciso de motivação", value: "Pode me dar uma frase de motivação para continuar?" },
    { label: "Me ajude com a ansiedade", value: "Estou me sentindo ansioso, o que posso fazer?" }
  ];

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-120px)] px-4 max-w-4xl mx-auto flex flex-col animate-fade-in pb-10">
        <header className="mb-8 text-center shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold mb-4 uppercase tracking-widest border border-primary/10">
            <Sparkles size={12} className="text-primary animate-pulse" />
            <span>Inteligência Artificial Ativa</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Coach QuitBoost</h1>
          <p className="text-muted-foreground mt-2 text-lg">Sua jornada para a liberdade, acompanhada com empatia.</p>
        </header>

        <div className="flex-1 flex flex-col rounded-[2.5rem] bg-white border border-border/40 shadow-xl overflow-hidden min-h-[550px] max-h-[70vh]">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-[#fafafa]/50">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex w-full mb-2", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  "flex items-start gap-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}>
                  <div className={cn(
                    "shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm border",
                    msg.role === 'assistant' ? 'bg-white border-primary/10 text-primary' : 'bg-primary text-white border-primary'
                  )}>
                    {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  <div className={cn(
                    "px-5 py-4 rounded-[1.5rem] text-[15px] leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white border border-border text-foreground rounded-tl-none'
                  )}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-white border border-primary/10 text-primary flex items-center justify-center shadow-sm animate-pulse">
                    <Bot size={20} />
                  </div>
                  <div className="px-5 py-3 rounded-[1.5rem] bg-white border border-border flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Action Buttons & Input */}
          <div className="p-6 md:p-8 bg-white border-t border-border/40">
            {messages.length < 3 && !isLoading && (
              <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
                {quickPrompts.map((prompt, i) => (
                  <button 
                    key={i} 
                    className="whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium border border-border/60 bg-white hover:bg-secondary/50 hover:border-primary/30 transition-all text-muted-foreground hover:text-primary active:scale-95 shadow-sm"
                    onClick={() => handleSend(prompt.value)}
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            )}
            
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
              className="relative flex items-center"
            >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Como posso ajudar você agora?..." 
                className="w-full bg-[#f4f4f5]/50 rounded-[1.5rem] px-6 py-4 pr-16 outline-none focus:ring-2 focus:ring-primary/10 border border-transparent focus:border-border transition-all text-base min-h-[56px]"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-2 w-11 h-11 rounded-full bg-primary text-white hover:opacity-90 active:scale-95 transition-all flex items-center justify-center shrink-0 shadow-lg disabled:opacity-50 disabled:shadow-none"
              >
                <Send size={20} />
              </button>
            </form>
            <p className="text-[11px] text-center text-muted-foreground mt-4 opacity-70">
              O Coach é uma IA focada em motivação. Para emergências médicas, ligue para 192 ou consulte seu médico.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
