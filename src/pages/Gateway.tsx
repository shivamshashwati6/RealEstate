import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Building2, User, Shield, ArrowRight, Sparkles, KeyRound, CheckCircle2 } from 'lucide-react';

export default function Gateway() {
  const { user, role, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user && role) {
      const dashboardMap: Record<string, string> = {
        buyer: '/dashboard/buyer',
        seller: '/dashboard/seller',
        admin: '/dashboard/admin',
      };
      const targetRoute = dashboardMap[role] || '/dashboard/buyer';
      navigate(targetRoute, { replace: true });
    }
  }, [user, role, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          <span className="text-xs font-semibold tracking-wide">Resolving portal session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Brand Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Estate<span className="text-emerald-400">Market</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wide uppercase">Real Estate Platform</span>
          </div>
        </div>

        <Link
          to="/properties"
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          Browse Public Listings
        </Link>
      </header>

      {/* Main Hero & Portal Selection */}
      <main className="max-w-5xl mx-auto w-full my-12 space-y-12 z-10 text-center">
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Zero-Touch Auto Routing Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Select Your Specialized <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              Real Estate Portal
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Choose your specialized portal to sign in or register. Authenticated users are automatically routed to their direct role-based dashboard.
          </p>
        </div>

        {/* 3 Role Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Buyer Portal Card */}
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 hover:border-emerald-500/50 p-6 shadow-2xl flex flex-col justify-between space-y-6 group transition-all transform hover:-translate-y-1">
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-fit">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Buyer & Renter</span>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Buyer Portal</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Search properties, save collections, calculate EMI, and schedule live property tours.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <Link
                to="/auth/buyer/login"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Sign In as Buyer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/auth/buyer/register"
                className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 flex items-center justify-center transition-colors"
              >
                Create Buyer Account
              </Link>
            </div>
          </div>

          {/* Seller Portal Card */}
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 hover:border-amber-500/50 p-6 shadow-2xl flex flex-col justify-between space-y-6 group transition-all transform hover:-translate-y-1">
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 w-fit">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">Seller & Agent</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Seller Studio</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Create and manage listings, track views/inquiries, and accept visit tour requests.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <Link
                to="/auth/seller/login"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Sign In as Seller</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/auth/seller/register"
                className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 flex items-center justify-center transition-colors"
              >
                Create Seller Account
              </Link>
            </div>
          </div>

          {/* Admin Portal Card */}
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 hover:border-rose-500/50 p-6 shadow-2xl flex flex-col justify-between space-y-6 group transition-all transform hover:-translate-y-1">
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 w-fit">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-rose-400 tracking-wider">Admin & Governance</span>
                <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">Admin Portal</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Approve/reject listings, monitor telemetry analytics, and manage platform moderation.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <Link
                to="/auth/admin/login"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Sign In as Admin</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/auth/admin/register"
                className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 flex items-center justify-center transition-colors"
              >
                Register Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-slate-500 z-10 border-t border-slate-800/80 pt-6">
        © 2026 EstateMarket. Role-Based Auth Engine & Realtime Telemetry.
      </footer>
    </div>
  );
}
