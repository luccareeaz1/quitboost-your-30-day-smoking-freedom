export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          emoji: string | null
          icon: string | null
          id: string
          medical_fact: string | null
          medical_source: string | null
          points: number | null
          rarity: string | null
          required_days: number | null
          story: string | null
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          icon?: string | null
          id?: string
          medical_fact?: string | null
          medical_source?: string | null
          points?: number | null
          rarity?: string | null
          required_days?: number | null
          story?: string | null
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          icon?: string | null
          id?: string
          medical_fact?: string | null
          medical_source?: string | null
          points?: number | null
          rarity?: string | null
          required_days?: number | null
          story?: string | null
          title?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: { created_at: string | null; id: string; post_id: string; user_id: string }
        Insert: { created_at?: string | null; id?: string; post_id: string; user_id: string }
        Update: { created_at?: string | null; id?: string; post_id?: string; user_id?: string }
        Relationships: []
      }
      challenges: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration: string | null
          id: string
          is_collaborative: boolean | null
          is_daily: boolean | null
          is_weekly: boolean | null
          points: number | null
          source: string | null
          technique: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          id?: string
          is_collaborative?: boolean | null
          is_daily?: boolean | null
          is_weekly?: boolean | null
          points?: number | null
          source?: string | null
          technique?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          id?: string
          is_collaborative?: boolean | null
          is_daily?: boolean | null
          is_weekly?: boolean | null
          points?: number | null
          source?: string | null
          technique?: string | null
          title?: string
        }
        Relationships: []
      }
      coach_conversations: {
        Row: { created_at: string | null; id: string; updated_at: string | null; user_id: string }
        Insert: { created_at?: string | null; id?: string; updated_at?: string | null; user_id: string }
        Update: { created_at?: string | null; id?: string; updated_at?: string | null; user_id?: string }
        Relationships: []
      }
      coach_messages: {
        Row: { content: string; conversation_id: string; created_at: string | null; id: string; role: string; tokens_used: number | null }
        Insert: { content: string; conversation_id: string; created_at?: string | null; id?: string; role: string; tokens_used?: number | null }
        Update: { content?: string; conversation_id?: string; created_at?: string | null; id?: string; role?: string; tokens_used?: number | null }
        Relationships: []
      }
      comment_likes: {
        Row: { comment_id: string; created_at: string; id: string; user_id: string }
        Insert: { comment_id: string; created_at?: string; id?: string; user_id: string }
        Update: { comment_id?: string; created_at?: string; id?: string; user_id?: string }
        Relationships: []
      }
      comments: {
        Row: { content: string; created_at: string; id: string; parent_id: string | null; post_id: string; user_id: string }
        Insert: { content: string; created_at?: string; id?: string; parent_id?: string | null; post_id: string; user_id: string }
        Update: { content?: string; created_at?: string; id?: string; parent_id?: string | null; post_id?: string; user_id?: string }
        Relationships: []
      }
      notifications: {
        Row: { body: string | null; created_at: string | null; data: Json | null; id: string; read: boolean | null; title: string; type: string; user_id: string }
        Insert: { body?: string | null; created_at?: string | null; data?: Json | null; id?: string; read?: boolean | null; title: string; type: string; user_id: string }
        Update: { body?: string | null; created_at?: string | null; data?: Json | null; id?: string; read?: boolean | null; title?: string; type?: string; user_id?: string }
        Relationships: []
      }
      post_likes: {
        Row: { created_at: string; id: string; post_id: string; user_id: string }
        Insert: { created_at?: string; id?: string; post_id: string; user_id: string }
        Update: { created_at?: string; id?: string; post_id?: string; user_id?: string }
        Relationships: []
      }
      posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          hashtags: string[] | null
          id: string
          is_medical: boolean | null
          is_pinned: boolean | null
          updated_at: string | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          is_medical?: boolean | null
          is_pinned?: boolean | null
          updated_at?: string | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          is_medical?: boolean | null
          is_pinned?: boolean | null
          updated_at?: string | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cigarettes_per_day: number | null
          created_at: string | null
          current_level: number | null
          display_name: string | null
          id: string
          language: string | null
          lgpd_consent: boolean | null
          lgpd_consent_date: string | null
          notifications_enabled: boolean | null
          onboarding_completed: boolean | null
          price_per_cigarette: number | null
          privacy: string | null
          quit_date: string | null
          theme: string | null
          total_points: number | null
          triggers: string[] | null
          updated_at: string | null
          years_smoking: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cigarettes_per_day?: number | null
          created_at?: string | null
          current_level?: number | null
          display_name?: string | null
          id: string
          language?: string | null
          lgpd_consent?: boolean | null
          lgpd_consent_date?: string | null
          notifications_enabled?: boolean | null
          onboarding_completed?: boolean | null
          price_per_cigarette?: number | null
          privacy?: string | null
          quit_date?: string | null
          theme?: string | null
          total_points?: number | null
          triggers?: string[] | null
          updated_at?: string | null
          years_smoking?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cigarettes_per_day?: number | null
          created_at?: string | null
          current_level?: number | null
          display_name?: string | null
          id?: string
          language?: string | null
          lgpd_consent?: boolean | null
          lgpd_consent_date?: string | null
          notifications_enabled?: boolean | null
          onboarding_completed?: boolean | null
          price_per_cigarette?: number | null
          privacy?: string | null
          quit_date?: string | null
          theme?: string | null
          total_points?: number | null
          triggers?: string[] | null
          updated_at?: string | null
          years_smoking?: number | null
        }
        Relationships: []
      }
      progress_logs: {
        Row: { cigarettes_avoided: number | null; craving_count: number | null; craving_max_intensity: number | null; created_at: string | null; health_score: number | null; id: string; logged_date: string; money_saved: number | null; mood: string | null; notes: string | null; user_id: string }
        Insert: { cigarettes_avoided?: number | null; craving_count?: number | null; craving_max_intensity?: number | null; created_at?: string | null; health_score?: number | null; id?: string; logged_date?: string; money_saved?: number | null; mood?: string | null; notes?: string | null; user_id: string }
        Update: { cigarettes_avoided?: number | null; craving_count?: number | null; craving_max_intensity?: number | null; created_at?: string | null; health_score?: number | null; id?: string; logged_date?: string; money_saved?: number | null; mood?: string | null; notes?: string | null; user_id?: string }
        Relationships: []
      }
      reports: {
        Row: { comment_id: string | null; created_at: string | null; description: string | null; id: string; post_id: string | null; reason: string; reporter_id: string; status: string | null }
        Insert: { comment_id?: string | null; created_at?: string | null; description?: string | null; id?: string; post_id?: string | null; reason: string; reporter_id: string; status?: string | null }
        Update: { comment_id?: string | null; created_at?: string | null; description?: string | null; id?: string; post_id?: string | null; reason?: string; reporter_id?: string; status?: string | null }
        Relationships: []
      }
      smoking_logs: {
        Row: { id: string; logged_at: string | null; notes: string | null; user_id: string | null }
        Insert: { id?: string; logged_at?: string | null; notes?: string | null; user_id?: string | null }
        Update: { id?: string; logged_at?: string | null; notes?: string | null; user_id?: string | null }
        Relationships: []
      }
      streaks: {
        Row: { current_streak: number | null; id: string; last_check_in: string | null; longest_streak: number | null; total_days_smoke_free: number | null; updated_at: string | null; user_id: string }
        Insert: { current_streak?: number | null; id?: string; last_check_in?: string | null; longest_streak?: number | null; total_days_smoke_free?: number | null; updated_at?: string | null; user_id: string }
        Update: { current_streak?: number | null; id?: string; last_check_in?: string | null; longest_streak?: number | null; total_days_smoke_free?: number | null; updated_at?: string | null; user_id?: string }
        Relationships: []
      }
      subscriptions: {
        Row: { created_at: string | null; current_period_end: string | null; current_period_start: string | null; id: string; plan: string; status: string | null; stripe_customer_id: string | null; stripe_subscription_id: string | null; updated_at: string | null; user_id: string }
        Insert: { created_at?: string | null; current_period_end?: string | null; current_period_start?: string | null; id?: string; plan?: string; status?: string | null; stripe_customer_id?: string | null; stripe_subscription_id?: string | null; updated_at?: string | null; user_id: string }
        Update: { created_at?: string | null; current_period_end?: string | null; current_period_start?: string | null; id?: string; plan?: string; status?: string | null; stripe_customer_id?: string | null; stripe_subscription_id?: string | null; updated_at?: string | null; user_id?: string }
        Relationships: []
      }
      user_achievements: {
        Row: { achievement_id: string | null; id: string; unlocked_at: string | null; user_id: string | null }
        Insert: { achievement_id?: string | null; id?: string; unlocked_at?: string | null; user_id?: string | null }
        Update: { achievement_id?: string | null; id?: string; unlocked_at?: string | null; user_id?: string | null }
        Relationships: []
      }
      user_challenges: {
        Row: { challenge_id: string | null; completed_at: string | null; id: string; status: string | null; user_id: string | null }
        Insert: { challenge_id?: string | null; completed_at?: string | null; id?: string; status?: string | null; user_id?: string | null }
        Update: { challenge_id?: string | null; completed_at?: string | null; id?: string; status?: string | null; user_id?: string | null }
        Relationships: []
      }
    }
    Views: {
      leaderboard: {
        Row: { avatar_url: string | null; days_smoke_free: number | null; display_name: string | null; points: number | null; rank: number | null; streak: number | null; user_id: string | null }
        Relationships: []
      }
    }
    Functions: {
      get_post_comments_count: { Args: { p_post_id: string }; Returns: number }
      get_post_likes_count: { Args: { p_post_id: string }; Returns: number }
      refresh_leaderboard: { Args: never; Returns: undefined }
      user_has_liked_post: { Args: { p_post_id: string; p_user_id: string }; Returns: boolean }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
