import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { usePropertyStore } from '../store/usePropertyStore';
import { PropertyCard } from '../components/property/PropertyCard';
import { StorageEngine } from '../services/storage';
import type { Property, VisitBooking, CollectionItem } from '../types';
import { Calendar, Heart, FolderHeart, Plus } from 'lucide-react';

interface BuyerDashboardPageProps {
  onSelectProperty: (property: Property) => void;
}

export const BuyerDashboardPage: React.FC<BuyerDashboardPageProps> = ({ onSelectProperty }) => {
  const { currentUser } = useAuthStore();
  const { properties, userFavorites } = usePropertyStore();

  const [activeTab, setActiveTab] = useState<'visits' | 'favorites' | 'collections'>('visits');
  const [visits] = useState<VisitBooking[]>(() =>
    StorageEngine.getVisits(currentUser.id, 'buyer')
  );
  const [collections, setCollections] = useState<CollectionItem[]>(() =>
    StorageEngine.getCollections(currentUser.id)
  );

  const [newColName, setNewColName] = useState('');
  const [showCreateCol, setShowCreateCol] = useState(false);

  const favoriteProperties = properties.filter((p) =>
    userFavorites.some((f) => f.propertyId === p.id)
  );

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    const newCol = StorageEngine.createCollection(
      currentUser.id,
      newColName.trim(),
      'Personal saved collection',
      favoriteProperties.slice(0, 2).map((p) => p.id)
    );
    setCollections([newCol, ...collections]);
    setNewColName('');
    setShowCreateCol(false);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Buyer Dashboard
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser.email} • {currentUser.phone}</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('visits')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all ${
              activeTab === 'visits'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Visit Bookings ({visits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all ${
              activeTab === 'favorites'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Favorites ({favoriteProperties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all ${
              activeTab === 'collections'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderHeart className="w-3.5 h-3.5" />
            <span>Collections ({collections.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'visits' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Your Scheduled Property Tours</h3>

          {visits.length === 0 ? (
            <div className="bg-slate-900/60 p-12 rounded-3xl border border-slate-800 text-center text-xs text-slate-400">
              No scheduled property tours. Explore listings and click "Book Property Visit Tour".
            </div>
          ) : (
            <div className="space-y-4">
              {visits.map((v) => {
                const statusColor = {
                  requested: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  confirmed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                  rejected: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                  completed: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
                }[v.status] || 'bg-slate-800 text-slate-300';

                return (
                  <div key={v.id} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={v.propertyImage}
                        alt={v.propertyTitle}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">{v.propertyTitle}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{v.visitDate} at {v.visitTime}</span>
                        </p>
                        {v.notes && <p className="text-[11px] text-slate-400 italic">Notes: "{v.notes}"</p>}
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2">
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold border capitalize ${statusColor}`}>
                        Status: {v.status}
                      </span>
                      {v.sellerNotes && (
                        <span className="text-[11px] text-emerald-400 bg-emerald-950/60 p-2 rounded-lg border border-emerald-800">
                          Seller Reply: {v.sellerNotes}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Your Saved Favorites</h3>

          {favoriteProperties.length === 0 ? (
            <div className="bg-slate-900/60 p-12 rounded-3xl border border-slate-800 text-center text-xs text-slate-400">
              No saved properties yet. Click the heart icon on any listing card to save it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((p) => (
                <PropertyCard key={p.id} property={p} onSelect={onSelectProperty} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'collections' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Organized Collections</h3>
            <button
              onClick={() => setShowCreateCol(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              New Collection
            </button>
          </div>

          {showCreateCol && (
            <form onSubmit={handleCreateCollection} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Collection name (e.g. Investment Penthouses)..."
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                className="flex-1 bg-slate-950 text-xs text-white px-3 py-2 rounded-xl border border-slate-800"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
                Save
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collections.map((col) => (
              <div key={col.id} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderHeart className="w-4 h-4 text-emerald-400" />
                    {col.name}
                  </h4>
                  <span className="text-[10px] text-slate-400">{col.propertyIds.length} properties</span>
                </div>
                <p className="text-xs text-slate-400">{col.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
