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

  const getCoachResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();
    
    // Categorias expandidas e lógica de "contexto"
    const responsePool = {
      craving: {
        keywords: ["vontade", "fumar", "cigarro", "fissura", "desejo", "querendo", "pito", "maço"],
        responses: [
          "Essa onda de fissura é intensa, mas lembre-se: ela dura no máximo 10 minutos. Vamos focar na sua respiração? Inspire por 4 segundos, segure por 7, solte por 8.",
          "O desejo é apenas um sinal químico do seu cérebro se reequilibrando. Não dê o comando de 'sim' para ele. Beba um copo de água bem gelada agora, isso ajuda a quebrar o padrão metal.",
          "Imagine a fissura como uma nuvem passageira. Ela escurece o céu agora, mas logo o sol volta. O que você pode fazer com as mãos nos próximos 5 minutos para se distrair?",
          "Você decidiu parar por um motivo sagrado: sua liberdade. Esse desejo de 5 minutos não é mais forte que sua promessa de uma vida inteira.",
          "Sinta o ar entrando. Seus pulmões já estão começando a se limpar. Fumar agora resetaria todo esse esforço. Você é mais forte que um bastão de papel e nicotina.",
          "Tente mastigar algo crocante, como uma cenoura ou uma maçã. A distração mecânica é uma aliada poderosa contra o hábito automático."
        ]
      },
      anxiety: {
        keywords: ["ansiedade", "nervoso", "estresse", "irritado", "impaciente", "bravo", "surtando", "tenso"],
        responses: [
          "A ansiedade é a nicotina tentando te convencer a voltar. Ela é uma mentirosa. O cigarro não relaxa, ele apenas alivia a abstinência que ele mesmo criou.",
          "Feche os olhos por um momento. Sinta seus pés firmes no chão. Você está no controle, não seus nervos. Respire fundo e conte até dez lentamente.",
          "É normal se sentir irritado. Seu corpo está 'reclamando' da falta de um veneno. Tente canalizar isso: faça 10 polichinelos ou uma caminhada rápida pelo corredor.",
          "Sua mente está acelerada agora, mas isso vai passar. A irritabilidade é sinal de cura, não de fracasso. Aguenta firme, o pior já está ficando para trás.",
          "Vamos tentar um exercício: nomeie 5 coisas que você vê, 4 que você pode tocar e 3 que você ouve. Isso vai te ancorar no presente."
        ]
      },
      motivation: {
        keywords: ["motivação", "desistir", "difícil", "ajuda", "consegue", "triste", "desanimado", "por que"],
        responses: [
          "Olhe para o quanto você já economizou e o fôlego que está ganhando. Cada dia sem fumar é uma vitória épica sobre uma das drogas mais viciantes do mundo.",
          "Você não está 'perdendo' nada ao não fumar. Você está GANHANDO vida, tempo com quem ama e orgulho próprio. Você é um guerreiro(a)!",
          "O 'eu' do futuro vai olhar para trás hoje e te agradecer imensamente por não ter desistido. Você está construindo uma nova versão de si mesmo.",
          "Lembre-se: o sofrimento da disciplina é temporário, mas o arrependimento do fracasso dura muito mais. Escolha a disciplina hoje!",
          "Sua determinação me inspira. Milhares de pessoas já conseguiram, e você tem todas as ferramentas necessárias para ser a próxima história de sucesso."
        ]
      },
      relapse: {
        keywords: ["falhei", "fumei", "recaída", "escorreguei", "perdi", "deslize", "fumei um", "voltei"],
        responses: [
          "Um deslize não é o fim da estrada, é apenas um buraco no caminho. Não use isso como desculpa para desistir. O que importa é o que você faz agora: recomece o cronômetro.",
          "Respire fundo. A culpa é pior que a nicotina agora. Jogue fora o que sobrou, limpe o cinzeiro e vamos voltar ao plano. Eu ainda acredito 100% em você.",
          "Analise o que aconteceu: foi estresse? Álcool? Um amigo? Aprenda com esse gatilho para blindar sua próxima tentativa. Você já sabe que consegue ficar sem.",
          "Muitos ex-fumantes precisaram de várias tentativas. O sucesso não é linear. Levante a cabeça, perdoe-se e vamos vencer as próximas 24 horas juntos."
        ]
      },
      greeting: {
        keywords: ["oi", "olá", "bom dia", "boa tarde", "boa noite", "e aí", "tudo bem"],
        responses: [
          "Olá! Estou aqui firme e forte com você. Como está o nível da sua determinação hoje de 0 a 10?",
          "Oi, guerreiro(a). É sempre bom falar com você. O que está passando pela sua mente agora?",
          "Olá! Pronto para mais um dia de liberdade e pulmões limpos? Como posso te apoiar hoje?"
        ]
      }
    };

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // Lógica de "Logic & Relevance"
    for (const category of Object.values(responsePool)) {
      if (category.keywords.some(k => lowerText.includes(k))) {
        return pick(category.responses);
      }
    }
    
    // Respostas contextuais para perguntas específicas
    if (userText.includes("?")) {
      return "Essa é uma ótima pergunta. O mais importante é entender que sua jornada é única. O que exatamente está te preocupando mais sobre esse ponto?";
    }

    if (userText.length < 10) {
      return "Estou te ouvindo. Pode me contar mais sobre isso? Falar sobre os sentimentos ajuda a desarmar a vontade de fumar.";
    }

    return "Entendo o que você está dizendo. Manter o foco no presente e no seu propósito é a chave. Como você planejou lidar com os próximos gatilhos de hoje?";
  };

  const simulateResponse = async (userText: string) => {
    setIsLoading(true);
    
    // Simular um "processamento neural" mais realista
    const words = userText.split(' ').length;
    const thinkingTime = Math.min(Math.max(words * 100, 1000), 3000);
    await new Promise(resolve => setTimeout(resolve, thinkingTime));
    
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
    { label: "Estou com vontade 🚬", value: "Estou com muita vontade de fumar agora, me ajude!" },
    { label: "Preciso de motivação 🔥", value: "Pode me dar uma frase de motivação para continuar?" },
    { label: "Tive uma recaída 😔", value: "Eu acabei fumando um cigarro, o que eu faço agora?" },
    { label: "Dicas de ansiedade 🧘", value: "Estou muito ansioso, quais técnicas de respiração você recomenda?" }
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
