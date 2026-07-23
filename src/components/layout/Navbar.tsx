import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { usePropertyStore } from '../../store/usePropertyStore';
import { useCompareStore } from '../../store/useCompareStore';
import { Building2, Search, SlidersHorizontal, LogOut, PlusCircle, Menu, X, User, LayoutGrid } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, signOut } = useAuthStore();
  const { openFormModal } = usePropertyStore();
  const { compareProperties, openCompareModal } = useCompareStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (currentUser.role === 'admin') return '/dashboard/admin';
    if (currentUser.role === 'seller') return '/dashboard/seller';
    return '/dashboard/buyer';
  };

  const handleSignOut = () => {
    signOut();
    navigate('/', { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-8 z-40 bg-slate-950/80 border-b border-slate-800 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-sky-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                Estate<span className="text-emerald-400">Market</span>
              </span>
              <span className="block text-[9px] text-slate-400 font-semibold tracking-wider uppercase">
                Real Estate Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/') ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Portal Gateway</span>
            </Link>

            <Link
              to="/marketplace"
              className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/marketplace') || isActive('/search') ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Marketplace Catalog</span>
            </Link>

            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                  location.pathname.startsWith('/dashboard')
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>
                  {currentUser.role === 'admin' ? 'Admin Command' : currentUser.role === 'seller' ? 'Seller Studio' : 'Buyer Dashboard'}
                </span>
              </Link>
            )}
          </nav>

          {/* Action Tools & Persona Control */}
          <div className="hidden md:flex items-center gap-3">
            {/* Compare Drawer Trigger */}
            {compareProperties.length > 0 && (
              <button
                onClick={openCompareModal}
                className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors"
                title="Compare Properties"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center shadow">
                  {compareProperties.length}
                </span>
              </button>
            )}

            {/* Seller Action Button */}
            {isAuthenticated && (currentUser.role === 'seller' || currentUser.role === 'admin') && (
              <button
                onClick={() => openFormModal(null)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-extrabold text-xs shadow-md hover:from-amber-400 hover:to-emerald-400 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Property</span>
              </button>
            )}

            {/* User Profile Badge & Sign Out Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <Link to={getDashboardPath()} className="flex items-center gap-2 group">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-500/40 group-hover:scale-105 transition-transform"
                  />
                  <div className="text-left hidden lg:block">
                    <span className="block text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">{currentUser.name}</span>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">{currentUser.role}</span>
                  </div>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-200 py-2 border-b border-slate-800"
          >
            Portal Gateway Landing Page
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-200 py-2 border-b border-slate-800"
          >
            Search & Browse Properties
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-emerald-400 py-2 border-b border-slate-800"
              >
                {currentUser.role.toUpperCase()} Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="block w-full text-left text-sm font-semibold text-rose-400 py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-emerald-400 py-2"
            >
              Sign In to Portal
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
