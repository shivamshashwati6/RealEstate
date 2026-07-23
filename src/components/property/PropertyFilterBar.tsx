import React, { useState } from 'react';
import { usePropertyStore } from '../../store/usePropertyStore';
import { Search, Filter, RotateCcw, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';

const CITIES = ['all', 'Miami', 'New York', 'Austin', 'San Jose', 'Seattle', 'Los Angeles'];
const PROPERTY_TYPES = ['all', 'apartment', 'villa', 'house', 'plot', 'commercial', 'penthouse'];
const AMENITIES_LIST = [
  'Private Swimming Pool',
  'Smart Home Automation',
  'EV Charging Station',
  '24/7 Concierge Security',
  'Gym & Spa Facilities',
  'Solar Panel Grid',
  'Landscaped Garden',
  'Waterfront View',
];

export const PropertyFilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters } = usePropertyStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAmenityToggle = (amenity: string) => {
    const current = filters.amenities;
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    setFilters({ amenities: updated });
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl mb-6 backdrop-blur-xl">
      {/* Primary Search & Quick Filters Row */}
      <div className="flex flex-col lg:flex-row items-center gap-3">
        {/* Keyword Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, location, keywords (e.g. penthouse, pool, Miami)..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            className="w-full bg-slate-950/80 text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500"
          />
        </div>

        {/* Intent Tabs (All / Buy / Rent) */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs w-full lg:w-auto">
          <button
            onClick={() => setFilters({ intent: 'all' })}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filters.intent === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilters({ intent: 'sale' })}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filters.intent === 'sale'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setFilters({ intent: 'rent' })}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filters.intent === 'rent'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rent
          </button>
        </div>

        {/* City Dropdown */}
        <div className="w-full lg:w-44">
          <select
            value={filters.city}
            onChange={(e) => setFilters({ city: e.target.value })}
            className="w-full bg-slate-950/80 text-xs text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Cities</option>
            {CITIES.filter((c) => c !== 'all').map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Property Type Dropdown */}
        <div className="w-full lg:w-44">
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters({ propertyType: e.target.value })}
            className="w-full bg-slate-950/80 text-xs text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none cursor-pointer capitalize"
          >
            <option value="all">All Types</option>
            {PROPERTY_TYPES.filter((t) => t !== 'all').map((t) => (
              <option key={t} value={t} className="capitalize">{t}</option>
            ))}
          </select>
        </div>

        {/* Expand Filters Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
            isExpanded || filters.amenities.length > 0 || filters.bedrooms !== 'all' || filters.maxPrice < 10000000
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Reset Filters */}
        <button
          onClick={resetFilters}
          className="p-2.5 rounded-xl bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800 transition-colors"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded Advanced Filters Drawer */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn">
          {/* Max Price Range Slider */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex justify-between">
              <span>Max Budget / Price</span>
              <span className="text-emerald-400">${filters.maxPrice.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="500"
              max="10000000"
              step="50000"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>$500</span>
              <span>$10M+</span>
            </div>
          </div>

          {/* Bedrooms Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Bedrooms</label>
            <div className="flex gap-1">
              {['all', '1', '2', '3', '4+'].map((b) => (
                <button
                  key={b}
                  onClick={() => setFilters({ bedrooms: b })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    filters.bedrooms === b
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {b === 'all' ? 'Any' : b}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Sort Results By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ sortBy: e.target.value as any })}
              className="w-full bg-slate-950/80 text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
            >
              <option value="featured">Featured / Relevant</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="date_desc">Newest Listings First</option>
              <option value="area_desc">Largest Area (Sqft)</option>
            </select>
          </div>

          {/* Amenities Filter Matrix */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-300 mb-2.5">Filter by Premium Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map((amenity) => {
                const isSelected = filters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
