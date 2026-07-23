import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Home, Building2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const Gateway: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const dashboardMap: Record<string, string> = {
        buyer: '/dashboard/buyer',
        seller: '/dashboard/seller',
        admin: '/dashboard/admin',
      };
      navigate(dashboardMap[currentUser.role] || '/dashboard/buyer', { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  const portals = [
    {
      role: 'buyer',
      title: 'Buyer & Renter Portal',
      description: 'Search luxury penthouses, eco villas, and urban condos. Save favorites, schedule tour viewings, and chat directly with sellers.',
      icon: Home,
      loginUrl: '/auth/buyer/login',
      registerUrl: '/auth/buyer/register',
      gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      badge: 'Home Seekers',
      buttonBg: 'from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950',
    },
    {
      role: 'seller',
      title: 'Seller & Agent Studio',
      description: 'List residential & commercial real estate, manage buyer tour booking requests, communicate in real time, and monitor listing telemetry.',
      icon: Building2,
      loginUrl: '/auth/seller/login',
      registerUrl: '/auth/seller/register',
      gradient: 'from-amber-500 via-emerald-500 to-teal-600',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      badge: 'Property Owners & Consultants',
      buttonBg: 'from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950',
    },
    {
      role: 'admin',
      title: 'Admin Command Center',
      description: 'High-security platform governance. Review pending listing approvals, moderate flagged content reports, enforce account suspensions, and track growth analytics.',
      icon: ShieldCheck,
      loginUrl: '/auth/admin/login',
      registerUrl: undefined,
      gradient: 'from-rose-500 via-amber-500 to-rose-600',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      badge: 'Super Admin Operators',
      buttonBg: 'from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white',
    },
  ];

  return (
    <div className="min-h-[88vh] bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full space-y-12 text-center relative z-10">
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Next-Generation Real Estate Platform Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Welcome to <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">EstateMarket</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Select your specialized persona portal below to access your dedicated dashboard, tools, and listings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.role}
                className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 shadow-2xl transition-all duration-300 hover:-translate-y-1 group backdrop-blur-xl"
              >
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${portal.gradient} p-0.5 shadow-lg group-hover:scale-105 transition-transform`}>
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>

                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border inline-block mb-2 ${portal.badgeColor}`}>
                      {portal.badge}
                    </span>
                    <h2 className="text-xl font-bold text-white tracking-tight">{portal.title}</h2>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {portal.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 space-y-2.5">
                  <Link
                    to={portal.loginUrl}
                    className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${portal.buttonBg} font-extrabold py-3 px-4 rounded-xl transition text-xs shadow-md`}
                  >
                    <span>Sign In to {portal.role.toUpperCase()} Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {portal.registerUrl ? (
                    <Link
                      to={portal.registerUrl}
                      className="w-full text-center text-xs font-semibold text-slate-400 hover:text-white py-1 block transition-colors"
                    >
                      Don't have an account? <span className="underline text-emerald-400 font-bold">Register Now</span>
                    </Link>
                  ) : (
                    <span className="text-[11px] text-slate-500 text-center block italic py-1">
                      🔒 Invite-only access passcode required
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
          <span>Looking to browse public real estate listings?</span>
          <Link to="/search" className="text-emerald-400 font-bold hover:underline flex items-center gap-1">
            <span>Explore Marketplace Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
