import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { UserProfile, UserRole } from '../types';
import { StorageEngine } from '../services/storage';

interface AuthState {
  user: User | null;
  role: UserRole;
  isLoading: boolean;
  currentUserProfile: UserProfile | null;
  initializeAuth: () => Promise<UserRole>;
  signOut: () => Promise<void>;
  switchRole: (targetRole: 'buyer' | 'seller' | 'admin') => void;
  mockLogin: (email: string, targetRole: 'buyer' | 'seller' | 'admin') => Promise<UserRole>;
}

export const useAuthStore = create<AuthState>((set) => {
  const users = StorageEngine.getUsers();
  const defaultBuyer = users.find((u) => u.role === 'buyer') || users[0];

  return {
    user: null,
    role: null,
    isLoading: true,
    currentUserProfile: defaultBuyer,

    initializeAuth: async () => {
      set({ isLoading: true });

      // If Supabase credentials are configured in .env, query live Supabase Auth & public.users table
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (!session?.user) {
            set({ user: null, role: null, isLoading: false });
            return null;
          }

          // Explicitly query public.users table to get the true database role
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();

          const resolvedRole = (userData?.role || (session.user.user_metadata?.role as UserRole) || 'buyer') as UserRole;

          const allUsers = StorageEngine.getUsers();
          const profile = allUsers.find((u) => u.role === resolvedRole) || {
            id: session.user.id,
            email: session.user.email || '',
            name: (session.user.user_metadata?.full_name as string) || 'User',
            phone: (session.user.user_metadata?.phone as string) || '',
            role: resolvedRole || 'buyer',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            isVerified: true,
            isSuspended: false,
            createdAt: new Date().toISOString(),
          };

          set({
            user: session.user,
            role: resolvedRole,
            currentUserProfile: profile,
            isLoading: false,
          });

          return resolvedRole;
        } catch {
          // Fallback to local session
        }
      }

      // Local storage / demo mode session resolution
      const localUsers = StorageEngine.getUsers();
      const storedRole = (localStorage.getItem('estatemarket_active_role') as UserRole) || 'buyer';
      const matchedUser = localUsers.find((u) => u.role === storedRole) || localUsers[0];

      // Simulated user object
      const dummyUser: User = {
        id: matchedUser.id,
        app_metadata: {},
        user_metadata: { role: matchedUser.role, full_name: matchedUser.name },
        aud: 'authenticated',
        created_at: matchedUser.createdAt,
        email: matchedUser.email,
        phone: matchedUser.phone,
      };

      set({
        user: dummyUser,
        role: matchedUser.role,
        currentUserProfile: matchedUser,
        isLoading: false,
      });

      return matchedUser.role;
    },

    signOut: async () => {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('estatemarket_active_role');
      set({ user: null, role: null, currentUserProfile: null, isLoading: false });
    },

    switchRole: (targetRole) => {
      localStorage.setItem('estatemarket_active_role', targetRole);
      const allUsers = StorageEngine.getUsers();
      const matched = allUsers.find((u) => u.role === targetRole) || allUsers[0];

      const dummyUser: User = {
        id: matched.id,
        app_metadata: {},
        user_metadata: { role: matched.role, full_name: matched.name },
        aud: 'authenticated',
        created_at: matched.createdAt,
        email: matched.email,
        phone: matched.phone,
      };

      set({
        user: dummyUser,
        role: targetRole,
        currentUserProfile: matched,
        isLoading: false,
      });
    },

    mockLogin: async (email, targetRole) => {
      localStorage.setItem('estatemarket_active_role', targetRole);
      const allUsers = StorageEngine.getUsers();
      const matched = allUsers.find((u) => u.role === targetRole) || allUsers[0];

      const dummyUser: User = {
        id: matched.id,
        app_metadata: {},
        user_metadata: { role: matched.role, full_name: matched.name },
        aud: 'authenticated',
        created_at: matched.createdAt,
        email,
        phone: matched.phone,
      };

      set({
        user: dummyUser,
        role: targetRole,
        currentUserProfile: matched,
        isLoading: false,
      });

      return targetRole;
    },
  };
});
