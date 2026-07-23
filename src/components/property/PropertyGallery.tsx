import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Large Image Display */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
        <img
          src={images[activeImageIndex] || images[0]}
          alt={`${title} - image ${activeImageIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Gallery Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700/80 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700/80 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Expand / Lightbox Trigger */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 text-xs font-semibold text-white border border-slate-700 backdrop-blur-md hover:bg-slate-800 transition-colors"
        >
          <Maximize className="w-3.5 h-3.5" />
          <span>Full Gallery ({images.length})</span>
        </button>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-24 aspect-[16/10] rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                activeImageIndex === idx
                  ? 'border-emerald-400 scale-95 shadow-md shadow-emerald-500/20'
                  : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Overlay Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-slate-400 hover:text-white text-xl font-bold p-2"
          >
            ✕ Close
          </button>
          <div className="max-w-5xl w-full max-h-[85vh] relative flex items-center justify-center">
            <img
              src={images[activeImageIndex]}
              alt={title}
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-slate-800"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 p-3 rounded-full bg-slate-900/90 text-white border border-slate-700"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 p-3 rounded-full bg-slate-900/90 text-white border border-slate-700"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
