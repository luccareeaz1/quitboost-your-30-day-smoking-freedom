import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import {
  MessageSquare,
  Heart,
  Send,
  MoreVertical,
  Flame,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { communityService } from "@/lib/services";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  user_id: string;
  profiles: Profile;
  post_likes: Like[];
  comments: Comment[];
}

const Comunidade = () => {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<PostWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedPosts = await communityService.getPosts();
      setPosts(fetchedPosts as unknown as PostWithData[]);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const subscription = communityService.subscribeToNewPosts(() => {
      loadData();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [loadData]);

  const handleCreatePost = async () => {
    if (!user) {
      toast.error("Faça login para interagir na comunidade.");
      return;
    }
    if (!newPostContent.trim()) return;

    try {
      setIsPosting(true);
      await communityService.createPost(user.id, newPostContent, "geral", []);
      setNewPostContent("");
      toast.success("Mensagem enviada!");
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
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const currentLikes = p.post_likes || [];
            return {
              ...p,
              post_likes: liked
                ? [...currentLikes, { user_id: user.id }]
                : currentLikes.filter((l) => l.user_id !== user.id),
            };
          }
          return p;
        })
      );
    } catch (error) {
      toast.error("Erro ao processar curtida.");
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 max-w-2xl py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header / Title */}
        <div className="mb-8 border-b border-border/40 pb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Comunidade</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Compartilhe sua jornada, apoie outras pessoas e encontre motivação. 
            Estamos todos juntos na missão de conquistar uma vida livre do cigarro.
          </p>
        </div>

        {/* Input Area (Post Composer) */}
        <div className="mb-10 p-5 bg-card border border-border/50 rounded-2xl shadow-sm">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <span className="font-semibold text-primary text-sm">
                {profile?.display_name ? profile.display_name[0].toUpperCase() : "U"}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Como você está se sentindo hoje? Compartilhe seu progresso..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-transparent border-none outline-none resize-none min-h-[80px] text-[15px] placeholder:text-muted-foreground/50 py-2 focus:ring-0"
              />
              <div className="flex justify-end pt-3 border-t border-border/30 mt-2">
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || isPosting}
                  className="rounded-full h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm transition-all"
                >
                  {isPosting ? "Enviando..." : "Publicar"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed Posts */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-10 opacity-50">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Carregando feed...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-border/40 text-muted-foreground bg-muted/5">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Seja o primeiro a compartilhar na comunidade.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                onLike={() => handleToggleLike(post.id)}
                refreshData={loadData}
              />
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

// CHILD COMPONENT: Post Card
const PostCard = ({
  post,
  currentUser,
  onLike,
  refreshData,
}: {
  post: PostWithData;
  currentUser: User | null;
  onLike: () => Promise<void>;
  refreshData: () => void;
}) => {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const likedByMe = post.post_likes?.some((l) => l.user_id === currentUser?.id);

  const handleAddComment = async () => {
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
        undefined
      );
      setReplyContent("");
      toast.success("Comentário adicionado.");
      refreshData();
    } catch (error) {
      toast.error("Erro ao enviar comentário.");
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:border-border transition-colors">
      <div className="flex items-start gap-4 mb-4">
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border">
          <span className="font-semibold text-foreground text-sm">
            {post.profiles?.display_name ? post.profiles.display_name[0].toUpperCase() : "U"}
          </span>
        </div>
        
        {/* Post Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className="font-medium text-sm text-foreground truncate">
                {post.profiles?.display_name || "Membro"}
              </span>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
              </span>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          
          {/* Mock streak badge for flavor */}
          <div className="flex items-center gap-1 mt-0.5 opacity-80">
            <Flame className="w-3 h-3 text-amber-500" />
            <span className="text-[11px] text-amber-500/80 font-medium">Livre do cigarro</span>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="pl-14 mb-4">
        <p className="text-[15px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pl-14 flex items-center gap-6">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            likedByMe ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className={`w-[18px] h-[18px] ${likedByMe ? "fill-current" : ""}`} />
          <span>{post.post_likes?.length || 0}</span>
        </button>
        
        <button
          onClick={() => setShowReply(!showReply)}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            showReply ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="w-[18px] h-[18px]" />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showReply && (
        <div className="mt-5 pl-14 pt-4 border-t border-border/40">
          {currentUser && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border">
                <span className="font-semibold text-xs text-foreground">
                  {currentUser?.email ? currentUser.email[0].toUpperCase() : "U"}
                </span>
              </div>
              <div className="flex-1 flex items-center bg-muted/20 border border-border/50 rounded-full px-4 h-10">
                <input
                  placeholder="Escreva um comentário..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  className="w-full bg-transparent border-none text-sm outline-none placeholder:text-muted-foreground/60 focus:ring-0"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!replyContent.trim()}
                  className="text-primary hover:text-primary/80 disabled:opacity-50 ml-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-2">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <span className="font-medium text-xs text-foreground">
                    {comment.profiles?.display_name ? comment.profiles.display_name[0].toUpperCase() : "U"}
                  </span>
                </div>
                <div className="flex-1 bg-muted/20 rounded-2xl rounded-tl-none p-3 border border-border/30">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {comment.profiles?.display_name || "Membro"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-[13px] text-foreground/90 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Comunidade;
