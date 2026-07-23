import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Property } from '../../types';
import { MapPin } from 'lucide-react';

interface PropertyMapProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  center?: [number, number];
  zoom?: number;
}

const customMapIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  onSelectProperty,
  center = [25.7781, -80.1313],
  zoom = 11,
}) => {
  const mapCenter: [number, number] = properties.length > 0
    ? [properties[0].latitude, properties[0].longitude]
    : center;

  return (
    <div className="w-full h-[550px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((prop) => (
          <Marker
            key={prop.id}
            position={[prop.latitude, prop.longitude]}
            icon={customMapIcon}
          >
            <Popup>
              <div className="w-64 space-y-2 text-slate-100">
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-full h-28 object-cover rounded-lg"
                />
                <div className="font-bold text-sm text-white line-clamp-1">{prop.title}</div>
                <div className="text-emerald-400 font-extrabold text-sm">
                  ${prop.price.toLocaleString()} {prop.intent === 'rent' ? '/mo' : ''}
                </div>
                <div className="text-[11px] text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{prop.address}, {prop.city}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700">
                  <span>{prop.bedrooms} Bed | {prop.bathrooms} Bath</span>
                  <span>{prop.areaSqft} sqft</span>
                </div>
                <button
                  onClick={() => onSelectProperty(prop)}
                  className="w-full mt-2 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
