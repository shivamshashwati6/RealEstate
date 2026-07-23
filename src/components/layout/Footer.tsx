import React from 'react';
import { Building2, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/60">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Estate<span className="text-emerald-400">Market</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The modern real estate marketplace platform connecting property buyers, renters, owners, and developers with real-time chat, virtual tour scheduling, and verified listings.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Row-Level Security & Admin Moderated</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Property Discovery</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#search" className="hover:text-emerald-400 transition-colors">Luxury Penthouses</a></li>
              <li><a href="#search" className="hover:text-emerald-400 transition-colors">Eco Villas & Houses</a></li>
              <li><a href="#search" className="hover:text-emerald-400 transition-colors">Downtown Apartments</a></li>
              <li><a href="#search" className="hover:text-emerald-400 transition-colors">Commercial Tech Hubs</a></li>
              <li><a href="#search" className="hover:text-emerald-400 transition-colors">Waterfront Plots & Land</a></li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Popular Cities</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /> Miami, Florida</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /> New York City, NY</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /> Austin, Texas</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /> San Jose, California</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /> Seattle, Washington</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Platform Contact</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-500" /> support@estatemarket.com</li>
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-500" /> +1 (800) 555-ESTATE</li>
              <li className="text-slate-400 pt-2">24/7 Realtime Messaging Support Available</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 EstateMarket Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using React, Supabase & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
