import { useState, useRef, useEffect } from "react";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "coach";
  text: string;
}

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "coach", text: "Olá! Sou seu Coach QuitBoost. Como você está se sentindo agora? Estou aqui para te apoiar em cada passo." }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const newMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages(prev => [...prev, newMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      let reply = "Estou aqui com você! Respire fundo. Essa vontade é passageira e você é muito mais forte que ela.";
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes("vontade") || lowerText.includes("fumar")) {
        reply = "A fissura dura apenas de 5 a 10 minutos. Tente agora: beba um copo de água bem gelada ou faça 10 respirações profundas. Você já superou muitos momentos assim, este é só mais um!";
      } else if (lowerText.includes("ansiedade") || lowerText.includes("controlar")) {
        reply = "A ansiedade é comum nesse processo. Tente focar no presente: descreva 3 coisas que você está vendo agora e 3 sons que está ouvindo. Isso ajuda a acalmar o cérebro.";
      } else if (lowerText.includes("motivação") || lowerText.includes("continuar")) {
        reply = "Lembre-se do motivo pelo qual você começou. Seus pulmões já estão mais limpos e seu coração agradece. Cada cigarro evitado é uma vitória gigante! Você merece uma vida livre.";
      }
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "coach", text: reply }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-28 pb-10 px-4 max-w-4xl mx-auto flex flex-col animate-fade-in">
      <header className="mb-8 text-center shrink-0">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tighter">Coach IA</h1>
        <p className="text-muted-foreground mt-2 text-lg">Apoio e orientação em tempo real para sua liberdade.</p>
      </header>

      <AppleCard className="flex-1 flex flex-col min-h-[60vh] max-h-[70vh] p-0 overflow-hidden shadow-elevated">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-secondary/5">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'coach' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-muted-foreground'
                }`}>
                  {msg.role === 'coach' ? <Bot size={18} /> : <User size={18} />}
                </div>
                <div className={`px-5 py-3 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-foreground text-background rounded-br-none' 
                    : 'bg-background text-foreground border border-border/50 rounded-bl-none'
                }`}>
                  <p className="text-base leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-card border-t border-border/50 shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {quickPrompts.map((prompt, i) => (
              <Button 
                key={i} 
                variant="secondary" 
                size="sm" 
                className="rounded-full shrink-0 border border-border/30 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
            className="flex gap-3"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Como posso te ajudar agora?..." 
              className="flex-1 bg-secondary/50 rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary/20 transition-all"
            />
            <Button 
              type="submit" 
              disabled={!input.trim()}
              className="rounded-full w-14 h-14 shrink-0 bg-foreground text-background hover:scale-105 transition-transform shadow-lg"
            >
              <Send size={20} />
            </Button>
          </form>
        </div>
      </AppleCard>
    </div>

  );
}
