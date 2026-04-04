import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { User } from "@supabase/supabase-js";
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
interface Profile {
  id: string;
  display_name: string;
  avatar_url: string;
}

interface Like {
  user_id: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id: string | null;
  user_id: string;
  profiles: Profile;
  comment_likes: Like[];
}

interface PostWithData {
  id: string;
  content: string;
  created_at: string;
  category: string;
  hashtags: string[];
  views_count: number;
  is_medical: boolean;
  user_id: string;
  profiles: Profile;
  post_likes: Like[];
  comments: Comment[];
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
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedPosts = await communityService.getPosts({
        category: activeCategory === "all" ? undefined : activeCategory,
        search: searchQuery || undefined
      });
      setPosts(fetchedPosts as unknown as PostWithData[]);

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
  }, [user, activeCategory, searchQuery]);

  useEffect(() => {
    loadData();

    // 2. Realtime Subscription
    const subscription = communityService.subscribeToNewPosts(() => {
      loadData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadData]);

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
      <div className="container mx-auto px-4 max-w-4xl py-12 animate-fade-in pb-24 relative z-10">
        {/* HEADER SECTION */}
        <header className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="inline-block p-5 rounded-[2rem] bg-primary/10 mb-8 border border-primary/20 shadow-glow"
          >
            <ShieldCheck size={40} className="text-primary drop-shadow-glow" />
          </motion.div>
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="flex items-center gap-6">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white italic leading-none">
                Global <span className="text-primary drop-shadow-glow">Network.</span>
              </h1>
              <button
                 onClick={() => setShowRules(!showRules)}
                 className="p-3 rounded-2xl bg-card/40 border border-border/40 hover:bg-card/60 transition-all hover:scale-110 shadow-lg backdrop-blur-md"
                 title="Protocolos de Convivência"
              >
                 <Shield size={24} className="text-primary" />
              </button>
            </div>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.5em] leading-relaxed italic mt-2">
              Sincronização de Sinais Neurais • Protocolo de Apoio Mútuo v4.0
            </p>
          </div>
        </header>

        {/* RULES COLLAPSIBLE */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="overflow-hidden mb-12"
            >
              <div className="rounded-[2.5rem] bg-card/40 backdrop-blur-3xl border border-primary/20 p-10 shadow-elevated relative group">
                <div className="absolute inset-0 bg-primary/5 rotate-45 group-hover:bg-primary/10 transition-colors pointer-events-none" />
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <h3 className="text-2xl font-black text-white italic tracking-tighter flex items-center gap-4 leading-none">
                    <Shield className="w-8 h-8 text-primary drop-shadow-glow" fill="currentColor" />
                    Protocolos de Convivência
                  </h3>
                  <button onClick={() => setShowRules(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <X className="w-6 h-6 text-muted-foreground hover:text-white" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                  {COMMUNITY_RULES.map((rule, i) => (
                    <div key={i} className="flex gap-4 text-sm text-muted-foreground leading-relaxed p-5 bg-black/40 rounded-[1.5rem] border border-border/20 backdrop-blur-md group/rule hover:border-primary/40 transition-all">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0 shadow-glow group-hover/rule:scale-125 transition-transform" />
                      <p className="font-bold italic">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          {/* MAIN CONTENT */}
          <div className="space-y-10">
            
            {/* SEARCH & FILTERS */}
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground transition-all group-focus-within:text-primary group-focus-within:scale-110" />
                <input 
                  type="text" 
                  placeholder="Interceptar sinais (#hashtags, usuários)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 pl-16 pr-8 bg-card/40 border border-border/40 rounded-[1.2rem] focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base placeholder:text-muted-foreground/40 font-bold italic backdrop-blur-xl"
                />
              </div>
            </div>

            {/* CATEGORY TABS */}
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-[1.2rem] whitespace-nowrap transition-all text-[11px] font-black uppercase tracking-[0.2em] italic border ${
                    activeCategory === cat.id 
                    ? "bg-white text-black border-white shadow-glow scale-[1.05]" 
                    : "bg-card/40 border-border/40 text-muted-foreground hover:border-primary/40 hover:text-white"
                  }`}
                >
                  <cat.icon className="w-5 h-5" />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* POST COMPOSER */}
            <AppleCard className="p-8 border border-border/40 bg-card/40 backdrop-blur-3xl shadow-elevated rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
              <div className="flex gap-6 relative z-10">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center shrink-0 shadow-glow group-hover:scale-105 transition-transform">
                  <span className="font-black text-white text-3xl italic">
                    {profile?.display_name ? profile.display_name[0].toUpperCase() : "U"}
                  </span>
                </div>
                <div className="flex-1 space-y-6">
                  <textarea 
                    placeholder="Compartilhe uma vitória ou peça apoio..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none text-xl min-h-[120px] py-1 placeholder:text-muted-foreground/30 font-bold italic leading-relaxed"
                  />
                  <div className="flex flex-wrap items-center justify-between pt-8 border-t border-border/20 gap-6">
                    <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                       {CATEGORIES.filter(c => c.id !== "all").map(c => (
                         <button
                           key={c.id}
                           onClick={() => setSelectedCategory(c.id)}
                           className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border italic whitespace-nowrap ${
                             selectedCategory === c.id 
                             ? `${c.bg} ${c.color} ${c.border} shadow-glow` 
                             : "bg-transparent text-muted-foreground border-border/20 hover:border-primary/40"
                           }`}
                         >
                           {c.label}
                         </button>
                       ))}
                    </div>
                    <Button 
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim() || isPosting}
                      className="rounded-[1.2rem] h-14 px-10 font-black uppercase tracking-[0.2em] shadow-glow scale-105 hover:scale-110 active:scale-95 transition-all text-[11px] italic"
                    >
                      {isPosting ? "Orbitando..." : "Transmitir"}
                      <Send className="ml-3 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </AppleCard>

            {/* FEED */}
            <div className="space-y-8">
              {loading ? (
                <div className="text-center py-24 bg-card/20 rounded-[2.5rem] border border-dashed border-border/40 backdrop-blur-sm">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto shadow-glow"
                  />
                  <p className="mt-6 text-muted-foreground font-black uppercase tracking-[0.4em] text-[10px] animate-pulse italic">
                    Sincronizando com a rede galáctica...
                  </p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-24 bg-card/20 rounded-[2.5rem] border border-dashed border-border/40 backdrop-blur-sm">
                  <Info className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                  <p className="text-muted-foreground font-bold italic text-lg uppercase tracking-widest opacity-40">
                    Nenhum sinal detectado nesta frequência.
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {posts.map((post, i) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      currentUser={user}
                      isBookmarked={bookmarks.includes(post.id)}
                      onLike={() => handleToggleLike(post.id)}
                      onBookmark={() => handleToggleBookmark(post.id)}
                      refreshData={loadData}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-8 hidden lg:block relative">
            <div className="sticky top-24 space-y-8">
              <AppleCard className="p-8 bg-white text-black shadow-glow rounded-[2rem] relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-6 italic leading-none">Meta Coletiva</h3>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs uppercase tracking-widest italic">Apoios Ativos</span>
                    <span className="font-black text-xl italic leading-none">12/20</span>
                  </div>
                  <div className="w-full bg-black/10 rounded-full h-4 p-[2px] shadow-inner">
                    <div className="bg-primary w-[60%] h-full rounded-full shadow-glow" />
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-black/5 rounded-2xl border border-black/5">
                    <Sparkles className="w-6 h-6 text-primary shrink-0" />
                    <p className="text-[11px] font-bold italic leading-relaxed opacity-80 uppercase tracking-tight">
                      "O apoio entre iguais aumenta em 40% a taxa de sucesso" - CDC
                    </p>
                  </div>
                </div>
              </AppleCard>

              <AppleCard className="p-8 shadow-elevated border border-border/40 bg-card/40 backdrop-blur-3xl rounded-[2rem] relative group">
                <div className="absolute top-0 right-0 p-4">
                  <Trophy className="w-8 h-8 text-primary/20 drop-shadow-glow" />
                </div>
                <h3 className="text-xl font-black text-white italic tracking-tighter mb-10 flex items-center gap-4 leading-none">
                  Frota Elite
                </h3>
                <div className="space-y-8">
                  {[
                    { name: "Dr. Pedro L.", points: 1250, badge: "Protocol Commander", icon: Shield },
                    { name: "Maria Clara", points: 890, badge: "Master Mentor", icon: Award },
                    { name: "Ricardo B.", points: 720, badge: "High Motivator", icon: TrendingUp }
                  ].map((member, i) => (
                    <div key={i} className="flex items-center gap-6 group/item relative">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border transition-all duration-500 ${
                        i === 0 ? "bg-primary text-primary-foreground border-white shadow-glow" : "bg-black/60 border-border/40 text-muted-foreground group-hover/item:border-primary/40"
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-white group-hover/item:text-primary transition-colors uppercase tracking-tight italic leading-none mb-2">{member.name}</p>
                        <div className="flex items-center gap-2">
                          <member.icon size={10} className="text-primary" />
                          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] italic leading-none whitespace-nowrap">{member.badge}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] font-black text-primary drop-shadow-glow italic leading-none">{member.points}</p>
                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1 leading-none italic">PX</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-10 text-[10px] font-black uppercase tracking-[0.3em] group h-12 rounded-[1rem] italic border border-border/20 hover:border-primary/40 hover:bg-primary/10">
                  Dashboard de Frota
                  <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-2" />
                </Button>
              </AppleCard>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
};

// CHILD COMPONENTS
const PostCard = ({ post, currentUser, isBookmarked, onLike, onBookmark, refreshData, index }: {
  post: PostWithData;
  currentUser: User | null;
  isBookmarked: boolean;
  onLike: () => Promise<void>;
  onBookmark: () => Promise<void>;
  refreshData: () => void;
  index: number;
}) => {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const likedByMe = post.post_likes?.some((l: Like) => l.user_id === currentUser?.id);

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
      toast.success("Mensagem interceptada!");
      refreshData();
    } catch (error) {
      toast.error("Erro no sinal.");
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
    >
      <AppleCard className="p-10 shadow-elevated hover:shadow-glow transition-all duration-700 border border-border/40 hover:border-primary/30 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full blur-[60px] pointer-events-none" />
        <header className="flex items-center justify-between mb-10 relative z-10">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-3xl text-white shadow-glow transition-all duration-700 group-hover:scale-105 italic leading-none ${
              post.is_medical ? "bg-emerald-500" : "bg-gradient-to-br from-primary to-primary-foreground"
            }`}>
              {post.profiles?.display_name ? post.profiles.display_name[0].toUpperCase() : "U"}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h4 className="text-xl font-black text-white italic tracking-tight leading-none truncate max-w-[150px]">{post.profiles?.display_name || "Comandante"}</h4>
                {post.is_medical && (
                  <span className="flex items-center gap-2 text-[9px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] border border-emerald-500/40 italic shadow-glow">
                    <ShieldCheck className="w-3 h-3" /> Verificado
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] italic leading-none flex items-center gap-2">
                <Sparkles size={8} className="text-primary" />
                Sinal transmitido {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border italic shadow-sm leading-none ${
              post.category === 'recaida' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 
              post.category === 'vitoria' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-glow' :
              post.category === 'ciencia' ? 'bg-primary/20 text-primary border-primary/40' :
              'bg-card/40 text-muted-foreground border-border/40'
            }`}>
              {CATEGORIES.find(c => c.id === post.category)?.label || post.category}
            </span>
          </div>
        </header>

        <div className="space-y-6 mb-10 relative z-10">
          <p className="text-2xl leading-relaxed font-bold italic tracking-tight text-white/90 whitespace-pre-wrap">
            {post.content}
          </p>
          <div className="flex flex-wrap gap-3">
            {post.hashtags?.map((tag: string) => (
              <span key={tag} className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-white cursor-pointer transition-all bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 italic shadow-sm hover:border-primary/40">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <footer className="flex items-center justify-between pt-8 border-t border-border/20 relative z-10">
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={onLikeClick}
              disabled={isLiking}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-[1.2rem] transition-all font-black text-sm italic border ${
                likedByMe ? "text-rose-400 bg-rose-500/20 border-rose-500/40 shadow-glow scale-105" : "text-muted-foreground bg-black/40 border-border/20 hover:border-primary/40 hover:text-white"
              } ${isLiking ? "scale-95" : ""}`}
            >
              <Heart className={`w-5 h-5 ${likedByMe ? "fill-current" : ""}`} />
              <span className="leading-none">{post.post_likes?.length || 0}</span>
            </button>
            <button 
              onClick={() => setShowReply(!showReply)}
              className={`flex items-center gap-3 px-6 py-3.5 transition-all font-black text-sm rounded-[1.2rem] italic border ${
                showReply ? "bg-primary/20 border-primary/40 text-primary shadow-glow scale-105" : "text-muted-foreground bg-black/40 border-border/20 hover:border-primary/40 hover:text-white"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="leading-none">{post.comments?.length || 0}</span>
            </button>
            <button className="hidden sm:flex items-center gap-3 px-6 py-3.5 text-muted-foreground bg-black/40 border-border/20 hover:border-primary/40 hover:text-white rounded-[1.2rem] transition-all font-black text-sm italic">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={onBookmark}
            className={`p-4 transition-all rounded-[1.2rem] border ${isBookmarked ? "text-primary bg-primary/20 border-primary/40 shadow-glow scale-110" : "text-muted-foreground bg-black/40 border-border/20 hover:border-primary/40 hover:text-white"}`}
          >
            <Bookmark className={`w-6 h-6 ${isBookmarked ? "fill-current" : ""}`} />
          </button>
        </footer>

        {/* COMMENTS SECTION */}
        <AnimatePresence>
          {(showReply || post.comments?.length > 0) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: "circOut" }}
              className="mt-8 pt-10 border-t border-border/20 overflow-hidden relative z-10"
            >
              {/* REPLY INPUT */}
              {currentUser && (
                <div className="flex gap-4 mb-12 bg-black/60 p-6 rounded-[1.8rem] border border-border/40 backdrop-blur-xl shadow-elevated">
                   <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center shrink-0 font-black text-xl text-white shadow-glow italic leading-none">
                    {currentUser?.email ? currentUser.email[0].toUpperCase() : "U"}
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      placeholder="Transmitir suporte neural..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                      className="w-full h-12 pl-6 pr-14 bg-transparent border-none rounded-2xl outline-none transition-all text-sm font-bold italic text-white placeholder:text-muted-foreground/30 focus:ring-0"
                    />
                    <button 
                      onClick={() => handleAddComment()}
                      className="absolute right-1 top-1 p-3 text-primary hover:bg-primary/20 rounded-xl transition-all shadow-glow"
                    >
                      <Send className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}

              {/* NESTED COMMENTS */}
              <div className="space-y-10 pl-4 sm:pl-6">
                {post.comments?.filter((c: Comment) => !c.parent_id).map((comment: Comment) => (
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

const CommentItem = ({ comment, allComments, currentUser, postId, refreshData, depth = 0 }: {
  comment: Comment;
  allComments: Comment[];
  currentUser: User | null;
  postId: string;
  refreshData: () => void;
  depth?: number;
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const replies = allComments.filter((c: Comment) => c.parent_id === comment.id);
  
  const likedByMe = comment.comment_likes?.some((l: Like) => l.user_id === currentUser?.id);

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
      toast.success("Resposta propagada!");
      refreshData();
    } catch (error) {
      toast.error("Erro na resposta.");
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
      toast.error("Erro no sinal.");
    }
  };

  return (
    <div className={`space-y-6 ${depth > 0 ? "ml-8 pl-8 border-l border-border/20" : ""}`}>
      <div className="flex gap-6 group/comment">
        <div className="w-12 h-12 rounded-[1.2rem] bg-card/60 flex items-center justify-center shrink-0 font-black text-lg text-white shadow-sm border border-border/20 group-hover/comment:border-primary/40 transition-all italic leading-none">
           {comment.profiles?.display_name ? comment.profiles.display_name[0].toUpperCase() : "U"}
        </div>
        <div className="flex-1">
          <div className="bg-black/60 backdrop-blur-xl rounded-[1.8rem] p-6 inline-block min-w-[200px] border border-border/40 group-hover/comment:border-primary/20 transition-all shadow-elevated">
            <div className="flex items-center justify-between gap-6 mb-3">
               <span className="text-sm font-black text-white italic truncate max-w-[120px] leading-none">{comment.profiles?.display_name || "Comandante"}</span>
               <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] italic leading-none">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}</span>
            </div>
            <p className="text-base font-bold italic leading-relaxed text-white/80">{comment.content}</p>
          </div>
          <div className="flex items-center gap-8 mt-4 ml-4">
            <button 
              onClick={handleToggleLike}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] italic transition-colors leading-none ${likedByMe ? "text-rose-400 drop-shadow-glow" : "text-muted-foreground hover:text-white"}`}
            >
              <Heart className={`w-3.5 h-3.5 ${likedByMe ? "fill-current" : ""}`} />
              {comment.comment_likes?.length || 0}
            </button>
            <button 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-[10px] text-muted-foreground hover:text-primary font-black uppercase tracking-[0.2em] italic transition-colors leading-none"
            >
              Responder
            </button>
            <button className="text-[9px] text-muted-foreground hover:text-rose-400 font-black uppercase tracking-[0.2em] italic transition-colors opacity-0 group-hover/comment:opacity-100 flex items-center gap-2 leading-none">
              <Flag className="w-3 h-3" /> Denunciar
            </button>
          </div>

          <AnimatePresence>
            {showReplyInput && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="mt-6 flex gap-4 bg-black/40 p-4 rounded-[1.5rem] border border-border/20 backdrop-blur-md shadow-glow"
              >
                <input 
                  autoFocus
                  placeholder={`Respondendo a ${comment.profiles?.display_name}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="flex-1 h-10 bg-transparent border-none rounded-xl px-4 text-xs font-bold italic outline-none text-white focus:ring-0"
                  onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                />
                <button 
                  onClick={handleReply}
                  className="px-6 h-10 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-[1rem] shadow-glow italic scale-105 active:scale-95 transition-all"
                >
                  Confirmar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {replies.length > 0 && (
        <div className="space-y-6">
          {replies.map((reply: Comment) => (
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
