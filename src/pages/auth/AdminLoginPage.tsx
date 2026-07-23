import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import type { UserRole } from '../../types';
import { Shield, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { allUsers, switchRole } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [email, setEmail] = useState('admin.platform@estatemarket.com');
  const [password, setPassword] = useState('adminpassword123');
  const [roleMismatchError, setRoleMismatchError] = useState<{ actualRole: UserRole; message: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRoleMismatchError(null);

    const foundUser = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser && foundUser.role !== 'admin') {
      const roleLabel = foundUser.role.charAt(0).toUpperCase() + foundUser.role.slice(1);
      setRoleMismatchError({
        actualRole: foundUser.role,
        message: `This account is registered as a ${roleLabel}. Access to the Admin Command Center is restricted.`,
      });
      return;
    }

    switchRole('admin');
    addNotification('success', 'Admin Session Authenticated', 'Access granted to Super Admin Governance Center.');
    navigate('/dashboard/admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-slate-900/90 border border-rose-500/30 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl animate-fadeIn">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="text-center space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
            <Shield className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-extrabold uppercase">
            <Sparkles className="w-3 h-3" /> Command Center Portal
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Super Admin Login</h1>
          <p className="text-xs text-slate-400">Governance, telemetry charts & moderation queue</p>
        </div>

        {roleMismatchError && (
          <div className="bg-rose-950/90 border border-rose-800 p-4 rounded-2xl text-xs text-rose-300 space-y-2 animate-fadeIn">
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
            <label className="block font-semibold text-slate-300 mb-1">Select Admin Account / Email *</label>
            <select
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setRoleMismatchError(null);
              }}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none"
            >
              <option value="admin.platform@estatemarket.com">Eleanor Vance (Super Admin)</option>
              <option value="alex.buyer@example.com">Alex Johnson (Buyer - Try Mismatch Error)</option>
              <option value="sarah.realty@example.com">Sarah Jenkins (Seller - Try Mismatch Error)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Passcode / Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-rose-600/20 hover:from-rose-500 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
          >
            <span>Authenticate Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-500 pt-2 border-t border-slate-800 relative z-10">
          Admin accounts are created via database seed or invite-only authorization.
        </div>
      </div>
    </div>
  );
};
