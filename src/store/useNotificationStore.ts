import { create } from 'zustand';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface NotificationState {
  notifications: ToastNotification[];
  addNotification: (type: ToastNotification['type'], title: string, message: string) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (type, title, message) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    set((state) => ({
      notifications: [...state.notifications, { id, type, title, message }],
    }));

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 4500);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
