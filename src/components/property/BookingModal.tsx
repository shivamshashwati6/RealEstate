import React, { useState } from 'react';
import type { Property } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { StorageEngine } from '../../services/storage';
import { Calendar, Clock, X, CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ property, isOpen, onClose }) => {
  const { currentUser } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [visitDate, setVisitDate] = useState('2026-07-29');
  const [visitTime, setVisitTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      StorageEngine.createVisit({
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        buyerPhone: currentUser.phone,
        sellerId: property.ownerId,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyImage: property.images[0],
        propertyAddress: `${property.address}, ${property.city}`,
        visitDate,
        visitTime,
        notes,
      });

      setIsSubmitting(false);
      addNotification('success', 'Visit Requested!', `Your tour request for ${visitDate} at ${visitTime} has been submitted to ${property.ownerName}.`);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Schedule Property Tour</h3>
            <p className="text-xs text-slate-400">Request an in-person or virtual walkthrough</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{property.title}</h4>
            <p className="text-[11px] text-slate-400 truncate">{property.address}, {property.city}</p>
            <span className="text-xs font-extrabold text-emerald-400">
              ${property.price.toLocaleString()} {property.intent === 'rent' ? '/mo' : ''}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Preferred Tour Date
            </label>
            <input
              type="date"
              required
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              Time Slot
            </label>
            <select
              value={visitTime}
              onChange={(e) => setVisitTime(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="09:00">09:00 AM (Morning)</option>
              <option value="11:00">11:00 AM (Morning)</option>
              <option value="14:30">02:30 PM (Afternoon)</option>
              <option value="16:00">04:00 PM (Late Afternoon)</option>
              <option value="18:00">06:00 PM (Evening)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Special Requests / Questions
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Would like to inspect parking space and utility meters during the visit."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Submitting Request...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirm Visit Booking
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
