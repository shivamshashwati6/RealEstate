import { create } from 'zustand';
import type { UserProfile, UserRole } from '../types';
import { StorageEngine } from '../services/storage';

interface AuthState {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot' | 'otp';
  
  initializeAuth: () => void;
  switchRole: (role: UserRole) => void;
  loginUser: (email: string, role: UserRole) => boolean;
  signOut: () => void;
  openAuthModal: (mode?: 'login' | 'register' | 'forgot' | 'otp') => void;
  closeAuthModal: () => void;
  toggleUserSuspension: (userId: string) => void;
  refreshUsers: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const users = StorageEngine.getUsers();
  const defaultBuyer = users.find((u) => u.role === 'buyer') || users[0];

  return {
    currentUser: defaultBuyer,
    allUsers: users,
    isAuthenticated: true,
    isLoading: false,
    isAuthModalOpen: false,
    authModalMode: 'login',

    initializeAuth: () => {
      const currentUsers = StorageEngine.getUsers();
      set({ allUsers: currentUsers, isLoading: false });
    },

    switchRole: (role: UserRole) => {
      const currentUsers = StorageEngine.getUsers();
      const targetUser = currentUsers.find((u) => u.role === role) || currentUsers[0];
      set({ currentUser: targetUser, allUsers: currentUsers, isAuthenticated: true });
    },

    loginUser: (email: string, role: UserRole) => {
      const currentUsers = StorageEngine.getUsers();
      const match = currentUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        if (match.role !== role) {
          return false; // Mismatch role
        }
        set({ currentUser: match, isAuthenticated: true });
        return true;
      }
      // Fallback switch to default role user
      const targetUser = currentUsers.find((u) => u.role === role) || currentUsers[0];
      set({ currentUser: targetUser, isAuthenticated: true });
      return true;
    },

    signOut: () => {
      set({ isAuthenticated: false });
    },

    openAuthModal: (mode = 'login') => {
      set({ isAuthModalOpen: true, authModalMode: mode });
    },

    closeAuthModal: () => {
      set({ isAuthModalOpen: false });
    },

    toggleUserSuspension: (userId: string) => {
      StorageEngine.toggleUserSuspension(userId);
      get().refreshUsers();
    },

    refreshUsers: () => {
      set({ allUsers: StorageEngine.getUsers() });
    },
  };
});
