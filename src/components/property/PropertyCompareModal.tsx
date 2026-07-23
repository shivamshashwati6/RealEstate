import React from 'react';
import { useCompareStore } from '../../store/useCompareStore';
import { X, Scale, Check, Trash2 } from 'lucide-react';

export const PropertyCompareModal: React.FC = () => {
  const { compareProperties, isCompareModalOpen, closeCompareModal, removeFromCompare, clearCompare } = useCompareStore();

  if (!isCompareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-6xl w-full p-6 shadow-2xl space-y-6 relative my-8 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Side-by-Side Property Comparison</h3>
              <p className="text-xs text-slate-400">Comparing {compareProperties.length} selected properties</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareProperties.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Basket
              </button>
            )}
            <button
              onClick={closeCompareModal}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {compareProperties.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Scale className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Properties Selected for Comparison</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click the comparison icon on any property card to add items here for a side-by-side spec comparison.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-3 bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider w-44">
                    Property Specs
                  </th>
                  {compareProperties.map((prop) => (
                    <th key={prop.id} className="p-3 bg-slate-950/40 border-b border-slate-800 min-w-[220px]">
                      <div className="relative group">
                        <button
                          onClick={() => removeFromCompare(prop.id)}
                          className="absolute -top-1 -right-1 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-full h-28 object-cover rounded-xl mb-2"
                        />
                        <span className="font-bold text-white block line-clamp-1">{prop.title}</span>
                        <span className="text-emerald-400 font-extrabold block text-sm">
                          ${prop.price.toLocaleString()} {prop.intent === 'rent' ? '/mo' : ''}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/60">Location</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 font-medium">{p.city}, {p.state}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/60">Property Type</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 font-medium capitalize">{p.type} (For {p.intent})</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/60">Total Area</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 font-bold text-white">{p.areaSqft.toLocaleString()} sqft</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/60">Bedrooms / Baths</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 font-medium">{p.bedrooms} Beds / {p.bathrooms} Baths</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/60">Price per Sqft</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 font-medium text-emerald-400">
                      ${Math.round(p.price / (p.areaSqft || 1)).toLocaleString()}/sqft
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/60">Furnished Status</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 capitalize">{p.furnishedStatus.replace('-', ' ')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/60">Construction</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 capitalize">{p.constructionStatus.replace('_', ' ')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/60">Parking Spaces</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3">{p.parkingSpaces} Vehicle Slots</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-950/60">Key Amenities</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3">
                      <ul className="space-y-1 text-[11px]">
                        {p.amenities.slice(0, 4).map((a, idx) => (
                          <li key={idx} className="flex items-center gap-1 text-slate-300">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
