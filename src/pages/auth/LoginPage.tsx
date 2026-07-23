import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import type { UserRole } from '../../types';
import { Building2, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  forcedRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({ forcedRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { switchRole } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');

  useEffect(() => {
    if (forcedRole) {
      setSelectedRole(forcedRole);
      if (forcedRole === 'buyer') setEmail('alex.buyer@example.com');
      else if (forcedRole === 'seller') setEmail('sarah.realty@example.com');
      else if (forcedRole === 'admin') setEmail('admin.platform@estatemarket.com');
    } else {
      if (location.pathname.includes('/buyer')) setSelectedRole('buyer');
      else if (location.pathname.includes('/seller')) setSelectedRole('seller');
      else if (location.pathname.includes('/admin')) setSelectedRole('admin');
    }
  }, [forcedRole, location.pathname]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(selectedRole);
    addNotification('success', 'Sign In Successful', `Welcome back! Logged in as ${selectedRole.toUpperCase()}.`);
    
    const dashboardMap: Record<UserRole, string> = {
      buyer: '/dashboard/buyer',
      seller: '/dashboard/seller',
      admin: '/dashboard/admin',
    };
    navigate(dashboardMap[selectedRole]);
  };

  const handleGoogleSignIn = () => {
    switchRole(selectedRole);
    addNotification('success', 'Google Sign In', `Authenticated as ${selectedRole.toUpperCase()} via Google.`);
    const dashboardMap: Record<UserRole, string> = {
      buyer: '/dashboard/buyer',
      seller: '/dashboard/seller',
      admin: '/dashboard/admin',
    };
    navigate(dashboardMap[selectedRole]);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 mx-auto shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Sign In ({selectedRole.toUpperCase()} Portal)
          </h1>
          <p className="text-xs text-slate-400">Access your dedicated workspace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-800 flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase font-bold shrink-0">Or Email Sign In</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Sign In Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['buyer', 'seller', 'admin'] as UserRole[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                    selectedRole === r
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to {selectedRole.toUpperCase()} Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center space-y-2 text-xs">
          <Link to="/auth/login" className="text-slate-400 hover:text-white block font-medium">
            ← Back to Auth Gateway Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
