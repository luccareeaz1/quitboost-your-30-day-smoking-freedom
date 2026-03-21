import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Heart, MessageCircle, Send, AlertTriangle, Search,
  Bookmark, Share2, Flag, Filter, TrendingUp, Clock, Hash,
  Award, ThumbsUp, Reply, MoreHorizontal, X, ChevronDown,
  ChevronUp, Shield, Star, Flame, Eye, Image as ImageIcon,
  AtSign, Plus, Trophy, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";

// ========== TYPES ==========
interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  timestamp: string;
  replies: Comment[];
  mentions: string[];
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  avatarColor: string;
  daysFree: number;
  text: string;
  likes: number;
  comments: Comment[];
  needsSupport: boolean;
  timestamp: string;
  category: "vitoria" | "duvida" | "suporte" | "motivacao" | "testemunho";
  hashtags: string[];
  bookmarked: boolean;
  views: number;
  shared: number;
}

// ========== MEDICAL CONTENT (Fontes: OMS, CDC, INCA) ==========
const COMMUNITY_RULES = [
  "🩺 Todo conteúdo deve ser respeitoso e focado em apoio mútuo.",
  "🚫 Proibida qualquer promoção, venda ou incentivo ao uso de tabaco ou derivados.",
  "💚 Caso esteja em crise, procure um profissional de saúde imediatamente.",
  "🔒 Sua identidade é protegida. Use apelidos e não compartilhe dados pessoais sensíveis.",
  "⚕️ Não forneça conselhos médicos específicos — sugira sempre a consulta profissional.",
  "🤝 Acolha todos, independentemente de recaídas — cada tentativa fortalece a próxima.",
];

const MOTIVATIONAL_TIPS = [
  "Segundo a OMS, a cada 6 segundos uma pessoa morre por doenças relacionadas ao tabaco. Você está mudando essa estatística! 💪",
  "Estudos do CDC mostram que o suporte social aumenta em até 40% as chances de sucesso na cessação.",
  "O INCA recomenda: compartilhar sua jornada com outros é parte fundamental do tratamento.",
];

// ========== MOCK DATA ==========
const createComment = (
  id: string, author: string, avatar: string, text: string,
  likes: number, timestamp: string, replies: Comment[] = [], mentions: string[] = []
): Comment => ({ id, author, avatar, text, likes, timestamp, replies, mentions });

const mockPosts: Post[] = [
  {
    id: "1",
    author: "Dra. Marina",
    avatar: "DM",
    avatarColor: "bg-emerald-500",
    daysFree: 365,
    text: "🩺 Dica médica do dia: Após 20 minutos sem fumar, sua pressão arterial e frequência cardíaca retornam ao normal. Após 12 horas, o nível de monóxido de carbono no sangue normaliza. Cada minuto conta! (Fonte: OMS – WHO Report on the Global Tobacco Epidemic, 2024)",
    likes: 142,
    comments: [
      createComment("c1", "Lucas R.", "LR", "Incrível saber disso! Estou no dia 3 e já sinto diferença na respiração.", 12, "1h atrás", [
        createComment("c1r1", "Ana P.", "AP", "@Lucas R. Sim! No dia 3 a nicotina já foi eliminada do corpo. Você está indo super bem!", 8, "45min atrás", [
          createComment("c1r1r1", "Lucas R.", "LR", "@Ana P. Obrigado pelo apoio! Isso me motiva demais 🙏", 5, "30min atrás"),
        ], ["Ana P."]),
      ], []),
      createComment("c2", "Carlos M.", "CM", "Compartilhei com minha mãe que está tentando parar. Obrigado pela informação!", 6, "2h atrás"),
    ],
    needsSupport: false,
    timestamp: "3h atrás",
    category: "motivacao",
    hashtags: ["#SaúdeReal", "#CessaçãoTabagismo", "#OMS"],
    bookmarked: false,
    views: 1284,
    shared: 45,
  },
  {
    id: "2",
    author: "João P.",
    avatar: "JP",
    avatarColor: "bg-blue-500",
    daysFree: 3,
    text: "Hoje estou com muita vontade de fumar depois do café. A fissura é forte demais. Alguém tem alguma técnica que funcione? Já tentei a respiração 4-7-8 mas não está ajudando muito 😟",
    likes: 67,
    comments: [
      createComment("c3", "Fernanda S.", "FS", "João, tenta a técnica dos 5 sentidos: identifique 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira e 1 que saboreia. É uma técnica de grounding da TCC (Terapia Cognitivo-Comportamental) que funciona muito para craving.", 24, "1h atrás", [
        createComment("c3r1", "João P.", "JP", "@Fernanda S. Vou tentar agora! Obrigado 🙏", 4, "50min atrás", [], ["Fernanda S."]),
        createComment("c3r2", "Dr. Pedro L.", "DL", "@João P. Ótima sugestão da Fernanda! Complementando: segundo as diretrizes do INCA, a fissura dura em média 3-5 minutos. Se conseguir resistir esse tempo, ela passa. Beba água gelada também.", 18, "40min atrás", [], ["João P."]),
      ]),
      createComment("c4", "Maria C.", "MC", "Eu substitui o café por chá verde na primeira semana e ajudou muito. O café é um dos maiores gatilhos segundo estudos.", 9, "3h atrás"),
    ],
    needsSupport: true,
    timestamp: "4h atrás",
    category: "suporte",
    hashtags: ["#Craving", "#PrecisoDeApoio", "#Café"],
    bookmarked: false,
    views: 892,
    shared: 12,
  },
  {
    id: "3",
    author: "Ana R.",
    avatar: "AR",
    avatarColor: "bg-amber-500",
    daysFree: 30,
    text: "🏆 30 DIAS! NÃO ACREDITO! Economizei R$450, minha capacidade pulmonar melhorou, meu paladar voltou e estou correndo 3km sem parar. Para quem está no começo: segundo o CDC, após 1 mês de cessação, os cílios das vias aéreas começam a se regenerar, melhorando a limpeza natural dos pulmões. Não desistam!",
    likes: 234,
    comments: [
      createComment("c5", "Roberto G.", "RG", "Que inspiração! Estou no dia 12 e posts como o seu me dão forças para continuar.", 15, "2h atrás", [
        createComment("c5r1", "Ana R.", "AR", "@Roberto G. Dia 12 é INCRÍVEL! O período mais difícil (dias 3-10) você já passou! Agora é manter a vigilância. Estou torcendo por você! 🌟", 22, "1h atrás", [], ["Roberto G."]),
      ]),
    ],
    needsSupport: false,
    timestamp: "6h atrás",
    category: "vitoria",
    hashtags: ["#30Dias", "#Vitória", "#PulmõesLimpos"],
    bookmarked: false,
    views: 2156,
    shared: 89,
  },
  {
    id: "4",
    author: "Carlos M.",
    avatar: "CM",
    avatarColor: "bg-violet-500",
    daysFree: 7,
    text: "Uma semana sem fumar! O exercício de respiração diafragmática que o Coach IA sugeriu mudou minha vida. Faço 3x ao dia (manhã, após almoço e antes de dormir). Segundo as diretrizes do Ministério da Saúde, a terapia cognitivo-comportamental combinada com técnicas de relaxamento multiplica as chances de sucesso em até 3x.",
    likes: 98,
    comments: [
      createComment("c6", "Patrícia V.", "PV", "A respiração diafragmática é evidência classe A nas diretrizes do INCA! Ótima escolha! Eu também uso e funciona demais nos momentos de craving.", 11, "5h atrás"),
    ],
    needsSupport: false,
    timestamp: "8h atrás",
    category: "testemunho",
    hashtags: ["#7Dias", "#Respiração", "#TCC"],
    bookmarked: false,
    views: 756,
    shared: 23,
  },
  {
    id: "5",
    author: "Lucia F.",
    avatar: "LF",
    avatarColor: "bg-rose-500",
    daysFree: 0,
    text: "Tive uma recaída ontem depois de 14 dias sem fumar. Estou me sentindo muito mal e culpada. Será que eu consigo de novo? 😢",
    likes: 89,
    comments: [
      createComment("c7", "Dr. Pedro L.", "DL", "Lucia, recaída NÃO é fracasso! Segundo a OMS, a maioria dos fumantes precisa de 5-7 tentativas antes de parar definitivamente. Cada tentativa é um aprendizado. O mais importante agora é recomeçar HOJE, não semana que vem. Você conseguiu 14 dias — isso prova que você é capaz! 💚", 45, "1h atrás", [
        createComment("c7r1", "Lucia F.", "LF", "@Dr. Pedro L. Muito obrigada... vou recomeçar agora. Já zerei o meu contador.", 28, "30min atrás", [], ["Dr. Pedro L."]),
        createComment("c7r2", "Maria S.", "MS", "@Lucia F. Eu tive 3 recaídas antes de conseguir meus 60 dias atuais. Cada vez ficou mais fácil. Você vai conseguir! Estamos juntos 🤝", 19, "20min atrás", [], ["Lucia F."]),
      ]),
    ],
    needsSupport: true,
    timestamp: "2h atrás",
    category: "suporte",
    hashtags: ["#Recaída", "#Recomeço", "#NãoDesista"],
    bookmarked: false,
    views: 1567,
    shared: 34,
  },
];

const CATEGORY_MAP = {
  vitoria: { label: "Vitória", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  duvida: { label: "Dúvida", icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  suporte: { label: "Precisa de Apoio", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  motivacao: { label: "Motivação", icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  testemunho: { label: "Testemunho", icon: Star, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20" },
};

// ========== NESTED COMMENT COMPONENT ==========
const NestedComment = ({
  comment,
  depth = 0,
  onReply,
  onLike,
  likedComments,
}: {
  comment: Comment;
  depth?: number;
  onReply: (commentId: string, author: string) => void;
  onLike: (commentId: string) => void;
  likedComments: Set<string>;
}) => {
  const [showReplies, setShowReplies] = useState(depth < 2);
  const maxDepth = 4;
  const indentPx = Math.min(depth * 20, 60);

  const highlightMentions = (text: string) => {
    const parts = text.split(/(@[\w\s.]+?)(?=\s|$|,|\.)/g);
    return parts.map((part, i) =>
      part.startsWith("@") ? (
        <span key={i} className="text-primary font-semibold">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div style={{ marginLeft: `${indentPx}px` }} className="relative">
      {depth > 0 && (
        <div
          className="absolute left-[-12px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-border to-transparent"
          style={{ height: "100%" }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.05 }}
        className="py-3"
      >
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0 mt-0.5">
            {comment.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-foreground">{comment.author}</span>
              <span className="text-[10px] text-muted-foreground">· {comment.timestamp}</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">
              {highlightMentions(comment.text)}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onLike(comment.id)}
                className={`flex items-center gap-1 text-[11px] transition-colors ${
                  likedComments.has(comment.id)
                    ? "text-rose-500"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Heart className={`w-3 h-3 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
              </button>
              {depth < maxDepth && (
                <button
                  onClick={() => onReply(comment.id, comment.author)}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                >
                  <Reply className="w-3 h-3" />
                  Responder
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {comment.replies.length > 0 && (
        <>
          {!showReplies && (
            <button
              onClick={() => setShowReplies(true)}
              className="flex items-center gap-1.5 text-[11px] text-primary font-medium ml-10 mb-2 hover:underline"
            >
              <ChevronDown className="w-3 h-3" />
              Ver {comment.replies.length} resposta{comment.replies.length > 1 ? "s" : ""}
            </button>
          )}
          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {comment.replies.map((reply) => (
                  <NestedComment
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    onReply={onReply}
                    onLike={onLike}
                    likedComments={likedComments}
                  />
                ))}
                {showReplies && comment.replies.length > 0 && (
                  <button
                    onClick={() => setShowReplies(false)}
                    className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium ml-10 mb-1 hover:text-foreground"
                  >
                    <ChevronUp className="w-3 h-3" />
                    Ocultar respostas
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

// ========== MAIN COMPONENT ==========
const Comunidade = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [newPostCategory, setNewPostCategory] = useState<Post["category"]>("motivacao");
  const [showRules, setShowRules] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [replyTarget, setReplyTarget] = useState<{ postId: string; commentId: string; author: string } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [reportModal, setReportModal] = useState<string | null>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);

  // ===== HANDLERS =====
  const handleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setPosts((p) => p.map((post) => (post.id === id ? { ...post, likes: post.likes - 1 } : post)));
      } else {
        next.add(id);
        setPosts((p) => p.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post)));
      }
      return next;
    });
  };

  const handleCommentLike = (commentId: string) => {
    setLikedComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const handleBookmark = (id: string) => {
    setBookmarkedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const hashtags = newPost.match(/#[\wÀ-ú]+/g) || [];
    const post: Post = {
      id: Date.now().toString(),
      author: "Você",
      avatar: "VC",
      avatarColor: "bg-primary",
      daysFree: 0,
      text: newPost,
      likes: 0,
      comments: [],
      needsSupport: newPostCategory === "suporte",
      timestamp: "agora",
      category: newPostCategory,
      hashtags,
      bookmarked: false,
      views: 0,
      shared: 0,
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleReplyToComment = (postId: string, commentId: string, author: string) => {
    setReplyTarget({ postId, commentId, author });
    setReplyText(`@${author} `);
    setTimeout(() => replyInputRef.current?.focus(), 100);
  };

  const addReplyToComment = (comments: Comment[], targetId: string, newReply: Comment): Comment[] => {
    return comments.map((c) => {
      if (c.id === targetId) {
        return { ...c, replies: [...c.replies, newReply] };
      }
      if (c.replies.length > 0) {
        return { ...c, replies: addReplyToComment(c.replies, targetId, newReply) };
      }
      return c;
    });
  };

  const submitReply = () => {
    if (!replyTarget || !replyText.trim()) return;
    const mentions = replyText.match(/@[\w\s.]+/g)?.map((m) => m.slice(1).trim()) || [];
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      author: "Você",
      avatar: "VC",
      text: replyText,
      likes: 0,
      timestamp: "agora",
      replies: [],
      mentions,
    };
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === replyTarget.postId) {
          return { ...post, comments: addReplyToComment(post.comments, replyTarget.commentId, newReply) };
        }
        return post;
      })
    );
    setReplyTarget(null);
    setReplyText("");
  };

  const addTopLevelComment = (postId: string) => {
    const text = commentTexts[postId];
    if (!text?.trim()) return;
    const mentions = text.match(/@[\w\s.]+/g)?.map((m) => m.slice(1).trim()) || [];
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: "Você",
      avatar: "VC",
      text,
      likes: 0,
      timestamp: "agora",
      replies: [],
      mentions,
    };
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post))
    );
    setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
  };

  // ===== FILTERING & SORTING =====
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.text.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.hashtags.some((h) => h.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === "popular") {
      result.sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const countAllComments = (comments: Comment[]): number => {
    return comments.reduce((sum, c) => sum + 1 + countAllComments(c.replies), 0);
  };

  // ===== LEADERBOARD =====
  const leaderboard = useMemo(() => {
    const authorMap = new Map<string, { posts: number; likes: number; days: number }>();
    posts.forEach((p) => {
      const current = authorMap.get(p.author) || { posts: 0, likes: 0, days: 0 };
      authorMap.set(p.author, {
        posts: current.posts + 1,
        likes: current.likes + p.likes,
        days: Math.max(current.days, p.daysFree),
      });
    });
    return Array.from(authorMap.entries())
      .map(([name, stats]) => ({ name, ...stats, score: stats.likes + stats.posts * 10 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [posts]);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl pb-20">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Comunidade</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="p-2 rounded-xl bg-card border border-border hover:bg-accent transition-colors"
                title="Ranking"
              >
                <Award className="w-4 h-4 text-amber-500" />
              </button>
              <button
                onClick={() => setShowRules(!showRules)}
                className="p-2 rounded-xl bg-card border border-border hover:bg-accent transition-colors"
                title="Regras"
              >
                <Shield className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Apoie e seja apoiado. Juntos somos mais fortes. 💚
          </p>
        </motion.div>

        {/* COMMUNITY RULES */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Regras da Comunidade
                  </h3>
                  <button onClick={() => setShowRules(false)}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <ul className="space-y-2">
                  {COMMUNITY_RULES.map((rule, i) => (
                    <li key={i} className="text-xs text-muted-foreground leading-relaxed">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEADERBOARD */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="rounded-2xl bg-card border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Ranking de Engajamento
                  </h3>
                  <button onClick={() => setShowLeaderboard(false)}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="space-y-3">
                  {leaderboard.map((user, i) => (
                    <div key={user.name} className="flex items-center gap-3">
                      <span className={`text-sm font-bold w-6 text-center ${
                        i === 0 ? "text-amber-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-muted-foreground"
                      }`}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}º`}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {user.days} dias livre · {user.likes} 💚
                        </p>
                      </div>
                      <span className="text-xs font-bold text-primary">{user.score} pts</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-4">
                  Ranking baseado em engajamento positivo. Identidades anônimas protegidas.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEARCH & FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-4"
        >
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar posts, #hashtags, usuários..."
                className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-colors ${
                showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-accent"
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                      selectedCategory === "all" ? "bg-foreground text-background" : "bg-card border border-border hover:bg-accent"
                    }`}
                  >
                    Todos
                  </button>
                  {Object.entries(CATEGORY_MAP).map(([key, cat]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1 transition-colors ${
                        selectedCategory === key
                          ? `${cat.bg} ${cat.color} ${cat.border} border`
                          : "bg-card border border-border hover:bg-accent"
                      }`}
                    >
                      <cat.icon className="w-3 h-3" />
                      {cat.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setSortBy("recent")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                      sortBy === "recent" ? "bg-foreground text-background" : "bg-card border border-border"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    Recentes
                  </button>
                  <button
                    onClick={() => setSortBy("popular")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                      sortBy === "popular" ? "bg-foreground text-background" : "bg-card border border-border"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    Popular
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* MOTIVATIONAL TIP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-4 mb-6"
        >
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            {MOTIVATIONAL_TIPS[Math.floor(Date.now() / 86400000) % MOTIVATIONAL_TIPS.length]}
          </p>
        </motion.div>

        {/* NEW POST COMPOSER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card border border-border p-5 mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
              VC
            </div>
            <span className="text-xs text-muted-foreground">Compartilhe sua jornada...</span>
          </div>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Como você está se sentindo hoje? Use #hashtags para categorizar."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[80px] leading-relaxed"
          />

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value as Post["category"])}
                className="text-[11px] bg-card border border-border rounded-lg px-2 py-1.5 outline-none focus:border-primary/50"
              >
                <option value="motivacao">💚 Motivação</option>
                <option value="vitoria">🏆 Vitória</option>
                <option value="duvida">❓ Dúvida</option>
                <option value="suporte">🆘 Preciso de apoio</option>
                <option value="testemunho">⭐ Testemunho</option>
              </select>
              <button className="p-1.5 rounded-lg hover:bg-accent transition-colors" title="Adicionar hashtag">
                <Hash className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-accent transition-colors" title="Mencionar usuário">
                <AtSign className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <Button size="sm" className="rounded-full" onClick={handlePost} disabled={!newPost.trim()}>
              <Send className="w-4 h-4 mr-1" /> Publicar
            </Button>
          </div>
        </motion.div>

        {/* FEED */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, i) => {
              const catInfo = CATEGORY_MAP[post.category];
              const totalComments = countAllComments(post.comments);

              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.03 }}
                  className={`rounded-2xl bg-card border p-5 transition-shadow hover:shadow-sm ${
                    post.needsSupport ? "border-rose-500/20" : "border-border"
                  }`}
                >
                  {/* Category badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${catInfo.bg} ${catInfo.color}`}>
                      <catInfo.icon className="w-3 h-3" />
                      {catInfo.label}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        {post.views.toLocaleString()}
                      </span>
                      <button
                        onClick={() => setReportModal(post.id)}
                        className="p-1 rounded-md hover:bg-accent transition-colors"
                        title="Reportar"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* Author info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-full ${post.avatarColor} flex items-center justify-center text-[11px] font-bold text-white`}>
                      {post.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{post.author}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {post.daysFree > 0 ? `${post.daysFree} dias sem fumar` : "Começando agora"} · {post.timestamp}
                      </p>
                    </div>
                  </div>

                  {/* Post content */}
                  <p className="text-sm text-foreground leading-relaxed mb-3 whitespace-pre-line">{post.text}</p>

                  {/* Hashtags */}
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-primary font-medium bg-primary/5 px-2 py-0.5 rounded-full cursor-pointer hover:bg-primary/10 transition-colors"
                          onClick={() => setSearchQuery(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 border-t border-border pt-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        likedPosts.has(post.id)
                          ? "text-rose-500 bg-rose-500/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                      {post.likes}
                    </button>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground">
                      <MessageCircle className="w-4 h-4" />
                      {totalComments}
                    </span>
                    <button
                      onClick={() => setShowShareModal(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      {post.shared}
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        bookmarkedPosts.has(post.id) ? "text-amber-500" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarkedPosts.has(post.id) ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Nested comments */}
                  {post.comments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-3">
                        Comentários ({totalComments})
                      </p>
                      {post.comments.map((comment) => (
                        <NestedComment
                          key={comment.id}
                          comment={comment}
                          onReply={(commentId, author) => handleReplyToComment(post.id, commentId, author)}
                          onLike={handleCommentLike}
                          likedComments={likedComments}
                        />
                      ))}
                    </div>
                  )}

                  {/* Reply to comment input */}
                  <AnimatePresence>
                    {replyTarget?.postId === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-primary/10"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Reply className="w-3 h-3 text-primary" />
                          <span className="text-[10px] text-primary font-medium">
                            Respondendo a {replyTarget.author}
                          </span>
                          <button onClick={() => setReplyTarget(null)}>
                            <X className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <input
                            ref={replyInputRef}
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && submitReply()}
                            placeholder="Escreva sua resposta..."
                            className="flex-1 bg-accent/50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50"
                          />
                          <Button size="sm" className="rounded-xl" onClick={submitReply} disabled={!replyText.trim()}>
                            <Send className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Add top-level comment */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[8px] font-bold shrink-0 mt-1">
                        VC
                      </div>
                      <input
                        type="text"
                        value={commentTexts[post.id] || ""}
                        onChange={(e) => setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && addTopLevelComment(post.id)}
                        placeholder="Adicione um comentário de apoio..."
                        className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none border-b border-transparent focus:border-primary/30 pb-1 transition-colors"
                      />
                      <button
                        onClick={() => addTopLevelComment(post.id)}
                        disabled={!commentTexts[post.id]?.trim()}
                        className="text-primary disabled:text-muted-foreground transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">Nenhum post encontrado.</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Tente outro filtro ou busca.</p>
            </motion.div>
          )}
        </div>

        {/* SHARE MODAL */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => setShowShareModal(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-card rounded-3xl border border-border p-6 max-w-sm w-full shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">Compartilhar Post</h3>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {["WhatsApp", "Twitter", "Copiar Link"].map((option) => (
                    <button
                      key={option}
                      className="p-3 rounded-xl border border-border hover:bg-accent transition-colors text-center"
                      onClick={() => setShowShareModal(null)}
                    >
                      <Share2 className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground font-medium">{option}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowShareModal(null)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center py-2"
                >
                  Cancelar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* REPORT MODAL */}
        <AnimatePresence>
          {reportModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => setReportModal(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-card rounded-3xl border border-border p-6 max-w-sm w-full shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Flag className="w-5 h-5 text-destructive" />
                  <h3 className="text-lg font-semibold">Reportar conteúdo</h3>
                </div>
                <div className="space-y-2 mb-6">
                  {["Conteúdo inapropriado", "Promoção de tabaco", "Informação médica incorreta", "Spam", "Outro"].map((reason) => (
                    <button
                      key={reason}
                      className="w-full text-left p-3 rounded-xl border border-border hover:bg-accent transition-colors text-sm"
                      onClick={() => {
                        setReportModal(null);
                        // In production, this would send a report to the moderation queue
                      }}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setReportModal(null)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center py-2"
                >
                  Cancelar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MEDICAL DISCLAIMER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 rounded-2xl bg-muted/50 border border-border p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            ⚕️ <strong>Aviso Legal:</strong> Este app e sua comunidade não substituem consulta médica.
            Consulte seu médico antes de qualquer mudança no tratamento. Em caso de emergência, ligue 192 (SAMU) ou 188 (CVV).
            Conteúdo baseado em diretrizes da OMS, CDC e INCA/Ministério da Saúde do Brasil.
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Comunidade;
