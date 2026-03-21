import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Heart, Share2, Bookmark, Send, 
  Search, Filter, Plus, Flag, MoreHorizontal, 
  CheckCircle2, ShieldCheck, TrendingUp, Hash,
  ArrowRight, Info, AlertCircle, X, ChevronDown, ChevronUp,
  Award, Trophy, MessageCircle, Sparkles, Star, Shield
} from "lucide-react";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { communityService } from "@/lib/services";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// Types derived from database
interface PostWithData {
  id: string;
  content: string;
  created_at: string;
  category: string;
  hashtags: string[];
  views_count: number;
  is_medical: boolean;
  user_id: string;
  profiles: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
  post_likes: { user_id: string }[];
  comments: any[];
}

const CATEGORIES = [
  { id: "all", label: "Tudo", icon: Hash, color: "text-muted-foreground", bg: "bg-muted/10", border: "border-muted/20" },
  { id: "motivacao", label: "Motivação", icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "vitoria", label: "Vitória", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: "suporte", label: "Apoio", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { id: "ciencia", label: "Ciência", icon: ShieldCheck, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  { id: "recaida", label: "Recaída", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-600/10", border: "border-rose-600/20" },
];

const COMMUNITY_RULES = [
  "🩺 Todo conteúdo deve ser respeitoso e focado em apoio mútuo.",
  "🚫 Proibida qualquer promoção, venda ou incentivo ao uso de tabaco.",
  "⚕️ Não forneça conselhos médicos específicos — sugira sempre a consulta profissional.",
  "🤝 Acolha todos, independentemente de recaídas — cada tentativa fortalece a próxima.",
];

const Comunidade = () => {
  const { user, profile } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<PostWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("motivacao");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showRules, setShowRules] = useState(false);
  
  // 1. Fetch Posts and Bookmarks
  const loadData = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await communityService.getPosts({
        category: activeCategory === "all" ? undefined : activeCategory,
        search: searchQuery || undefined
      });
      setPosts(fetchedPosts as any);

      if (user) {
        const userBookmarks = await communityService.getBookmarks(user.id);
        setBookmarks(userBookmarks);
      }
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
      // toast.error("Não foi possível carregar o feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // 2. Realtime Subscription
    const subscription = communityService.subscribeToNewPosts(() => {
      loadData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [activeCategory, searchQuery]);

  // 3. Actions
  const handleCreatePost = async () => {
    if (!user) {
      toast.error("Faça login para postar.");
      return;
    }
    if (!newPostContent.trim()) return;

    try {
      setIsPosting(true);
      const hashtags = newPostContent.match(/#[\wÀ-ú]+/g) || [];
      await communityService.createPost(
        user.id, 
        newPostContent, 
        selectedCategory, 
        hashtags
      );
      setNewPostContent("");
      toast.success("Post publicado!");
      loadData();
    } catch (error) {
      toast.error("Erro ao publicar.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!user) {
      toast.error("Faça login para curtir.");
      return;
    }
    try {
      const liked = await communityService.toggleLike(user.id, postId);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const currentLikes = p.post_likes || [];
          return {
            ...p,
            post_likes: liked 
              ? [...currentLikes, { user_id: user.id }]
              : currentLikes.filter(l => l.user_id !== user.id)
          };
        }
        return p;
      }));
    } catch (error) {
      toast.error("Erro ao curtir.");
    }
  };

  const handleToggleBookmark = async (postId: string) => {
    if (!user) {
      toast.error("Faça login para salvar.");
      return;
    }
    try {
      const saved = await communityService.toggleBookmark(user.id, postId);
      setBookmarks(prev => 
        saved ? [...prev, postId] : prev.filter(id => id !== postId)
      );
      toast.success(saved ? "Salvo nos itens guardados" : "Removido dos salvos");
    } catch (error) {
      toast.error("Erro ao salvar post.");
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 max-w-4xl py-12 animate-fade-in pb-24">
        {/* HEADER SECTION */}
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-3 rounded-3xl bg-primary/10 mb-6"
          >
            <ShieldCheck className="w-8 h-8 text-primary" />
          </motion.div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-5xl font-bold tracking-tighter">Comunidade</h1>
            <button
               onClick={() => setShowRules(!showRules)}
               className="p-2 rounded-xl bg-card border border-border hover:bg-accent transition-colors"
               title="Regras"
            >
               <Shield className="w-5 h-5 text-primary" />
            </button>
          </div>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Apoio mútuo baseado em evidências. Você não está sozinho nesta jornada de liberdade.
          </p>
        </header>

        {/* RULES COLLAPSIBLE */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="rounded-3xl bg-primary/5 border border-primary/10 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Regras Éticas da Startup
                  </h3>
                  <button onClick={() => setShowRules(false)}>
                    <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {COMMUNITY_RULES.map((rule, i) => (
                    <div key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed p-3 bg-white/50 rounded-2xl dark:bg-black/20">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* MAIN CONTENT */}
          <div className="space-y-8">
            
            {/* SEARCH & FILTERS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input 
                  type="text" 
                  placeholder="Buscar discussões, #hashtags ou usuários..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-6 bg-muted/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base"
                />
              </div>
            </div>

            {/* CATEGORY TABS */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all text-sm font-bold ${
                    activeCategory === cat.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* POST COMPOSER */}
            <AppleCard className="p-6 border-2 border-primary/10 shadow-soft overflow-hidden">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  <span className="font-bold text-white text-xl">
                    {profile?.display_name ? profile.display_name[0].toUpperCase() : "U"}
                  </span>
                </div>
                <div className="flex-1 space-y-4">
                  <textarea 
                    placeholder="Como você está hoje? Compartilhe uma vitória ou peça apoio..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none text-lg min-h-[100px] py-1 placeholder:text-muted-foreground/50"
                  />
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex gap-2 overflow-x-auto">
                       {CATEGORIES.filter(c => c.id !== "all").map(c => (
                         <button
                           key={c.id}
                           onClick={() => setSelectedCategory(c.id)}
                           className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                             selectedCategory === c.id 
                             ? `${c.bg} ${c.color} ${c.border}` 
                             : "bg-transparent text-muted-foreground border-transparent hover:bg-muted"
                           }`}
                         >
                           {c.label}
                         </button>
                       ))}
                    </div>
                    <Button 
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim() || isPosting}
                      className="rounded-2xl px-6 font-bold shadow-lg shadow-primary/20 h-10"
                    >
                      {isPosting ? "..." : "Publicar"}
                      <Send className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </AppleCard>

            {/* FEED */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full mx-auto"
                  />
                  <p className="mt-4 text-muted-foreground font-medium">Sincronizando com a rede...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                  <Info className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">Nenhum post encontrado nesta categoria.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {posts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      currentUser={user}
                      isBookmarked={bookmarks.includes(post.id)}
                      onLike={() => handleToggleLike(post.id)}
                      onBookmark={() => handleToggleBookmark(post.id)}
                      refreshData={loadData}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6 hidden lg:block">
            <AppleCard className="p-6 bg-foreground text-background shadow-elevated">
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">Meta Diária</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-70">Apoios Dados</span>
                  <span className="font-bold">12/20</span>
                </div>
                <div className="w-full bg-background/20 rounded-full h-2">
                  <div className="bg-primary w-[60%] h-full rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                </div>
                <p className="text-[10px] opacity-60 italic">
                  "O apoio entre iguais aumenta em 40% a taxa de sucesso" - CDC
                </p>
              </div>
            </AppleCard>

            <AppleCard className="p-6 shadow-soft">
              <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Ranking Semanal
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Dr. Pedro L.", points: 1250, badge: "Especialista" },
                  { name: "Maria Clara", points: 890, badge: "Mentor" },
                  { name: "Ricardo B.", points: 720, badge: "Motivador" }
                ].map((member, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold leading-none mb-1">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground">{member.badge}</p>
                    </div>
                    <div className="text-[10px] font-bold text-primary">
                      {member.points}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-xs font-bold group h-8 rounded-xl">
                Ver Ranking
                <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
              </Button>
            </AppleCard>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
};

// CHILD COMPONENTS
const PostCard = ({ post, currentUser, isBookmarked, onLike, onBookmark, refreshData }: any) => {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const likedByMe = post.post_likes?.some((l: any) => l.user_id === currentUser?.id);

  const handleAddComment = async (parentId?: string) => {
    if (!currentUser) {
      toast.error("Faça login para comentar.");
      return;
    }
    if (!replyContent.trim()) return;

    try {
      await communityService.addComment(
        currentUser.id,
        post.id,
        replyContent,
        parentId
      );
      setReplyContent("");
      // setShowReply(false);
      toast.success("Comentário adicionado!");
      refreshData();
    } catch (error) {
      toast.error("Erro ao comentar.");
    }
  };

  const onLikeClick = async () => {
    setIsLiking(true);
    await onLike();
    setTimeout(() => setIsLiking(false), 300);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <AppleCard className="p-6 md:p-8 shadow-soft hover:shadow-md transition-all duration-500 border border-transparent hover:border-primary/5 group">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-black/10 transition-transform group-hover:scale-105 ${
              post.is_medical ? "bg-emerald-500" : "bg-primary"
            }`}>
              {post.profiles?.display_name ? post.profiles.display_name[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold tracking-tight">{post.profiles?.display_name || "Usuário"}</h4>
                {post.is_medical && (
                  <span className="flex items-center gap-1 text-[9px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-emerald-500/20">
                    <ShieldCheck className="w-2.5 h-2.5" /> Médico Verificado
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-xl border ${
              post.category === 'recaida' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
              post.category === 'vitoria' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
              post.category === 'ciencia' ? 'bg-primary/10 text-primary border-primary/20' :
              'bg-muted/50 text-muted-foreground border-muted'
            }`}>
              {CATEGORIES.find(c => c.id === post.category)?.label || post.category}
            </span>
            <button className="p-2 hover:bg-muted rounded-xl transition-colors">
              <MoreHorizontal className="w-5 h-5 text-muted-foreground/50" />
            </button>
          </div>
        </header>

        <div className="space-y-4 mb-8">
          <p className="text-lg leading-relaxed font-medium tracking-tight text-foreground/90 whitespace-pre-wrap">
            {post.content}
          </p>
          <div className="flex flex-wrap gap-2">
            {post.hashtags?.map((tag: string) => (
              <span key={tag} className="text-xs font-bold text-primary hover:text-primary/70 cursor-pointer transition-all bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <footer className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-1 sm:gap-4">
            <button 
              onClick={onLikeClick}
              disabled={isLiking}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all font-bold text-sm ${
                likedByMe ? "text-rose-500 bg-rose-500/10 shadow-inner" : "text-muted-foreground hover:bg-muted"
              } ${isLiking ? "scale-95" : ""}`}
            >
              <Heart className={`w-5 h-5 ${likedByMe ? "fill-current" : ""}`} />
              {post.post_likes?.length || 0}
            </button>
            <button 
              onClick={() => setShowReply(!showReply)}
              className={`flex items-center gap-2 px-4 py-2.5 transition-all font-bold text-sm rounded-2xl ${
                showReply ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              {post.comments?.length || 0}
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-muted-foreground hover:bg-muted rounded-2xl transition-all font-bold text-sm">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={onBookmark}
            className={`p-2.5 transition-all rounded-2xl ${isBookmarked ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"}`}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
          </button>
        </footer>

        {/* COMMENTS SECTION */}
        <AnimatePresence>
          {(showReply || post.comments?.length > 0) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 pt-6 border-t border-border/50 overflow-hidden"
            >
              {/* REPLY INPUT */}
              {currentUser && (
                <div className="flex gap-3 mb-8 bg-muted/30 p-4 rounded-2xl border border-muted">
                   <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 font-bold text-white shadow-md">
                    {profile?.display_name ? profile.display_name[0].toUpperCase() : "U"}
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      placeholder="Adicione um comentário de apoio..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                      className="w-full h-11 pl-4 pr-12 bg-white/50 dark:bg-black/20 border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                    />
                    <button 
                      onClick={() => handleAddComment()}
                      className="absolute right-1.5 top-1.5 p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* NESTED COMMENTS */}
              <div className="space-y-6">
                {post.comments?.filter((c: any) => !c.parent_id).map((comment: any) => (
                  <CommentItem 
                    key={comment.id} 
                    comment={comment} 
                    allComments={post.comments} 
                    currentUser={currentUser}
                    postId={post.id}
                    refreshData={refreshData}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AppleCard>
    </motion.div>
  );
};

const CommentItem = ({ comment, allComments, currentUser, postId, refreshData, depth = 0 }: any) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const replies = allComments.filter((c: any) => c.parent_id === comment.id);
  
  const likedByMe = comment.comment_likes?.some((l: any) => l.user_id === currentUser?.id);

  const handleReply = async () => {
    if (!currentUser) return;
    if (!replyContent.trim()) return;
    try {
      await communityService.addComment(
        currentUser.id,
        postId,
        replyContent,
        comment.id
      );
      setReplyContent("");
      setShowReplyInput(false);
      toast.success("Resposta enviada!");
      refreshData();
    } catch (error) {
      toast.error("Erro ao responder.");
    }
  };

  const handleToggleLike = async () => {
    if (!currentUser) {
      toast.error("Faça login para curtir.");
      return;
    }
    try {
      await communityService.toggleCommentLike(currentUser.id, comment.id);
      refreshData();
    } catch (error) {
      toast.error("Erro ao curtir comentário.");
    }
  };

  return (
    <div className={`space-y-4 ${depth > 0 ? "ml-6 pl-4 border-l border-border/50" : ""}`}>
      <div className="flex gap-4 group">
        <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center shrink-0 font-bold text-sm shadow-sm group-hover:bg-primary/5 transition-colors">
           {comment.profiles?.display_name ? comment.profiles.display_name[0].toUpperCase() : "U"}
        </div>
        <div className="flex-1">
          <div className="bg-muted/20 dark:bg-muted/10 rounded-2xl p-4 inline-block min-w-[140px] border border-transparent group-hover:border-primary/5 transition-all">
            <div className="flex items-center justify-between gap-4 mb-2">
               <span className="text-xs font-bold leading-none">{comment.profiles?.display_name || "Usuário"}</span>
               <span className="text-[10px] text-muted-foreground font-medium">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}</span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-foreground/80">{comment.content}</p>
          </div>
          <div className="flex items-center gap-6 mt-2 ml-3">
            <button 
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors ${likedByMe ? "text-rose-500" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Heart className={`w-3.5 h-3.5 ${likedByMe ? "fill-current" : ""}`} />
              {comment.comment_likes?.length || 0}
            </button>
            <button 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-[11px] text-muted-foreground hover:text-primary font-bold transition-colors"
            >
              Responder
            </button>
            <button className="text-[10px] text-muted-foreground hover:text-rose-500 font-bold transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1">
              <Flag className="w-3 h-3" /> Denunciar
            </button>
          </div>

          <AnimatePresence>
            {showReplyInput && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-4 flex gap-3 animate-fade-in bg-white dark:bg-black/20 p-3 rounded-2xl border border-border shadow-sm"
              >
                <input 
                  autoFocus
                  placeholder={`Respondendo a ${comment.profiles?.display_name}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="flex-1 h-9 bg-muted/20 border-none rounded-xl px-4 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/10"
                  onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                />
                <button 
                  onClick={handleReply}
                  className="px-4 bg-primary text-primary-foreground text-[11px] font-bold rounded-xl shadow-lg shadow-primary/20"
                >
                  Enviar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {replies.length > 0 && (
        <div className="space-y-4">
          {replies.map((reply: any) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              allComments={allComments} 
              currentUser={currentUser}
              postId={postId}
              refreshData={refreshData}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comunidade;
