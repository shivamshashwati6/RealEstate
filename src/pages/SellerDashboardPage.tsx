import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { usePropertyStore } from '../store/usePropertyStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { StorageEngine } from '../services/storage';
import type { Property, VisitBooking } from '../types';
import { Building2, Plus, Edit3, Trash2, Clock, Check } from 'lucide-react';

interface SellerDashboardPageProps {
  onSelectProperty: (property: Property) => void;
}

export const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({ onSelectProperty }) => {
  const { currentUser } = useAuthStore();
  const { properties, openFormModal, deleteProperty } = usePropertyStore();
  const { addNotification } = useNotificationStore();

  const sellerProperties = properties.filter(
    (p) => p.ownerId === currentUser.id || currentUser.role === 'admin'
  );

  const [visits, setVisits] = useState<VisitBooking[]>(() =>
    StorageEngine.getVisits(currentUser.id, 'seller')
  );

  const totalViews = sellerProperties.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
  const pendingApprovals = sellerProperties.filter((p) => p.status === 'pending_approval').length;

  const handleUpdateVisit = (visitId: string, status: VisitBooking['status']) => {
    StorageEngine.updateVisitStatus(visitId, status, 'Seller updated request status.');
    setVisits(StorageEngine.getVisits(currentUser.id, 'seller'));
    addNotification('success', 'Visit Status Updated', `Tour request marked as ${status}.`);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Seller & Agent Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser.email} • Premier Consultant</p>
          </div>
        </div>

        <button
          onClick={() => openFormModal(null)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-emerald-400 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Property Listing
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold block">Total Managed Listings</span>
          <span className="text-2xl font-extrabold text-white">{sellerProperties.length}</span>
          <span className="text-[10px] text-emerald-400 font-medium block">Live on Marketplace</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold block">Total Impressions & Views</span>
          <span className="text-2xl font-extrabold text-emerald-400">{totalViews.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block">Across all active listings</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold block">Tour Visit Requests</span>
          <span className="text-2xl font-extrabold text-teal-400">{visits.length}</span>
          <span className="text-[10px] text-slate-400 block">Scheduled by buyers</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold block">Pending Admin Approval</span>
          <span className="text-2xl font-extrabold text-amber-400">{pendingApprovals}</span>
          <span className="text-[10px] text-slate-400 block">In verification queue</span>
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-400" />
          Your Managed Property Listings
        </h3>

        {sellerProperties.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            You haven't posted any property listings yet. Click "Create Property Listing" above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3.5 rounded-l-xl">Property Details</th>
                  <th className="p-3.5">Price & Intent</th>
                  <th className="p-3.5">Type & Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Views</th>
                  <th className="p-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {sellerProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <span
                            onClick={() => onSelectProperty(prop)}
                            className="font-bold text-white hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
                          >
                            {prop.title}
                          </span>
                          <span className="text-[11px] text-slate-400">{prop.bedrooms} Bed • {prop.bathrooms} Bath • {prop.areaSqft} sqft</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400">
                      ${prop.price.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">For {prop.intent}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize font-medium block">{prop.type}</span>
                      <span className="text-[11px] text-slate-400">{prop.city}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                        prop.status === 'live' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        prop.status === 'pending_approval' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-white">{prop.viewsCount}</td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => openFormModal(prop)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProperty(prop.id)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-slate-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-400" />
          Buyer Visit Tour Inquiries
        </h3>

        {visits.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No visit requests currently pending.</p>
        ) : (
          <div className="space-y-3">
            {visits.map((v) => (
              <div key={v.id} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-white">{v.buyerName} — {v.propertyTitle}</h4>
                  <p className="text-slate-400 mt-0.5">Date: {v.visitDate} at {v.visitTime} • Buyer Phone: {v.buyerPhone || 'N/A'}</p>
                  {v.notes && <p className="text-slate-400 italic mt-1">"{v.notes}"</p>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateVisit(v.id, 'confirmed')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept Visit
                  </button>
                  <button
                    onClick={() => handleUpdateVisit(v.id, 'rejected')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-950 font-bold"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
