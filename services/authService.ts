import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

export type AuthResult =
  | { ok: true; session: Session | null }
  | { ok: false; error: string };

const friendly = (message: string): string => {
  const m = message.toLowerCase();
  if (m.includes('invalid login')) return 'Invalid email or password.';
  if (m.includes('email not confirmed'))
    return 'Please confirm your email before logging in.';
  if (m.includes('user already registered'))
    return 'An account with this email already exists.';
  if (m.includes('rate limit')) return 'Too many attempts. Try again shortly.';
  if (m.includes('network')) return 'Network error. Check your connection.';
  return message;
};

export const authService = {
  async signUp(params: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: { full_name: params.fullName },
      },
    });

    if (error) return { ok: false, error: friendly(error.message) };
    return { ok: true, session: data.session };
  },

  async signIn(params: {
    email: string;
    password: string;
  }): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });
    if (error) return { ok: false, error: friendly(error.message) };
    return { ok: true, session: data.session };
  },

  async signOut(): Promise<{ ok: true } | { ok: false; error: string }> {
    const { error } = await supabase.auth.signOut();
    if (error) return { ok: false, error: friendly(error.message) };
    return { ok: true };
  },

  async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async sendPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { ok: false as const, error: friendly(error.message) };
    return { ok: true as const };
  },
};
