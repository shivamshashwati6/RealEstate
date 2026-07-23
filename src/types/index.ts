export type UserRole = 'buyer' | 'seller' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
}

export type PropertyType = 'apartment' | 'villa' | 'house' | 'plot' | 'commercial' | 'penthouse';
export type ListingIntent = 'sale' | 'rent';
export type ListingStatus = 'draft' | 'pending_approval' | 'live' | 'sold' | 'rented' | 'archived';
export type FurnishedStatus = 'unfurnished' | 'semi-furnished' | 'fully-furnished';
export type ConstructionStatus = 'ready_to_move' | 'under_construction';

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  ownerPhone?: string;
  title: string;
  description: string;
  price: number;
  pricePeriod?: 'total' | 'per_month' | 'per_sqft';
  intent: ListingIntent;
  type: PropertyType;
  status: ListingStatus;
  
  // Specs
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  parkingSpaces: number;
  furnishedStatus: FurnishedStatus;
  constructionStatus: ConstructionStatus;
  builtYear?: number;
  
  // Location
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
  
  // Media & Amenities
  images: string[];
  videoUrl?: string;
  amenities: string[];
  
  // Metrics
  viewsCount: number;
  favoritesCount: number;
  inquiriesCount: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilterState {
  searchQuery: string;
  city: string;
  propertyType: string; // 'all' or specific
  intent: string; // 'all', 'sale', 'rent'
  minPrice: number;
  maxPrice: number;
  bedrooms: string; // 'all', '1', '2', '3', '4+'
  bathrooms: string; // 'all', '1', '2', '3+'
  minArea: number;
  maxArea: number;
  furnishedStatus: string; // 'all', etc.
  constructionStatus: string; // 'all', etc.
  amenities: string[];
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'date_desc' | 'area_desc';
}

export interface FavoriteItem {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
}

export interface CollectionItem {
  id: string;
  userId: string;
  name: string;
  description: string;
  propertyIds: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  propertyId?: string;
  message: string;
  imageUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ConversationSummary {
  conversationId: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerRole: UserRole;
  propertyId?: string;
  propertyTitle?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export type VisitStatus = 'requested' | 'confirmed' | 'rejected' | 'rescheduled' | 'completed' | 'cancelled';

export interface VisitBooking {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  sellerId: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyAddress: string;
  visitDate: string;
  visitTime: string;
  status: VisitStatus;
  notes?: string;
  sellerNotes?: string;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  photoUrls?: string[];
  sellerReply?: string;
  createdAt: string;
}

export type ReportStatus = 'pending' | 'reviewed' | 'action_taken' | 'dismissed';

export interface ReportItem {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reportedBy: string;
  reportedByName: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalUsers: number;
  totalListings: number;
  pendingApprovals: number;
  totalVisits: number;
  totalInquiries: number;
  monthlyRegistrations: { month: string; users: number; listings: number }[];
  listingsByCity: { city: string; count: number }[];
  listingsByType: { type: string; count: number }[];
}
