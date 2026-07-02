import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../utils/supabaseClient';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (userData: Omit<User, 'id' | 'createdAt' | 'role'>, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  updateUserRole: (newRole: 'user' | 'admin') => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Fetch role from user_profiles table (source of truth)
const fetchUserProfile = async (userId: string) => {
  const { data } = await supabase
    .from('user_profiles')
    .select('role, name, phone')
    .eq('id', userId)
    .single();
  return data;
};

const buildUser = async (supabaseUser: any): Promise<User> => {
  const profile = await fetchUserProfile(supabaseUser.id).catch(() => null);
  return {
    id: supabaseUser.id,
    name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    phone: profile?.phone || supabaseUser.user_metadata?.phone || '',
    avatar: supabaseUser.user_metadata?.avatar_url || '',
    role: profile?.role || 'user',
    createdAt: supabaseUser.created_at || new Date().toISOString(),
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const u = await buildUser(session.user);
        setUser(u);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }).catch(() => setIsLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = await buildUser(session.user);
        setUser(u);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        setUser(await buildUser(data.user));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt' | 'role'>, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password,
        options: { data: { name: userData.name, phone: userData.phone } },
      });
      if (error) throw error;
      if (data.user) {
        const sessionUser = data.session?.user || data.user;
        setUser(await buildUser(sessionUser));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
    return true;
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    if (error) throw error;
  };

  const loginWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'facebook', options: { redirectTo: window.location.origin } });
    if (error) throw error;
  };

  const updateUserRole = async (newRole: 'user' | 'admin') => {
    if (!user) return;
    await supabase.from('user_profiles').update({ role: newRole }).eq('id', user.id);
    setUser(prev => prev ? { ...prev, role: newRole } : null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, resetPassword, loginWithGoogle, loginWithFacebook, updateUserRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
