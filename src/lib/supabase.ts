/**
 * @deprecated Use `@/integrations/supabase/client` instead.
 * This file re-exports the canonical Supabase client to avoid having two
 * separate client instances pointing at different projects.
 */
export { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Helper types (kept for backwards compatibility)
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
