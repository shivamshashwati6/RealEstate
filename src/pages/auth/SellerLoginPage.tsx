import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import type { UserRole } from '../../types';
import { Building, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const SellerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { allUsers, switchRole } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [email, setEmail] = useState('sarah.realty@example.com');
  const [password, setPassword] = useState('password123');
  const [roleMismatchError, setRoleMismatchError] = useState<{ actualRole: UserRole; message: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRoleMismatchError(null);

    const foundUser = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser && foundUser.role !== 'seller') {
      const roleLabel = foundUser.role.charAt(0).toUpperCase() + foundUser.role.slice(1);
      setRoleMismatchError({
        actualRole: foundUser.role,
        message: `This account is registered as a ${roleLabel}. Please sign in through the ${roleLabel} Portal.`,
      });
      return;
    }

    switchRole('seller');
    addNotification('success', 'Welcome Seller Consultant!', 'Logged into Seller Studio.');
    navigate('/dashboard/seller');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 relative overflow-hidden animate-fadeIn">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="text-center space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Building className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold uppercase">
            <Sparkles className="w-3 h-3" /> Seller & Agent Studio
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Seller Sign In</h1>
          <p className="text-xs text-slate-400">Manage property listings, visit approvals & analytics</p>
        </div>

        {roleMismatchError && (
          <div className="bg-rose-950/80 border border-rose-800 p-4 rounded-2xl text-xs text-rose-300 space-y-2 animate-fadeIn">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{roleMismatchError.message}</p>
            </div>
            <Link
              to={`/auth/${roleMismatchError.actualRole}/login`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition-colors"
            >
              <span>Go to {roleMismatchError.actualRole.toUpperCase()} Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs relative z-10">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Select Seller Account / Email *</label>
            <select
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setRoleMismatchError(null);
              }}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
            >
              <option value="sarah.realty@example.com">Sarah Jenkins (Seller)</option>
              <option value="marcus.villas@example.com">Marcus Vance (Seller)</option>
              <option value="alex.buyer@example.com">Alex Johnson (Buyer - Try Mismatch Error)</option>
              <option value="admin.platform@estatemarket.com">Eleanor Vance (Admin - Try Mismatch Error)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to Seller Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800 relative z-10">
          Don't have an agent/seller account?{' '}
          <Link to="/auth/seller/register" className="text-amber-400 font-semibold hover:underline">
            Register as a Seller
          </Link>
        </div>
      </div>
    </div>
  );
};
