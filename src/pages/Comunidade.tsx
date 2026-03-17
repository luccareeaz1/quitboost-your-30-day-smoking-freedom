import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Heart, MessageCircle, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  replies?: Comment[];
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  daysFree: number;
  text: string;
  likes: number;
  comments: Comment[];
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
    comments: [
      { id: "c1", author: "João P.", text: "Parabéns! Estou no dia 5, sua mensagem me deu forças.", timestamp: "1h atrás", replies: [
        { id: "r1", author: "Maria S.", text: "Obrigada João! Força, os primeiros dias são os mais difíceis mas passa rápido.", timestamp: "45min atrás" }
      ]},
      { id: "c2", author: "Ana R.", text: "Incrível progresso!", timestamp: "30min atrás" }
    ],
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
    comments: [
      { id: "c3", author: "Carlos M.", text: "Beba água gelada e respire fundo por 3 minutos. Funciona comigo!", timestamp: "3h atrás" }
    ],
    needsSupport: true,
    timestamp: "4h atrás",
  }
];

const Comunidade = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<{postId: string, commentId: string} | null>(null);
  const [commentText, setCommentText] = useState("");

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

  const handleAddComment = (postId: string, parentCommentId?: string) => {
    if (!commentText.trim()) return;

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id !== postId) return post;

      const newComment: Comment = {
        id: Date.now().toString(),
        author: "Você",
        text: commentText,
        timestamp: "agora",
        replies: []
      };

      if (!parentCommentId) {
        return { ...post, comments: [...post.comments, newComment] };
      } else {
        return {
          ...post,
          comments: post.comments.map(c => {
            if (c.id === parentCommentId) {
              return { ...c, replies: [...(c.replies || []), newComment] };
            }
            return c;
          })
        };
      }
    }));

    setCommentText("");
    setReplyingTo(null);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-6 max-w-2xl pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-4 uppercase tracking-widest">
            <Users size={12} />
            <span>Rede de Apoio Ativa</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Comunidade</h1>
          <p className="text-muted-foreground">Onde a força individual se torna coletiva.</p>
        </motion.div>

        {/* New post */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[2rem] bg-white border border-border/40 p-6 mb-8 shadow-sm hover:shadow-md transition-shadow"
        >
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Compartilhe como você está se sentindo hoje..."
            className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[100px]"
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/40">
            <p className="text-xs text-muted-foreground italic">Seu post será visto por todos na rede.</p>
            <Button size="sm" className="rounded-full px-6" onClick={handlePost} disabled={!newPost.trim()}>
              <Send className="w-4 h-4 mr-2" /> Publicar
            </Button>
          </div>
        </motion.div>

        {/* Feed */}
        <div className="space-y-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "rounded-[2.5rem] bg-white border p-7 shadow-sm transition-all hover:shadow-md",
                post.needsSupport ? "border-destructive/30 bg-destructive/5" : "border-border/40"
              )}
            >
              {post.needsSupport && (
                <div className="flex items-center gap-1.5 text-destructive text-[10px] font-bold uppercase tracking-wider mb-4 px-3 py-1 bg-destructive/10 rounded-full w-fit">
                  <AlertTriangle className="w-3 h-3" /> Precisa de apoio imediato
                </div>
              )}

              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold text-primary shadow-inner">
                  {post.avatar}
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    <span className="text-primary font-bold">{post.daysFree} dias</span> sem fumar · {post.timestamp}
                  </p>
                </div>
              </div>

              <p className="text-[15px] text-foreground leading-relaxed mb-6 font-medium">{post.text}</p>

              <div className="flex items-center gap-6 pb-4 border-b border-border/40">
                <button
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "flex items-center gap-2 text-sm font-semibold transition-all hover:scale-110",
                    likedPosts.has(post.id) ? "text-destructive" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Heart className={cn("w-5 h-5", likedPosts.has(post.id) ? "fill-current" : "")} />
                  {post.likes}
                </button>
                <button className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all">
                  <MessageCircle className="w-5 h-5" />
                  {post.comments.length}
                </button>
              </div>

              {/* Comments Section */}
              <div className="mt-5 space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="group">
                    <div className="bg-secondary/30 p-4 rounded-3xl">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-primary">{comment.author}</span>
                        <span className="text-[10px] text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-snug">{comment.text}</p>
                      
                      <div className="flex gap-4 mt-2">
                        <button 
                          onClick={() => {
                            setReplyingTo({postId: post.id, commentId: comment.id});
                            setCommentText("");
                          }}
                          className="text-[10px] font-bold text-primary flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <MessageCircle size={10} /> Responder
                        </button>
                        <button className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                          <Heart size={10} /> Curtir
                        </button>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-8 mt-2 space-y-2 border-l-2 border-primary/10 pl-4">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="bg-primary/5 p-3 rounded-2xl relative">
                             <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-bold text-primary">{reply.author}</span>
                              <span className="text-[9px] text-muted-foreground">{reply.timestamp}</span>
                            </div>
                            <p className="text-xs text-foreground/70">{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Reply Input Context Info */}
                {replyingTo?.postId === post.id && replyingTo.commentId && (
                  <div className="flex items-center justify-between bg-primary/5 px-4 py-2 rounded-t-2xl border-x border-t border-primary/10 -mb-4">
                    <span className="text-[10px] text-primary font-bold">Respondendo ao comentário</span>
                    <button onClick={() => setReplyingTo(null)} className="text-[10px] text-muted-foreground hover:text-primary">Cancelar</button>
                  </div>
                )}

                {/* Reply Input */}
                <div className="mt-4 flex gap-2 items-center">
                  <input 
                    type="text"
                    value={replyingTo?.postId === post.id ? commentText : ""}
                    onChange={(e) => {
                      if (replyingTo?.postId !== post.id) setReplyingTo({postId: post.id, commentId: ""});
                      setCommentText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id, replyingTo?.commentId || undefined);
                    }}
                    placeholder={replyingTo?.postId === post.id && replyingTo.commentId ? "Escreva sua resposta..." : "Deixe um comentário..."}
                    className="flex-1 bg-secondary/20 rounded-full px-4 py-2 text-sm outline-none border border-transparent focus:border-primary/20 transition-all"
                  />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="rounded-full text-primary"
                    onClick={() => handleAddComment(post.id, replyingTo?.commentId || undefined)}
                    disabled={!commentText.trim()}
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Comunidade;

