import React from 'react';
import type { Property } from '../../types';
import { usePropertyStore } from '../../store/usePropertyStore';
import { useCompareStore } from '../../store/useCompareStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Bed, Bath, Maximize2, MapPin, Heart, Scale, Eye } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const { currentUser } = useAuthStore();
  const { userFavorites, toggleFavorite } = usePropertyStore();
  const { addToCompare, compareProperties } = useCompareStore();
  const { addNotification } = useNotificationStore();

  const isFavorite = userFavorites.some((f) => f.propertyId === property.id);
  const isCompared = compareProperties.some((p) => p.id === property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(currentUser.id, property.id);
    if (!isFavorite) {
      addNotification('success', 'Added to Favorites', `"${property.title}" saved to your collection.`);
    } else {
      addNotification('info', 'Removed Favorite', `"${property.title}" removed from favorites.`);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = addToCompare(property);
    if (success) {
      addNotification('success', 'Property Added to Comparison', `Added "${property.title}" to compare tray.`);
    } else if (isCompared) {
      addNotification('info', 'Already in Compare', `"${property.title}" is already in your comparison basket.`);
    } else {
      addNotification('warning', 'Comparison Limit Reached', 'You can compare up to 4 properties simultaneously.');
    }
  };

  const formattedPrice = property.intent === 'rent'
    ? `$${property.price.toLocaleString()}/mo`
    : `$${property.price.toLocaleString()}`;

  const statusBadge = {
    live: { label: 'Verified Live', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    pending_approval: { label: 'Pending Approval', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    sold: { label: 'Sold', color: 'bg-slate-700/60 text-slate-400 border-slate-600' },
    rented: { label: 'Rented', color: 'bg-slate-700/60 text-slate-400 border-slate-600' },
    draft: { label: 'Draft', color: 'bg-slate-800 text-slate-400 border-slate-700' },
    archived: { label: 'Archived', color: 'bg-rose-900/40 text-rose-300 border-rose-800' }
  }[property.status] || { label: property.status, color: 'bg-slate-800 text-slate-300 border-slate-700' };

  return (
    <div
      onClick={() => onSelect(property)}
      className="group relative bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-emerald-500/50 shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col transform hover:-translate-y-1"
    >
      {/* Image Gallery Hero */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md">
            For {property.intent.toUpperCase()}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700">
            {property.type}
          </span>
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border backdrop-blur-md ${statusBadge.color}`}>
            {statusBadge.label}
          </span>
        </div>

        {/* Top Action Buttons (Favorite & Compare) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all duration-200 ${
              isFavorite
                ? 'bg-rose-500/90 text-white border-rose-400 shadow-lg shadow-rose-500/30'
                : 'bg-slate-900/70 text-slate-300 border-slate-700/70 hover:bg-slate-800 hover:text-rose-400'
            }`}
            title="Save to Favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={handleCompareClick}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all duration-200 ${
              isCompared
                ? 'bg-emerald-500/90 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-900/70 text-slate-300 border-slate-700/70 hover:bg-slate-800 hover:text-emerald-400'
            }`}
            title="Add to Compare"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
          <div>
            <span className="text-xl font-extrabold text-white tracking-tight drop-shadow-md">
              {formattedPrice}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-300 bg-slate-900/80 px-2 py-1 rounded-md border border-slate-700/60 backdrop-blur-sm">
            <Eye className="w-3 h-3 text-emerald-400" />
            <span>{property.viewsCount} views</span>
          </div>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {property.title}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{property.address}, {property.city}</span>
          </p>
        </div>

        {/* Specs Pill Matrix */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-slate-300 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <Bed className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white">{property.bedrooms}</span>
            <span className="text-[10px] text-slate-400">Beds</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <Bath className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="font-semibold text-white">{property.bathrooms}</span>
            <span className="text-[10px] text-slate-400">Baths</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <Maximize2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-semibold text-white">{property.areaSqft.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400">Sqft</span>
          </div>
        </div>

        {/* Owner Info & Details Action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
          <div className="flex items-center gap-2">
            <img
              src={property.ownerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={property.ownerName}
              className="w-6 h-6 rounded-full object-cover border border-slate-700"
            />
            <span className="text-slate-400 text-[11px] truncate max-w-[110px]">{property.ownerName}</span>
          </div>

          <span className="text-emerald-400 font-bold text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};
