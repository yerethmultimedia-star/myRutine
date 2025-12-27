import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { authService } from '../services/auth';
import { User } from '../types';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true,
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  signOut: async () => {
    await authService.signOut();
    set({ session: null, user: null });
  },
  checkSession: async () => {
    set({ isLoading: true });
    try {
      const session = await authService.getSession();
      set({ session, isLoading: false });
      
      if (session) {
        // Fetch user profile
        try {
          const { userService } = await import('../services/user');
          const user = await userService.getProfile();
          set({ user });
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
      set({ session: null, user: null, isLoading: false });
    }
  },
}));
