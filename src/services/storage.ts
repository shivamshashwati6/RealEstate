import type { Property, UserProfile, VisitBooking, ReviewItem, ReportItem, ChatMessage, CollectionItem, FavoriteItem, AnalyticsSummary } from '../types';
import { MOCK_PROPERTIES, MOCK_USERS, MOCK_VISITS, MOCK_REVIEWS, MOCK_REPORTS, MOCK_MESSAGES, MOCK_COLLECTIONS } from './mockData';

const KEYS = {
  USERS: 'estatemarket_users',
  PROPERTIES: 'estatemarket_properties',
  FAVORITES: 'estatemarket_favorites',
  COLLECTIONS: 'estatemarket_collections',
  VISITS: 'estatemarket_visits',
  REVIEWS: 'estatemarket_reviews',
  REPORTS: 'estatemarket_reports',
  MESSAGES: 'estatemarket_messages',
};

const initStorage = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(KEYS.PROPERTIES)) {
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(MOCK_PROPERTIES));
  }
  if (!localStorage.getItem(KEYS.VISITS)) {
    localStorage.setItem(KEYS.VISITS, JSON.stringify(MOCK_VISITS));
  }
  if (!localStorage.getItem(KEYS.REVIEWS)) {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(MOCK_REVIEWS));
  }
  if (!localStorage.getItem(KEYS.REPORTS)) {
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(MOCK_REPORTS));
  }
  if (!localStorage.getItem(KEYS.MESSAGES)) {
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(MOCK_MESSAGES));
  }
  if (!localStorage.getItem(KEYS.COLLECTIONS)) {
    localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(MOCK_COLLECTIONS));
  }
  if (!localStorage.getItem(KEYS.FAVORITES)) {
    const initialFavs: FavoriteItem[] = [
      { id: 'fav_1', userId: 'usr_buyer_1', propertyId: 'prop_1', createdAt: '2026-07-10T10:00:00Z' },
      { id: 'fav_2', userId: 'usr_buyer_1', propertyId: 'prop_2', createdAt: '2026-07-12T14:00:00Z' }
    ];
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(initialFavs));
  }
};

initStorage();

export const StorageEngine = {
  getProperties: (): Property[] => {
    try {
      const data = localStorage.getItem(KEYS.PROPERTIES);
      return data ? JSON.parse(data) : MOCK_PROPERTIES;
    } catch {
      return MOCK_PROPERTIES;
    }
  },

  getPropertyById: (id: string): Property | undefined => {
    return StorageEngine.getProperties().find((p) => p.id === id);
  },

  saveProperty: (property: Partial<Property> & { ownerId: string }): Property => {
    const properties = StorageEngine.getProperties();
    const existingIndex = properties.findIndex((p) => p.id === property.id);
    
    if (existingIndex >= 0) {
      const updated: Property = {
        ...properties[existingIndex],
        ...property,
        updatedAt: new Date().toISOString(),
      };
      properties[existingIndex] = updated;
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(properties));
      return updated;
    } else {
      const newProperty: Property = {
        id: `prop_${Date.now()}`,
        ownerId: property.ownerId,
        ownerName: property.ownerName || 'Property Agent',
        ownerAvatar: property.ownerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        ownerPhone: property.ownerPhone || '+1 (555) 000-0000',
        title: property.title || 'Untitled Property',
        description: property.description || '',
        price: property.price || 0,
        pricePeriod: property.pricePeriod || 'total',
        intent: property.intent || 'sale',
        type: property.type || 'apartment',
        status: property.status || 'pending_approval',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        areaSqft: property.areaSqft || 0,
        parkingSpaces: property.parkingSpaces || 0,
        furnishedStatus: property.furnishedStatus || 'unfurnished',
        constructionStatus: property.constructionStatus || 'ready_to_move',
        builtYear: property.builtYear || new Date().getFullYear(),
        address: property.address || '',
        city: property.city || 'Miami',
        state: property.state || 'Florida',
        country: property.country || 'United States',
        zipCode: property.zipCode || '33101',
        latitude: property.latitude || 25.7617,
        longitude: property.longitude || -80.1918,
        images: property.images && property.images.length > 0 ? property.images : [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: property.amenities || [],
        viewsCount: 1,
        favoritesCount: 0,
        inquiriesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      properties.unshift(newProperty);
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(properties));
      return newProperty;
    }
  },

  updateListingStatus: (id: string, status: Property['status']): Property | null => {
    const properties = StorageEngine.getProperties();
    const index = properties.findIndex((p) => p.id === id);
    if (index >= 0) {
      properties[index].status = status;
      properties[index].updatedAt = new Date().toISOString();
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(properties));
      return properties[index];
    }
    return null;
  },

  deleteProperty: (id: string): boolean => {
    let properties = StorageEngine.getProperties();
    properties = properties.filter((p) => p.id !== id);
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(properties));
    return true;
  },

  incrementViews: (id: string) => {
    const properties = StorageEngine.getProperties();
    const p = properties.find((item) => item.id === id);
    if (p) {
      p.viewsCount = (p.viewsCount || 0) + 1;
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(properties));
    }
  },

  getFavorites: (userId: string): FavoriteItem[] => {
    try {
      const data = localStorage.getItem(KEYS.FAVORITES);
      const favs: FavoriteItem[] = data ? JSON.parse(data) : [];
      return favs.filter((f) => f.userId === userId);
    } catch {
      return [];
    }
  },

  toggleFavorite: (userId: string, propertyId: string): boolean => {
    const data = localStorage.getItem(KEYS.FAVORITES);
    let favs: FavoriteItem[] = data ? JSON.parse(data) : [];
    const existingIndex = favs.findIndex((f) => f.userId === userId && f.propertyId === propertyId);
    let isFav = false;

    if (existingIndex >= 0) {
      favs.splice(existingIndex, 1);
      isFav = false;
    } else {
      favs.push({
        id: `fav_${Date.now()}`,
        userId,
        propertyId,
        createdAt: new Date().toISOString(),
      });
      isFav = true;
    }
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));

    const props = StorageEngine.getProperties();
    const p = props.find((item) => item.id === propertyId);
    if (p) {
      p.favoritesCount = favs.filter((f) => f.propertyId === propertyId).length;
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(props));
    }

    return isFav;
  },

  getCollections: (userId: string): CollectionItem[] => {
    try {
      const data = localStorage.getItem(KEYS.COLLECTIONS);
      const cols: CollectionItem[] = data ? JSON.parse(data) : MOCK_COLLECTIONS;
      return cols.filter((c) => c.userId === userId);
    } catch {
      return [];
    }
  },

  createCollection: (userId: string, name: string, description: string, propertyIds: string[]): CollectionItem => {
    const data = localStorage.getItem(KEYS.COLLECTIONS);
    const cols: CollectionItem[] = data ? JSON.parse(data) : MOCK_COLLECTIONS;
    const newCol: CollectionItem = {
      id: `col_${Date.now()}`,
      userId,
      name,
      description,
      propertyIds,
      createdAt: new Date().toISOString(),
    };
    cols.unshift(newCol);
    localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(cols));
    return newCol;
  },

  getVisits: (userId: string, role: string): VisitBooking[] => {
    try {
      const data = localStorage.getItem(KEYS.VISITS);
      const visits: VisitBooking[] = data ? JSON.parse(data) : MOCK_VISITS;
      if (role === 'admin') return visits;
      if (role === 'seller') return visits.filter((v) => v.sellerId === userId);
      return visits.filter((v) => v.buyerId === userId);
    } catch {
      return MOCK_VISITS;
    }
  },

  createVisit: (visit: Omit<VisitBooking, 'id' | 'createdAt' | 'status'>): VisitBooking => {
    const data = localStorage.getItem(KEYS.VISITS);
    const visits: VisitBooking[] = data ? JSON.parse(data) : MOCK_VISITS;
    const newVisit: VisitBooking = {
      ...visit,
      id: `vst_${Date.now()}`,
      status: 'requested',
      createdAt: new Date().toISOString(),
    };
    visits.unshift(newVisit);
    localStorage.setItem(KEYS.VISITS, JSON.stringify(visits));
    return newVisit;
  },

  updateVisitStatus: (id: string, status: VisitBooking['status'], sellerNotes?: string): VisitBooking | null => {
    const data = localStorage.getItem(KEYS.VISITS);
    const visits: VisitBooking[] = data ? JSON.parse(data) : MOCK_VISITS;
    const index = visits.findIndex((v) => v.id === id);
    if (index >= 0) {
      visits[index].status = status;
      if (sellerNotes) visits[index].sellerNotes = sellerNotes;
      localStorage.setItem(KEYS.VISITS, JSON.stringify(visits));
      return visits[index];
    }
    return null;
  },

  getMessages: (conversationId: string): ChatMessage[] => {
    try {
      const data = localStorage.getItem(KEYS.MESSAGES);
      const msgs: ChatMessage[] = data ? JSON.parse(data) : MOCK_MESSAGES;
      return msgs.filter((m) => m.conversationId === conversationId);
    } catch {
      return [];
    }
  },

  sendMessage: (msg: Omit<ChatMessage, 'id' | 'createdAt' | 'isRead'>): ChatMessage => {
    const data = localStorage.getItem(KEYS.MESSAGES);
    const msgs: ChatMessage[] = data ? JSON.parse(data) : MOCK_MESSAGES;
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    msgs.push(newMsg);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(msgs));
    return newMsg;
  },

  getReviewsForProperty: (propertyId: string): ReviewItem[] => {
    try {
      const data = localStorage.getItem(KEYS.REVIEWS);
      const reviews: ReviewItem[] = data ? JSON.parse(data) : MOCK_REVIEWS;
      return reviews.filter((r) => r.propertyId === propertyId);
    } catch {
      return [];
    }
  },

  addReview: (review: Omit<ReviewItem, 'id' | 'createdAt'>): ReviewItem => {
    const data = localStorage.getItem(KEYS.REVIEWS);
    const reviews: ReviewItem[] = data ? JSON.parse(data) : MOCK_REVIEWS;
    const newReview: ReviewItem = {
      ...review,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    reviews.unshift(newReview);
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
    return newReview;
  },

  getReports: (): ReportItem[] => {
    try {
      const data = localStorage.getItem(KEYS.REPORTS);
      return data ? JSON.parse(data) : MOCK_REPORTS;
    } catch {
      return MOCK_REPORTS;
    }
  },

  createReport: (report: Omit<ReportItem, 'id' | 'createdAt' | 'status'>): ReportItem => {
    const data = localStorage.getItem(KEYS.REPORTS);
    const reports: ReportItem[] = data ? JSON.parse(data) : MOCK_REPORTS;
    const newRep: ReportItem = {
      ...report,
      id: `rep_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    reports.unshift(newRep);
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
    return newRep;
  },

  updateReportStatus: (id: string, status: ReportItem['status']): ReportItem | null => {
    const data = localStorage.getItem(KEYS.REPORTS);
    const reports: ReportItem[] = data ? JSON.parse(data) : MOCK_REPORTS;
    const index = reports.findIndex((r) => r.id === id);
    if (index >= 0) {
      reports[index].status = status;
      localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
      return reports[index];
    }
    return null;
  },

  getUsers: (): UserProfile[] => {
    try {
      const data = localStorage.getItem(KEYS.USERS);
      return data ? JSON.parse(data) : MOCK_USERS;
    } catch {
      return MOCK_USERS;
    }
  },

  toggleUserSuspension: (id: string): UserProfile | null => {
    const users = StorageEngine.getUsers();
    const u = users.find((item) => item.id === id);
    if (u) {
      u.isSuspended = !u.isSuspended;
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      return u;
    }
    return null;
  },

  getAnalyticsSummary: (): AnalyticsSummary => {
    const users = StorageEngine.getUsers();
    const props = StorageEngine.getProperties();
    const visits = StorageEngine.getVisits('', 'admin');
    
    const pendingListings = props.filter((p) => p.status === 'pending_approval').length;
    
    const cityMap: Record<string, number> = {};
    const typeMap: Record<string, number> = {};
    
    props.forEach((p) => {
      cityMap[p.city] = (cityMap[p.city] || 0) + 1;
      typeMap[p.type] = (typeMap[p.type] || 0) + 1;
    });

    return {
      totalUsers: users.length,
      totalListings: props.length,
      pendingApprovals: pendingListings,
      totalVisits: visits.length,
      totalInquiries: props.reduce((acc, curr) => acc + (curr.inquiriesCount || 0), 0),
      monthlyRegistrations: [
        { month: 'Feb', users: 12, listings: 8 },
        { month: 'Mar', users: 19, listings: 14 },
        { month: 'Apr', users: 24, listings: 22 },
        { month: 'May', users: 38, listings: 29 },
        { month: 'Jun', users: 52, listings: 41 },
        { month: 'Jul', users: 68, listings: 55 },
      ],
      listingsByCity: Object.entries(cityMap).map(([city, count]) => ({ city, count })),
      listingsByType: Object.entries(typeMap).map(([type, count]) => ({ type, count })),
    };
  }
};
