import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  subscription: 'free' | 'standard' | 'elite';
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  subscription: 'free',
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<'free' | 'standard' | 'elite'>('free');

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData) {
        setProfile(profileData);

        // Also sync to localStorage for offline-first support
        const localProfile = {
          quitDate: profileData.quit_date || new Date().toISOString(),
          cigarrosPorDia: profileData.cigarettes_per_day || 20,
          anosFumando: profileData.years_smoking || 5,
          custoPorCigarro: Number(profileData.price_per_cigarette) || 1.25,
          gatilhos: profileData.triggers || [],
          nome: profileData.display_name || '',
          bio: profileData.bio || '',
          privacidade: profileData.privacy || 'public',
          notificacoes: profileData.notifications_enabled !== false,
          tema: profileData.theme || 'auto',
        };
        localStorage.setItem('quitboost_profile', JSON.stringify(localProfile));
      }

      // Fetch subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', userId)
        .single();

      if (subData && subData.status === 'active') {
        setSubscription(subData.plan as 'free' | 'standard' | 'elite');
      } else {
        setSubscription('free');
      }
    } catch (err) {
      console.warn('Could not fetch profile:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      }
      setLoading(false);
    });

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
        setSubscription('free');
      }
      setLoading(false);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSubscription('free');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, subscription, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
