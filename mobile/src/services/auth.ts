import { supabase, apiClient } from './api';
import { Session } from '@supabase/supabase-js';

export interface AuthResult {
  session: Session | null;
  error: Error | null;
}

export const authService = {
  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        apiClient.setToken(data.session.access_token);
        // Verify with backend
        await apiClient.post('/auth/verify', { token: data.session.access_token });
      }

      return { session: data.session, error: null };
    } catch (error: any) {
      return { session: null, error };
    }
  },

  async signUpWithEmail(email: string, password: string, name?: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        apiClient.setToken(data.session.access_token);
        await apiClient.post('/auth/verify', { token: data.session.access_token });
      }

      return { session: data.session, error: null };
    } catch (error: any) {
      return { session: null, error };
    }
  },

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'myrutine://auth/callback',
        },
      });

      if (error) throw error;

      // OAuth redirect handling is done via deep linking
      return { session: null, error: null };
    } catch (error: any) {
      return { session: null, error };
    }
  },

  async signInWithApple(): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'myrutine://auth/callback',
        },
      });

      if (error) throw error;

      return { session: null, error: null };
    } catch (error: any) {
      return { session: null, error };
    }
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    apiClient.setToken(null);
  },

  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      apiClient.setToken(session.access_token);
    }
    return session;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
};
