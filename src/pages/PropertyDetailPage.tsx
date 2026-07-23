import React, { useState } from 'react';
import type { Property } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { usePropertyStore } from '../store/usePropertyStore';
import { useCompareStore } from '../store/useCompareStore';
import { useChatStore } from '../store/useChatStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { NearbyPlaces } from '../components/property/NearbyPlaces';
import { EMICalculator } from '../components/property/EMICalculator';
import { ReviewSection } from '../components/property/ReviewSection';
import { BookingModal } from '../components/property/BookingModal';
import { ReportModal } from '../components/property/ReportModal';
import { PropertyMap } from '../components/property/PropertyMap';
import { Bed, Bath, Maximize2, Car, Calendar, MapPin, Heart, Scale, MessageSquare, Flag, ArrowLeft, CheckCircle2, ShieldCheck, Share2 } from 'lucide-react';

interface PropertyDetailPageProps {
  property: Property;
  onBack: () => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ property, onBack }) => {
  const { currentUser } = useAuthStore();
  const { userFavorites, toggleFavorite } = usePropertyStore();
  const { addToCompare } = useCompareStore();
  const { openChatWithSeller } = useChatStore();
  const { addNotification } = useNotificationStore();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const isFav = userFavorites.some((f) => f.propertyId === property.id);

  const handleFavoriteClick = () => {
    toggleFavorite(currentUser.id, property.id);
    if (!isFav) {
      addNotification('success', 'Saved to Favorites', `"${property.title}" saved.`);
    }
  };

  const handleCompareClick = () => {
    const success = addToCompare(property);
    if (success) {
      addNotification('success', 'Added to Comparison', `Added "${property.title}" to compare basket.`);
    }
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    addNotification('info', 'Link Copied', 'Property share URL copied to clipboard.');
  };

  const formattedPrice = property.intent === 'rent'
    ? `$${property.price.toLocaleString()}/mo`
    : `$${property.price.toLocaleString()}`;

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Search Results
      </button>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase bg-emerald-500 text-slate-950">
              For {property.intent.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase bg-slate-800 text-slate-200 border border-slate-700">
              {property.type}
            </span>
            <span className="text-xs text-slate-400 font-medium">Built Year: {property.builtYear || 2024}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{property.title}</h1>

          <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{property.address}, {property.city}, {property.state}, {property.country}</span>
          </p>
        </div>

        {/* Pricing Badge */}
        <div className="text-left lg:text-right space-y-1">
          <span className="block text-xs font-semibold uppercase text-slate-400">Listing Price</span>
          <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{formattedPrice}</div>
          <span className="block text-[11px] text-slate-500">
            Est. ${Math.round(property.price / (property.areaSqft || 1)).toLocaleString()}/sqft
          </span>
        </div>
      </div>

      {/* Grid Layout: Main Content (Left 2 cols) & Action Box (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Gallery & Specs & Details */}
        <div className="lg:col-span-2 space-y-8">
          <PropertyGallery images={property.images} title={property.title} />

          {/* Quick Metrics Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <Bed className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="block font-bold text-white text-sm">{property.bedrooms} Beds</span>
                <span className="text-[10px] text-slate-400">Bedrooms</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <Bath className="w-5 h-5 text-teal-400 shrink-0" />
              <div>
                <span className="block font-bold text-white text-sm">{property.bathrooms} Baths</span>
                <span className="text-[10px] text-slate-400">Bathrooms</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <Maximize2 className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <span className="block font-bold text-white text-sm">{property.areaSqft.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">Sqft Area</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <Car className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="block font-bold text-white text-sm">{property.parkingSpaces} Slots</span>
                <span className="text-[10px] text-slate-400">Parking</span>
              </div>
            </div>
          </div>

          {/* Detailed Description & Spec Table */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">About Property & Overview</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Furnished Status</span>
                <span className="font-semibold text-white capitalize">{property.furnishedStatus.replace('-', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Construction Status</span>
                <span className="font-semibold text-white capitalize">{property.constructionStatus.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Listing Status</span>
                <span className="font-semibold text-emerald-400 capitalize">{property.status}</span>
              </div>
            </div>
          </div>

          {/* Amenities Breakdown Grid */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Amenities & Modern Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map View */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Exact Location & Map Marker
            </h3>
            <PropertyMap properties={[property]} onSelectProperty={() => {}} zoom={14} />
          </div>

          {/* Nearby Amenities */}
          <NearbyPlaces city={property.city} />

          {/* Mortgage EMI Estimator */}
          <EMICalculator propertyPrice={property.price} />

          {/* Reviews & Ratings Section */}
          <ReviewSection propertyId={property.id} sellerId={property.ownerId} />
        </div>

        {/* Right Column - Owner Contact & Quick Actions Box */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-6 sticky top-24">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <img
                src={property.ownerAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'}
                alt={property.ownerName}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/40"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white truncate">{property.ownerName}</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" title="Verified Agent" />
                </div>
                <p className="text-xs text-slate-400">Property Owner / Listing Consultant</p>
                <span className="text-[10px] text-emerald-400 font-medium">⚡ Responds in &lt; 15 mins</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                Book Property Visit Tour
              </button>

              <button
                onClick={() => openChatWithSeller({
                  id: property.ownerId,
                  email: 'sarah.realty@example.com',
                  name: property.ownerName,
                  phone: property.ownerPhone || '+1 (555) 000-0000',
                  role: 'seller',
                  avatar: property.ownerAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
                  isVerified: true,
                  isSuspended: false,
                  createdAt: ''
                }, property)}
                className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Chat Realtime with Owner
              </button>
            </div>

            {/* Favorite & Compare & Share Bar */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-xs">
              <button
                onClick={handleFavoriteClick}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  isFav
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400' : ''}`} />
                <span className="text-[10px] font-semibold">{isFav ? 'Saved' : 'Favorite'}</span>
              </button>

              <button
                onClick={handleCompareClick}
                className="p-2.5 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 flex flex-col items-center gap-1 transition-all"
              >
                <Scale className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-semibold">Compare</span>
              </button>

              <button
                onClick={handleShareClick}
                className="p-2.5 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 flex flex-col items-center gap-1 transition-all"
              >
                <Share2 className="w-4 h-4 text-sky-400" />
                <span className="text-[10px] font-semibold">Share Link</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-[11px] text-slate-500 hover:text-rose-400 font-semibold inline-flex items-center gap-1 transition-colors"
              >
                <Flag className="w-3 h-3" />
                Report Suspicious Listing
              </button>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        property={property}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

      <ReportModal
        property={property}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
