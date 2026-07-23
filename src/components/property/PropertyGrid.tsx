import React from 'react';
import type { Property } from '../../types';
import { PropertyCard } from './PropertyCard';
import { Building2, RefreshCw } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onResetFilters?: () => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  onSelectProperty,
  onResetFilters,
}) => {
  if (properties.length === 0) {
    return (
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-12 text-center my-8 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <Building2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Matching Properties Found</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          We couldn't find any listings matching your active search and filter criteria. Try adjusting price range, location, or property type.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((prop) => (
        <PropertyCard
          key={prop.id}
          property={prop}
          onSelect={onSelectProperty}
        />
      ))}
    </div>
  );
};
