import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/authService';
import { profileService } from '@/services/profileService';
import type { AuthResult } from '@/services/authService';
import type { Profile, ProfileUpdate } from '@/services/profileService';
import type { Session, User } from '@supabase/supabase-js';

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  ready: boolean;
  signUp: (params: { email: string; password: string; fullName: string }) => Promise<AuthResult>;
  signIn: (params: { email: string; password: string }) => Promise<AuthResult>;
  signOut: () => Promise<{ ok: true } | { ok: false; error: string }>;
  updateProfile: (update: ProfileUpdate) => Promise<Profile>;
  uploadAvatar: (localUri: string) => Promise<string>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const loadProfile = useCallback(async (userId: string, email: string, fullName?: string) => {
    try {
      const p = await profileService.ensureProfile(userId, email, fullName ?? '');
      setProfile(p);
    } catch {
      // profile will be created via trigger or next action
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const fullName = (s.user.user_metadata as Record<string, unknown> | undefined)?.full_name as string | undefined ?? '';
        loadProfile(s.user.id, s.user.email ?? '', fullName);
      }
      setLoading(false);
      setReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const fullName = (s.user.user_metadata as Record<string, unknown> | undefined)?.full_name as string | undefined ?? '';
        loadProfile(s.user.id, s.user.email ?? '', fullName);
      } else {
        setProfile(null);
      }
    });

    return () => { subscription.unsubscribe(); };
  }, [loadProfile]);

  const value: AuthState = {
    session,
    user,
    profile,
    loading,
    ready,

    signUp: async (params) => {
      setLoading(true);
      const result = await authService.signUp(params);
      if (result.ok && result.session?.user) {
        await loadProfile(result.session.user.id, result.session.user.email ?? '', params.fullName);
      }
      setLoading(false);
      return result;
    },

    signIn: async (params) => {
      setLoading(true);
      const result = await authService.signIn(params);
      if (result.ok && result.session?.user) {
        await loadProfile(result.session.user.id, result.session.user.email ?? '');
      }
      setLoading(false);
      return result;
    },

    signOut: async () => {
      setLoading(true);
      const result = await authService.signOut();
      setProfile(null);
      setLoading(false);
      return result;
    },

    updateProfile: async (update: ProfileUpdate) => {
      if (!user) throw new Error('Not authenticated');
      const p = await profileService.update(user.id, update);
      setProfile(p);
      return p;
    },

    uploadAvatar: async (localUri: string) => {
      if (!user) throw new Error('Not authenticated');
      const url = await profileService.uploadAvatar(user.id, localUri);
      const p = await profileService.update(user.id, { avatar_url: url });
      setProfile(p);
      return url;
    },

    refreshProfile: async () => {
      if (user) await loadProfile(user.id, user.email ?? '');
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
