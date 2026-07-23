import React, { useState } from 'react';
import { usePropertyStore } from '../store/usePropertyStore';
import { PropertyCard } from '../components/property/PropertyCard';
import type { Property } from '../types';
import { Search, Building2, ShieldCheck, ArrowRight, Star, TrendingUp, KeyRound, Sparkles } from 'lucide-react';

interface HomePageProps {
  onSelectProperty: (property: Property) => void;
  onNavigateToSearch: (city?: string, type?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProperty, onNavigateToSearch }) => {
  const { properties } = usePropertyStore();
  const [heroSearch, setHeroSearch] = useState('');

  const liveProperties = properties.filter((p) => p.status === 'live');
  const featuredProperties = liveProperties.slice(0, 3);

  const categories = [
    { type: 'penthouse', label: 'Luxury Penthouses', icon: '🏙️', count: '18 Available' },
    { type: 'villa', label: 'Eco & Beach Villas', icon: '🏡', count: '34 Available' },
    { type: 'apartment', label: 'Urban Apartments', icon: '🏢', count: '82 Available' },
    { type: 'commercial', label: 'Commercial Offices', icon: '🏬', count: '12 Available' },
    { type: 'plot', label: 'Land & Building Plots', icon: '🌄', count: '25 Available' },
  ];

  const popularCities = ['Miami', 'New York', 'Austin', 'San Jose', 'Seattle'];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 border border-slate-800 p-8 sm:p-16 shadow-2xl text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Next-Gen Real Estate Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Discover & Own Exceptional <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              Real Estate Worldwide
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Connect directly with verified owners and brokers. Explore luxury penthouses, eco villas, and high-yield commercial property investments with real-time tour booking.
          </p>

          <div className="bg-slate-900/90 p-2 sm:p-3 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search city, neighborhood, or listing title..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onNavigateToSearch(heroSearch)}
                className="w-full bg-slate-950 text-xs text-white pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none placeholder-slate-500"
              />
            </div>

            <button
              onClick={() => onNavigateToSearch(heroSearch)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Explore Listings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <span className="font-semibold text-slate-500">Popular Cities:</span>
            {popularCities.map((city) => (
              <button
                key={city}
                onClick={() => onNavigateToSearch(city)}
                className="px-3 py-1 rounded-full bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
              >
                📍 {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Property Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Browse Property Categories</h2>
            <p className="text-xs text-slate-400">Curated collections tailored to your lifestyle</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.type}
              onClick={() => onNavigateToSearch(undefined, cat.type)}
              className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 hover:border-emerald-500/50 shadow-xl transition-all cursor-pointer group text-center space-y-2 hover:-translate-y-1"
            >
              <div className="text-3xl mb-1 transform group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{cat.label}</h3>
              <span className="text-[10px] text-slate-500 block">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Handpicked Premium Listings</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Featured Real Estate Options</h2>
          </div>

          <button
            onClick={() => onNavigateToSearch()}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Properties ({liveProperties.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-slate-900/60 rounded-3xl border border-slate-800 p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Verified Ownership</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every property submission passes rigorous admin approval queues to prevent fraud and duplicates.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Instant Tour Scheduling</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Book in-person or virtual walkthroughs directly with owners with automated status tracking.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Realtime Buyer-Seller Chat</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              In-app end-to-end messaging with photo attachments, read receipts, and instant inquiry response.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-6">
        <div className="text-center space-y-1 max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-white tracking-tight">Trusted by Buyers & Sellers</h2>
          <p className="text-xs text-slate-400">See what users say about finding homes on EstateMarket</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "We closed on our Miami oceanfront penthouse within 3 weeks of discovering it on EstateMarket. The direct chat with Sarah was so seamless!"
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Alex"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div>
                <span className="block text-xs font-bold text-white">Alex Johnson</span>
                <span className="block text-[10px] text-slate-500">Homebuyer, Miami</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "As a seller consultant, EstateMarket gave me 4x more qualified visit inquiries than traditional portals. The visit scheduler is top-notch."
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                alt="Sarah"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div>
                <span className="block text-xs font-bold text-white">Sarah Jenkins</span>
                <span className="block text-[10px] text-slate-500">Real Estate Consultant</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "The side-by-side comparison matrix made it crystal clear which eco villa matched our budget and floor plan requirement."
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Marcus"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div>
                <span className="block text-xs font-bold text-white">Marcus Vance</span>
                <span className="block text-[10px] text-slate-500">Property Investor</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
