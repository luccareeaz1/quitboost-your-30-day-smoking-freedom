import { FreeshNavbar } from "@/components/layout/FreeshNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  MessageSquare, 
  Trophy, 
  TrendingUp, 
  Plus, 
  Share2, 
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share,
  LayoutGrid,
  ChevronRight,
  Flame,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const TRENDING = [
  { name: "#PrimeiraSemana", count: "1.240 focados", color: "bg-blue-400" },
  { name: "#SemRecaída", count: "868 conquistas", color: "bg-emerald-400" },
  { name: "#RespireFreesh", count: "3.102 vitoriosos", color: "bg-indigo-400" },
];

const SUGGESTIONS = [
  { name: "Dr. Ricardo (Pneumo)", handle: "@dr_ricardo", avatar: "DR" },
  { name: "Ana (1 ano sem fumar)", handle: "@ana_venceu", avatar: "AV" },
];

const SIDEBAR_ITEMS = [
  { icon: LayoutGrid, label: "Feed de Apoio", active: true },
  { icon: Users, label: "Grupos Mentorados" },
  { icon: MessageSquare, label: "Dicas Diárias" },
  { icon: Trophy, label: "Vitoriosos" },
];

export default function Community() {
  const { toast } = useToast();

  const handleAction = (title: string, desc: string) => {
    toast({
      title: title,
      description: desc,
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <FreeshNavbar />
      
      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Left Sidebar */}
        <aside className="md:col-span-3 hidden md:block">
          <div className="space-y-4">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleAction("Navegação", `Indo para ${item.label}...`)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all",
                  item.active 
                    ? "bg-[#2D45C1]/5 text-[#2D45C1] shadow-[0_4px_12px_rgba(45,69,193,0.1)]" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            <div className="pt-8 px-4">
              <Button 
                onClick={() => handleAction("Compartilhar", "Abrindo menu de compartilhamento...")}
                className="w-full bg-[#2D45C1] hover:bg-[#1E30A1] text-white rounded-full h-14 font-black gap-2 shadow-xl shadow-blue-100"
              >
                <Plus className="w-5 h-5 pointer-events-none" />
                Compartilhar
              </Button>
            </div>
          </div>
        </aside>

        {/* Center Feed */}
        <main className="md:col-span-6">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Rede de Apoio Freesh</h1>
            <div className="flex gap-8 border-b border-slate-100 pb-1">
              {["Para Você", "Minha Rede", "Gritos de Ajuda"].map((tab, i) => (
                <button 
                  key={tab} 
                  onClick={() => handleAction("Filtro", `Mostrando feed: ${tab}`)}
                  className={cn(
                    "text-xs font-black uppercase tracking-widest pb-4 transition-all relative px-2",
                    i === 0 ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {tab}
                  {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2D45C1] rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          <Card className="border-none shadow-[0_4px_24px_rgba(0,0,0,0.03)] bg-white rounded-3xl mb-10 overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="w-12 h-12 shadow-sm border border-slate-100">
                  <AvatarFallback className="bg-slate-100 text-slate-400 font-bold">EU</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-4 transition-all group-focus-within:border-[#2D45C1]/30">
                    <textarea 
                      placeholder="O que está acontecendo na sua jornada?" 
                      className="w-full bg-transparent border-none text-md resize-none focus:outline-none min-h-[60px] placeholder:text-slate-400"
                    />
                    <div className="mt-4 pt-4 border-t border-slate-200/50 flex justify-between items-center">
                      <div className="flex gap-4">
                        <button className="text-slate-400 hover:text-[#2D45C1] transition-all"><Plus className="w-5 h-5" /></button>
                        <button className="text-slate-400 hover:text-[#2D45C1] transition-all"><TrendingUp className="w-5 h-5" /></button>
                      </div>
                      <Button 
                        onClick={() => handleAction("Publicado!", "Sua postagem foi compartilhada com a comunidade.")}
                        className="bg-[#2D45C1] hover:bg-[#1E30A1] text-white px-8 rounded-xl h-10 font-bold shadow-lg shadow-blue-100"
                      >
                        Publicar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-10">
            {/* Post 1 */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-none shadow-[0_4px_32px_rgba(0,0,0,0.02)] bg-white rounded-3xl overflow-hidden hover:shadow-[0_8px_48px_rgba(0,0,0,0.04)] transition-all">
                <CardContent className="p-8">
                  <div className="flex gap-4 mb-6">
                    <Avatar className="w-14 h-14 ring-4 ring-slate-50/50 border border-slate-100">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" />
                      <AvatarFallback>EG</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-lg font-black text-slate-900 leading-tight">Clara Oliveira</h3>
                          <span className="text-sm font-bold text-slate-400">@clara_freesh · 2h</span>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100 inline-flex">
                          <CheckCircle2 className="w-3 h-3 fill-emerald-100" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Conquista: 30 dias sem fumar!</span>
                        </div>
                      </div>
                      <button className="text-slate-300 hover:text-slate-900"><MoreHorizontal className="w-6 h-6" /></button>
                    </div>
                  </div>
                  <p className="text-slate-700 text-md leading-relaxed mb-6 font-medium">
                    Gente, hoje fazem 30 dias que eu não acendo um cigarro! Sinto meu fôlego voltando e o cheiro das coisas está muito mais nítido. Se eu consegui, você também consegue! Vamos juntos nessa? 🚭✨
                  </p>
                  <div className="rounded-[2.5rem] overflow-hidden mb-8 aspect-[16/9] bg-slate-100 shadow-inner group">
                    <img 
                      src="https://images.unsplash.com/photo-1506126613408-eca07ce68773" 
                      alt="Health lifestyle" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex items-center gap-10 pt-4 border-t border-slate-50">
                    <button 
                      onClick={() => handleAction("Amei!", "Você curtiu a postagem de Elena.")}
                      className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-all"
                    >
                      <Heart className="w-6 h-6" /> <span className="text-sm font-bold">768</span>
                    </button>
                    <button 
                      onClick={() => handleAction("Comentários", "Abrindo seção de comentários...")}
                      className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-all"
                    >
                      <MessageCircle className="w-6 h-6" /> <span className="text-sm font-bold">24</span>
                    </button>
                    <button 
                      onClick={() => handleAction("Compartilhado", "Postagem compartilhada com sucesso.")}
                      className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-all ml-auto"
                    >
                      <Share className="w-6 h-6" /> <span className="text-sm font-bold">12</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Post 2 */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-none shadow-[0_4px_32px_rgba(0,0,0,0.02)] bg-white rounded-3xl overflow-hidden hover:shadow-[0_8px_48px_rgba(0,0,0,0.04)] transition-all">
                <CardContent className="p-8">
                  <div className="flex gap-4 mb-4">
                    <Avatar className="w-14 h-14 ring-4 ring-slate-50/50 border border-slate-100">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" />
                      <AvatarFallback>RC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-lg font-black text-slate-900 leading-tight">Ricardo Castro</h3>
                          <span className="text-sm font-bold text-slate-400">@ricardo_freesh · 5h</span>
                        </div>
                        <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-2 py-0.5 rounded-lg border border-rose-100 inline-flex">
                          <AlertTriangle className="w-3 h-3 fill-rose-50" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Grito de Ajuda</span>
                        </div>
                      </div>
                      <button className="text-slate-300 hover:text-slate-900"><MoreHorizontal className="w-6 h-6" /></button>
                    </div>
                  </div>
                  <p className="text-slate-700 text-md leading-relaxed font-medium">
                    Eita vontade que não passa... Acabei de sair de uma reunião estressante e meu cérebro só pensa no cigarro. Alguém tem alguma dica rápida de foco? Não quero jogar meus 112 dias fora. 🆘
                  </p>
                  <div className="flex items-center gap-10 mt-6 pt-4 border-t border-slate-50">
                    <button 
                      onClick={() => handleAction("Incrível!", "Você curtiu a postagem de Marcus.")}
                      className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-all"
                    >
                      <Heart className="w-6 h-6" /> <span className="text-sm font-bold">42</span>
                    </button>
                    <button 
                      onClick={() => handleAction("Comentários", "Abrindo seção de comentários...")}
                      className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-all"
                    >
                      <MessageCircle className="w-6 h-6" /> <span className="text-sm font-bold">8</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="md:col-span-3 space-y-10">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              Grupos em Alta
            </h2>
            <div className="space-y-6">
              {TRENDING.map((challenge) => (
                <div key={challenge.name} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Saúde • Em Alta</p>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-all group-hover:translate-x-1" />
                  </div>
                  <h4 className="text-md font-black text-slate-900 group-hover:text-[#2D45C1] transition-all mb-1">{challenge.name}</h4>
                  <p className="text-sm font-bold text-slate-500">{challenge.count}</p>
                </div>
              ))}
              <button 
                onClick={() => handleAction("Ver Mais", "Carregando mais desafios...")}
                className="text-sm font-bold text-[#2D45C1] hover:underline pt-2"
              >
                Mostrar mais
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h2 className="text-xl font-black text-slate-900 mb-8">Mentores Especialistas</h2>
            <div className="space-y-8">
              {SUGGESTIONS.map((user) => (
                <div key={user.name} className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 shadow-sm border border-slate-100 ring-4 ring-slate-50/50">
                    <AvatarFallback className="bg-slate-50 text-slate-400 font-bold">{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-slate-900 truncate mb-0.5">{user.name}</h4>
                    <p className="text-xs font-bold text-slate-400 truncate">{user.handle}</p>
                  </div>
                  <Button 
                    onClick={() => handleAction("Apoiando!", `Você agora apoia ${user.name}`)}
                    variant="outline" 
                    className="rounded-xl border-slate-200 text-slate-900 font-black h-10 px-4 text-xs hover:bg-slate-50 transition-all"
                  >
                    Apoiar
                  </Button>
                </div>
              ))}
              <button 
                onClick={() => handleAction("Ver Mais", "Carregando mais sugestões...")}
                className="text-sm font-bold text-[#2D45C1] hover:underline pt-2 w-full text-left"
              >
                Mostrar mais
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 px-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-500">Termos de Serviço</a>
            <a href="#" className="hover:text-slate-500">Privacidade</a>
            <a href="#" className="hover:text-slate-500">Cookies</a>
            <a href="#" className="hover:text-slate-500">Acessibilidade</a>
            <span>© 2026 Freesh Inc.</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
