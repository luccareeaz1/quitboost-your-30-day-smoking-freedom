// ================================================================
// QUITBOOST SUPABASE SERVICE LAYER
// All database operations centralized here
// ================================================================
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type Post = Database['public']['Tables']['posts']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];
type Achievement = Database['public']['Tables']['achievements']['Row'];
type Challenge = Database['public']['Tables']['challenges']['Row'];

// ===================== PROFILES =====================

export const profileService = {
  async get(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async update(userId: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async saveOnboarding(userId: string, data: {
    cigarettes_per_day: number;
    years_smoking: number;
    price_per_cigarette: number;
    quit_date: string;
    triggers: string[];
    display_name?: string;
  }) {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...data,
        onboarding_completed: true,
        lgpd_consent: true,
        lgpd_consent_date: new Date().toISOString(),
      })
      .eq('id', userId);
    if (error) throw error;
  },

  async deleteAccount(userId: string) {
    // Supabase cascading deletes should handle related tables if configured,
    // but in some setups we need to be explicit or at least call the auth deletion.
    // Note: Deleting from auth.users requires service_role or a custom RPC.
    // For now, we delete from public.profiles which is allowed by RLS.
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    if (error) throw error;
    
    // Sign out user
    await supabase.auth.signOut();
  },

  async saveConsent(userId: string, data: {
    policy_version: string;
    accepted_terms: boolean;
    accepted_health_data: boolean;
    marketing_consent: boolean;
  }) {
    const { error } = await supabase
      .from('consent_logs')
      .insert({
        user_id: userId,
        ...data,
        accepted_at: new Date().toISOString()
      });
    if (error) throw error;
  }
};

// ===================== COMMUNITY (Posts + Comments) =====================

export const communityService = {
  async getPosts(options?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (id, display_name, avatar_url),
        post_likes (id, user_id),
        comments (
          id, content, created_at, parent_id,
          profiles:user_id (id, display_name, avatar_url),
          comment_likes (id, user_id)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(options?.limit || 20);

    if (options?.category && options.category !== 'all') {
      query = query.eq('category', options.category);
    }

    if (options?.search) {
      query = query.ilike('content', `%${options.search}%`);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createPost(userId: string, content: string, category: string = 'geral', hashtags: string[] = []) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content,
        category,
        hashtags,
      })
      .select(`
        *,
        profiles:user_id (id, display_name, avatar_url)
      `)
      .single();
    if (error) throw error;
    return data;
  },

  async deletePost(postId: string) {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) throw error;
  },

  async toggleLike(userId: string, postId: string) {
    // Check if already liked
    const { data: existing } = await supabase
      .from('post_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (existing) {
      await supabase.from('post_likes').delete().eq('id', existing.id);
      return false; // unliked
    } else {
      await supabase.from('post_likes').insert({ user_id: userId, post_id: postId });
      return true; // liked
    }
  },

  async addComment(userId: string, postId: string, content: string, parentId?: string) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: userId,
        post_id: postId,
        content,
        parent_id: parentId || null,
      })
      .select(`
        *,
        profiles:user_id (id, display_name, avatar_url)
      `)
      .single();
    if (error) throw error;
    return data;
  },

  async toggleCommentLike(userId: string, commentId: string) {
    const { data: existing } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('comment_id', commentId)
      .single();

    if (existing) {
      await supabase.from('comment_likes').delete().eq('id', existing.id);
      return false;
    } else {
      await supabase.from('comment_likes').insert({ user_id: userId, comment_id: commentId });
      return true;
    }
  },

  async toggleBookmark(userId: string, postId: string) {
    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (existing) {
      await supabase.from('bookmarks').delete().eq('id', existing.id);
      return false;
    } else {
      await supabase.from('bookmarks').insert({ user_id: userId, post_id: postId });
      return true;
    }
  },

  async getBookmarks(userId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('post_id')
      .eq('user_id', userId);
    if (error) throw error;
    return data?.map((b) => b.post_id) || [];
  },

  async reportContent(userId: string, reason: string, postId?: string, commentId?: string, description?: string) {
    const { error } = await supabase
      .from('reports')
      .insert({
        reporter_id: userId,
        post_id: postId || null,
        comment_id: commentId || null,
        reason,
        description,
      });
    if (error) throw error;
  },

  // Realtime subscription
  subscribeToNewPosts(callback: (post: Post) => void) {
    return supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        callback(payload.new as Post);
      })
      .subscribe();
  },
};

// ===================== CHALLENGES =====================

export const challengeService = {
  async getAll() {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async getUserChallenges(userId: string) {
    const { data, error } = await supabase
      .from('user_challenges')
      .select(`
        *,
        challenges (*)
      `)
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  async completeChallenge(userId: string, challengeId: string) {
    // Check if already completed today
    const { data: existing } = await supabase
      .from('user_challenges')
      .select('id')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .eq('status', 'completed')
      .single();

    if (existing) return existing;

    const { data, error } = await supabase
      .from('user_challenges')
      .upsert({
        user_id: userId,
        challenge_id: challengeId,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ===================== ACHIEVEMENTS =====================

export const achievementService = {
  async getAll() {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('required_days');
    if (error) throw error;
    return data;
  },

  async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  async unlockAchievement(userId: string, achievementId: string) {
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    if (existing) return existing;

    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ===================== PROGRESS =====================

export const progressService = {
  async logDaily(userId: string, data: {
    cigarettes_avoided: number;
    money_saved: number;
    health_score: number;
    craving_count?: number;
    craving_max_intensity?: number;
    mood?: string;
    notes?: string;
  }) {
    const { error } = await supabase
      .from('progress_logs')
      .upsert({
        user_id: userId,
        logged_date: new Date().toISOString().split('T')[0],
        ...data,
      }, {
        onConflict: 'user_id,logged_date',
      });
    if (error) throw error;
  },

  async getLogs(userId: string, days: number = 30) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data, error } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_date', fromDate.toISOString().split('T')[0])
      .order('logged_date', { ascending: false });
    if (error) throw error;
    return data;
  },
};

// ===================== STREAKS =====================

export const streakService = {
  async get(userId: string) {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async checkIn(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const streak = await this.get(userId);

    if (!streak) {
      const { error } = await supabase.from('streaks').insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_check_in: today,
        total_days_smoke_free: 1,
      });
      if (error) throw error;
      return;
    }

    const lastCheckIn = streak.last_check_in;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (lastCheckIn === yesterdayStr) {
      newStreak = (streak.current_streak || 0) + 1;
    } else if (lastCheckIn === today) {
      return; // Already checked in today
    }

    const { error } = await supabase
      .from('streaks')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak || 0),
        last_check_in: today,
        total_days_smoke_free: (streak.total_days_smoke_free || 0) + 1,
      })
      .eq('user_id', userId);
    if (error) throw error;
  },
};

// ===================== COACH =====================

export const coachService = {
  async getOrCreateConversation(userId: string) {
    // Try to get existing conversation
    const { data: existing } = await supabase
      .from('coach_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (existing) return existing;

    // Create new one
    const { data, error } = await supabase
      .from('coach_conversations')
      .insert({ user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('coach_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async addMessage(conversationId: string, role: 'user' | 'assistant', content: string) {
    const { data, error } = await supabase
      .from('coach_messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ===================== SUBSCRIPTIONS =====================

export const subscriptionService = {
  async get(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createCheckout(userId: string, plan: string) {
    // This would typically call a Supabase Edge Function to create a Stripe session
    // For now, we simulate or use a direct update if payment is mocked
    console.log(`Creating checkout for ${plan} for user ${userId}`);
    // return { url: 'https://checkout.stripe.com/...' };
  }
};

// ===================== NOTIFICATIONS =====================

export const notificationService = {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    if (error) throw error;
  },

  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    if (error) throw error;
  },

  async getUnreadCount(userId: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    if (error) throw error;
    return count || 0;
  },

  // Realtime subscription
  subscribeToNotifications(userId: string, callback: (payload: { new: unknown }) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        callback(payload as { new: unknown });
      })
      .subscribe();
  },
};

// ===================== LEADERBOARD =====================

export const leaderboardService = {
  async getTop(limit: number = 20) {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(limit);
    if (error) throw error;
    return data;
  },
};
