import React, { useState } from 'react';
import type { Property } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { StorageEngine } from '../../services/storage';
import { Flag, X, ShieldAlert } from 'lucide-react';

interface ReportModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ property, isOpen, onClose }) => {
  const { currentUser } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [reason, setReason] = useState('Misleading pricing or information');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    StorageEngine.createReport({
      propertyId: property.id,
      propertyTitle: property.title,
      reportedBy: currentUser.id,
      reportedByName: currentUser.name,
      reason,
      details,
    });

    addNotification('warning', 'Report Submitted', 'Our moderation team will review this listing shortly.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Report Property Listing</h3>
            <p className="text-xs text-slate-400">Help us keep EstateMarket safe & accurate</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reason for Report</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none cursor-pointer"
            >
              <option value="Misleading pricing or information">Misleading pricing or information</option>
              <option value="Duplicate or fake property listing">Duplicate or fake property listing</option>
              <option value="Inappropriate media or photos">Inappropriate media or photos</option>
              <option value="Unavailable or already sold/rented">Unavailable or already sold/rented</option>
              <option value="Other scam/fraud concern">Other scam/fraud concern</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Additional Details</label>
            <textarea
              rows={3}
              placeholder="Provide specific details to help our admin team investigate..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Flag className="w-4 h-4" />
            Submit Flag Report
          </button>
        </form>
      </div>
    </div>
  );
};
