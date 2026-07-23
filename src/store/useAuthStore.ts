import { create } from 'zustand';
import type { UserProfile, UserRole } from '../types';
import { StorageEngine } from '../services/storage';

interface AuthState {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot' | 'otp';
  switchRole: (role: UserRole) => void;
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
    isAuthModalOpen: false,
    authModalMode: 'login',

    switchRole: (role: UserRole) => {
      const currentUsers = StorageEngine.getUsers();
      const targetUser = currentUsers.find((u) => u.role === role) || currentUsers[0];
      set({ currentUser: targetUser, allUsers: currentUsers });
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
