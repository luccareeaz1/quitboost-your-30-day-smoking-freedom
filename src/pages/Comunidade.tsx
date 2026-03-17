import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Heart, MessageCircle, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";

interface Post {
  id: string;
  author: string;
  avatar: string;
  daysFree: number;
  text: string;
  likes: number;
  comments: string[];
  needsSupport: boolean;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: "Maria S.",
    avatar: "M",
    daysFree: 14,
    text: "Duas semanas sem fumar! A vontade diminuiu muito depois do dia 10. Quem está no começo, não desista!",
    likes: 24,
    comments: ["Parabéns! Estou no dia 5, sua mensagem me deu forças.", "Incrível progresso!"],
    needsSupport: false,
    timestamp: "2h atrás",
  },
  {
    id: "2",
    author: "João P.",
    avatar: "J",
    daysFree: 3,
    text: "Hoje estou com muita vontade de fumar. Alguém tem alguma dica para passar essa hora?",
    likes: 18,
    comments: ["Beba água gelada e respire fundo por 3 minutos. Funciona comigo!", "Você consegue! Cada minuto conta."],
    needsSupport: true,
    timestamp: "4h atrás",
  },
  {
    id: "3",
    author: "Ana R.",
    avatar: "A",
    daysFree: 30,
    text: "30 DIAS! Não acredito que consegui. Economizei R$450 e minha respiração melhorou muito.",
    likes: 67,
    comments: ["Que conquista!", "Você é uma inspiração!"],
    needsSupport: false,
    timestamp: "6h atrás",
  },
  {
    id: "4",
    author: "Carlos M.",
    avatar: "C",
    daysFree: 7,
    text: "Uma semana! O exercício de respiração do app salvou meu dia pelo menos 3 vezes.",
    likes: 31,
    comments: ["O exercício de respiração é ótimo mesmo!"],
    needsSupport: false,
    timestamp: "8h atrás",
  },
];

const Comunidade = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handleLike = (id: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setPosts(p => p.map(post => post.id === id ? { ...post, likes: post.likes - 1 } : post));
      } else {
        next.add(id);
        setPosts(p => p.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post));
      }
      return next;
    });
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      author: "Você",
      avatar: "V",
      daysFree: 0,
      text: newPost,
      likes: 0,
      comments: [],
      needsSupport: false,
      timestamp: "agora",
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Comunidade</h1>
          <p className="text-muted-foreground mb-8">Apoie e seja apoiado na sua jornada.</p>
        </motion.div>

        {/* New post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card border border-border p-5 mb-6"
        >
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Compartilhe como você está se sentindo..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[80px]"
          />
          <div className="flex justify-end mt-3">
            <Button size="sm" className="rounded-full" onClick={handlePost} disabled={!newPost.trim()}>
              <Send className="w-4 h-4 mr-1" /> Publicar
            </Button>
          </div>
        </motion.div>

        {/* Feed */}
        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`rounded-2xl bg-card border p-5 ${
                post.needsSupport ? "border-destructive/20" : "border-border"
              }`}
            >
              {post.needsSupport && (
                <div className="flex items-center gap-1.5 text-destructive text-[10px] font-medium uppercase tracking-wider mb-3">
                  <AlertTriangle className="w-3 h-3" /> Precisa de apoio
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
                  {post.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{post.author}</p>
                  <p className="text-[10px] text-muted-foreground">{post.daysFree} dias sem fumar · {post.timestamp}</p>
                </div>
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-4">{post.text}</p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    likedPosts.has(post.id) ? "text-destructive" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                  {post.likes}
                </button>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MessageCircle className="w-4 h-4" /> {post.comments.length}
                </span>
              </div>

              {post.comments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  {post.comments.map((c, ci) => (
                    <p key={ci} className="text-xs text-muted-foreground pl-4 border-l-2 border-border">{c}</p>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Comunidade;
