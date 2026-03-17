/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Sparkles, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = { 
  id: "welcome", 
  role: "assistant", 
  content: "Olá! Sou seu Coach QuitBoost. Analisei sua biometria e seus gatilhos. Estou pronto para te guiar nos próximos 30 dias. Como você está se sentindo nesse exato momento?" 
};

export default function AICoachInterface() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const getCoachResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();
    
    const responsePool = {
      craving: {
        keywords: ["vontade", "fumar", "cigarro", "fissura", "desejo", "querendo", "pito", "maço"],
        responses: [
          "A fissura é como uma onda: ela cresce, atinge o pico e quebra. Aguente 10 minutos. Beba um copo de água gelada agora.",
          "Seu cérebro está tentando te sabotar pedindo o 'veneno' habitual. Não morda a isca. Respire fundo 3 vezes.",
          "Cada desejo que você vence enfraquece o vício. Você está vencendo uma batalha difícil agora. Orgulhe-se!",
        ]
      },
      anxiety: {
        keywords: ["ansiedade", "nervoso", "estresse", "irritado", "impaciente", "bravo", "surtando", "tenso"],
        responses: [
          "A ansiedade é a nicotina pedindo arrego. Ela não é sua dona. Tente o exercício 4-7-8 de respiração agora.",
          "Sinta seus pés no chão. Você está aqui, no presente. O cigarro não resolve o estresse, ele só cria mais dependência.",
        ]
      },
      greeting: {
        keywords: ["oi", "olá", "bom dia", "boa tarde", "boa noite"],
        responses: ["Olá! Estou aqui. Como está sua determinação hoje de 0 a 10?", "Oi! Vamos conquistar mais 24 horas de liberdade hoje?"]
      }
    };

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    for (const category of Object.values(responsePool)) {
      if (category.keywords.some(k => lowerText.includes(k))) {
        return pick(category.responses);
      }
    }
    
    return "Entendo perfeitamente. O mais importante é mantermos a vigilância. O que você escolhe fazer agora para se manter no caminho?";
  };

  const simulateResponse = async (userText: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const response = getCoachResponse(userText);
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
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    await simulateResponse(text);
  };

  return (
    <div className="container max-w-5xl mx-auto px-6 py-10 flex flex-col h-[calc(100vh-140px)]">
        <header className="flex items-center justify-between mb-8 shrink-0">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Coach <span className="text-primary italic">Neural.</span></h1>
            <p className="text-gray-400 font-medium">Suporte analítico e motivacional 24/7.</p>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="px-4 py-2 rounded-2xl bg-white border border-gray-100 flex items-center gap-2">
               <Zap size={16} className="text-primary" fill="currentColor" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Modo: Agressivo</span>
            </div>
          </div>
        </header>

        <AppleCard className="flex-1 flex flex-col bg-white border-gray-100 shadow-xl overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex w-full", msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div className={cn(
                   "flex gap-4 max-w-[80%]",
                   msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border",
                    msg.role === 'assistant' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-gray-100 border-gray-200 text-gray-400'
                  )}>
                    {msg.role === 'assistant' ? <Bot size={22} /> : <User size={22} />}
                  </div>
                  <div className={cn(
                    "p-5 rounded-[1.8rem] text-[15px] font-medium leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? 'bg-gray-900 text-white rounded-tr-none' 
                      : 'bg-gray-50 text-gray-700 rounded-tl-none border border-gray-100'
                  )}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                    <Bot size={22} />
                  </div>
                  <div className="px-6 py-4 rounded-[1.8rem] bg-gray-50 border border-gray-100 flex gap-2">
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 md:p-8 bg-gray-50/50 border-t border-gray-100">
            <div className="flex gap-4 items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Descreva como você está se sentindo..."
                className="flex-1 bg-white h-14 rounded-full px-8 shadow-sm border border-gray-100 outline-none focus:border-primary/50 transition-all font-medium text-gray-700"
              />
              <Button 
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Send size={24} />
              </Button>
            </div>
          </div>
        </AppleCard>
    </div>
  );
}
