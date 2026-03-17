import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Heart, MessageCircle, Send, AlertTriangle, Sparkles, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppleCard } from "@/components/ui/apple-card";
import AppLayout from "@/components/app/AppLayout";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  level: number;
  text: string;
  likes: number;
  commentCount: number;
  timestamp: string;
  isEmergency?: boolean;
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: "Ricardo Mendes",
    avatar: "RM",
    level: 12,
    text: "Acabei de completar minha primeira semana! A disposição física é outra. Persistam, vale cada segundo de esforço. 🚀",
    likes: 42,
    commentCount: 5,
    timestamp: "15 min",
  },
  {
    id: "2",
    author: "Juliana Silva",
    avatar: "JS",
    level: 5,
    isEmergency: true,
    text: "Alguém online? A fissura pós-almoço está batendo forte agora. Dicas?",
    likes: 12,
    commentCount: 8,
    timestamp: "2 min",
  },
  {
    id: "3",
    author: "Carlos Oliveira",
    avatar: "CO",
    level: 28,
    text: "Quase um mês! O segredo é substituir o hábito. Troquei o cigarro pela caminhada e minha ansiedade despencou.",
    likes: 89,
    commentCount: 12,
    timestamp: "1h",
  }
];

const relevantUsers = [
  { name: "Ana Paula", level: 12, avatar: "AP" },
  { name: "Marcos Vinícius", level: 11, avatar: "MV" },
  { name: "Sofia Luz", level: 13, avatar: "SL" },
];

export default function Comunidade() {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState("");

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      author: "Você",
      avatar: "V",
      level: 1,
      text: newPost,
      likes: 0,
      commentCount: 0,
      timestamp: "agora",
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto px-6 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT/MAIN: THE FEED */}
          <div className="lg:col-span-2 space-y-8">
            <header className="mb-10">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Feed da <span className="text-primary italic">Comunidade.</span></h1>
              <p className="text-gray-400 font-medium">Conecte-se com quem compartilha sua missão.</p>
            </header>

            {/* CREATE POST CARD */}
            <AppleCard className="p-6 bg-white border-gray-100 shadow-sm">
               <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">V</div>
                 <div className="flex-1">
                   <textarea 
                     value={newPost}
                     onChange={(e) => setNewPost(e.target.value)}
                     placeholder="No que você está pensando?"
                     className="w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder:text-gray-300 resize-none min-h-[80px] font-medium"
                   />
                   <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                     <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="rounded-full text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-primary">
                          <Sparkles size={14} className="mr-2" /> Dica
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-full text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-red-500">
                          <AlertTriangle size={14} className="mr-2" /> Emergência
                        </Button>
                     </div>
                     <Button 
                       onClick={handleCreatePost}
                       disabled={!newPost.trim()}
                       className="rounded-full px-8 bg-primary text-white font-bold h-10 shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all"
                     >
                       Publicar
                     </Button>
                   </div>
                 </div>
               </div>
            </AppleCard>

            {/* POSTS LIST */}
            <div className="space-y-6">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <AppleCard className={cn(
                    "p-7 bg-white shadow-sm border-gray-100 hover:shadow-xl transition-all group",
                    post.isEmergency && "border-red-100 bg-red-50/30"
                  )}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                          {post.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{post.author}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Nível {post.level}</span>
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">· {post.timestamp} atrás</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full text-gray-300"><MoreHorizontal size={20} /></Button>
                    </div>

                    <p className="text-gray-600 font-medium leading-relaxed mb-8">
                      {post.text}
                    </p>

                    <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors font-bold text-xs">
                        <Heart size={18} /> {post.likes}
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-bold text-xs">
                        <MessageCircle size={18} /> {post.commentCount}
                      </button>
                    </div>
                  </AppleCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: SIDEBAR */}
          <div className="hidden lg:block space-y-8">
            {/* USERS AT SAME LEVEL */}
            <AppleCard className="p-8 bg-gray-50 border-gray-100">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                 <Users size={14} className="text-primary" /> No mesmo nível
               </h3>
               <div className="space-y-6">
                 {relevantUsers.map((user, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{user.name}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-primary">Nível {user.level}</p>
                        </div>
                     </div>
                     <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 text-gray-300 hover:text-primary"><Send size={14} /></Button>
                   </div>
                 ))}
               </div>
               <Button variant="ghost" className="w-full mt-8 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-white">Ver todos</Button>
            </AppleCard>

            {/* STATS CARD */}
            <AppleCard className="p-8 bg-primary text-white border-transparent overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-20"><Zap size={40} fill="currentColor" /></div>
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/60 mb-6">Impacto Coletivo</h3>
               <div className="space-y-4">
                 <div>
                   <p className="text-3xl font-black italic tracking-tighter">15.2k</p>
                   <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Vidas em Transformação</p>
                 </div>
                 <div className="h-1 bg-white/20 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-white w-2/3" />
                 </div>
               </div>
            </AppleCard>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
