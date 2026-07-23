import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Building2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginGateway() {
  const portals = [
    {
      role: 'buyer',
      title: 'Buyer & Renter Portal',
      description: 'Search properties, save favorites, book viewings, and chat with owners.',
      icon: Home,
      loginUrl: '/auth/buyer/login',
      registerUrl: '/auth/buyer/register',
      color: 'from-emerald-500 to-teal-500',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      badge: 'Home Seekers',
    },
    {
      role: 'seller',
      title: 'Seller & Agent Portal',
      description: 'List properties, manage booking requests, and track interest analytics.',
      icon: Building2,
      loginUrl: '/auth/seller/login',
      registerUrl: '/auth/seller/register',
      color: 'from-amber-500 to-emerald-500',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      badge: 'Property Owners',
    },
    {
      role: 'admin',
      title: 'Admin Command Center',
      description: 'Approve listings, moderate user reports, and monitor platform activity.',
      icon: ShieldCheck,
      loginUrl: '/auth/admin/login',
      registerUrl: '/auth/admin/register',
      color: 'from-rose-500 to-amber-500',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      badge: 'Platform Operators',
    },
  ];

  return (
    <div className="min-h-[85vh] bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full space-y-10 text-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Role-Based Authentication Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Real Estate Marketplace Portal
          </h1>
          <p className="max-w-xl mx-auto text-sm text-slate-400">
            Select your account type to sign in to your dedicated portal dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.role}
                className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="p-6 space-y-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${portal.color} flex items-center justify-center text-slate-950 font-bold mb-4 shadow-lg transform group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${portal.badgeColor}`}>
                    {portal.badge}
                  </span>

                  <h3 className="text-lg font-bold text-white tracking-tight">{portal.title}</h3>
                  
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {portal.description}
                  </p>
                </div>

                <div className="px-6 pb-6 pt-3 bg-slate-950/60 border-t border-slate-800/80 flex flex-col gap-2.5">
                  <Link
                    to={portal.loginUrl}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl hover:from-emerald-400 hover:to-teal-400 transition text-xs shadow-md shadow-emerald-500/20"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {portal.registerUrl && (
                    <Link
                      to={portal.registerUrl}
                      className="w-full text-center text-xs font-semibold text-slate-400 hover:text-white py-1 transition-colors"
                    >
                      Don't have an account? <span className="underline text-emerald-400 font-bold">Register</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
