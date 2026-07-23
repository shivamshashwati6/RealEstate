import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCompareStore } from '../../store/useCompareStore';
import { usePropertyStore } from '../../store/usePropertyStore';
import { useChatStore } from '../../store/useChatStore';
import { Building2, Search, Heart, Scale, MessageSquare, PlusCircle, LayoutDashboard, Shield, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUserProfile, role, signOut } = useAuthStore();
  const { compareProperties, openCompareModal } = useCompareStore();
  const { userFavorites, openFormModal } = usePropertyStore();
  const { openChatWithSeller } = useChatStore();

  const activePath = location.pathname;

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-[35px] z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
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
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-full border border-slate-800/60">
          <Link
            to="/properties"
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activePath === '/properties' || activePath === '/'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Explore Properties
          </Link>

          {role === 'buyer' && (
            <Link
              to="/dashboard/buyer"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activePath === '/dashboard/buyer'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Buyer Dashboard
            </Link>
          )}

          {role === 'seller' && (
            <Link
              to="/dashboard/seller"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activePath === '/dashboard/seller'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Seller Studio
            </Link>
          )}

          {role === 'admin' && (
            <Link
              to="/dashboard/admin"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activePath === '/dashboard/admin'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Action Widgets */}
        <div className="flex items-center gap-2.5">
          {(role === 'seller' || role === 'admin') && (
            <button
              onClick={() => openFormModal(null)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              List Property
            </button>
          )}

          <button
            onClick={openCompareModal}
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Compare Properties"
          >
            <Scale className="w-4 h-4" />
            {compareProperties.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {compareProperties.length}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate('/dashboard/buyer')}
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-rose-400 border border-slate-700/60 transition-colors"
            title="Favorites"
          >
            <Heart className="w-4 h-4" />
            {userFavorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {userFavorites.length}
              </span>
            )}
          </button>

          <button
            onClick={() => openChatWithSeller({
              id: 'usr_seller_1',
              email: 'sarah.realty@example.com',
              name: 'Sarah Jenkins',
              phone: '+1 (555) 876-5432',
              role: 'seller',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
              isVerified: true,
              isSuspended: false,
              createdAt: ''
            })}
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700/60 transition-colors"
            title="Chat Inbox"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </button>

          <div className="pl-2 border-l border-slate-800 flex items-center gap-2">
            {currentUserProfile ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => role && navigate(`/dashboard/${role}`)}
                  className="flex items-center gap-2 p-1 pl-2.5 pr-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 transition-all"
                >
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline">{currentUserProfile.name.split(' ')[0]}</span>
                  <img
                    src={currentUserProfile.avatar}
                    alt={currentUserProfile.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-600"
                  />
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth/buyer/login"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
