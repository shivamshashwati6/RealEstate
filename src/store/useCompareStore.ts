import { create } from 'zustand';
import type { Property } from '../types';

interface CompareState {
  compareProperties: Property[];
  isCompareModalOpen: boolean;
  addToCompare: (property: Property) => boolean;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  openCompareModal: () => void;
  closeCompareModal: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  compareProperties: [],
  isCompareModalOpen: false,

  addToCompare: (property) => {
    const list = get().compareProperties;
    if (list.some((p) => p.id === property.id)) return false;
    if (list.length >= 4) return false;

    set({ compareProperties: [...list, property] });
    return true;
  },

  removeFromCompare: (propertyId) => {
    set((state) => ({
      compareProperties: state.compareProperties.filter((p) => p.id !== propertyId),
    }));
  },

  clearCompare: () => {
    set({ compareProperties: [] });
  },

  openCompareModal: () => {
    set({ isCompareModalOpen: true });
  },

  closeCompareModal: () => {
    set({ isCompareModalOpen: false });
  },
}));
