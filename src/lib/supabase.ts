import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Registration and database features will not work.');
}

const dummyUrl = 'https://placeholder.supabase.co';
const dummyKey = 'placeholder';

export const supabase = createClient(supabaseUrl || dummyUrl, supabaseAnonKey || dummyKey);
