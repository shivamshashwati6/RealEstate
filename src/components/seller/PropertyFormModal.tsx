import React, { useState, useEffect } from 'react';
import type { Property, PropertyType, ListingIntent, FurnishedStatus, ConstructionStatus } from '../../types';
import { usePropertyStore } from '../../store/usePropertyStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { StorageEngine } from '../../services/storage';
import { X, Building2, Plus, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export const PropertyFormModal: React.FC = () => {
  const { isFormModalOpen, editingProperty, closeFormModal, fetchProperties } = usePropertyStore();
  const { currentUser } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(500000);
  const [intent, setIntent] = useState<ListingIntent>('sale');
  const [type, setType] = useState<PropertyType>('apartment');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [areaSqft, setAreaSqft] = useState<number>(1800);
  const [parkingSpaces, setParkingSpaces] = useState<number>(2);
  const [furnishedStatus, setFurnishedStatus] = useState<FurnishedStatus>('fully-furnished');
  const [constructionStatus, setConstructionStatus] = useState<ConstructionStatus>('ready_to_move');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Miami');
  const [state, setState] = useState('Florida');
  const [latitude, setLatitude] = useState<number>(25.7617);
  const [longitude, setLongitude] = useState<number>(-80.1918);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [amenities, setAmenities] = useState<string[]>([
    'Smart Home Automation',
    'Private Swimming Pool',
    '24/7 Concierge Security'
  ]);

  useEffect(() => {
    if (editingProperty) {
      setTitle(editingProperty.title);
      setDescription(editingProperty.description);
      setPrice(editingProperty.price);
      setIntent(editingProperty.intent);
      setType(editingProperty.type);
      setBedrooms(editingProperty.bedrooms);
      setBathrooms(editingProperty.bathrooms);
      setAreaSqft(editingProperty.areaSqft);
      setParkingSpaces(editingProperty.parkingSpaces);
      setFurnishedStatus(editingProperty.furnishedStatus);
      setConstructionStatus(editingProperty.constructionStatus);
      setAddress(editingProperty.address);
      setCity(editingProperty.city);
      setState(editingProperty.state);
      setLatitude(editingProperty.latitude);
      setLongitude(editingProperty.longitude);
      setImages(editingProperty.images.length > 0 ? editingProperty.images : [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
      ]);
      setAmenities(editingProperty.amenities);
    } else {
      setTitle('');
      setDescription('');
      setPrice(750000);
      setAddress('');
    }
  }, [editingProperty, isFormModalOpen]);

  if (!isFormModalOpen) return null;

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const saved = StorageEngine.saveProperty({
      id: editingProperty?.id,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      ownerPhone: currentUser.phone,
      title,
      description,
      price: Number(price),
      intent,
      type,
      status: currentUser.role === 'admin' ? 'live' : 'pending_approval',
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      areaSqft: Number(areaSqft),
      parkingSpaces: Number(parkingSpaces),
      furnishedStatus,
      constructionStatus,
      address,
      city,
      state,
      country: 'United States',
      latitude: Number(latitude),
      longitude: Number(longitude),
      images: images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
      ],
      amenities,
    });

    fetchProperties();
    closeFormModal();

    if (currentUser.role === 'admin') {
      addNotification('success', 'Listing Live!', `"${saved.title}" has been published to the marketplace.`);
    } else {
      addNotification('info', 'Submitted for Approval', `"${saved.title}" has been submitted to admin queue for approval.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6 relative my-8 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {editingProperty ? 'Edit Property Listing' : 'Create New Property Listing'}
              </h3>
              <p className="text-xs text-slate-400">Fill in details for buyers and renters</p>
            </div>
          </div>

          <button
            onClick={closeFormModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Property Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Grand Horizon Oceanfront Penthouse"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Description *</label>
              <textarea
                rows={3}
                required
                placeholder="Detail key architectural highlights, lighting, floor layout, views, and nearby features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Price ($USD) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none font-bold text-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Listing Intent</label>
              <select
                value={intent}
                onChange={(e) => setIntent(e.target.value as ListingIntent)}
                className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Property Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
                className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none capitalize"
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="house">House</option>
                <option value="penthouse">Penthouse</option>
                <option value="commercial">Commercial</option>
                <option value="plot">Plot / Land</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Bedrooms</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full bg-slate-900 text-white p-2 rounded-xl border border-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1">Bathrooms</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full bg-slate-900 text-white p-2 rounded-xl border border-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1">Area (Sqft)</label>
              <input
                type="number"
                value={areaSqft}
                onChange={(e) => setAreaSqft(Number(e.target.value))}
                className="w-full bg-slate-900 text-white p-2 rounded-xl border border-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1">Parking Slots</label>
              <input
                type="number"
                value={parkingSpaces}
                onChange={(e) => setParkingSpaces(Number(e.target.value))}
                className="w-full bg-slate-900 text-white p-2 rounded-xl border border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Street Address *</label>
              <input
                type="text"
                required
                placeholder="e.g. 450 Ocean Drive, Suite 500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-slate-300 flex items-center gap-1">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              Property Image Gallery URLs
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste image URL (Unsplash or image host)..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 bg-slate-950 text-white px-3.5 py-2 rounded-xl border border-slate-800"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                <Plus className="w-4 h-4 inline" /> Add Image
              </button>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-800 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute inset-0 bg-slate-950/80 text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={closeFormModal}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-emerald-400 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {editingProperty ? 'Update Listing' : 'Submit Property Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
