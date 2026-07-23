import React, { useEffect, useMemo } from 'react';
import { usePropertyStore } from '../store/usePropertyStore';
import { PropertyFilterBar } from '../components/property/PropertyFilterBar';
import { PropertyGrid } from '../components/property/PropertyGrid';
import { PropertyMap } from '../components/property/PropertyMap';
import type { Property } from '../types';
import { LayoutGrid, Map, Building2 } from 'lucide-react';

interface SearchPageProps {
  onSelectProperty: (property: Property) => void;
  initialSearchQuery?: string;
  initialCity?: string;
  initialType?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  onSelectProperty,
  initialSearchQuery,
  initialCity,
  initialType,
}) => {
  const { properties, filters, setFilters, resetFilters, viewMode, setViewMode } = usePropertyStore();

  useEffect(() => {
    if (initialSearchQuery) setFilters({ searchQuery: initialSearchQuery });
    if (initialCity) setFilters({ city: initialCity });
    if (initialType) setFilters({ propertyType: initialType });
  }, [initialSearchQuery, initialCity, initialType]);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (p.status !== 'live') return false;

      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCity = p.city.toLowerCase().includes(q);
        const matchAddress = p.address.toLowerCase().includes(q);
        const matchType = p.type.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCity && !matchAddress && !matchType) return false;
      }

      if (filters.city !== 'all' && p.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      if (filters.propertyType !== 'all' && p.type !== filters.propertyType) {
        return false;
      }

      if (filters.intent !== 'all' && p.intent !== filters.intent) {
        return false;
      }

      if (p.price > filters.maxPrice) {
        return false;
      }

      if (filters.bedrooms !== 'all') {
        if (filters.bedrooms === '4+') {
          if (p.bedrooms < 4) return false;
        } else {
          if (p.bedrooms !== Number(filters.bedrooms)) return false;
        }
      }

      if (filters.amenities.length > 0) {
        const hasAll = filters.amenities.every((a) => p.amenities.includes(a));
        if (!hasAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'date_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sortBy === 'area_desc') return b.areaSqft - a.areaSqft;
      return 0;
    });
  }, [properties, filters]);

  return (
    <div className="space-y-6 pb-16">
      <PropertyFilterBar />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Property Search & Discovery
          </h1>
          <p className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredProperties.length}</strong> available properties matching criteria
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid View</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'map'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Interactive Map View</span>
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <PropertyGrid
          properties={filteredProperties}
          onSelectProperty={onSelectProperty}
          onResetFilters={resetFilters}
        />
      ) : (
        <div className="space-y-4">
          <PropertyMap
            properties={filteredProperties}
            onSelectProperty={onSelectProperty}
          />
          <PropertyGrid
            properties={filteredProperties}
            onSelectProperty={onSelectProperty}
            onResetFilters={resetFilters}
          />
        </div>
      )}
    </div>
  );
};
