import { create } from 'zustand';
import type { Property, PropertyFilterState, FavoriteItem } from '../types';
import { StorageEngine } from '../services/storage';

const DEFAULT_FILTERS: PropertyFilterState = {
  searchQuery: '',
  city: 'all',
  propertyType: 'all',
  intent: 'all',
  minPrice: 0,
  maxPrice: 10000000,
  bedrooms: 'all',
  bathrooms: 'all',
  minArea: 0,
  maxArea: 50000,
  furnishedStatus: 'all',
  constructionStatus: 'all',
  amenities: [],
  sortBy: 'featured',
};

interface PropertyState {
  properties: Property[];
  filters: PropertyFilterState;
  selectedProperty: Property | null;
  isFormModalOpen: boolean;
  editingProperty: Property | null;
  userFavorites: FavoriteItem[];
  viewMode: 'grid' | 'map';
  
  fetchProperties: () => void;
  setFilters: (newFilters: Partial<PropertyFilterState>) => void;
  resetFilters: () => void;
  setSelectedProperty: (property: Property | null) => void;
  openFormModal: (property?: Property | null) => void;
  closeFormModal: () => void;
  toggleFavorite: (userId: string, propertyId: string) => void;
  fetchFavorites: (userId: string) => void;
  setViewMode: (mode: 'grid' | 'map') => void;
  updateListingStatus: (propertyId: string, status: Property['status']) => void;
  deleteProperty: (propertyId: string) => void;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: StorageEngine.getProperties(),
  filters: DEFAULT_FILTERS,
  selectedProperty: null,
  isFormModalOpen: false,
  editingProperty: null,
  userFavorites: [],
  viewMode: 'grid',

  fetchProperties: () => {
    set({ properties: StorageEngine.getProperties() });
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS });
  },

  setSelectedProperty: (property) => {
    if (property) {
      StorageEngine.incrementViews(property.id);
    }
    set({ selectedProperty: property, properties: StorageEngine.getProperties() });
  },

  openFormModal: (property = null) => {
    set({ isFormModalOpen: true, editingProperty: property });
  },

  closeFormModal: () => {
    set({ isFormModalOpen: false, editingProperty: null });
  },

  toggleFavorite: (userId, propertyId) => {
    StorageEngine.toggleFavorite(userId, propertyId);
    set({
      userFavorites: StorageEngine.getFavorites(userId),
      properties: StorageEngine.getProperties(),
    });
  },

  fetchFavorites: (userId) => {
    set({ userFavorites: StorageEngine.getFavorites(userId) });
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  updateListingStatus: (propertyId, status) => {
    StorageEngine.updateListingStatus(propertyId, status);
    get().fetchProperties();
  },

  deleteProperty: (propertyId) => {
    StorageEngine.deleteProperty(propertyId);
    get().fetchProperties();
  },
}));
