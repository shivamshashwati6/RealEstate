import React from 'react';
import { School, Stethoscope, Train, ShoppingBag, Trees, Compass } from 'lucide-react';

interface PlaceItem {
  category: string;
  name: string;
  distance: string;
  icon: React.ReactNode;
}

export const NearbyPlaces: React.FC<{ city: string }> = ({ city }) => {
  const places: PlaceItem[] = [
    { category: 'Education', name: `St. Mary Academy & International School`, distance: '0.6 miles', icon: <School className="w-4 h-4 text-emerald-400" /> },
    { category: 'Healthcare', name: `${city} General Medical Center & ER`, distance: '1.2 miles', icon: <Stethoscope className="w-4 h-4 text-rose-400" /> },
    { category: 'Transit', name: `Central Station & Subway Metro Hub`, distance: '0.4 miles', icon: <Train className="w-4 h-4 text-sky-400" /> },
    { category: 'Shopping', name: `Whole Foods Market & Town Center Plaza`, distance: '0.8 miles', icon: <ShoppingBag className="w-4 h-4 text-amber-400" /> },
    { category: 'Recreation', name: `Riverfront Botanic Park & Walking Trails`, distance: '0.3 miles', icon: <Trees className="w-4 h-4 text-teal-400" /> },
  ];

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Compass className="w-5 h-5 text-emerald-400" />
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Nearby Neighborhood & Amenities</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {places.map((p, idx) => (
          <div key={idx} className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                {p.icon}
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-200">{p.name}</span>
                <span className="block text-[10px] text-slate-400">{p.category}</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {p.distance}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
