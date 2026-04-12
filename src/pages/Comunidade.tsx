import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  MessageSquare, 
  Trophy, 
  Plus, 
  Heart, 
  MessageCircle, 
  Share, 
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Image as ImageIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const TRENDING = [
  { name: "#LiberdadeReal", count: "1.240 focados", color: "text-blue-600" },
  { name: "#PulmõesLimpos", count: "868 conquistas", color: "text-blue-400" },
  { name: "#QuitBoostClub", count: "3.102 vitoriosos", color: "text-indigo-500" },
];

const SUGGESTIONS = [
  { name: "Dr. Marcelo (Pneumo)", handle: "@dr_marcelo", avatar: "DM" },
  { name: "Juliana (2 anos livre)", handle: "@juli_venceu", avatar: "JV" },
];

export default function Comunidade() {
  const { toast } = useToast();

  const handleAction = (title: string, desc: string) => {
    toast({ title, description: desc });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 pb-32">
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Círculo de Apoio</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none mb-2">
          Vença em <span className="text-blue-600 italic">Comunidade</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Conecte-se com pessoas reais que entendem o seu desafio.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Sidebar - Navigation/Quick Links */}
        <aside className="lg:col-span-3 space-y-8 hidden lg:block">
          <div className="space-y-4">
            <NavButton icon={Users} label="Feed de Apoio" active />
            <NavButton icon={MessageSquare} label="Grupos Mentorados" />
            <NavButton icon={Trophy} label="Vitoriosos do Dia" />
            <NavButton icon={TrendingUp} label="Dicas Clínicas" />
          </div>
          
          <Card className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200/50 border-none">
             <h4 className="text-xl font-bold mb-4 leading-tight tracking-tight">Inspire Outras Pessoas</h4>
             <p className="text-white/60 text-xs font-medium mb-8">Sua vitória pode ser o motivo de alguém não desistir hoje.</p>
             <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px] gap-2 border-none">
               <Plus className="w-4 h-4" />
               Novo Relato
             </Button>
          </Card>
        </aside>

        {/* Center - Feed */}
        <main className="lg:col-span-6 space-y-10">
           {/* Create Post */}
           <Card className="border border-slate-100 shadow-xl shadow-slate-200/20 bg-white rounded-[2.5rem] p-8">
              <div className="flex gap-6">
                <Avatar className="w-14 h-14 shadow-sm border border-slate-100">
                  <AvatarFallback className="bg-slate-50 text-slate-400 font-bold">EU</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-6">
                   <textarea 
                     placeholder="Como você está se sentindo agora?" 
                     className="w-full bg-transparent border-none text-lg font-bold resize-none focus:outline-none min-h-[80px] placeholder:text-slate-300"
                   />
                   <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                     <div className="flex gap-4">
                       <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-all border border-slate-100"><Plus className="w-5 h-5" /></button>
                       <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-all border border-slate-100"><ImageIcon className="w-5 h-5" /></button>
                     </div>
                     <Button className="bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px] border-none shadow-lg shadow-blue-100">
                        Postar
                     </Button>
                   </div>
                </div>
              </div>
           </Card>

           {/* Posts List */}
           <div className="space-y-12">
             <PostCard 
                user={{ name: "Isabela Dias", handle: "@isa_livre", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabela" }}
                content="Gente, 6 meses sem fumar hoje! A maior diferença? Consigo subir as escadas do prédio sem parecer que corri uma maratona. Continuem firmes, vale cada segundo!"
                stats={{ likes: 452, comments: 28 }}
                tag={{ label: "Conquista: 6 Meses", icon: CheckCircle2, type: 'success' }}
                image="https://images.unsplash.com/photo-1506126613408-eca07ce68773"
             />
             <PostCard 
                user={{ name: "Marcos Porto", handle: "@marcos_p", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos" }}
                content="Fissura forte depois do almoço hoje. Alguém por aqui? Já tomei 2 copos de água gelada mas o cérebro tá insistindo. Me ajudem com uma distração!"
                stats={{ likes: 12, comments: 8 }}
                tag={{ label: "Grito de Ajuda", icon: AlertTriangle, type: 'danger' }}
             />
           </div>
        </main>

        {/* Right Sidebar - Trending/Suggestions */}
        <aside className="lg:col-span-3 space-y-10">
           <Card className="border border-slate-100 shadow-lg shadow-slate-200/20 bg-white rounded-[2.5rem] p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">Destaques</h3>
              <div className="space-y-8">
                {TRENDING.map((t) => (
                  <div key={t.name} className="group cursor-pointer">
                    <div className="flex justify-between items-center mb-1">
                       <span className={cn("text-[9px] font-bold uppercase tracking-widest", t.color)}>Em alta</span>
                       <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-all" />
                    </div>
                    <h4 className="text-md font-bold text-slate-900 group-hover:text-blue-600 transition-all">{t.name}</h4>
                    <p className="text-[11px] font-medium text-slate-400">{t.count}</p>
                  </div>
                ))}
              </div>
           </Card>

           <Card className="border border-slate-100 shadow-lg shadow-slate-200/20 bg-white rounded-[2.5rem] p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">Mentoria</h3>
              <div className="space-y-8">
                {SUGGESTIONS.map((s) => (
                  <div key={s.handle} className="flex items-center gap-4">
                     <Avatar className="w-10 h-10 shadow-sm border border-slate-50">
                        <AvatarFallback className="bg-slate-50 text-slate-400 font-bold">{s.avatar}</AvatarFallback>
                     </Avatar>
                     <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{s.name}</h4>
                        <p className="text-[10px] font-medium text-slate-400 truncate">{s.handle}</p>
                     </div>
                     <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl">
                        <Plus className="w-5 h-5" />
                     </Button>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-10 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-none">Ver Todos</Button>
           </Card>
        </aside>
      </div>
    </div>
  );
}

function NavButton({ icon: Icon, label, active }: any) {
  return (
    <button className={cn(
      "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold uppercase tracking-widest transition-all",
      active ? "bg-white shadow-xl shadow-slate-200/20 text-blue-600 border border-slate-100" : "text-slate-400 hover:text-slate-900"
    )}>
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

function PostCard({ user, content, stats, tag, image }: any) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
      <Card className="border border-slate-100 shadow-xl shadow-slate-200/20 bg-white rounded-[2.5rem] p-10 overflow-hidden relative group">
         <div className="flex justify-between items-start mb-8">
           <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 shadow-sm border border-slate-100">
                 <AvatarImage src={user.avatar} />
                 <AvatarFallback className="bg-slate-50 font-bold">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                 <h3 className="text-lg font-bold text-slate-900 tracking-tight">{user.name}</h3>
                 <p className="text-xs font-medium text-slate-400">{user.handle} · 2h</p>
              </div>
           </div>
           {tag && (
             <div className={cn(
                "px-4 py-2 rounded-xl border flex items-center gap-2",
                tag.type === 'success' ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-rose-50 border-rose-100 text-rose-600"
             )}>
                <tag.icon className="w-3.5 h-3.5 fill-current opacity-20" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{tag.label}</span>
             </div>
           )}
         </div>

         <p className="text-lg font-bold text-slate-700 leading-relaxed mb-8">{content}</p>

         {image && (
           <div className="mb-8 rounded-[2rem] overflow-hidden aspect-video shadow-inner bg-slate-50 border border-slate-100">
              <img src={image} alt="Lifestyle" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
           </div>
         )}

         <div className="flex items-center gap-10 pt-8 border-t border-slate-100">
           <button className="flex items-center gap-3 text-slate-400 hover:text-rose-500 transition-colors font-bold text-xs uppercase tracking-widest">
              <Heart className="w-6 h-6" /> {stats.likes}
           </button>
           <button className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest">
              <MessageCircle className="w-6 h-6" /> {stats.comments}
           </button>
           <button className="ml-auto text-slate-300 hover:text-slate-900 transition-colors">
              <Share className="w-6 h-6" />
           </button>
         </div>
      </Card>
    </motion.div>
  );
}
