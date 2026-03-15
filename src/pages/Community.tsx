import { useState } from "react";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, Heart, Share2, MoreHorizontal, 
  Send, CornerDownRight, Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  likes: number;
  time: string;
  replies?: Comment[];
}

interface Post {
  id: string;
  user: string;
  avatar: string;
  content: string;
  likes: number;
  comments: Comment[];
  time: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    user: "João Silva",
    avatar: "JS",
    content: "Hoje completo 10 dias sem fumar! A ansiedade ainda bate forte às vezes, mas estou firme. Alguma dica para o café da manhã?",
    likes: 24,
    time: "2h atrás",
    comments: [
      {
        id: "c1",
        user: "Maria Costa",
        avatar: "MC",
        content: "Parabéns!! Eu troquei o café por chá de hortelã nos primeiros dias, ajudou muito a quebrar o hábito.",
        likes: 5,
        time: "1h atrás",
        replies: [
          {
            id: "c2",
            user: "João Silva",
            avatar: "JS",
            content: "Vou testar amanhã mesmo! Obrigado Maria.",
            likes: 2,
            time: "30min atrás"
          }
        ]
      }
    ]
  }
];

export default function Community() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(MOCK_POSTS);

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 max-w-3xl mx-auto space-y-10 animate-fade-in">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-semibold tracking-tighter">Comunidade</h1>
        <p className="text-muted-foreground text-lg">Você não está sozinho nessa jornada.</p>
      </header>

      {/* AI ASSISTANT PROMPT */}
      <AppleCard className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Precisa de apoio agora?</p>
            <p className="text-sm text-muted-foreground">O Coach IA está disponível para conversar.</p>
          </div>
          <Button onClick={() => navigate("/coach")} className="rounded-full shadow-lg">Conversar</Button>
        </div>
      </AppleCard>

      {/* NEW POST BOX */}
      <AppleCard className="p-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarFallback>EU</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <textarea 
              placeholder="Como você está se sentindo hoje?"
              className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none min-h-[100px]"
            />
            <div className="flex justify-between items-center pt-2 border-t">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="rounded-full">📷</Button>
                <Button variant="ghost" size="sm" className="rounded-full">😊</Button>
              </div>
              <Button className="rounded-full px-6 font-bold">Publicar</Button>
            </div>
          </div>
        </div>
      </AppleCard>

      {/* FEED */}
      <div className="space-y-8">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <AppleCard className="p-0 overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Avatar>
              <AvatarFallback>{post.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{post.user}</p>
              <p className="text-xs text-muted-foreground">{post.time}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="h-5 w-5" /></Button>
        </div>

        <p className="text-lg leading-relaxed">{post.content}</p>

        <div className="flex items-center gap-6 pt-2">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            {post.likes + (isLiked ? 1 : 0)}
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <MessageCircle className="h-5 w-5" />
            {post.comments.length}
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* COMMENTS SECTION */}
      <div className="bg-secondary/20 border-t p-6 space-y-6">
        {post.comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        
        {/* REPLY INPUT */}
        <div className="flex gap-3 items-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback>EU</AvatarFallback>
          </Avatar>
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Escreva um comentário..."
              className="w-full bg-background border rounded-full py-2 px-4 text-sm pr-10 focus:ring-1 focus:ring-primary outline-none"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AppleCard>
  );
}

function CommentItem({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Avatar className={isReply ? "h-6 w-6" : "h-8 w-8"}>
          <AvatarFallback className="text-[10px]">{comment.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex-1 bg-background rounded-2xl rounded-tl-none p-3 shadow-sm border border-border/50">
          <div className="flex justify-between items-baseline mb-1">
            <p className="font-bold text-sm">{comment.user}</p>
            <p className="text-[10px] text-muted-foreground">{comment.time}</p>
          </div>
          <p className="text-sm leading-snug">{comment.content}</p>
          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`text-[10px] font-bold ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              {isLiked ? 'Curtido' : 'Curtir'}
            </button>
            <button 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-[10px] font-bold text-muted-foreground"
            >
              Responder
            </button>
          </div>
        </div>
      </div>

      {/* NESTED REPLIES */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-11 space-y-4 relative">
          <div className="absolute left-4 top-0 bottom-4 w-px bg-border/50" />
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}

      {/* NESTED REPLY INPUT */}
      <AnimatePresence>
        {showReplyInput && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-11"
          >
            <div className="flex gap-2 items-center">
              <CornerDownRight className="h-4 w-4 text-muted-foreground" />
              <input 
                autoFocus
                type="text" 
                placeholder={`Respondendo a ${comment.user}...`}
                className="flex-1 bg-background border rounded-full py-1.5 px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
